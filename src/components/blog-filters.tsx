"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface BlogFiltersProps {
  selectedTags: string[];
  readingTime: string | null;
  tagList: string[];
  query: string;
}

/**
 * BlogFilters Component
 * 
 * Consolidated search and filter interface with:
 * - Search input with debounce
 * - Reading time dropdown
 * - Multi-select tag badges
 * - Clear all filters button
 * 
 * @param selectedTags - Currently selected tags array
 * @param readingTime - Currently selected reading time filter (quick/medium/deep)
 * @param tagList - Array of available tags
 * @param query - Current search query
 */
export function BlogFilters({ selectedTags, readingTime, tagList, query }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(query);
  const [, startTransition] = useTransition();

  // Sync search value with query prop
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  // Debounced search - update URL after 250ms of no typing
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalized = searchValue.trim();
      if (normalized === query.trim()) return;
      
      const params = new URLSearchParams(searchParams.toString());
      if (normalized) {
        params.set("q", normalized);
      } else {
        params.delete("q");
      }
      params.delete("page");
      
      startTransition(() => {
        router.push(`/blog?${params.toString()}`, { scroll: false });
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchValue, query, searchParams, router]);

  /**
   * Updates reading time filter
   */
  const updateReadingTime = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set("readingTime", value);
    } else {
      params.delete("readingTime");
    }
    params.delete("page");
    
    router.push(`/blog?${params.toString()}`);
  };

  /**
   * Toggle tag selection
   */
  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    
    if (newTags.length > 0) {
      params.set("tag", newTags.join(","));
    } else {
      params.delete("tag");
    }
    params.delete("page");
    
    router.push(`/blog?${params.toString()}`);
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    router.push("/blog");
  };

  const hasActiveFilters = selectedTags.length > 0 || readingTime || query;
  const filterCount = selectedTags.length + (readingTime ? 1 : 0) + (query ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search and Reading Time Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search posts..."
            aria-label="Search blog posts"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-10"
          />
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select
            value={readingTime || "all"}
            onValueChange={updateReadingTime}
          >
            <SelectTrigger className="h-10">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Reading time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reading times</SelectItem>
              <SelectItem value="quick">Quick (&lt;5 min)</SelectItem>
              <SelectItem value="medium">Medium (5-15 min)</SelectItem>
              <SelectItem value="deep">Deep (&gt;15 min)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-10 px-3 whitespace-nowrap"
          >
            Clear all
            {filterCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                {filterCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Tag Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tagList.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {isSelected && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
