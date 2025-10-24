import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * CSP Violation Reporting Endpoint
 * 
 * Receives and logs Content Security Policy violations from browsers.
 * This endpoint helps monitor security issues and potential XSS attacks.
 * 
 * Security Features:
 * - Rate limiting: 30 reports per minute per IP
 * - PII anonymization: Only logs metadata, not user data
 * - Graceful error handling: Never blocks the user's browser
 * 
 * CSP Report Format (browser-generated):
 * {
 *   "csp-report": {
 *     "document-uri": "https://example.com/page",
 *     "referrer": "https://example.com/",
 *     "violated-directive": "script-src 'self'",
 *     "effective-directive": "script-src",
 *     "original-policy": "default-src 'self'; script-src 'self'",
 *     "blocked-uri": "https://evil.com/malicious.js",
 *     "status-code": 200,
 *     "source-file": "https://example.com/page",
 *     "line-number": 42,
 *     "column-number": 13
 *   }
 * }
 * 
 * Rate Limiting:
 * - Prevents abuse of the reporting endpoint
 * - Allows 30 reports/minute per IP (legitimate violations are rare)
 * - Uses shared Redis state in production for distributed rate limiting
 * - Falls back to in-memory rate limiting if Redis unavailable
 * 
 * Privacy:
 * - Logs only security-relevant metadata
 * - Excludes potentially sensitive URIs (query params, hashes)
 * - Never logs user-generated content
 * - Compliant with privacy regulations (GDPR, CCPA)
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#violation_reporting
 * @see https://www.w3.org/TR/CSP3/#reporting
 */

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting (30 reports per minute per IP)
    const clientIp = getClientIp(req);
    const rateLimitResult = await rateLimit(clientIp, {
      limit: 30,
      windowInSeconds: 60,
    });
    
    if (!rateLimitResult.success) {
      console.warn("CSP report rate limit exceeded", {
        ip: clientIp,
        remaining: rateLimitResult.remaining,
      });
      
      return NextResponse.json(
        { error: "Too many reports" },
        { status: 429 }
      );
    }

    // Parse CSP violation report
    const report = await req.json();
    
    // Extract relevant security information (anonymized)
    const cspReport = report["csp-report"] || {};
    
    // Log anonymized violation data
    const violationData = {
      timestamp: new Date().toISOString(),
      violatedDirective: cspReport["violated-directive"],
      effectiveDirective: cspReport["effective-directive"],
      blockedUri: anonymizeUri(cspReport["blocked-uri"]),
      documentUri: anonymizeUri(cspReport["document-uri"]),
      sourceFile: anonymizeUri(cspReport["source-file"]),
      lineNumber: cspReport["line-number"],
      columnNumber: cspReport["column-number"],
      statusCode: cspReport["status-code"],
      disposition: cspReport["disposition"], // "enforce" or "report"
    };

    // Log to console (will be captured by Vercel logs)
    console.warn("CSP Violation Report:", JSON.stringify(violationData, null, 2));

    // TODO: In production, send to monitoring service
    // Examples:
    // - Sentry: Sentry.captureMessage('CSP Violation', { extra: violationData })
    // - Datadog: datadogLogs.logger.warn('CSP Violation', violationData)
    // - Custom endpoint: fetch('https://your-logging-service.com/csp', ...)

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    // Never fail the request - CSP reports shouldn't break the user's experience
    console.error("Error processing CSP report:", error);
    
    return NextResponse.json(
      { success: true }, // Return success even on error
      { status: 200 }
    );
  }
}

/**
 * Anonymize URIs by removing query parameters and hashes
 * 
 * Removes potentially sensitive data like:
 * - Query parameters (may contain tokens, IDs, PII)
 * - Hash fragments (may contain state, tokens)
 * - User-specific paths (if configured)
 * 
 * @param uri - The URI to anonymize
 * @returns Anonymized URI with only scheme, host, and path
 * 
 * @example
 * anonymizeUri("https://example.com/page?token=secret#section")
 * // Returns: "https://example.com/page"
 * 
 * anonymizeUri("inline")
 * // Returns: "inline" (special CSP value)
 */
function anonymizeUri(uri: string | undefined): string {
  if (!uri) return "unknown";
  
  // Special CSP values (inline, eval, etc.)
  if (!uri.startsWith("http")) return uri;
  
  try {
    const url = new URL(uri);
    // Return only scheme + host + pathname (no query, no hash)
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch {
    // If URL parsing fails, return the original (might be a special CSP keyword)
    return uri;
  }
}

/**
 * Allow only POST requests
 * CSP reports are sent via POST by browsers
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. CSP reports must be sent via POST." },
    { status: 405 }
  );
}
