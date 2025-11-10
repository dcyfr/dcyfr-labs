import { NextRequest, NextResponse } from "next/server";
import { incrementPostViews } from "@/lib/views";
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

/**
 * POST /api/views
 * 
 * Increments the view count for a given post with comprehensive anti-spam protection.
 * 
 * Protection layers:
 * 1. IP-based rate limiting (10 views per 5 minutes)
 * 2. Session deduplication (1 view per session per post per 30 minutes)
 * 3. User-agent validation (blocks bots and suspicious clients)
 * 4. Timing validation (requires minimum time on page)
 * 5. Abuse pattern detection (tracks and blocks repeat offenders)
 * 
 * Request body:
 * {
 *   "postId": "string",        // Permanent post identifier
 *   "sessionId": "string",     // Client-generated session ID (from sessionStorage)
 *   "timeOnPage": number,      // Milliseconds user spent on page (must be >= 5000)
 *   "isVisible": boolean       // Whether page was visible (from Visibility API)
 * }
 * 
 * Response:
 * {
 *   "count": number | null,    // Updated view count
 *   "recorded": boolean        // Whether the view was actually counted
 * }
 * 
 * Error responses:
 * - 400: Invalid request data
 * - 429: Rate limit exceeded
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, sessionId, timeOnPage, isVisible } = body;

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

    // Validate visibility - only count views when page was actually visible
    if (isVisible !== true) {
      return NextResponse.json(
        { 
          error: "View not counted - page was not visible", 
          recorded: false,
          count: null 
        },
        { status: 200 } // Not an error, just not counted
      );
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Layer 1: Validate request (user-agent, bot detection)
    const validation = validateRequest(request);
    if (!validation.valid) {
      await recordAbuseAttempt(clientIp, "view", validation.reason || "validation_failed");
      return NextResponse.json(
        { error: "Request validation failed", recorded: false },
        { status: 400 }
      );
    }

    // Layer 2: Validate timing (minimum time on page)
    const timingCheck = validateTiming("view", timeOnPage);
    if (!timingCheck.valid) {
      await recordAbuseAttempt(clientIp, "view", timingCheck.reason || "timing_failed");
      return NextResponse.json(
        { 
          error: "Insufficient time on page", 
          recorded: false,
          count: null 
        },
        { status: 200 } // Not an error, just not counted
      );
    }

    // Layer 3: Check for abuse patterns
    const isAbuser = await detectAbusePattern(clientIp, "view");
    if (isAbuser) {
      await recordAbuseAttempt(clientIp, "view", "abuse_pattern_detected");
      return NextResponse.json(
        { error: "Suspicious activity detected", recorded: false },
        { status: 429 }
      );
    }

    // Layer 4: Rate limiting (10 views per 5 minutes per IP)
    const rateLimitResult = await rateLimit(
      `view:${clientIp}`,
      { limit: 10, windowInSeconds: 300 } // 5 minutes
    );

    if (!rateLimitResult.success) {
      await recordAbuseAttempt(clientIp, "view", "rate_limit_exceeded");
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

    // Layer 5: Session deduplication (1 view per session per post per 30 minutes)
    const isDuplicate = await checkSessionDuplication(
      "view",
      postId,
      sessionId,
      1800 // 30 minutes
    );

    if (isDuplicate) {
      // Not an abuse attempt, just a duplicate - return success without incrementing
      return NextResponse.json(
        { 
          recorded: false,
          count: null,
          message: "View already recorded for this session"
        },
        { status: 200 }
      );
    }

    // All checks passed - increment the view count
    const count = await incrementPostViews(postId);

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
    console.error("Error recording view:", error);
    return NextResponse.json(
      { error: "Failed to record view", recorded: false },
      { status: 500 }
    );
  }
}
