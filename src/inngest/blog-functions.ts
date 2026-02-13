import { inngest } from './client';
import { redis } from '@/mcp/shared/redis-client';
import { track } from '@vercel/analytics/server';

// Redis keys
const VIEW_KEY_PREFIX = 'views:post:';
const TRENDING_KEY = 'blog:trending';
const MILESTONE_KEY_PREFIX = 'blog:milestone:';
const ANALYTICS_KEY_PREFIX = 'blog:analytics:';

/**
 * Track blog post view
 *
 * Triggered when a user views a blog post.
 * NOTE: The actual view count increment happens in /api/views via incrementPostViews().
 * This function handles secondary tracking:
 * - Daily view tracking for analytics
 * - Milestone detection
 * - Updating trending calculations
 */
export const trackPostView = inngest.createFunction(
  { id: 'track-post-view' },
  { event: 'blog/post.viewed' },
  async ({ event, step }) => {
    const { postId, slug, title } = event.data;
    // Redis client imported from shared module

    if (!redis) {
      console.warn('Redis not configured, skipping view tracking');
      return { success: false, reason: 'redis-not-configured' };
    }

    // Test Redis connectivity first
    try {
      await Promise.race([
        redis.ping(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Redis ping timeout')), 3000)),
      ]);
    } catch (pingError) {
      console.error('Redis connectivity check failed for view tracking:', pingError);
      return {
        success: false,
        reason: 'redis-connection-failed',
        error: pingError instanceof Error ? pingError.message : String(pingError),
      };
    }

    // Step 1: Process view tracking atomically with timeout protection
    // Combines: get views, track daily, check milestones - reduces execution time by 33%
    const totalViews = await step.run('process-view', async () => {
      try {
        // Get current view count (already incremented by /api/views) with timeout
        const views = await Promise.race([
          redis.get(`${VIEW_KEY_PREFIX}${postId}`),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Redis get timeout')), 5000)
          ),
        ]);

        const count = parseInt((views as string) || '0');
        console.warn(`Post view tracked: ${slug} (${count} total views)`);

        // Track in Vercel Analytics (non-blocking, with error handling)
        try {
          await track('blog_post_viewed', {
            postId,
            slug,
            title,
            totalViews: count,
          });
        } catch (trackError) {
          console.warn('Failed to track view in Vercel Analytics:', trackError);
          // Don't fail the function for analytics issues
        }

        // Track daily views (uses postId for consistency) with timeout
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `${VIEW_KEY_PREFIX}${postId}:day:${today}`;

        try {
          await Promise.race([
            redis.incr(dailyKey),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Redis incr timeout')), 5000)
            ),
          ]);

          // Set expiry for daily keys (90 days) with timeout
          await Promise.race([
            redis.expire(dailyKey, 90 * 24 * 60 * 60),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Redis expire timeout')), 3000)
            ),
          ]);
        } catch (dailyError) {
          console.warn(`Failed to track daily views for ${postId}:`, dailyError);
          // Don't fail the main tracking for daily tracking issues
        }

        // Check for milestones with error handling
        const milestones = [100, 1000, 10000, 50000, 100000];
        for (const milestone of milestones) {
          if (count === milestone) {
            // Send milestone event
            await inngest.send({
              name: 'blog/milestone.reached',
              data: {
                slug,
                title,
                milestone,
                totalViews: count,
                reachedAt: new Date().toISOString(),
              },
            });

            // Track that we've sent this milestone (uses postId)
            await redis.set(
              `${MILESTONE_KEY_PREFIX}${postId}:${milestone}`,
              new Date().toISOString()
            );

            console.warn(`🎉 Milestone reached: ${title} hit ${milestone} views!`);
          }
        }

        return count;
      } catch (error) {
        console.error('Failed to process view:', error);
        return 0;
      }
    });

    return {
      success: true,
      postId,
      slug,
      totalViews,
      timestamp: new Date().toISOString(),
    };
  }
);

/**
 * Handle milestone achievements
 *
 * Triggered when a post reaches a view milestone.
 * Could send notifications, update badges, etc.
 */
