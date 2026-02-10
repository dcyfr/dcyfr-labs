/**
 * Form Skeleton
 *
 * This component uses design-token-aware patterns to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: Form components (contact forms, search forms, input interfaces)
 *
 * Generic loading skeleton for form components.
 * - Spacing: SPACING.content for vertical gaps, SPACING_VALUES for field spacing
 * - Animation: ANIMATION_CONSTANTS.stagger.normal (100ms between fields)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Skeleton } from "@/components/ui/skeleton";
import { SPACING, SPACING_VALUES, ANIMATION_CONSTANTS } from "@/lib/design-tokens";

export interface FormSkeletonProps {
  /** Number of form fields to show */
  fieldCount?: number;
  /** Show submit button skeleton */
  showButton?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton for form components
 * Displays field labels and input placeholders
 */
export function FormSkeleton({
  fieldCount = 3,
  showButton = true,
  className,
}: FormSkeletonProps) {
  return (
    <div className={className}>
      <div className={SPACING.content}>
        {[...Array(fieldCount)].map((_, i) => (
          <div
            key={i}
            className={`space-y-${SPACING_VALUES.sm}`}
            style={{
              animationDelay: `${ANIMATION_CONSTANTS.stagger.normal * i}ms`,
              animation: ANIMATION_CONSTANTS.types.fadeIn,
            }}
          >
            {/* Label */}
            <Skeleton className="h-4 w-24" />

            {/* Input field */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        {/* Submit button */}
        {showButton && (
          <div
            style={{
              animationDelay: `${ANIMATION_CONSTANTS.stagger.normal * fieldCount}ms`,
              animation: ANIMATION_CONSTANTS.types.fadeIn,
            }}
          >
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
