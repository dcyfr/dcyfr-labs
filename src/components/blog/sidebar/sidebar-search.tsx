"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { RefObject } from "react";

interface SidebarSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  totalResults: number;
  totalPosts: number;
  activeFilterCount: number;
  onClearAll: () => void;
  isPending?: boolean;
}

/**
 * Sidebar Search Component
 * 
 * Search input with results count and clear all button.
 * Used in the blog listing page sidebar.
 */
export function SidebarSearch({
  searchValue,
  onSearchChange,
  searchInputRef,
  totalResults,
  totalPosts,
  activeFilterCount,
  onClearAll,
}: SidebarSearchProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search posts..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11"
        />
      </div>
      
      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          {totalResults === totalPosts 
            ? `${totalResults} posts` 
            : `${totalResults} of ${totalPosts} posts`}
        </span>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
