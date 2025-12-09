"use client";

import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMobileFilterSheet } from "@/hooks/use-mobile-filter-sheet";

interface FloatingFilterFabProps {
  activeFilterCount: number;
  hasFilters: boolean;
}

/**
 * FloatingFilterFab Component
 *
 * Floating action button for opening mobile filter sheet.
 * Positioned fixed bottom-right, above footer.
 * Shows active filter count badge when filters applied.
 * Mobile only (hidden on lg: breakpoint).
 *
 * Features:
 * - Fixed position bottom-right with proper spacing
 * - Badge shows active filter count
 * - Icon color changes when filters active
 * - Opens filter sheet on click
 * - Smooth animations and transitions
 */
export function FloatingFilterFab({
  activeFilterCount,
  hasFilters,
}: FloatingFilterFabProps) {
  const { open } = useMobileFilterSheet();

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        // Mobile only (hidden on lg: breakpoint)
        "lg:hidden",
        // Fixed positioning - bottom-right with spacing above footer
        "fixed bottom-20 right-4 z-30",
        // Sizing and styling
        "rounded-full p-3",
        "bg-primary hover:bg-primary/90 active:bg-primary/80",
        "text-primary-foreground",
        "shadow-lg hover:shadow-xl",
        // Transitions
        "transition-all duration-200 ease-out",
        // Accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      )}
      aria-label={
        hasFilters
          ? `Filters (${activeFilterCount})`
          : "Open filters"
      }
      title={
        hasFilters
          ? `${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} active`
          : "Open filters"
      }
    >
      {/* Icon with optional color change */}
      <SlidersHorizontal
        className={cn(
          "h-5 w-5",
          "text-primary-foreground"
        )}
      />

      {/* Active filter count badge */}
      {hasFilters && activeFilterCount > 0 && (
        <Badge
          variant="secondary"
          className={cn(
            "absolute -top-1 -right-1",
            "h-5 w-5 p-0",
            "flex items-center justify-center",
            "text-xs font-bold",
            "bg-accent text-accent-foreground",
            "border border-background"
          )}
        >
          {activeFilterCount}
        </Badge>
      )}
    </button>
  );
}
