import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

/**
 * Development-only endpoint to manually refresh GitHub cache
 *
 * Usage: GET http://localhost:3000/api/dev/refresh-github
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  try {
    // Trigger the manual refresh event
    await inngest.send({
      name: 'github/data.refresh',
      data: {
        force: true,
        source: 'dev-manual-trigger',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'GitHub data refresh triggered',
      note: 'Check Inngest dashboard or logs for progress',
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
