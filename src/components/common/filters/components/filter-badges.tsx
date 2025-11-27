"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { FilterBadgesProps } from "../types";

export function FilterBadges({
  items,
  selected,
  onToggle,
  icon: Icon,
  label,
  className,
}: FilterBadgesProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {(label || Icon) && (
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {label && (
            <>
              {/* eslint-disable-next-line no-restricted-syntax */}
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
            </>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <Badge
              key={item}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none"
              onClick={() => onToggle(item)}
            >
              {item}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
