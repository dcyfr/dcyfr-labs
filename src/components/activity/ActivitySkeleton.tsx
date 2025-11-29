"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ActivityVariant } from "@/lib/activity";

// ============================================================================
// PROPS
// ============================================================================

interface ActivitySkeletonProps {
  /** Display variant (matches ActivityFeed) */
  variant?: ActivityVariant;

  /** Number of skeleton items to show */
  count?: number;

  /** CSS class overrides */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Loading skeleton for ActivityFeed
 *
 * Matches the visual structure of each variant to prevent layout shift.
 */
export function ActivitySkeleton({
  variant = "standard",
  count = 5,
  className,
}: ActivitySkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((i) => (
          <MinimalSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-1", className)}>
        {items.map((i) => (
          <CompactSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className={cn("relative", className)}>
        {items.map((i) => (
          <TimelineSkeleton key={i} isLast={i === items.length - 1} />
        ))}
      </div>
    );
  }

  // Standard variant
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((i) => (
        <StandardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// VARIANT SKELETONS
// ============================================================================

function StandardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Icon placeholder */}
          <Skeleton className="shrink-0 w-9 h-9 rounded-full" />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-16 shrink-0" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2 px-3">
      <Skeleton className="shrink-0 w-7 h-7 rounded-full" />
      <Skeleton className="flex-1 h-4" />
      <Skeleton className="shrink-0 h-3 w-12" />
    </div>
  );
}

function MinimalSkeleton() {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Skeleton className="h-3 w-12 shrink-0" />
      <Skeleton className="h-4 flex-1" />
    </div>
  );
}

function TimelineSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      {!isLast && (
        <div
          className="absolute left-[18px] top-10 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}

      {/* Icon node */}
      <Skeleton className="relative z-10 shrink-0 w-9 h-9 rounded-full" />

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 shrink-0" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-16 mt-1" />
      </div>
    </div>
  );
}

export default ActivitySkeleton;
