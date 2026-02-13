/**
 * Badge Wallet Skeleton
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: src/components/about/badge-wallet.tsx (or similar)
 *
 * Loading skeleton for Credly badge wallet display.
 * - Headings: SkeletonHeading (auto-sized to TYPOGRAPHY tokens)
 * - Spacing: SPACING_VALUES for padding/gaps/margins
 * - Animation: ANIMATION_CONSTANTS.stagger.fast (50ms between items)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonHeading } from "@/components/ui/skeleton-primitives";
import { SPACING, SPACING_VALUES, ANIMATION_CONSTANTS } from "@/lib/design-tokens";

export interface BadgeWalletSkeletonProps {
  /** Number of badge placeholders to show */
  count?: number;
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton for BadgeWallet component
 * Shows grid of badge placeholders with stagger animation
 */
export function BadgeWalletSkeleton({
  count = 6,
  className,
}: BadgeWalletSkeletonProps) {
  return (
    <div className={className}>
      {/* Header - matches real component icon + heading + badge layout */}
      <div className={`mb-${SPACING_VALUES.lg} flex items-center gap-2`}>
        <Skeleton className="h-5 w-5 rounded-md" />
        <SkeletonHeading level="h3" width="w-32" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      {/* Badge grid */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-${SPACING_VALUES.md}`}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-${SPACING_VALUES.md} rounded-lg border`}
            style={{
              animationDelay: `${ANIMATION_CONSTANTS.stagger.fast * i}ms`,
              animation: ANIMATION_CONSTANTS.types.fadeIn,
            }}
          >
            {/* Badge image */}
            <Skeleton className={`h-24 w-24 rounded-full mb-${SPACING_VALUES.sm}`} />

            {/* Badge name */}
            <Skeleton className="h-5 w-full mb-1" />

            {/* Issuer */}
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

    </div>
  );
}
