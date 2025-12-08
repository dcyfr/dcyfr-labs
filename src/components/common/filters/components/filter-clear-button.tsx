"use client";

import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/lib/design-tokens";
import type { FilterClearButtonProps } from "../types";

export function FilterClearButton({
  onClear,
  count,
  visible,
  className = "h-10 px-4 whitespace-nowrap shrink-0",
}: FilterClearButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      className={`${className} ${!visible ? "invisible" : ""}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      Clear all
      {count > 0 && (
        <span className={`ml-2 rounded-full bg-muted px-2 py-0.5 ${TYPOGRAPHY.label.xs}`}>
          {count}
        </span>
      )}
    </Button>
  );
}
