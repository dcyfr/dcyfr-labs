import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SkeletonHeading,
  SkeletonText,
  SkeletonBadges,
} from "@/components/ui/skeleton-primitives";
import { SPACING_VALUES, ANIMATIONS } from "@/lib/design-tokens";

/**
 * Skeleton loader for ProjectCard component.
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: src/components/project-card.tsx
 *
 * Structure must match ProjectCard:
 * - Div wrapper with block, group, cursor-pointer styling
 * - Card with flex, h-full, relative positioning
 * - CardHeader with SPACING_VALUES for padding
 *   - Timeline with status badge
 *   - Title: SkeletonHeading (auto-sized to TYPOGRAPHY tokens)
 *   - Description: SkeletonText (multi-line with proper gaps)
 *   - Tech Stack badges: SkeletonBadges (auto-varied widths)
 * - CardFooter with external project links only
 *   - No "View Details" button (card itself is clickable)
 * - Animation: ANIMATIONS.stagger.normal (100ms between items)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */
export function ProjectCardSkeleton() {
  return (
    <div className="block group cursor-pointer">
      <Card className="flex h-full flex-col overflow-hidden relative">
        {/* Background placeholder */}
        <div className="absolute inset-0 z-0 bg-muted/20" />

        {/* Content - matches CardHeader structure */}
        <CardHeader className={`space-y-1.5 relative z-10 px-${SPACING_VALUES.md} sm:px-${SPACING_VALUES.lg} py-${SPACING_VALUES.md} sm:py-5`}>
          {/* Timeline with status badge */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" /> {/* Badge */}
            <Skeleton className="h-3 w-24" /> {/* Timeline */}
          </div>

          {/* Title - auto-sized to typography tokens */}
          <SkeletonHeading level="h3" variant="standard" width="w-48 sm:w-56" />

          {/* Description - multi-line primitive */}
          <CardDescription>
            <SkeletonText lines={2} lastLineWidth="w-5/6" gap="tight" />
          </CardDescription>

          {/* Tech Stack badges (max 3) - using primitive */}
          <div className="pt-1">
            <SkeletonBadges count={3} />
          </div>
        </CardHeader>

        {/* External project links only (no View Details button) */}
        <CardFooter className={`mt-auto flex flex-row flex-wrap gap-2 sm:gap-3 relative z-10 px-${SPACING_VALUES.md} sm:px-${SPACING_VALUES.lg} py-${SPACING_VALUES.sm} sm:py-${SPACING_VALUES.md}`}>
          <Skeleton className="h-10 w-20 rounded-md" /> {/* External link */}
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * Skeleton loader for multiple project cards.
 *
 * @param count - Number of skeleton cards to render (default: 3)
 */
export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            animationDelay: `${ANIMATIONS.stagger.normal * i}ms`,
            animation: ANIMATIONS.types.fadeIn,
          }}
        >
          <ProjectCardSkeleton />
        </div>
      ))}
    </div>
  );
}
