"use client";

import { Button } from "@/components/ui/button";
import type { FilterClearButtonProps } from "../types";

export function FilterClearButton({
  onClear,
  count,
  visible,
  className = "h-10 px-4 whitespace-nowrap shrink-0",
}: FilterClearButtonProps) {
  if (!visible) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      className={className}
    >
      Clear all
      {count > 0 && (
        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {count}
        </span>
      )}
    </Button>
  );
}
