"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TYPOGRAPHY } from "@/lib/design-tokens";

interface SidebarFiltersProps {
  sortBy: string;
  dateRange: string;
  readingTime: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSortChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onReadingTimeChange: (value: string) => void;
}

/**
 * Sidebar Filters Component
 * 
 * Collapsible section containing sort, date range, and reading time filters.
 * Used in the blog listing page sidebar.
 */
export function SidebarFilters({
  sortBy,
  dateRange,
  readingTime,
  isExpanded,
  onToggle,
  onSortChange,
  onDateRangeChange,
  onReadingTimeChange,
}: SidebarFiltersProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full ${TYPOGRAPHY.label.small}`}
      >
        <span>Sort & Filters</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3 pt-2">
          {/* Sort badges */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Sort by</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "newest", label: "Newest" },
                { value: "popular", label: "Popular" },
                { value: "oldest", label: "Oldest" },
                { value: "archived", label: "Archived" },
                ...(process.env.NODE_ENV === "development" ? [{ value: "drafts", label: "Drafts" }] : []),
              ].map((option) => {
                const isSelected = sortBy === option.value;
                return (
                  <Badge
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none text-xs"
                    onClick={() => onSortChange(option.value)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Date range badges */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Date range</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "All time" },
                { value: "30d", label: "30 days" },
                { value: "90d", label: "90 days" },
                { value: "year", label: "This year" },
              ].map((option) => {
                const isSelected = dateRange === option.value;
                return (
                  <Badge
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none text-xs"
                    onClick={() => onDateRangeChange(option.value)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Reading time badges */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Reading time</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "All" },
                { value: "quick", label: "≤5 min" },
                { value: "medium", label: "5-15 min" },
                { value: "deep", label: ">15 min" },
              ].map((option) => {
                const isSelected = (readingTime || "all") === option.value;
                return (
                  <Badge
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none text-xs"
                    onClick={() => onReadingTimeChange(option.value)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
