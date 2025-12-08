"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TYPOGRAPHY } from "@/lib/design-tokens";

interface SidebarTopicsProps {
  tagList: Array<{ tag: string; count: number }>;
  selectedTags: string[];
  isExpanded: boolean;
  onToggle: () => void;
  onTagToggle: (tag: string) => void;
}

/**
 * Sidebar Topics Component
 * 
 * Collapsible section containing tag filter badges with counts.
 * Used in the blog listing page sidebar.
 */
export function SidebarTopics({
  tagList,
  selectedTags,
  isExpanded,
  onToggle,
  onTagToggle,
}: SidebarTopicsProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full ${TYPOGRAPHY.label.small}`}
      >
        <span>Topics</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && tagList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tagList.map(({ tag, count }) => {
            const isSelected = selectedTags.some(t => t.toLowerCase() === tag.toLowerCase());
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
