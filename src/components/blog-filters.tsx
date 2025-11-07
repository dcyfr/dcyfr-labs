"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Tag } from "lucide-react";

interface BlogFiltersProps {
  tag: string | null;
  readingTime: string | null;
  tagList: string[];
}

/**
 * BlogFilters Component
 * 
 * Dropdown filters for reading time and tags. Provides a compact alternative
 * to badge-based filters with better mobile UX.
 * 
 * @param tag - Currently selected tag filter
 * @param readingTime - Currently selected reading time filter (quick/medium/deep)
 * @param tagList - Array of available tags
 */
export function BlogFilters({ tag, readingTime, tagList }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Updates URL with new filter values
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to first page when filters change
    params.delete("page");
    
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Reading time filter */}
      <div className="min-w-[200px]">
        <Select
          value={readingTime || "all"}
          onValueChange={(value) => updateFilter("readingTime", value)}
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

      {/* Tag filter */}
      <div className="min-w-[200px]">
        <Select
          value={tag || "all"}
          onValueChange={(value) => updateFilter("tag", value)}
        >
          <SelectTrigger className="h-10">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {tagList.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
