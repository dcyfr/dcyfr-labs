import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { redis, getRedisEnvironment } from '@/lib/redis-client';
import {
  fetchGitHubContributions,
  GITHUB_CACHE_KEY,
  GITHUB_CACHE_DURATION,
} from '@/inngest/github-functions';

/** Schedule: Hourly at minute 0 — migrated from Inngest refreshGitHubData */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/refresh-github-data] Fetching GitHub contributions...');
    const freshData = await fetchGitHubContributions();

    if (!freshData) {
      console.warn(
        '[cron/refresh-github-data] Failed to fetch GitHub data, keeping existing cache'
      );
      return NextResponse.json({ success: false, reason: 'fetch-failed' });
    }

    if (!redis) {
      console.error('[cron/refresh-github-data] Redis not available', {
        environment: getRedisEnvironment(),
        hasProductionUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      });
      return NextResponse.json({ success: false, reason: 'redis-not-configured' });
    }

    const cleanData = {
      contributions: freshData.contributions,
      source: freshData.source,
      totalContributions: freshData.totalContributions,
      lastUpdated: freshData.lastUpdated,
    };

    const ttlSeconds = Math.floor(GITHUB_CACHE_DURATION / 1000);
    await redis.setEx(GITHUB_CACHE_KEY, ttlSeconds, JSON.stringify(cleanData));

    const verification = await redis.get(GITHUB_CACHE_KEY);
    if (!verification) {
      return NextResponse.json(
        { success: false, reason: 'write-verification-failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      totalContributions: cleanData.totalContributions,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/refresh-github-data] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
