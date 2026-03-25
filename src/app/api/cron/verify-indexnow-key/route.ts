import { NextResponse } from 'next/server';
import { validateCronRequest } from '@/lib/cron-auth';

/** Schedule: Every 12 hours — migrated from Inngest verifyIndexNowKeyFile */
export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.INDEXNOW_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey || !siteUrl) {
    console.warn(
      '[cron/verify-indexnow-key] Skipped — missing INDEXNOW_API_KEY or NEXT_PUBLIC_SITE_URL'
    );
    return NextResponse.json({
      success: false,
      error: 'Missing INDEXNOW_API_KEY or NEXT_PUBLIC_SITE_URL',
      timestamp: new Date().toISOString(),
    });
  }

  const keyFileUrl = `${siteUrl}/${apiKey}.txt`;

  try {
    console.log(`[cron/verify-indexnow-key] Verifying key file: ${keyFileUrl}`);

    const response = await fetch(keyFileUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'DCYFR-Labs IndexNow Verification/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();
    if (content.trim() !== apiKey) {
      throw new Error(`Key file content mismatch. Expected: ${apiKey}, Got: ${content.trim()}`);
    }

    console.log('[cron/verify-indexnow-key] Key file verification successful');

    return NextResponse.json({
      success: true,
      keyFileUrl,
      statusCode: response.status,
      contentValid: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[cron/verify-indexnow-key] Verification failed: ${errorMessage}`);
    return NextResponse.json(
      { success: false, error: errorMessage, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
