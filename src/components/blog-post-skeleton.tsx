import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for blog post content.
 * Displays while MDX content is loading.
 */
export function BlogPostSkeleton() {
  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      {/* Header */}
      <header>
        {/* Date and updated info */}
        <Skeleton className="h-4 w-48 mb-4" />
        
        {/* Title */}
        <Skeleton className="h-10 w-3/4 mb-4" />
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-24" />
        </div>
      </header>

      {/* Content */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </article>
  );
}
