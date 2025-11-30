"use client";

import dynamic from "next/dynamic";

/**
 * Client-side layout utilities wrapper
 * 
 * These components are dynamically imported to reduce initial bundle size.
 * They must be in a client component because Next.js 16 doesn't allow
 * `ssr: false` with `next/dynamic` in Server Components.
 */

const LoadingBar = dynamic(
  () => import("@/components/features/loading-bar").then(mod => ({ default: mod.LoadingBar })),
  { ssr: false }
);

const ScrollToTop = dynamic(
  () => import("@/components/features/scroll-to-top").then(mod => ({ default: mod.ScrollToTop })),
  { ssr: false }
);

const WebVitalsReporter = dynamic(
  () => import("@/components/features/web-vitals-reporter").then(mod => ({ default: mod.WebVitalsReporter })),
  { ssr: false }
);

/**
 * LayoutUtilities Component
 * 
 * Bundles non-critical UI utilities that are dynamically imported:
 * - LoadingBar: Route transition progress indicator
 * - ScrollToTop: Scroll restoration on navigation
 * - WebVitalsReporter: Performance metrics tracking
 */
export function LayoutUtilities() {
  return (
    <>
      <LoadingBar />
      <ScrollToTop />
      <WebVitalsReporter />
    </>
  );
}