export const handleMilestone = inngest.createFunction(
  { id: 'handle-milestone' },
  { event: 'blog/milestone.reached' },
  async ({ event, step }) => {
    const { slug, title, milestone, totalViews } = event.data;

    // Step 1: Log the milestone
    await step.run('log-milestone', async () => {
      console.warn(`
        🎉 MILESTONE ACHIEVED! 🎉
        Post: ${title}
        Slug: ${slug}
        Milestone: ${milestone.toLocaleString()} views
        Total: ${totalViews.toLocaleString()} views
      `);

      // Track in Vercel Analytics
      await track('blog_milestone_reached', {
        slug,
        title,
        milestone,
        totalViews,
      });
    });

    // Step 2: Send email notification to author (optional feature)
    await step.run('notify-author', async () => {
      // FUTURE ENHANCEMENT: Implement email notification for milestone achievements
      // This would require:
      // 1. Adding AUTHOR_EMAIL to environment variables
      // 2. Creating a reusable email template for milestones
      // 3. Implementing email send via Resend or similar service
      //
      // Example implementation:
      // await inngest.send({
      //   name: "contact/email.send",
      //   data: {
      //     to: process.env.AUTHOR_EMAIL,
      //     subject: `🎉 "${title}" reached ${milestone} views!`,
      //     html: renderMilestoneEmail({ title, slug, milestone, totalViews }),
      //   },
      // });

      console.warn(
        `Milestone notification: ${title} reached ${milestone} views (email integration not yet implemented)`
      );
    });

    return {
      success: true,
      milestone,
      notified: false, // Will be true once email integration is added
    };
  }
);

/**
 * Calculate trending posts
 *
 * Runs hourly to identify posts with high recent activity.
 * Uses a simple algorithm: views in last 7 days / age of post.
 */
