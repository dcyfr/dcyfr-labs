import Link from "next/link";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * ActiveFilters Component
 * 
 * Displays active search filters as dismissible pills/chips with
 * individual remove buttons and a "Clear all" option.
 * 
 * Features:
 * - Shows active tag, reading time, and search query
 * - Individual dismiss buttons (X icon)
 * - "Clear all" link when multiple filters active
 * - Mobile-responsive layout
 * - Accessible with proper ARIA labels
 * 
 * @param props.tag - Currently active tag filter
 * @param props.query - Current search query
 * @param props.readingTime - Current reading time filter
 * 
 * @example
 * ```tsx
 * <ActiveFilters 
 *   tag="TypeScript" 
 *   query="hooks"
 *   readingTime="quick"
 * />
 * ```
 */
interface ActiveFiltersProps {
  tag?: string;
  query?: string;
  readingTime?: string;
}

const getReadingTimeLabel = (value: string) => {
  switch (value) {
    case "quick": return "Quick reads (<5min)";
    case "medium": return "Medium (5-15min)";
    case "deep": return "Deep dives (>15min)";
    default: return value;
  }
};

export function ActiveFilters({ tag, query, readingTime }: ActiveFiltersProps) {
  const hasFilters = Boolean(tag || query || readingTime);
  
  if (!hasFilters) return null;

  const buildClearHref = (removeType: "tag" | "query" | "readingTime" | "all") => {
    const params = new URLSearchParams();
    
    if (removeType !== "all") {
      // Keep other filters when removing one
      if (tag && removeType !== "tag") params.set("tag", tag);
      if (query && removeType !== "query") params.set("q", query);
      if (readingTime && removeType !== "readingTime") params.set("readingTime", readingTime);
    }
    
    const suffix = params.toString();
    return suffix ? `/blog?${suffix}` : "/blog";
  };

  const filterCount = [tag, query, readingTime].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 mt-4">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {query && (
        <Badge variant="secondary" className="gap-1.5 pr-1">
          <span>Search: &ldquo;{query}&rdquo;</span>
          <Link
            href={buildClearHref("query")}
            className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
            aria-label="Remove search filter"
          >
            <X className="h-3 w-3" />
          </Link>
        </Badge>
      )}
      
      {tag && (
        <Badge variant="secondary" className="gap-1.5 pr-1">
          <span>Tag: {tag}</span>
          <Link
            href={buildClearHref("tag")}
            className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
            aria-label="Remove tag filter"
          >
            <X className="h-3 w-3" />
          </Link>
        </Badge>
      )}
      
      {readingTime && (
        <Badge variant="secondary" className="gap-1.5 pr-1">
          <span>{getReadingTimeLabel(readingTime)}</span>
          <Link
            href={buildClearHref("readingTime")}
            className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
            aria-label="Remove reading time filter"
          >
            <X className="h-3 w-3" />
          </Link>
        </Badge>
      )}
      
      {filterCount > 1 && (
        <Link
          href="/blog"
          className="text-sm text-primary hover:underline underline-offset-4 ml-1"
        >
          Clear all
        </Link>
      )}
    </div>
  );
}
