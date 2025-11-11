import { PostListSkeleton } from "@/components/post-list-skeleton";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for blog listing page.
 * Matches the structure of the blog archive page with search and filters.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-3/4 max-w-2xl" />
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          {/* Search form skeleton */}
          <Skeleton className="h-10 w-full rounded-md mb-4" />

          {/* Tag filters skeleton */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          {/* Posts list skeleton */}
          <div className="mt-8">
            <PostListSkeleton count={5} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
