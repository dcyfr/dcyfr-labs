"use client";

import React from "react";
import { ErrorBoundary, MinimalErrorFallback } from "./error-boundary";

/**
 * Wraps blog search form with error boundary.
 * Uses minimal fallback to avoid disrupting the page layout.
 */
export function BlogSearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={MinimalErrorFallback}
      onError={(error) => {
        console.error("Blog Search Error:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
