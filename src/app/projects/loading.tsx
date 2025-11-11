import { ProjectListSkeleton } from "@/components/project-card-skeleton";
import { GitHubHeatmapSkeleton } from "@/components/github-heatmap-skeleton";
import { PageLayout } from "@/components/layouts/page-layout";
import { PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for projects page.
 * Matches the structure with hero, GitHub heatmap, and projects grid.
 */
export default function Loading() {
  return (
    <PageLayout>
      {/* Hero Section Skeleton */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-3/4 max-w-2xl" />
        </div>
      </section>

      {/* GitHub Heatmap Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <GitHubHeatmapSkeleton />
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <ProjectListSkeleton count={4} />
        </div>
      </section>
    </PageLayout>
  );
}
