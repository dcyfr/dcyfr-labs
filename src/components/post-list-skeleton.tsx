import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for blog post list.
 * Displays while posts are loading.
 */
export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="space-y-3">
          {/* Title */}
          <Skeleton className="h-7 w-3/4" />
          
          {/* Metadata (date, reading time, badges) */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
          </div>
          
          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
        </article>
      ))}
    </div>
  );
}
