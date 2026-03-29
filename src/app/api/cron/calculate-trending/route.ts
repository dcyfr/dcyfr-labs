import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { redis } from '@/lib/redis-client';
import { track } from '@vercel/analytics/server';

const VIEW_KEY_PREFIX = 'views:post:';
const TRENDING_KEY = 'blog:trending';
const FUNCTION_TIMEOUT_MS = 45000;

/** Schedule: Hourly — migrated from Inngest calculateTrending */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json({ success: false, reason: 'redis-not-configured' });
  }

  const startTime = Date.now();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Trending calculation timeout')), FUNCTION_TIMEOUT_MS)
  );

  try {
    return await Promise.race([
      (async () => {
        const keys = (await redis.keys(`${VIEW_KEY_PREFIX}*`)) as string[];
        const postKeys = keys.filter((key) => !key.includes(':day:'));

        if (postKeys.length === 0) {
          return NextResponse.json({ success: true, trendingCount: 0, reason: 'no-post-keys' });
        }

        const today = new Date();
        const dateStrings = Array.from({ length: 7 }, (_, j) => {
          const d = new Date(today);
          d.setDate(d.getDate() - j);
          return d.toISOString().split('T')[0];
        });

        type PostData = { postId: string; totalViews: number; recentViews: number };
        const postsData: PostData[] = [];
        const batchSize = 50;

        for (let i = 0; i < postKeys.length; i += batchSize) {
          const batch = postKeys.slice(i, i + batchSize);

          try {
            const multi = redis.multi();
            batch.forEach((key) => {
              multi.get(key);
              dateStrings.forEach((dateStr) => multi.get(`${key}:day:${dateStr}`));
            });

            const results = await multi.exec();
            if (!results) continue;

            batch.forEach((key, batchIdx) => {
              const postId = key.replace(VIEW_KEY_PREFIX, '');
              const offset = batchIdx * 8;
              const totalViews = parseInt((results[offset] as unknown as string) || '0');
              let recentViews = 0;
              for (let j = 0; j < 7; j++) {
                recentViews += parseInt((results[offset + 1 + j] as unknown as string) || '0');
              }
              postsData.push({ postId, totalViews, recentViews });
            });
          } catch (batchError) {
            console.warn(`[cron/calculate-trending] Batch error:`, batchError);
          }
        }

        const trending = postsData
          .filter((p) => p.recentViews > 0)
          .map((p) => ({
            ...p,
            score: p.recentViews * (p.recentViews / (p.totalViews || 1)),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        await redis.set(TRENDING_KEY, JSON.stringify(trending), { ex: 60 * 60 });

        try {
          await track('trending_posts_calculated', {
            trendingCount: trending.length,
            topPostId: trending[0]?.postId,
            timestamp: new Date().toISOString(),
          });
        } catch {
          // Non-critical
        }

        return NextResponse.json({
          success: true,
          trendingCount: trending.length,
          topPost: trending[0]?.postId,
          processingTimeMs: Date.now() - startTime,
        });
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error('[cron/calculate-trending] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
