import { PostListSkeleton } from "@/components/post-list-skeleton";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for home page.
 * Shown during initial page load.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      {/* Introduction Section */}
      <section className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </section>

      {/* Blog Section */}
      <section className="mt-12 md:mt-16 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-4">
          <PostListSkeleton count={5} />
        </div>
      </section>

      {/* Projects Section */}
      <section className="mt-12 md:mt-16 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </section>
    </div>
  );
}
