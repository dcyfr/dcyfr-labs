import { cn } from "@/lib/utils";

/**
 * Base skeleton component for loading states.
 * 
 * Strategy: Selective loading states for slow content only
 * - Blog posts (MDX parsing, API fetches)
 * - Project details (image loading)
 * - Analytics data (API fetches)
 * 
 * Uses shimmer animation from globals.css for visual feedback.
 * Respects prefers-reduced-motion for accessibility.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
