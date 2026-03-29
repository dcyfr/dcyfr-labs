import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { SecureSessionManager } from '@/lib/secure-session-manager';

/** Schedule: Every 4 hours (0, 4, 8, 12, 16, 20 UTC) — migrated from Inngest sessionMonitoring */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await SecureSessionManager.getSessionStats();
    const alerts: Array<{ type: string; message: string; severity: string }> = [];

    if (stats.totalSessions > 0 && stats.expiredSessions > stats.totalSessions * 0.5) {
      alerts.push({
        type: 'high_expired_sessions',
        message: `High number of expired sessions: ${stats.expiredSessions}/${stats.totalSessions}`,
        severity: 'warning',
      });
    }

    if (stats.activeSessions > 1000) {
      alerts.push({
        type: 'high_session_count',
        message: `High active session count: ${stats.activeSessions}`,
        severity: 'info',
      });
    }

    const hour = new Date().getUTCHours();
    if (stats.activeSessions === 0 && hour >= 14 && hour <= 22) {
      alerts.push({
        type: 'no_active_sessions_business_hours',
        message: 'No active sessions during business hours',
        severity: 'warning',
      });
    }

    if (alerts.length > 0) {
      console.warn('[cron/session-monitoring] Alerts:', alerts);
    }

    return NextResponse.json({ success: true, stats, alerts });
  } catch (error) {
    console.error('[cron/session-monitoring] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
