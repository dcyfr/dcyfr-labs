import { Skeleton } from "@/components/ui/skeleton";
import {
  SkeletonHeading,
  SkeletonText,
  SkeletonMetadata,
  SkeletonBadges,
  SkeletonParagraphs,
} from "@/components/ui/skeleton-primitives";
import { CONTAINER_WIDTHS, SPACING, SPACING_VALUES, ANIMATIONS } from "@/lib/design-tokens";

/**
 * Skeleton loader for blog post content page.
 * Displays while MDX content is loading.
 *
 * This component uses design-token-aware skeleton primitives to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: src/app/blog/[slug]/page.tsx
 *
 * Structure must match blog post page:
 * - Container: CONTAINER_WIDTHS.archive (max-w-7xl)
 * - Grid: lg:grid-cols-[280px_1fr] with gap-8
 * - Spacing: SPACING.subsection for vertical rhythm
 * - Headings: SkeletonHeading (auto-sized to TYPOGRAPHY tokens)
 * - Text: SkeletonText and SkeletonParagraphs (multi-line with proper gaps)
 * - Metadata: SkeletonMetadata (date, reading time)
 * - Animation: ANIMATIONS.stagger.fast (50ms between elements)
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */
export function BlogPostSkeleton() {
  return (
    <div className={`container ${CONTAINER_WIDTHS.archive} mx-auto px-${SPACING_VALUES.md} sm:px-${SPACING_VALUES.lg} lg:px-${SPACING_VALUES.xl} pt-${SPACING_VALUES.xl} md:pt-12 pb-${SPACING_VALUES.xl}`}>
      <div className="grid gap-${SPACING_VALUES.xl} items-start lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar skeleton (desktop only) */}
        <div
          className="hidden lg:block"
          style={{
            animationDelay: `${ANIMATIONS.stagger.fast * 0}ms`,
            animation: ANIMATIONS.types.fadeIn,
          }}
        >
          <div className={`sticky top-24 ${SPACING.subsection}`}>
            {/* ToC skeleton */}
            <div className={SPACING.content}>
              <SkeletonHeading level="h4" variant="standard" width="w-32" />
              <div className="space-y-2 pl-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            {/* Metadata skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <article
          className="min-w-0"
          style={{
            animationDelay: `${ANIMATIONS.stagger.fast * 1}ms`,
            animation: ANIMATIONS.types.fadeIn,
          }}
        >
          {/* Breadcrumbs */}
          <div className={`flex gap-2 mb-${SPACING_VALUES.lg}`}>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Header */}
          <header className={`mb-${SPACING_VALUES.xl}`}>
            {/* Date and reading time - using primitive */}
            <SkeletonMetadata
              showDate
              showReadingTime
              showViews={false}
              className={`mb-${SPACING_VALUES.md}`}
            />

            {/* Title - auto-sized to typography tokens */}
            <SkeletonHeading
              level="h1"
              variant="article"
              width="w-3/4"
              className={`mb-${SPACING_VALUES.md}`}
            />

            {/* Description - lead text */}
            <SkeletonText
              lines={2}
              lastLineWidth="w-5/6"
              gap="normal"
              className={`mb-${SPACING_VALUES.md}`}
            />

            {/* Badges - using primitive */}
            <SkeletonBadges count={3} />
          </header>

          {/* Content - using paragraph primitive */}
          <SkeletonParagraphs count={8} linesPerParagraph={3} />
        </article>
      </div>
    </div>
  );
}
