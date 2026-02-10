import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonHeading } from "@/components/ui/skeleton-primitives";
import { SPACING_VALUES, ANIMATION_CONSTANTS } from "@/lib/design-tokens";

/**
 * GitHub Heatmap Skeleton
 *
 * This component uses design-token-aware patterns to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: GitHub heatmap and contribution statistics components
 *
 * Skeleton loader for GitHub heatmap component.
 * - Spacing: SPACING_VALUES for padding/gaps/margins
 * - Animation: ANIMATION_CONSTANTS.stagger.fast (50ms between stat cards)
 *
 * Matches the structure of GitHubHeatmap component:
 * - Header with title and username link
 * - Statistics grid (5 stat cards)
 * - Contribution heatmap grid
 * - Footer with total contributions and date range
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */
export function GitHubHeatmapSkeleton() {
  return (
    <Card className={`p-${SPACING_VALUES.lg} min-h-100`}>
      <div className={`space-y-${SPACING_VALUES.md}`}>
        {/* Header */}
        <div className={`flex items-center justify-between flex-wrap gap-${SPACING_VALUES.sm}`}>
          <SkeletonHeading level="h3" width="w-32" />
          <Skeleton className="h-4 w-24" /> {/* @username link */}
        </div>

        {/* Statistics Grid - 5 stat cards */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-${SPACING_VALUES.sm}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`bg-muted/50 rounded-lg p-${SPACING_VALUES.sm} border border-border`}
              style={{
                animationDelay: `${ANIMATION_CONSTANTS.stagger.fast * i}ms`,
                animation: ANIMATION_CONSTANTS.types.fadeIn,
              }}
            >
              <Skeleton className={`h-4 w-20 mb-${SPACING_VALUES.sm}`} /> {/* Stat label */}
              <Skeleton className="h-8 w-12 mb-1" /> {/* Stat value */}
              <Skeleton className="h-3 w-8" /> {/* "days" or unit */}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1 min-w-full">
            {Array.from({ length: 53 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with contributions summary */}
        <div className={`flex items-center justify-between flex-wrap gap-${SPACING_VALUES.sm} text-sm`}>
          <Skeleton className="h-4 w-56" />{" "}
          {/* "X contributions in the last year" */}
          <Skeleton className="h-4 w-32" /> {/* Date range */}
        </div>
      </div>
    </Card>
  );
}
