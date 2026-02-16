/**
 * Delegation Events API Route
 *
 * Receives delegation events from MCP servers and streams them to
 * observability platforms (Axiom and Sentry).
 *
 * This endpoint allows MCP servers to send delegation events to the
 * dcyfr-labs observability infrastructure for monitoring and alerting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { rateLimit, getClientIp, createRateLimitHeaders } from '@/lib/rate-limit';
import {
  streamDelegationEvent,
  parseMCPDelegationEvent,
  createDelegationEventFromMCP,
  type DelegationEvent,
} from '@/lib/delegation/observability';

const RATE_LIMIT_CONFIG = {
  limit: 100,
  windowInSeconds: 60,
  failClosed: true,
};

function hasValidBearerToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return false;
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const validTokens = [process.env.ADMIN_API_KEY, process.env.CRON_SECRET].filter(
    (value): value is string => typeof value === 'string' && value.length > 0
  );

  if (validTokens.length === 0) {
    console.error('[Delegation Events API] ADMIN_API_KEY/CRON_SECRET not configured');
    return false;
  }

  return validTokens.some((candidate) => {
    try {
      const tokenBuffer = Buffer.from(token, 'utf8');
      const candidateBuffer = Buffer.from(candidate, 'utf8');
      if (tokenBuffer.length !== candidateBuffer.length) {
        return false;
      }
      return timingSafeEqual(tokenBuffer, candidateBuffer);
    } catch {
      return false;
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!hasValidBearerToken(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Valid bearer token required',
        },
        { status: 401 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimitResult = await rateLimit(`delegation:events:${clientIp}`, RATE_LIMIT_CONFIG);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...createRateLimitHeaders(rateLimitResult),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    const contentType = request.headers.get('content-type') || '';

    // Handle different input formats
    let delegationEvent: DelegationEvent | null = null;

    if (contentType.includes('application/json')) {
      // Direct JSON event from MCP server
      const eventData = await request.json();

      if (typeof eventData === 'string') {
        // Parse MCP event string format
        delegationEvent = parseMCPDelegationEvent(eventData);
      } else {
        // Direct event object
        delegationEvent = createDelegationEventFromMCP(
          eventData.type,
          eventData.contractId,
          eventData.delegatorAgentId,
          eventData.taskId,
          eventData.toolName,
          eventData.executionTime,
          eventData.error,
          eventData.metadata
        );
      }
    } else {
      // Handle raw string events (MCP server console output)
      const eventString = await request.text();
      delegationEvent = parseMCPDelegationEvent(eventString);
    }

    if (!delegationEvent) {
      return NextResponse.json({ error: 'Invalid delegation event format' }, { status: 400 });
    }

    // Validate required fields
    if (!delegationEvent.contractId) {
      return NextResponse.json({ error: 'Missing required field: contractId' }, { status: 400 });
    }

    // Stream to observability platforms
    streamDelegationEvent(delegationEvent);

    return NextResponse.json({
      success: true,
      eventType: delegationEvent.type,
      contractId: delegationEvent.contractId,
      timestamp: delegationEvent.timestamp,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
      },
    });
  } catch (error) {
    console.error('Delegation events API error:', error);

    return NextResponse.json({ error: 'Failed to process delegation event' }, { status: 500 });
  }
}

// Health check endpoint for monitoring
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'delegation-events-api',
    timestamp: Date.now(),
  });
}
