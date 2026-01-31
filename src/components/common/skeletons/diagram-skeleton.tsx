/**
 * Diagram Skeleton
 *
 * This component uses design-token-aware patterns to ensure
 * dimensions stay in sync with actual content automatically.
 *
 * ⚠️ SYNC REQUIRED WITH: Diagram components (Mermaid diagrams, flowcharts, visual diagrams)
 *
 * Loading skeleton for MDX diagrams (Mermaid, etc.).
 * - Aspect ratios: Responsive diagram placeholders based on variant
 * - Minimal component with no spacing violations
 *
 * Provides placeholder while diagram renders.
 *
 * Last sync: 2026-01-31
 *
 * @see /docs/components/skeleton-sync-strategy.md
 */

import { Skeleton } from "@/components/ui/skeleton";
import { SPACING, ANIMATIONS } from "@/lib/design-tokens";

export interface DiagramSkeletonProps {
  /** Diagram type affects aspect ratio */
  variant?: "flowchart" | "sequence" | "gantt" | "generic";
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton for diagram components
 * Shows appropriate aspect ratio based on diagram type
 */
export function DiagramSkeleton({
  variant = "generic",
  className,
}: DiagramSkeletonProps) {
  // Different diagram types have different typical aspect ratios
  const aspectRatios = {
    flowchart: "aspect-[4/3]",
    sequence: "aspect-[16/9]",
    gantt: "aspect-[21/9]",
    generic: "aspect-video",
  };

  return (
    <div className={`w-full rounded-lg border overflow-hidden ${className || ""}`}>
      <Skeleton className={`w-full ${aspectRatios[variant]}`} />
    </div>
  );
}
