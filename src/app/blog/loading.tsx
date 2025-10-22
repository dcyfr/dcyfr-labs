import { PostListSkeleton } from "@/components/post-list-skeleton";

/**
 * Loading state for blog listing page.
 * Shown during navigation to the blog page.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      <div className="space-y-4">
        {/* Title skeleton */}
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
        
        {/* Description skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Search form skeleton */}
      <div className="mt-6 h-10 bg-muted rounded-md animate-pulse" />

      {/* Tag filters skeleton */}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        ))}
      </div>

      {/* Posts list skeleton */}
      <div className="mt-8">
        <PostListSkeleton count={5} />
      </div>
    </div>
  );
}