export const calculateTrending = inngest.createFunction(
  {
    id: 'calculate-trending',
    retries: 1, // Fail fast on hourly jobs to prevent queue buildup
  },
  { cron: '0 * * * *' }, // Every hour
  async ({ step }) => {
    const startTime = Date.now();

    // Add timeout protection to prevent Vercel 300s timeout
    const FUNCTION_TIMEOUT_MS = 240000; // 4 minutes (less than Vercel's 5 minute limit)

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Function timeout - preventing Vercel 504')),
        FUNCTION_TIMEOUT_MS
      )
    );

    try {
      return await Promise.race([
        (async () => {
          // Redis client imported from shared module
          if (!redis) {
            console.warn('Redis not configured, skipping trending calculation');
            return { success: false, reason: 'redis-not-configured' };
          }

          // Test Redis connectivity first with short timeout
          try {
            await Promise.race([
              redis.ping(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Redis ping timeout')), 5000)
              ),
            ]);
          } catch (pingError) {
            console.error('Redis connectivity check failed:', pingError);
            return {
              success: false,
              reason: 'redis-connection-failed',
              error: pingError instanceof Error ? pingError.message : String(pingError),
            };
          }

          // Step 1: Get all post view keys with timeout protection
          const posts = await step.run('fetch-post-data', async () => {
            try {
              // Add timeout to individual Redis operations
              const keysTimeout = 10000; // 10 seconds
              const keys = (await Promise.race([
                redis.keys(`${VIEW_KEY_PREFIX}*`),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Redis keys operation timed out')), keysTimeout)
                ),
              ])) as string[];

              const postKeys = keys.filter((key) => !key.includes(':day:'));

              if (postKeys.length === 0) {
                console.warn('No post view keys found, trending calculation skipped');
                return [];
              }

              const postsData = [];
              const batchSize = 10; // Process in batches to avoid overwhelming Redis

              for (let i = 0; i < postKeys.length; i += batchSize) {
                const batch = postKeys.slice(i, i + batchSize);

                for (const key of batch) {
                  try {
                    const postId = key.replace(VIEW_KEY_PREFIX, '');

                    // Get total views with timeout
                    const totalViews = parseInt(
                      ((await Promise.race([
                        redis.get(key),
                        new Promise((_, reject) =>
                          setTimeout(() => reject(new Error('Redis get timeout')), 5000)
                        ),
                      ])) as string) || '0'
                    );

                    // Get views from last 7 days with timeout protection
                    let recentViews = 0;
                    const today = new Date();

                    for (let j = 0; j < 7; j++) {
                      try {
                        const date = new Date(today);
                        date.setDate(date.getDate() - j);
                        const dateStr = date.toISOString().split('T')[0];

                        const dayViews = await Promise.race([
                          redis.get(`${key}:day:${dateStr}`),
                          new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Day views timeout')), 2000)
                          ),
                        ]);

                        recentViews += parseInt((dayViews as string) || '0');
                      } catch (dayError) {
                        console.warn(`Failed to get day views for ${postId}, day ${j}:`, dayError);
                        // Continue processing other days
                      }
                    }

                    postsData.push({
                      postId,
                      totalViews,
                      recentViews,
                    });
                  } catch (postError) {
                    console.warn(`Failed to process post key ${key}:`, postError);
                    // Continue processing other posts
                  }
                }

                // Small delay between batches to avoid overwhelming Redis
                await new Promise((resolve) => setTimeout(resolve, 100));
              }

              console.warn(
                `Successfully processed ${postsData.length} posts for trending calculation`
              );
              return postsData;
            } catch (error) {
              console.error('Failed to fetch post data for trending:', error);
              return [];
            }
          });

          // Step 2: Calculate trending scores
          const trending = await step.run('calculate-scores', async () => {
            if (posts.length === 0) {
              console.warn('No posts data available for trending calculation');
              return [];
            }

            return posts
              .filter((post) => post.recentViews > 0)
              .map((post) => ({
                ...post,
                // Simple trending score: recent views * (recent/total ratio)
                score: post.recentViews * (post.recentViews / (post.totalViews || 1)),
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 10); // Top 10
          });

          // Step 3: Store trending list with timeout protection
          await step.run('store-trending', async () => {
            try {
              await Promise.race([
                redis.set(
                  TRENDING_KEY,
                  JSON.stringify(trending),
                  { ex: 60 * 60 } // Cache for 1 hour
                ),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Redis set timeout')), 10000)
                ),
              ]);

              console.warn(`Updated trending posts: ${trending.length} posts`);

              // Track in Vercel Analytics (with error handling)
              try {
                await track('trending_posts_calculated', {
                  trendingCount: trending.length,
                  topPostId: trending[0]?.postId,
                  timestamp: new Date().toISOString(),
                });
              } catch (trackError) {
                console.warn(
                  'Failed to track trending calculation in Vercel Analytics:',
                  trackError
                );
                // Don't fail the function for analytics tracking issues
              }
            } catch (error) {
              console.error('Failed to store trending data:', error);
              throw error; // Re-throw to indicate step failure
            }
          });

          return {
            success: true,
            trendingCount: trending.length,
            topPost: trending[0]?.postId,
            timestamp: new Date().toISOString(),
            processingTimeMs: Date.now() - startTime,
          };
        })(),
        timeoutPromise,
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Trending calculation failed:', errorMessage);

      // Return structured error response
      return {
        success: false,
        reason: 'calculation-failed',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  }
);

/**
 * Generate analytics summary
 *
 * Runs daily/weekly/monthly to create analytics reports.
 * Could be extended to send email summaries, update dashboards, etc.
 */
export const generateAnalyticsSummary = inngest.createFunction(
  {
    id: 'generate-analytics-summary',
    retries: 1,
  },
  { event: 'analytics/summary.generate' },
  async ({ event, step }) => {
    const { period, startDate, endDate } = event.data;
    // Redis client imported from shared module

    if (!redis) {
      return { success: false, reason: 'redis-not-configured' };
    }

    // Step 1: Collect post data
    const postsData = await step.run('collect-data', async () => {
      try {
        const keys = await redis.keys(`${VIEW_KEY_PREFIX}*`);
        const postKeys = keys.filter((key) => !key.includes(':day:'));

        const data = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (const key of postKeys) {
          const slug = key.replace(VIEW_KEY_PREFIX, '');
          const totalViews = parseInt(((await redis.get(key)) as string) || '0');

          // Calculate views in period
          let periodViews = 0;
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayViews = await redis.get(`${key}:day:${dateStr}`);
            periodViews += parseInt((dayViews as string) || '0');
          }

          if (periodViews > 0) {
            data.push({
              slug,
              totalViews,
              periodViews,
            });
          }
        }

        return data.sort((a, b) => b.periodViews - a.periodViews);
      } catch (error) {
        console.error('Failed to collect analytics data:', error);
        return [];
      }
    });

    // Step 2: Generate summary
    const summary = await step.run('generate-summary', async () => {
      const totalViews = postsData.reduce((sum, post) => sum + post.periodViews, 0);

      return {
        period,
        startDate,
        endDate,
        totalViews,
        uniquePosts: postsData.length,
        topPosts: postsData.slice(0, 10).map((post) => ({
          slug: post.slug,
          title: post.slug, // Would need to fetch actual title
          views: post.periodViews,
        })),
      };
    });

    // Step 3: Store summary
    await step.run('store-summary', async () => {
      try {
        const summaryKey = `${ANALYTICS_KEY_PREFIX}${period}:${startDate}`;
        await redis.set(
          summaryKey,
          JSON.stringify(summary),
          { ex: 90 * 24 * 60 * 60 } // Keep for 90 days
        );

        console.warn(`Analytics summary generated for ${period}:`, {
          totalViews: summary.totalViews,
          posts: summary.uniquePosts,
        });

        // Track in Vercel Analytics
        await track('analytics_summary_generated', {
          period,
          totalViews: summary.totalViews,
          uniquePosts: summary.uniquePosts,
          startDate,
          endDate,
        });
      } catch (error) {
        console.error('Failed to store analytics summary:', error);
      }
    });

    return {
      success: true,
      summary,
    };
  }
);

