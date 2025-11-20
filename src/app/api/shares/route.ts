import { NextRequest, NextResponse } from "next/server";
import { incrementPostShares } from "@/lib/shares";
import { rateLimit } from "@/lib/rate-limit";
import {
  getClientIp,
  validateRequest,
  checkSessionDuplication,
  recordAbuseAttempt,
  detectAbusePattern,
  validateTiming,
  isValidSessionId,
} from "@/lib/anti-spam";
import { handleApiError } from "@/lib/error-handler";

/**
 * POST /api/shares
 * 
 * Increments the share count for a given post with comprehensive anti-spam protection.
 * Uses permanent post ID to survive slug changes.
 * 
 * Protection layers:
 * 1. IP-based rate limiting (3 shares per 60 seconds)
 * 2. Session deduplication (1 share per session per post per 5 minutes)
 * 3. User-agent validation (blocks bots and suspicious clients)
 * 4. Timing validation (requires minimum time since page load)
 * 5. Abuse pattern detection (tracks and blocks repeat offenders)
 * 
 * Request body:
 * {
 *   "postId": "string",        // Permanent post identifier
 *   "sessionId": "string",     // Client-generated session ID (from sessionStorage)
 *   "timeOnPage": number       // Milliseconds since page load (must be >= 2000)
 * }
 * 
 * Response:
 * {
 *   "count": number | null,    // Updated share count
 *   "recorded": boolean        // Whether the share was actually counted
 * }
 * 
 * Error responses:
 * - 400: Invalid request data
 * - 429: Rate limit exceeded
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: { postId?: string; sessionId?: string; timeOnPage?: number } | undefined;
  
  try {
    body = await request.json();
    const { postId, sessionId, timeOnPage } = body || {};

    // Validate required fields
    if (!postId || typeof postId !== "string") {
      return NextResponse.json(
        { error: "Invalid postId", recorded: false },
        { status: 400 }
      );
    }

    if (!isValidSessionId(sessionId)) {
      return NextResponse.json(
        { error: "Invalid sessionId", recorded: false },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // TypeScript: After validation, we know these are strings
    const validPostId = postId as string;
    const validSessionId = sessionId as string;

    // Layer 1: Validate request (user-agent, bot detection)
    const validation = validateRequest(request);
    if (!validation.valid) {
      await recordAbuseAttempt(clientIp, "share", validation.reason || "validation_failed");
      return NextResponse.json(
        { error: "Request validation failed", recorded: false },
        { status: 400 }
      );
    }

    // Layer 2: Validate timing (minimum time since page load)
    const timingCheck = validateTiming("share", timeOnPage);
    if (!timingCheck.valid) {
      await recordAbuseAttempt(clientIp, "share", timingCheck.reason || "timing_failed");
      return NextResponse.json(
        { error: "Share too fast after page load", recorded: false },
        { status: 400 }
      );
    }

    // Layer 3: Check for abuse patterns
    const isAbuser = await detectAbusePattern(clientIp, "share");
    if (isAbuser) {
      await recordAbuseAttempt(clientIp, "share", "abuse_pattern_detected");
      return NextResponse.json(
        { error: "Suspicious activity detected", recorded: false },
        { status: 429 }
      );
    }

    // Layer 4: Rate limiting (3 shares per 60 seconds per IP)
    const rateLimitResult = await rateLimit(
      `share:${clientIp}`,
      { limit: 3, windowInSeconds: 60 }
    );

    if (!rateLimitResult.success) {
      await recordAbuseAttempt(clientIp, "share", "rate_limit_exceeded");
      return NextResponse.json(
        { error: "Rate limit exceeded", recorded: false },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Layer 5: Session deduplication (1 share per session per post per 5 minutes)
    const isDuplicate = await checkSessionDuplication(
      "share",
      validPostId,
      validSessionId,
      300 // 5 minutes
    );

    if (isDuplicate) {
      // Not an abuse attempt, just a duplicate - return success without incrementing
      return NextResponse.json(
        { 
          recorded: false,
          count: null,
          message: "Share already recorded for this session"
        },
        { status: 200 }
      );
    }

    // All checks passed - increment the share count
    const count = await incrementPostShares(validPostId);

    return NextResponse.json(
      { count, recorded: true },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error) {
    const errorInfo = handleApiError(error, {
      route: "/api/shares",
      method: "POST",
      additionalData: body ? { postId: body.postId } : {},
    });

    // For connection errors, return minimal response
    if (errorInfo.isConnectionError) {
      return new Response(null, { status: errorInfo.statusCode });
    }

    return NextResponse.json(
      { error: "Failed to increment share count", recorded: false },
      { status: errorInfo.statusCode }
    );
  }
}
