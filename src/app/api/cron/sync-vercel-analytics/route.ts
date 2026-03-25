import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { redis } from '@/lib/redis-client';

/** Schedule: Daily at 2 AM UTC — migrated from Inngest syncVercelAnalytics */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!redis) {
    console.warn('[cron/sync-vercel-analytics] Redis not configured, skipping');
    return NextResponse.json({ success: false, reason: 'redis-not-configured' });
  }

  try {
    const { fetchVercelAnalytics } = await import('@/lib/vercel-analytics-api');
    const result = await fetchVercelAnalytics(1);

    if (!result) {
      console.warn('[cron/sync-vercel-analytics] No Vercel analytics available');
      return NextResponse.json({ success: false, reason: 'no-vercel-data' });
    }

    const { topPages, topReferrers, topDevices, fetchedAt } = result;

    await redis.set('vercel:analytics:top-pages', JSON.stringify(topPages), { ex: 24 * 60 * 60 });
    await redis.set('vercel:analytics:top-referrers', JSON.stringify(topReferrers), {
      ex: 24 * 60 * 60,
    });
    await redis.set('vercel:analytics:top-devices', JSON.stringify(topDevices), {
      ex: 24 * 60 * 60,
    });
    await redis.set('vercel:analytics:last-synced', fetchedAt || new Date().toISOString(), {
      ex: 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      topPagesCount: topPages?.length ?? 0,
    });
  } catch (error) {
    console.error('[cron/sync-vercel-analytics] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
