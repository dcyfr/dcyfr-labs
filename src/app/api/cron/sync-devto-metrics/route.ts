import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { fetchDevToMetricsBatch } from '@/lib/social-analytics';
import { redis } from '@/lib/redis';

interface PostWithDevSlug {
  id: string;
  devSlug: string;
}

/** Schedule: Every 6 hours — migrated from Inngest syncDevToMetrics */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const postsData = await redis.get('posts:dev-slugs');

    if (!postsData) {
      console.warn('[cron/sync-devto-metrics] No posts with DEV slugs found in cache');
      return NextResponse.json({ status: 'skipped', message: 'No posts with DEV articles found' });
    }

    const posts = JSON.parse(postsData as string) as PostWithDevSlug[];

    if (posts.length === 0) {
      return NextResponse.json({ status: 'skipped', message: 'No posts with DEV articles found' });
    }

    console.warn(`[cron/sync-devto-metrics] Fetching metrics for ${posts.length} articles...`);

    const articlesToBatch = posts.map((p) => ({ postId: p.id, devSlug: p.devSlug }));
    const results = await fetchDevToMetricsBatch(articlesToBatch);

    const successCount = results.filter((r) => r !== null).length;

    // Cache metrics per post
    for (let i = 0; i < posts.length; i++) {
      if (results[i] !== null) {
        await redis.set(`devto:metrics:${posts[i].id}`, JSON.stringify(results[i]), {
          ex: 6 * 60 * 60,
        });
      }
    }

    return NextResponse.json({
      status: 'completed',
      total: posts.length,
      success: successCount,
      failed: posts.length - successCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/sync-devto-metrics] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
