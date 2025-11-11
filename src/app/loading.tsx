import { PostListSkeleton } from "@/components/post-list-skeleton";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";

/**
 * Loading state for home page.
 * Matches the structure of the refactored homepage with PageLayout patterns.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={`${PAGE_LAYOUT.hero.content} text-center space-y-4`}>
          {/* Avatar */}
          <div className="flex justify-center">
            <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />
          </div>
          {/* Title */}
          <Skeleton className="h-12 w-64 mx-auto" />
          {/* Description */}
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto" />
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 justify-center">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </section>

      {/* Blog Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
          <PostListSkeleton count={3} />
        </div>
      </section>

      {/* Projects Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
