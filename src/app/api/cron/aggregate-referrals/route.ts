import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { redis } from '@/lib/redis';

/** Schedule: Daily at 2 AM UTC — migrated from Inngest aggregateReferrals */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/aggregate-referrals] Fetching referral counters from Redis...');

    const keys = await redis.keys('referral:count:*');

    if (keys.length === 0) {
      return NextResponse.json({ success: true, aggregated: 0, message: 'No referral data found' });
    }

    const values = await Promise.all(
      keys.map(async (key: string) => {
        const value = await redis.get(key);
        return { key, value: parseInt((value as string) || '0', 10) };
      })
    );

    const counters = values.filter((v: { key: string; value: number }) => v.value > 0);

    // Aggregate by referral source (strip 'referral:count:' prefix)
    const aggregated = counters.reduce(
      (acc: Record<string, number>, { key, value }: { key: string; value: number }) => {
        const source = key.replace('referral:count:', '');
        acc[source] = (acc[source] || 0) + value;
        return acc;
      },
      {} as Record<string, number>
    );

    await redis.set('referral:aggregated', JSON.stringify(aggregated), { ex: 7 * 24 * 60 * 60 });

    console.warn(`[cron/aggregate-referrals] Aggregated ${counters.length} referral sources`);

    return NextResponse.json({
      success: true,
      aggregated: counters.length,
      totalReferrals: counters.reduce(
        (sum: number, v: { key: string; value: number }) => sum + v.value,
        0
      ),
    });
  } catch (error) {
    console.error('[cron/aggregate-referrals] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
