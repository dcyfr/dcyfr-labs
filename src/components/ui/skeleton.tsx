import { cn } from "@/lib/utils";

/**
 * Base skeleton component for loading states.
 * Provides a shimmer animation effect (gradient moving left-to-right).
 * More engaging than pulse and implies loading direction.
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
