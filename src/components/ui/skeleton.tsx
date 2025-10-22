import { cn } from "@/lib/utils";

/**
 * Base skeleton component for loading states.
 * Provides a pulsing animation effect.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
