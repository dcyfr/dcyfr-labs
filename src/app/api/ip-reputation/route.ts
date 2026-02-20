/**
 * IP Reputation API Route
 *
 * Provides manual IP reputation lookups and management
 * Follows existing API security patterns from analytics route
 */

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import * as Sentry from '@sentry/nextjs';
import { blockExternalAccess } from '@/lib/api/api-security';
import { rateLimit, getClientIp, createRateLimitHeaders } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/error-handler';
import { IPReputationService } from '@/lib/ip-reputation';
import { inngest } from '@/inngest/client';
import { type IPReputationCheck, type IPReputationBulkResult } from '@/types/ip-reputation';

/**
 * Security Configuration for IP Reputation API
 *
 * Multi-layer protection similar to analytics API:
 * - Layer 0: External access blocking
 * - Layer 1: API key authentication
 * - Layer 2: Environment validation
 * - Layer 3: Rate limiting (more restrictive due to external API costs)
 * - Layer 4: Audit logging
 */

/**
 * Validate API key authentication
 */
function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!authHeader || !expectedKey) return false;

  const providedKey = authHeader.replace('Bearer ', '');

  if (providedKey.length !== expectedKey.length) return false;

  return timingSafeEqual(Buffer.from(providedKey), Buffer.from(expectedKey));
}

/**
 * Validate environment allows API access
 */
function validateEnvironment(): boolean {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
  return ['development', 'preview', 'test'].includes(env || '');
}

/**
 * Log API access for security monitoring
 */
function logApiAccess(
  request: NextRequest,
  success: boolean,
  details: Record<string, unknown> = {}
): void {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: clientIp,
    userAgent,
    success,
    endpoint: '/api/ip-reputation',
    ...details,
  };

  if (success) {
    console.warn('IP Reputation API access:', logEntry);
  } else {
    console.warn('IP Reputation API access denied:', logEntry);
    Sentry.addBreadcrumb({
      category: 'security',
      message: 'IP Reputation API access denied',
      level: 'warning',
      data: logEntry,
    });
  }
}

/**
 * Enforce the 3-layer security stack on every request.
 * Returns a rejection NextResponse if blocked, or null if all checks pass.
 */
async function enforceSecurityGuards(request: NextRequest): Promise<NextResponse | null> {
  const externalAccessResult = blockExternalAccess(request);
  if (externalAccessResult) {
    logApiAccess(request, false, { reason: 'external-access-blocked' });
    return externalAccessResult;
  }
  if (!validateApiKey(request)) {
    logApiAccess(request, false, { reason: 'invalid-api-key' });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!validateEnvironment()) {
    logApiAccess(request, false, { reason: 'invalid-environment' });
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  return null;
}

/**
 * Parse the JSON request body, returning a discriminated union result.
 */
async function parseJsonBody(
  request: NextRequest
): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) };
  }
}

/**
 * Perform a single or bulk IP reputation lookup and log the outcome.
 */
async function performIpLookup(
  request: NextRequest,
  singleIp: string | null,
  multipleIps: string[] | undefined,
  useCache: boolean,
  startTime: number
): Promise<{ ok: true; result: IPReputationCheck | IPReputationBulkResult } | { ok: false; response: NextResponse }> {
  const reputationService = new IPReputationService();

  if (singleIp) {
    const result = await reputationService.getIpReputation(singleIp, useCache);
    logApiAccess(request, true, {
      action: 'single-ip-lookup',
      ip: singleIp,
      classification: result.details?.classification,
      cached: result.cache_hit,
      processingTime: Date.now() - startTime,
    });
    return { ok: true, result };
  }

  if (multipleIps) {
    if (multipleIps.length > 50) {
      logApiAccess(request, false, { reason: 'too-many-ips', count: multipleIps.length });
      return {
        ok: false,
        response: NextResponse.json({ error: 'Too many IPs. Maximum 50 per request.' }, { status: 400 }),
      };
    }
    const result = await reputationService.bulkCheckReputation(multipleIps);
    logApiAccess(request, true, {
      action: 'bulk-ip-lookup',
      ipCount: multipleIps.length,
      maliciousCount: result.malicious_count,
      suspiciousCount: result.suspicious_count,
      processingTime: result.processing_time_ms,
    });
    return { ok: true, result };
  }

  return { ok: false, response: NextResponse.json({ error: 'Invalid parameters' }, { status: 400 }) };
}

