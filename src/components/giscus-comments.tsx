"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * GiscusComments component integrates GitHub Discussions as a commenting system.
 * 
 * Features:
 * - Automatic theme switching (light/dark) synced with site theme
 * - Lazy loading for better performance
 * - Graceful fallback when not configured
 * - Environment-based configuration
 * 
 * Required Environment Variables:
 * - NEXT_PUBLIC_GISCUS_REPO: GitHub repository (format: "owner/repo")
 * - NEXT_PUBLIC_GISCUS_REPO_ID: Repository ID from Giscus setup
 * - NEXT_PUBLIC_GISCUS_CATEGORY: Discussion category name
 * - NEXT_PUBLIC_GISCUS_CATEGORY_ID: Category ID from Giscus setup
 * 
 * Setup Instructions:
 * 1. Enable GitHub Discussions on your repository
 * 2. Visit https://giscus.app/ to configure and get IDs
 * 3. Add environment variables to .env.local
 * 4. Deploy with environment variables set
 * 
 * @example
 * ```tsx
 * <GiscusComments />
 * ```
 */
export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Check if Giscus is configured
  const isConfigured =
    process.env.NEXT_PUBLIC_GISCUS_REPO &&
    process.env.NEXT_PUBLIC_GISCUS_REPO_ID &&
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY &&
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  // Wait for component to mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if not configured or not mounted
  if (!isConfigured || !mounted) {
    return null;
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-2xl font-semibold">Comments</h2>
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
