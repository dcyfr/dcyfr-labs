import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for about page.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl py-14 md:py-20">
      <div className="space-y-8">
        {/* Title */}
        <Skeleton className="h-10 w-32" />

        {/* Intro paragraphs */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Section title */}
        <Skeleton className="h-8 w-48 mt-8" />

        {/* Content blocks */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
