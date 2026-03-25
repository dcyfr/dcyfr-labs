import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { redis } from '@/lib/redis-client';
import { track } from '@vercel/analytics/server';

const VIEW_KEY_PREFIX = 'views:post:';
const ANALYTICS_KEY_PREFIX = 'blog:analytics:';

/** Schedule: Daily at midnight UTC — migrated from Inngest dailyAnalyticsSummary */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json({ success: false, reason: 'redis-not-configured' });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  const period = 'daily';
  const startDate = dateStr;
  const endDate = dateStr;

  try {
    // Collect post data for the period
    const keys = (await redis.keys(`${VIEW_KEY_PREFIX}*`)) as string[];
    const postKeys = keys.filter((key) => !key.includes(':day:'));

    const postsData: Array<{ slug: string; totalViews: number; periodViews: number }> = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const key of postKeys) {
      const slug = key.replace(VIEW_KEY_PREFIX, '');
      const totalViews = parseInt(((await redis.get(key)) as string) || '0');

      let periodViews = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().split('T')[0];
        const dayViews = await redis.get(`${key}:day:${ds}`);
        periodViews += parseInt((dayViews as string) || '0');
      }

      if (periodViews > 0) {
        postsData.push({ slug, totalViews, periodViews });
      }
    }

    const sorted = postsData.sort((a, b) => b.periodViews - a.periodViews);
    const totalViews = sorted.reduce((sum, p) => sum + p.periodViews, 0);

    const summary = {
      period,
      startDate,
      endDate,
      totalViews,
      uniquePosts: sorted.length,
      topPosts: sorted
        .slice(0, 10)
        .map((p) => ({ slug: p.slug, title: p.slug, views: p.periodViews })),
    };

    const summaryKey = `${ANALYTICS_KEY_PREFIX}${period}:${startDate}`;
    await redis.set(summaryKey, JSON.stringify(summary), { ex: 90 * 24 * 60 * 60 });

    console.warn(`[cron/daily-analytics-summary] Generated for ${period}:`, {
      totalViews: summary.totalViews,
      posts: summary.uniquePosts,
    });

    try {
      await track('analytics_summary_generated', {
        period,
        totalViews: summary.totalViews,
        uniquePosts: summary.uniquePosts,
        startDate,
        endDate,
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('[cron/daily-analytics-summary] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
