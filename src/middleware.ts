import { NextRequest, NextResponse } from 'next/server';

/**
 * Global Security Headers Middleware
 *
 * Adds security headers to all responses for defense-in-depth.
 * See: https://owasp.org/www-project-secure-headers/
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // X-Content-Type-Options: Prevent MIME type sniffing
  // Prevents browsers from interpreting files as a different MIME type
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: Prevent clickjacking attacks
  // Prevents the site from being embedded in iframes
  response.headers.set('X-Frame-Options', 'DENY');

  // X-XSS-Protection: Enable browser XSS filter (legacy browsers)
  // Modern browsers use CSP instead, but this provides defense-in-depth
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: Control referrer information
  // Prevents leaking sensitive URLs to external sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Disable unnecessary browser features
  // Reduces attack surface by disabling unused APIs
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );

  // Strict-Transport-Security (HSTS): Enforce HTTPS (production only)
  // Tells browsers to always use HTTPS for future requests
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Middleware Matcher Configuration
 *
 * Apply security headers to all routes except:
 * - Static files (_next/static)
 * - Image optimization (_next/image)
 * - Favicon and other image assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Image files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
