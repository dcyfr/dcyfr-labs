import { ProjectListSkeleton } from "@/components/project-card-skeleton";
import { GitHubHeatmapSkeleton } from "@/components/github-heatmap-skeleton";

/**
 * Loading state for projects page.
 * Shown while project data and GitHub heatmap are loading.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      <div className="space-y-4">
        {/* Title skeleton */}
        <div className="h-10 w-40 bg-muted rounded-md animate-pulse" />
        
        {/* Description skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse" />
      </div>

      {/* GitHub heatmap skeleton */}
      <div className="mt-10">
        <GitHubHeatmapSkeleton />
      </div>

      {/* Projects grid skeleton */}
      <div className="mt-10">
        <ProjectListSkeleton count={4} />
      </div>
    </div>
  );
}
