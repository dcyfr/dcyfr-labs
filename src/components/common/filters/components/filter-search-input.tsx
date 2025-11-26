"use client";

import { Input } from "@/components/ui/input";
import type { FilterSearchInputProps } from "../types";

export function FilterSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  "aria-label": ariaLabel,
  className = "w-full h-11",
}: FilterSearchInputProps) {
  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
}
