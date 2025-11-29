import { ActivitySkeleton } from "@/components/activity";
import { CONTAINER_WIDTHS, TYPOGRAPHY } from "@/lib/design-tokens";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLoading() {
  return (
    <div className={`container ${CONTAINER_WIDTHS.archive} mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-20 pb-8`}>
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-4 w-48 mb-8" />

      {/* Feed skeleton */}
      <ActivitySkeleton variant="timeline" count={8} />
    </div>
  );
}
