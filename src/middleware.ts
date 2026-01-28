import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for security and access control
 *
 * Provides edge-level protection for:
 * - /dev/** routes - Development-only pages and APIs
 * - /api/dev/** routes - Development-only API endpoints
 *
 * Benefits:
 * - Early request termination (no React/API handler overhead)
 * - Zero bundle impact (dev content never loads in prod)
 * - Consistent behavior across all dev routes
 * - Better performance than runtime checks
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check environment once
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  const disableFlag = process.env.DISABLE_DEV_PAGES === '1';
  const isDev = !disableFlag && (nodeEnv === 'development' || vercelEnv === 'development');

  // Block /dev/** pages and /api/dev/** APIs in preview/production
  if (pathname.startsWith('/dev/') || pathname === '/dev' || pathname.startsWith('/api/dev/')) {
    if (!isDev) {
      // Return 404 response (Next.js will render the 404 page)
      return NextResponse.rewrite(new URL('/404', request.url), {
        status: 404,
      });
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

/**
 * Configure which routes run this middleware
 * Match both /dev/** pages and /api/dev/** API routes
 */
export const config = {
  matcher: [
    '/dev/:path*',
    '/api/dev/:path*',
  ],
};
