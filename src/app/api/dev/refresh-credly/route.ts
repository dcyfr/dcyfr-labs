import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

/**
 * Development-only endpoint to manually refresh Credly cache
 *
 * Usage: GET http://localhost:3000/api/dev/refresh-credly
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  try {
    // First, clear the cache
    await inngest.send({
      name: 'credly/cache.clear',
      data: {
        reason: 'dev-manual-refresh',
        requestedBy: 'dev-endpoint',
      },
    });

    // Then trigger a refresh by manually calling the preload function
    const { preloadCredlyData } = await import('@/lib/credly-cache');
    await preloadCredlyData('dcyfr');

    return NextResponse.json({
      success: true,
      message: 'Credly cache refreshed successfully',
      note: 'Cache has been cleared and repopulated with fresh data',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
