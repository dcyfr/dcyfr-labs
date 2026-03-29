import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { InoreaderClient } from '@/lib/inoreader-client';
import { redis } from '@/lib/redis';

/** Schedule: Every 6 hours — migrated from Inngest syncInoreaderFeeds */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.INOREADER_CLIENT_ID || !process.env.INOREADER_CLIENT_SECRET) {
    return NextResponse.json({ success: false, reason: 'inoreader-not-configured' });
  }

  if (!redis) {
    return NextResponse.json({ success: false, reason: 'redis-not-configured' });
  }

  try {
    const tokensJson = await redis.get('inoreader:tokens');
    if (!tokensJson) {
      console.warn('[cron/sync-inoreader-feeds] No tokens found — user needs to authenticate');
      return NextResponse.json({ success: false, reason: 'no-tokens' });
    }

    const tokens = JSON.parse(tokensJson as string);

    const client = InoreaderClient.fromTokens(
      process.env.INOREADER_CLIENT_ID,
      process.env.INOREADER_CLIENT_SECRET,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      }
    );

    const articles = await client.getAllUnread(100);

    await redis.set('inoreader:feeds:latest', JSON.stringify(articles), { ex: 6 * 60 * 60 });

    const stats = {
      total_articles: articles.length,
      unique_sources: new Set(
        articles.map((a: { origin: { streamId: string } }) => a.origin.streamId)
      ).size,
      last_updated: Date.now(),
    };

    await redis.set('inoreader:stats', JSON.stringify(stats), { ex: 24 * 60 * 60 });

    const titleWords = articles
      .flatMap((a: { title: string }) => a.title.toLowerCase().split(/\W+/))
      .filter((w: string) => w.length > 4);

    const wordFreq = titleWords.reduce(
      (acc: Record<string, number>, w: string) => {
        acc[w] = (acc[w] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const trendingTopics = Object.entries(wordFreq)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    await redis.set('inoreader:trending_topics', JSON.stringify(trendingTopics), {
      ex: 24 * 60 * 60,
    });

    return NextResponse.json({ success: true, articles_synced: articles.length, ...stats });
  } catch (error) {
    console.error('[cron/sync-inoreader-feeds] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