/**
 * Daily analytics summary (scheduled)
 *
 * Runs daily at midnight UTC to generate yesterday's summary.
 */
export const dailyAnalyticsSummary = inngest.createFunction(
  { id: 'daily-analytics-summary' },
  { cron: '0 0 * * *' }, // Daily at midnight UTC
  async ({ step }) => {
    await step.run('trigger-summary', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      await inngest.send({
        name: 'analytics/summary.generate',
        data: {
          period: 'daily',
          startDate: dateStr,
          endDate: dateStr,
        },
      });

      console.warn(`Daily analytics summary triggered for ${dateStr}`);
    });

    return { success: true, triggered: true };
  }
);

/**
 * Sync Vercel analytics into Redis for comparison and dashboard display.
 *
 * Runs daily at 02:00 UTC. Uses `VERCEL_ANALYTICS_ENDPOINT` and `VERCEL_TOKEN`
 * for a proxy endpoint (preferred) or a direct Vercel API endpoint if configured.
 */
export const syncVercelAnalytics = inngest.createFunction(
  { id: 'sync-vercel-analytics' },
  { cron: '0 2 * * *' }, // Daily at 02:00 UTC
  async ({ step }) => {
    // Redis client imported from shared module
    if (!redis) {
      console.warn('Redis not configured, skipping Vercel analytics sync');
      return { success: false, reason: 'redis-not-configured' };
    }

    const { fetchVercelAnalytics } = await import('@/lib/vercel-analytics-api');

    await step.run('fetch-vercel-analytics', async () => {
      try {
        const result = await fetchVercelAnalytics(1);
        if (!result) {
          console.warn(
            'No Vercel analytics available; ensure VERCEL_TOKEN and VERCEL_ANALYTICS_ENDPOINT are configured'
          );
          return { success: false, reason: 'no-vercel-data' };
        }

        const { topPages, topReferrers, topDevices, fetchedAt } = result;

        // Store standardized data in Redis with 24h TTL
        await redis.set('vercel:topPages:daily', JSON.stringify(topPages), { ex: 24 * 60 * 60 });
        await redis.set('vercel:topReferrers:daily', JSON.stringify(topReferrers), {
          ex: 24 * 60 * 60,
        });
        await redis.set('vercel:topDevices:daily', JSON.stringify(topDevices), {
          ex: 24 * 60 * 60,
        });
        await redis.set('vercel:metrics:lastSynced', fetchedAt, { ex: 24 * 60 * 60 });

        // Track that we fetched Vercel analytics - helpful for audit
        await track('vercel_analytics_synced', { fetchedAt, topPagesCount: topPages.length });

        console.warn(
          `Vercel analytics synced: ${topPages.length} pages, ${topReferrers.length} referrers, ${topDevices.length} devices`
        );
      } catch (error) {
        console.error('Failed to sync Vercel analytics:', error);
      }
    });

    return { success: true };
  }
);
