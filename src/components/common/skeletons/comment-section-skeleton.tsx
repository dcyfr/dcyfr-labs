/**
 * Comment Section Skeleton
 *
 * This component uses design-token-aware patterns to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: Comment section components (Giscus comments, discussion threads)
 *
 * Loading skeleton for Giscus comments section.
 * - Spacing: SPACING.content for vertical gaps, SPACING_VALUES for margins/padding
 * - Animation: ANIMATIONS.stagger.normal (100ms between comments)
 *
 * Provides placeholder while comments load asynchronously.
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonHeading, SkeletonAvatar } from "@/components/ui/skeleton-primitives";
import { SPACING, SPACING_VALUES, ANIMATIONS } from "@/lib/design-tokens";

export interface CommentSectionSkeletonProps {
  /** Number of comment placeholders */
  commentCount?: number;
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton for comment sections (Giscus)
 * Shows realistic comment thread structure
 */
export function CommentSectionSkeleton({
  commentCount = 3,
  className,
}: CommentSectionSkeletonProps) {
  return (
    <div className={className}>
      {/* Section header */}
      <div className={`mb-${SPACING_VALUES.lg}`}>
        <SkeletonHeading level="h3" width="w-48" />
      </div>

      {/* Comment input area */}
      <div className={`mb-${SPACING_VALUES.xl} p-${SPACING_VALUES.md} rounded-lg border`}>
        <div className={`flex gap-${SPACING_VALUES.sm}`}>
          <SkeletonAvatar size="md" />
          <div className="flex-1">
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className={SPACING.content}>
        {[...Array(commentCount)].map((_, i) => (
          <div
            key={i}
            className={`flex gap-${SPACING_VALUES.sm}`}
            style={{
              animationDelay: `${ANIMATIONS.stagger.normal * i}ms`,
              animation: ANIMATIONS.types.fadeIn,
            }}
          >
            {/* Avatar */}
            <SkeletonAvatar size="md" />

            {/* Comment content */}
            <div className="flex-1">
              {/* Author and timestamp */}
              <div className={`flex items-center gap-${SPACING_VALUES.sm} mb-${SPACING_VALUES.sm}`}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Comment text */}
              <div className={`space-y-${SPACING_VALUES.sm} mb-${SPACING_VALUES.sm}`}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Actions */}
              <div className={`flex gap-${SPACING_VALUES.md}`}>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
