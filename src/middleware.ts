import { NextResponse } from "next/server";
import { SITE_DOMAIN } from "@/lib/site-config";
import type { NextRequest } from "next/server";

/**
 * Content Security Policy (CSP) Middleware
 * 
 * Adds CSP headers with nonce-based protection against XSS attacks.
 * 
 * Nonce-based CSP implementation:
 * - Generates unique cryptographic nonce per request
 * - Injects nonce into CSP header for script-src and style-src
 * - Passes nonce via x-nonce header for use in components
 * - Compatible with Vercel Analytics, next-themes, and JSON-LD scripts
 * 
 * Nonce support verified for:
 * - next-themes ThemeProvider (via nonce prop)
 * - JSON-LD structured data scripts (via nonce attribute)
 * - Vercel Analytics (inherits from script context)
 */

export function middleware(request: NextRequest) {
  // Generate unique nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  
  // Build CSP directives with nonce
  const cspDirectives = [
    // Default: only allow same-origin resources
    "default-src 'self'",
    
    // Scripts: self with nonce, external analytics, and Vercel Live
    // Using nonce instead of unsafe-inline for improved security
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com https://*.vercel-insights.com https://vercel.live`,
    
    // Styles: self with nonce, Google Fonts, and Vercel Live
    // Nonce supports next-themes and any dynamic styles
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com https://vercel.live`,
    
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
  
  // Pass nonce to components via custom header
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header with nonce
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
