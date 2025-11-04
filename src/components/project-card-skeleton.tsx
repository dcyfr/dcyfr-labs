import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for ProjectCard component.
 * 
 * ⚠️ SYNC REQUIRED WITH: src/components/project-card.tsx
 * 
 * Structure must match ProjectCard:
 * - Card with flex, h-full, relative positioning
 * - CardHeader with space-y-2, px-4 sm:px-6, py-4 sm:py-6
 *   - Timeline (optional)
 *   - Title + Status Badge
 *   - Description
 *   - Tech Stack badges
 * - CardContent (conditional) - Highlights section
 * - CardFooter with action buttons (flex-col sm:flex-row, py-3 sm:py-4)
 * 
 * Last synced: 2025-11-04 (Consistent vertical spacing)
 * 
 * @see /docs/components/project-card.md for structure details
 */
export function ProjectCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden relative">
      {/* Background placeholder */}
      <div className="absolute inset-0 z-0 bg-muted/20" />

      {/* Content - matches CardHeader structure */}
      <CardHeader className="space-y-2 relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        {/* Timeline */}
        <Skeleton className="h-3 w-24" />
        
        {/* Title + Status Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20" /> {/* Badge */}
          <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-56" /> {/* Title */}
        </div>

        {/* Description - 2 lines */}
        <CardDescription className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardDescription>

        {/* Tech Stack badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 sm:h-6 w-16" />
          <Skeleton className="h-5 sm:h-6 w-20" />
          <Skeleton className="h-5 sm:h-6 w-14" />
          <Skeleton className="h-5 sm:h-6 w-18" />
        </div>
      </CardHeader>

      {/* Highlights section (optional, matches CardContent) */}
      <CardContent className="relative z-10 px-4 sm:px-6 pb-0">
        {/* Mobile: Expandable button skeleton */}
        <Skeleton className="h-10 w-full rounded-md lg:hidden" />
        
        {/* Desktop: Highlights list */}
        <div className="hidden lg:block space-y-1.5 pl-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>
      </CardContent>

      {/* Action buttons (matches CardFooter) */}
      <CardFooter className="mt-auto flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 relative z-10 px-4 sm:px-6 py-3 sm:py-4">
        <Skeleton className="h-10 w-full sm:w-24 rounded-md" />
        <Skeleton className="h-10 w-full sm:w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
}

/**
 * Skeleton loader for multiple project cards.
 * 
 * @param count - Number of skeleton cards to render (default: 3)
 */
export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
