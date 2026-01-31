import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

/**
 * Development-only endpoint to populate preview database cache
 *
 * This endpoint populates the preview Redis database with:
 * - GitHub contribution data
 * - Credly badge data
 *
 * Usage: GET http://localhost:3000/api/dev/populate-cache
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  const results: {
    github?: { success: boolean; message?: string; error?: string };
    credly?: { success: boolean; message?: string; error?: string };
  } = {};

  // 1. Trigger GitHub data refresh
  try {
    await inngest.send({
      name: 'github/data.refresh',
      data: {
        force: true,
        source: 'dev-populate-cache',
      },
    });
    results.github = {
      success: true,
      message: 'GitHub refresh triggered (will complete in background)',
    };
  } catch (error) {
    results.github = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // 2. Refresh Credly cache directly (faster than waiting for Inngest)
  try {
    const { preloadCredlyData } = await import('@/lib/credly-cache');
    await preloadCredlyData('dcyfr');
    results.credly = {
      success: true,
      message: 'Credly cache populated successfully',
    };
  } catch (error) {
    results.credly = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  const overallSuccess = results.github?.success && results.credly?.success;

  return NextResponse.json(
    {
      success: overallSuccess,
      message: overallSuccess
        ? 'Preview database cache populated successfully'
        : 'Some operations failed - check details',
      results,
      note: 'GitHub data may take 1-2 minutes to appear. Reload the page to see updates.',
    },
    { status: overallSuccess ? 200 : 500 }
  );
}