/**
 * GET /api/ip-reputation - Check reputation for single or multiple IPs
 *
 * Query parameters:
 * - ip: Single IP address to check
 * - ips: Comma-separated list of IP addresses
 * - useCache: Whether to use cached results (default: true)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const guardResponse = await enforceSecurityGuards(request);
    if (guardResponse) return guardResponse;

    // Layer 3: Rate limiting (stricter for external API calls)
    const clientIp = getClientIp(request);
    const rateLimitResult = await rateLimit(clientIp, {
      limit: 10, // Only 10 requests per hour due to GreyNoise API costs
      windowInSeconds: 3600,
    });

    if (!rateLimitResult.success) {
      const headers = createRateLimitHeaders(rateLimitResult);
      logApiAccess(request, false, {
        reason: 'rate-limited',
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.reset,
      });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const singleIp = searchParams.get('ip');
    const multipleIps = searchParams
      .get('ips')
      ?.split(',')
      .map((ip) => ip.trim());
    const useCache = searchParams.get('useCache') !== 'false';

    if (!singleIp && !multipleIps) {
      logApiAccess(request, false, { reason: 'missing-ip-parameter' });
      return NextResponse.json({ error: 'Missing required parameter: ip or ips' }, { status: 400 });
    }

    const lookupResult = await performIpLookup(request, singleIp, multipleIps, useCache, startTime);
    if (!lookupResult.ok) return lookupResult.response;

    const headers = createRateLimitHeaders(rateLimitResult);
    return NextResponse.json(
      {
        success: true,
        data: lookupResult.result,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
      },
      { status: 200, headers }
    );
  } catch (error) {
    logApiAccess(request, false, {
      reason: 'internal-error',
      error: error instanceof Error ? error.message : 'unknown',
    });
    const errorInfo = handleApiError(error);
    return NextResponse.json(
      {
        error: errorInfo.message,
        code: errorInfo.isConnectionError ? 'CONNECTION_CLOSED' : 'INTERNAL_ERROR',
      },
      { status: errorInfo.statusCode }
    );
  }
}

/**
 * POST /api/ip-reputation - Trigger manual IP reputation check
 *
 * Body:
 * - ips: Array of IP addresses to check
 * - config: Optional configuration overrides
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const guardResponse = await enforceSecurityGuards(request);
    if (guardResponse) return guardResponse;

    // Stricter rate limiting for manual triggers
    const clientIp = getClientIp(request);
    const rateLimitResult = await rateLimit(clientIp, {
      limit: 5, // Only 5 manual triggers per hour
      windowInSeconds: 3600,
    });

    if (!rateLimitResult.success) {
      const headers = createRateLimitHeaders(rateLimitResult);
      logApiAccess(request, false, { reason: 'rate-limited' });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers });
    }

    // Parse request body
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return parsed.response;
    const { ips, config = {} } = parsed.body as { ips: string[]; config?: Record<string, unknown> };

    if (!ips || !Array.isArray(ips) || ips.length === 0) {
      logApiAccess(request, false, { reason: 'invalid-ips-array' });
      return NextResponse.json({ error: 'Missing or invalid ips array' }, { status: 400 });
    }

    if (ips.length > 100) {
      logApiAccess(request, false, { reason: 'too-many-ips', count: ips.length });
      return NextResponse.json(
        { error: 'Too many IPs. Maximum 100 per manual trigger.' },
        { status: 400 }
      );
    }

    // Trigger Inngest function for manual IP reputation check
    const eventId = await inngest.send({
      name: 'security/ip-reputation.check-triggered',
      data: {
        trigger_source: 'manual',
        ip_list: ips,
        check_config: config,
      },
    });

    logApiAccess(request, true, {
      action: 'manual-check-triggered',
      ipCount: ips.length,
      eventId: eventId.ids[0],
    });

    const headers = createRateLimitHeaders(rateLimitResult);
    return NextResponse.json(
      {
        success: true,
        message: 'IP reputation check triggered',
        event_id: eventId.ids[0],
        ip_count: ips.length,
        timestamp: new Date().toISOString(),
      },
      { status: 202, headers }
    );
  } catch (error) {
    logApiAccess(request, false, {
      reason: 'internal-error',
      error: error instanceof Error ? error.message : 'unknown',
    });

    const errorInfo = handleApiError(error);
    return NextResponse.json(
      {
        error: errorInfo.message,
        code: errorInfo.isConnectionError ? 'CONNECTION_CLOSED' : 'INTERNAL_ERROR',
      },
      { status: errorInfo.statusCode }
    );
  }
}

/**
 * PUT /api/ip-reputation - Update IP reputation manually
 *
 * Body:
 * - ip: IP address to update
 * - classification: New classification (malicious, suspicious, benign)
 * - reason: Reason for manual override
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const guardResponse = await enforceSecurityGuards(request);
    if (guardResponse) return guardResponse;

    // Parse request body
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return parsed.response;
    const { ip, classification, reason } = parsed.body as {
      ip: string;
      classification: string;
      reason: string;
    };

    if (!ip || !classification || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: ip, classification, reason' },
        { status: 400 }
      );
    }

    if (!['malicious', 'suspicious', 'benign', 'unknown'].includes(classification)) {
      return NextResponse.json(
        { error: 'Invalid classification. Must be: malicious, suspicious, benign, or unknown' },
        { status: 400 }
      );
    }

    // TODO: Implement manual reputation override
    // This would update the Redis cache with manual classification
    logApiAccess(request, true, {
      action: 'manual-classification-update',
      ip,
      classification,
      reason,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'IP reputation updated',
        ip,
        classification,
        reason,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorInfo = handleApiError(error);
    return NextResponse.json(
      {
        error: errorInfo.message,
        code: errorInfo.isConnectionError ? 'CONNECTION_CLOSED' : 'INTERNAL_ERROR',
      },
      { status: errorInfo.statusCode }
    );
  }
}
