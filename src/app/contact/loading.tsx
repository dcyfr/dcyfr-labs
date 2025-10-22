import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * Loading state for contact page.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl py-14 md:py-20">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton className="h-10 w-48" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>

      {/* Contact Form Skeleton */}
      <Card className="mt-8 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  );
}
