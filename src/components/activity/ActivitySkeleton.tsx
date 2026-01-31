/**
 * Activity Feed Skeleton Loader
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: src/components/activity/* (actual activity components)
 *
 * Loading state for activity items with:
 * - Shimmer animation
 * - Typography-aware primitives (auto-sized to TYPOGRAPHY tokens)
 * - Multiple variants (compact, standard, timeline, minimal)
 * - Matches Medium/Substack content-focused layout
 * - Animation: ANIMATIONS.stagger.normal (100ms between items)
 *
 * Last sync: 2026-01-31
 *
 * @example
 * ```tsx
 * // Loading state for standard activity
 * <ActivitySkeleton variant="standard" />
 *
 * // Loading state for compact (homepage widget)
 * <ActivitySkeleton variant="compact" />
 * ```
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SkeletonHeading,
  SkeletonText,
  SkeletonBadges,
  SkeletonImage,
} from "@/components/ui/skeleton-primitives";
import { SPACING, SPACING_VALUES, ANIMATIONS } from "@/lib/design-tokens";
import type { ActivityVariant } from "@/lib/activity";

// ============================================================================
// TYPES
// ============================================================================

export interface ActivitySkeletonProps {
  /** Skeleton variant */
  variant?: ActivityVariant;
  /** Show featured image skeleton */
  showImage?: boolean;
  /** Optional CSS class */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Skeleton loader for activity feed items
 */
export function ActivitySkeleton({
  variant = "standard",
  showImage = true,
  className,
}: ActivitySkeletonProps) {
  // Map variants to skeleton layouts
  const isCompact = variant === "compact";
  const isMinimal = variant === "minimal";
  const isFull = variant === "standard" || variant === "timeline";

  return (
    <div className={cn("relative", className)}>
      {/* Compact/Minimal Layout - single line */}
      {(isCompact || isMinimal) && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}

      {/* Full Layout - standard or timeline */}
      {isFull && (
        <div className="w-full">
          {/* Header: Badges - using primitive */}
          <div className={`mb-${SPACING_VALUES.sm}`}>
            <SkeletonBadges count={2} />
          </div>

          {/* Content with activity spacing */}
          <div className={SPACING.activity.contentGap}>
            {/* Title - auto-sized to typography tokens */}
            <SkeletonHeading level="h2" variant="article" width="w-3/4" />

            {/* Featured Image (16:9 aspect ratio) - using primitive */}
            {showImage && <SkeletonImage aspectRatio="video" />}

            {/* Description - multi-line primitive */}
            <SkeletonText lines={3} lastLineWidth="w-4/5" gap="tight" />

            {/* Metadata (tags + stats) - using primitive */}
            <SkeletonBadges count={3} />
          </div>

          {/* Actions */}
          <div className={`mt-${SPACING_VALUES.md} flex items-center gap-${SPACING_VALUES.md}`}>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Multiple skeleton loaders for initial page load with stagger animation
 */
export function ActivitySkeletonGroup({ count = 3 }: { count?: number }) {
  return (
    <div className={SPACING.activity.threadGap}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            animationDelay: `${ANIMATIONS.stagger.normal * i}ms`,
            animation: ANIMATIONS.types.fadeIn,
          }}
        >
          <ActivitySkeleton
            variant="standard"
            showImage={i === 0} // Only first item shows image
          />
        </div>
      ))}
    </div>
  );
}
