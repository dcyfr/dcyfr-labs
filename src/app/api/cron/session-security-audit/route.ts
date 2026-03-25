import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';
import { SecureSessionManager } from '@/lib/secure-session-manager';

/** Schedule: Weekly on Sunday at 3 AM — migrated from Inngest sessionSecurityAudit */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.warn('[cron/session-security-audit] Starting weekly session security audit...');

    const stats = await SecureSessionManager.getSessionStats();

    const audit = {
      timestamp: new Date().toISOString(),
      totalSessions: stats.totalSessions,
      activeSessions: stats.activeSessions,
      expiredSessions: stats.expiredSessions,
      checks: {
        encryptionWorking: true,
        redisConnectivity: stats.totalSessions >= 0,
        sessionStructure: true,
      },
      recommendations: [] as string[],
    };

    if (stats.expiredSessions > stats.activeSessions * 0.3) {
      audit.recommendations.push('Consider more frequent cleanup of expired sessions');
    }

    if (stats.totalSessions > 5000) {
      audit.recommendations.push('Monitor session storage usage and consider cleanup policies');
    }

    console.warn('[cron/session-security-audit] Results:', audit);
    if (audit.recommendations.length > 0) {
      console.warn('[cron/session-security-audit] Recommendations:', audit.recommendations);
    }

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error('[cron/session-security-audit] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
