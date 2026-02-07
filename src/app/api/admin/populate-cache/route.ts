import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/mcp/shared/redis-client';

/**
 * Admin endpoint to populate production cache
 *
 * This endpoint can be called in any environment (production, preview, dev)
 * to manually populate the Redis cache with Credly and GitHub data.
 *
 * Requires CRON_SECRET for authentication.
 *
 * Usage:
 *   curl -X POST https://www.dcyfr.ai/api/admin/populate-cache \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

const GITHUB_USERNAME = 'dcyfr';
const CREDLY_API_BASE = 'https://www.credly.com/users/dcyfr/badges.json';
const CACHE_TTL = 25 * 60 * 60; // 25 hours in seconds (1hr buffer beyond daily cron)

interface PopulateResult {
  success: boolean;
  message: string;
  key?: string;
  keys?: string[];
  count?: number;
  error?: string;
}

async function fetchGitHubContributions(): Promise<{
  contributions: Array<{ date: string; count: number }>;
  totalContributions: number;
  source: 'github-api';
  lastUpdated: string;
} | null> {
  try {
    console.log('[Admin Cache] Fetching GitHub contributions...');

    // Get date range for last year
    const to = new Date();
    const from = new Date();
    from.setFullYear(from.getFullYear() - 1);

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Use GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    } else {
      console.warn('[Admin Cache] No GITHUB_TOKEN - API rate limits may apply');
    }

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: {
          username: GITHUB_USERNAME,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: 0 }, // Don't cache during populate
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error('No contribution data in response');
    }

    // Transform to our format
    const contributions: Array<{ date: string; count: number }> = [];
    for (const week of calendar.weeks || []) {
      for (const day of week.contributionDays || []) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      }
    }

    console.log(`[Admin Cache] ✅ Fetched ${calendar.totalContributions} contributions`);

    return {
      contributions,
      totalContributions: calendar.totalContributions || 0,
      source: 'github-api',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Admin Cache] ❌ GitHub fetch failed:', error);
    return null;
  }
}

async function fetchCredlyBadges(): Promise<any[] | null> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Admin Cache] Fetching Credly badges (attempt ${attempt}/${maxRetries})...`);

      // Add timeout protection
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(CREDLY_API_BASE, {
        headers: { 'User-Agent': 'dcyfr-labs/1.0' },
        next: { revalidate: 0 }, // Don't cache during populate
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unable to read error body');
        throw new Error(
          `Credly API returned ${response.status} ${response.statusText}: ${errorBody}`
        );
      }

      const data = await response.json();
      const badges = data.data || [];

      console.log(`[Admin Cache] ✅ Fetched ${badges.length} badges on attempt ${attempt}`);

      return badges;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      console.error(
        `[Admin Cache] ❌ Credly fetch attempt ${attempt}/${maxRetries} failed:`,
        error
      );

      // Send to Sentry on final failure
      if (isLastAttempt) {
        try {
          const Sentry = await import('@sentry/nextjs');
          Sentry.captureException(error, {
            level: 'error',
            tags: {
              component: 'cache-population',
              api: 'credly',
              source: 'admin-populate-cache',
            },
            extra: {
              attempt,
              maxRetries,
              apiUrl: CREDLY_API_BASE,
            },
          });
        } catch (sentryError) {
          // Sentry not available - silently continue
          console.warn('[Admin Cache] Could not send error to Sentry:', sentryError);
        }

        return null; // All retries exhausted
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`[Admin Cache] ⏳ Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return null;
}

/**
 * GET handler for Vercel Cron Jobs
 *
 * Vercel crons send GET requests. This handler authenticates via the
 * Authorization header (Vercel auto-injects CRON_SECRET) and delegates
 * to the shared population logic.
 */
export async function GET(request: NextRequest) {
  return handlePopulateCache(request);
}

export async function POST(request: NextRequest) {
  return handlePopulateCache(request);
}

async function handlePopulateCache(request: NextRequest) {
  // Authentication check - Vercel crons send Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token || token !== process.env.CRON_SECRET) {
    console.warn('[Admin Cache] ⚠️ Unauthorized access attempt');
    return NextResponse.json(
      { error: 'Unauthorized - valid CRON_SECRET required' },
      { status: 401 }
    );
  }

  console.log('[Admin Cache] 🚀 Starting cache population...');
  console.log('[Admin Cache] Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    note: 'Keys auto-prefixed by Redis Proxy',
  });

  const results: {
    github?: PopulateResult;
    credly?: PopulateResult;
  } = {};

  // 1. Populate GitHub data
  try {
    const githubData = await fetchGitHubContributions();

    if (githubData) {
      const key = 'github:contributions:dcyfr';
      await redis.set(key, JSON.stringify(githubData), { ex: CACHE_TTL });

      results.github = {
        success: true,
        message: `Cached ${githubData.totalContributions} contributions`,
        key,
        count: githubData.totalContributions,
      };

      console.log(`[Admin Cache] ✅ GitHub data cached: ${key}`);
    } else {
      results.github = {
        success: false,
        message: 'Failed to fetch GitHub data',
        error: 'API request failed',
      };

      console.error('[Admin Cache] ❌ GitHub cache population failed');
    }
  } catch (error) {
    results.github = {
      success: false,
      message: 'Exception during GitHub cache population',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    console.error('[Admin Cache] ❌ GitHub cache error:', error);
  }

  // 2. Populate Credly data (all three variants)
  try {
    const allBadges = await fetchCredlyBadges();

    if (allBadges && Array.isArray(allBadges)) {
      const credlyKeys: string[] = [];
      const variants = [
        { limit: null, key: 'all', badges: allBadges },
        { limit: 10, key: '10', badges: allBadges.slice(0, 10) },
        { limit: 3, key: '3', badges: allBadges.slice(0, 3) },
      ];

      for (const variant of variants) {
        const redisKey = `credly:badges:dcyfr:${variant.key}`;
        const cacheData = {
          badges: variant.badges,
          total_count: variant.badges.length,
          count: variant.badges.length,
        };

        await redis.set(redisKey, JSON.stringify(cacheData), { ex: CACHE_TTL });
        credlyKeys.push(redisKey);

        console.log(`[Admin Cache] ✅ Cached ${variant.key}: ${variant.badges.length} badges`);
      }

      results.credly = {
        success: true,
        message: `Cached ${credlyKeys.length}/3 badge variants (${allBadges.length} total badges)`,
        keys: credlyKeys,
        count: allBadges.length,
      };
    } else {
      results.credly = {
        success: false,
        message: 'Failed to fetch Credly data',
        error: 'API request failed',
      };

      console.error('[Admin Cache] ❌ Credly cache population failed');
    }
  } catch (error) {
    results.credly = {
      success: false,
      message: 'Exception during Credly cache population',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    console.error('[Admin Cache] ❌ Credly cache error:', error);
  }

  const overallSuccess = results.github?.success && results.credly?.success;

  console.log('[Admin Cache] 📋 Summary:', {
    github: results.github?.success ? '✅' : '❌',
    credly: results.credly?.success ? '✅' : '❌',
    overall: overallSuccess ? '✅' : '❌',
  });

  return NextResponse.json(
    {
      success: overallSuccess,
      message: overallSuccess
        ? 'Cache populated successfully in production'
        : 'Some operations failed - check details',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        note: 'Keys auto-prefixed by Redis Proxy',
      },
      results: {
        github: results.github,
        credly: results.credly,
      },
      timestamp: new Date().toISOString(),
    },
    { status: overallSuccess ? 200 : 500 }
  );
}
