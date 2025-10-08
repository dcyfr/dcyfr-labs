import { NextResponse } from "next/server";
import { SITE_DOMAIN } from "@/lib/site-config";
import type { NextRequest } from "next/server";

/**
 * Content Security Policy (CSP) Middleware
 * 
 * Adds CSP headers to protect against XSS attacks and control resource loading.
 * 
 * Current implementation uses 'unsafe-inline' for compatibility with:
 * - Next.js hydration scripts
 * - Tailwind JIT inline styles
 * - Vercel Analytics inline scripts
 * - Third-party component libraries (Sonner, etc.)
 * 
 * Future enhancement: Migrate to nonce-based CSP for stricter security
 */

export function middleware(request: NextRequest) {
  // Build CSP directives
  const cspDirectives = [
    // Default: only allow same-origin resources
    "default-src 'self'",
    
    // Scripts: self, Vercel analytics, Vercel Live (preview/dev), and unsafe-inline
    // Note: We use unsafe-inline for compatibility with Next.js hydration and third-party scripts
    `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://*.vercel-insights.com https://vercel.live`,
    
    // Styles: self, unsafe-inline for Tailwind/Sonner, Google Fonts, Vercel Live
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live",
    
    // Images: self, data URIs, production domain, Vercel domains, and Vercel Live
  `img-src 'self' data: https://${SITE_DOMAIN} https://*.vercel.com https://vercel.com https://vercel.live`,
    
    // Fonts: self, Google Fonts CDN, and Vercel Live
    "font-src 'self' https://fonts.gstatic.com https://vercel.live",
    
    // Connect: self, Vercel analytics endpoints, and Vercel Live (for feedback/comments)
    "connect-src 'self' https://va.vercel-scripts.com https://*.vercel-insights.com https://vercel-insights.com https://vercel.live https://*.pusher.com wss://*.pusher.com",
    
    // Frame: allow Vercel Live for preview feedback, deny all others (clickjacking protection)
    "frame-src https://vercel.live",
    
    // Objects: no plugins
    "object-src 'none'",
    
    // Base URI: restrict to self
    "base-uri 'self'",
    
    // Form actions: only to self
    "form-action 'self'",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests",
    
    // Block all mixed content
    "block-all-mixed-content",
  ];

  const cspHeader = cspDirectives.join("; ");

  // Clone response headers
  const requestHeaders = new Headers(request.headers);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public files with extensions (images, fonts, etc.)
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
