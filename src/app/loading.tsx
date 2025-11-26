import { PostListSkeleton } from "@/components/blog/post/post-list-skeleton";
import { ProjectCardSkeleton } from "@/components/projects/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";

/**
 * Loading state for home page.
 * Uses actual layout components (PageHero, PageLayout) with skeleton children
 * to ensure structure matches the actual page.
 * 
 * @see src/app/page.tsx - Must match structure
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section - Uses PageHero component */}
      <PageHero
        variant="homepage"
        align="center"
        title={<Skeleton className="h-12 w-64 mx-auto" />}
        description={
          <>
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto" />
          </>
        }
        image={<Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />}
        actions={
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 justify-center">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36 hidden sm:inline-flex" />
          </div>
        }
      />

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
