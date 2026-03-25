import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { updateAllAnalyticsMilestones } from '@/lib/analytics-integration';

/** Schedule: Daily at 2 AM UTC — migrated from Inngest updateAnalyticsMilestones */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/update-analytics-milestones] Starting analytics milestone update...');
    const result = await updateAllAnalyticsMilestones();

    if (result.success) {
      console.warn(`[cron/update-analytics-milestones] Complete: ${result.updated.join(', ')}`);
    } else {
      console.warn(
        `[cron/update-analytics-milestones] Completed with errors. Updated: [${result.updated.join(', ')}] Failed: [${result.failed.join(', ')}]`
      );
    }

    return NextResponse.json({
      success: result.success,
      updated: result.updated,
      failed: result.failed,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/update-analytics-milestones] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
