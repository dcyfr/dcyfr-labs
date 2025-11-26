"use client";

import { Clock, TrendingUp, Calendar } from "lucide-react";
import {
  useFilterParams,
  useFilterSearch,
  useActiveFilters,
  FilterSearchInput,
  FilterSelect,
  FilterBadges,
  FilterClearButton,
  type FilterOption,
} from "@/components/common/filters";

interface BlogFiltersProps {
  selectedTags: string[];
  readingTime: string | null;
  tagList: string[];
  query: string;
  sortBy?: string;
  dateRange?: string;
}

const READING_TIME_OPTIONS: FilterOption[] = [
  { value: "all", label: "All reading times" },
  { value: "quick", label: "Quick (<5 min)" },
  { value: "medium", label: "Medium (5-15 min)" },
  { value: "deep", label: "Deep (>15 min)" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "oldest", label: "Oldest first" },
];

const DATE_RANGE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All time" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "year", label: "This year" },
];

/**
 * BlogFilters Component
 *
 * Consolidated search and filter interface with:
 * - Search input with debounce
 * - Reading time dropdown
 * - Sort by dropdown (newest, popular, etc.)
 * - Date range filter
 * - Multi-select tag badges
 * - Clear all filters button
 *
 * @param selectedTags - Currently selected tags array
 * @param readingTime - Currently selected reading time filter (quick/medium/deep)
 * @param tagList - Array of available tags
 * @param query - Current search query
 * @param sortBy - Current sort option (newest/popular)
 * @param dateRange - Current date range filter (30d/90d/year/all)
 */
export function BlogFilters({
  selectedTags,
  readingTime,
  tagList,
  query,
  sortBy = 'newest',
  dateRange = 'all'
}: BlogFiltersProps) {
  const { updateParam, toggleMultiParam, clearAll } = useFilterParams({ basePath: "/blog" });
  const { searchValue, setSearchValue } = useFilterSearch({ query, basePath: "/blog" });

  const { hasActive, count } = useActiveFilters({
    tags: selectedTags,
    readingTime,
    query,
    sortBy,
    dateRange,
  }, {
    sortBy: "newest",
    dateRange: "all",
  });

  const toggleTag = (tag: string) => toggleMultiParam("tag", tag, selectedTags);

  return (
    <div className="space-y-6">
      {/* Search Input - Full Width */}
      <FilterSearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search posts..."
        aria-label="Search blog posts"
      />

      {/* Filter Controls - Separate Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-wrap gap-3">
          <FilterSelect
            icon={Clock}
            value={readingTime || "all"}
            onChange={(value) => updateParam("readingTime", value, "all")}
            options={READING_TIME_OPTIONS}
            placeholder="Reading time"
            className="flex-1 min-w-[140px]"
          />

          <FilterSelect
            icon={TrendingUp}
            value={sortBy}
            onChange={(value) => updateParam("sortBy", value, "newest")}
            options={SORT_OPTIONS}
            placeholder="Sort by"
            className="flex-1 min-w-[130px]"
          />

          <FilterSelect
            icon={Calendar}
            value={dateRange}
            onChange={(value) => updateParam("dateRange", value, "all")}
            options={DATE_RANGE_OPTIONS}
            placeholder="Date range"
            className="flex-1 min-w-[130px]"
          />
        </div>

        {/* Clear All Button */}
        <FilterClearButton
          onClear={clearAll}
          count={count}
          visible={hasActive}
        />
      </div>

      {/* Tag Badges */}
      <div className="space-y-3">
        <FilterBadges
          items={tagList}
          selected={selectedTags}
          onToggle={toggleTag}
        />
      </div>
    </div>
  );
}
