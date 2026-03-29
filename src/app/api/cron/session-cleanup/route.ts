import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { SecureSessionManager } from '@/lib/secure-session-manager';

/** Schedule: Daily at 2 AM — migrated from Inngest sessionCleanup */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/session-cleanup] Starting daily session cleanup...');

    const result = await SecureSessionManager.cleanupExpiredSessions();
    console.warn(`[cron/session-cleanup] Completed: ${result.cleaned} sessions removed`);

    const stats = await SecureSessionManager.getSessionStats();
    console.warn('[cron/session-cleanup] Stats after cleanup:', stats);

    return NextResponse.json({
      success: true,
      cleaned: result.cleaned,
      remainingActive: stats.activeSessions,
      totalRemaining: stats.totalSessions,
    });
  } catch (error) {
    console.error('[cron/session-cleanup] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
