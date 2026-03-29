import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';

/**
 * Schedule: Daily at 1 AM UTC — migrated from Inngest dailySecurityTest
 *
 * Note: This test suite was scoped to December 12-20, 2025 (validation period).
 * The end date has passed so this always returns skipped. Kept for schedule parity.
 */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const endDate = new Date('2025-12-20T23:59:59Z');

  if (now > endDate) {
    return NextResponse.json({
      skipped: true,
      reason: 'Validation period ended (Dec 20, 2025)',
      timestamp: now.toISOString(),
    });
  }

  // Unreachable in production but preserved for parity
  return NextResponse.json({ skipped: false, timestamp: now.toISOString() });
}
