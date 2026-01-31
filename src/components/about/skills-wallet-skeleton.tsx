/**
 * Skills Wallet Skeleton
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: src/components/about/skills-wallet.tsx (or similar)
 *
 * Loading skeleton for skills display on resume page.
 * - Headings: SkeletonHeading (auto-sized to TYPOGRAPHY tokens)
 * - Spacing: SPACING_VALUES for padding/gaps/margins
 * - Animation: ANIMATIONS.stagger.normal (100ms between items)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonHeading } from "@/components/ui/skeleton-primitives";
import { SPACING, SPACING_VALUES, ANIMATIONS } from "@/lib/design-tokens";

export interface SkillsWalletSkeletonProps {
  /** Number of skill categories to show */
  categoryCount?: number;
  /** Skills per category */
  skillsPerCategory?: number;
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton for SkillsWallet component
 * Shows categorized skill placeholders with stagger animation
 */
export function SkillsWalletSkeleton({
  categoryCount = 4,
  skillsPerCategory = 6,
  className,
}: SkillsWalletSkeletonProps) {
  return (
    <div className={className}>
      {/* Header - matches real component icon + heading + badge layout */}
      <div className={`mb-${SPACING_VALUES.lg} flex items-center gap-2`}>
        <Skeleton className="h-5 w-5 rounded-md" />
        <SkeletonHeading level="h3" width="w-32" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      {/* Skills grid - matches real component */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${SPACING_VALUES.md}`}>
        {[...Array(skillsPerCategory)].map((_, i) => (
          <div
            key={i}
            className={`rounded-lg border p-${SPACING_VALUES.md}`}
            style={{
              animationDelay: `${ANIMATIONS.stagger.normal * i}ms`,
              animation: ANIMATIONS.types.fadeIn,
            }}
          >
            {/* Skill name + count */}
            <div className={`flex items-start justify-between gap-3 mb-${SPACING_VALUES.sm}`}>
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>

            {/* Badge count text */}
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
