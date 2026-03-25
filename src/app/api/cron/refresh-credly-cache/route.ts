import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { populateCredlyCache, getCredlyCacheStats } from '@/lib/credly-cache';

/** Schedule: Daily at 6 AM UTC — migrated from Inngest refreshCredlyCache */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/refresh-credly-cache] Refreshing badge cache for dcyfr user...');
    await populateCredlyCache('dcyfr');

    const stats = getCredlyCacheStats();
    console.warn('[cron/refresh-credly-cache] Cache validation:', stats);

    if (stats.validEntries === 0) {
      throw new Error('No valid cache entries after refresh');
    }

    return NextResponse.json({
      refreshStatus: 'completed',
      validation: { status: 'validated', stats },
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/refresh-credly-cache] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
