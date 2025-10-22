import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for GitHub heatmap component.
 * Displays while contribution data is loading.
 */
export function GitHubHeatmapSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Heatmap placeholder */}
        <div className="space-y-2">
          <div className="flex gap-1">
            {Array.from({ length: 53 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between text-sm">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
}
