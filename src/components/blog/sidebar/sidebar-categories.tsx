"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { TYPOGRAPHY } from "@/lib/design-tokens";

interface SidebarCategoriesProps {
  categoryList: string[];
  categoryDisplayMap: Record<string, string>;
  selectedCategory: string;
  isExpanded: boolean;
  onToggle: () => void;
  onCategorySelect: (category: string) => void;
}

/**
 * Sidebar Categories Component
 * 
 * Collapsible section containing category filter badges.
 * Used in the blog listing page sidebar.
 */
export function SidebarCategories({
  categoryList,
  categoryDisplayMap,
  selectedCategory,
  isExpanded,
  onToggle,
  onCategorySelect,
}: SidebarCategoriesProps) {
  if (categoryList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full ${TYPOGRAPHY.label.small}`}
      >
        <span>Categories</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-wrap gap-2 pt-2">
          {categoryList.map((category) => {
            const isSelected = selectedCategory === category;
            const displayName = categoryDisplayMap[category] || category;
            return (
              <Badge
                key={category}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onCategorySelect(category)}
              >
                {displayName}
                {isSelected && <X className="ml-1 h-3 w-3" />}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
