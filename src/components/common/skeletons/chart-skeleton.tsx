/**
 * Chart Skeleton
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: Chart components (analytics/dashboard)
 *
 * Loading skeleton for analytics charts and data visualizations.
 * - Headings: SkeletonHeading (auto-sized to TYPOGRAPHY tokens)
 * - Spacing: SPACING_VALUES for padding/gaps/margins
 * - Animation: ANIMATION_CONSTANTS.stagger.fast (50ms between legend items)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonHeading } from "@/components/ui/skeleton-primitives";
import { SPACING_VALUES, ANIMATION_CONSTANTS } from "@/lib/design-tokens";

export interface ChartSkeletonProps {
  /** Chart type affects skeleton appearance */
  variant?: "bar" | "line" | "pie" | "donut";
  /** Show title skeleton */
  showTitle?: boolean;
  /** Show legend skeleton */
  showLegend?: boolean;
  /** Additional classes */
  className?: string;
}

// Deterministic bar heights for skeleton (no random values for React purity)
const BAR_HEIGHTS = ["60%", "85%", "45%", "75%", "50%", "90%", "65%", "55%"];

/**
 * Skeleton for chart components with stagger animation
 * Provides visual placeholder while data loads
 */
export function ChartSkeleton({
  variant = "bar",
  showTitle = true,
  showLegend = false,
  className,
}: ChartSkeletonProps) {
  return (
    <Card className={`p-${SPACING_VALUES.lg} ${className || ""}`}>
      {/* Title */}
      {showTitle && (
        <div className={`mb-${SPACING_VALUES.md}`}>
          <SkeletonHeading level="h3" width="w-48" />
        </div>
      )}

      {/* Chart area */}
      <div className={`h-64 w-full mb-${SPACING_VALUES.md}`}>
        {variant === "bar" && (
          <div className="h-full flex items-end justify-around gap-2">
            {BAR_HEIGHTS.map((height, i) => (
              <Skeleton
                key={i}
                className="w-full"
                style={{
                  height,
                  animationDelay: `${ANIMATION_CONSTANTS.stagger.fast * i}ms`,
                  animation: ANIMATION_CONSTANTS.types.fadeIn,
                }}
              />
            ))}
          </div>
        )}

        {variant === "line" && (
          <div className="h-full w-full relative">
            <Skeleton className="absolute inset-0" />
          </div>
        )}

        {(variant === "pie" || variant === "donut") && (
          <div className="h-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`flex flex-wrap gap-${SPACING_VALUES.md}`}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
              style={{
                animationDelay: `${ANIMATION_CONSTANTS.stagger.fast * i}ms`,
                animation: ANIMATION_CONSTANTS.types.fadeIn,
              }}
            >
              <Skeleton className="h-3 w-3 rounded-sm" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
