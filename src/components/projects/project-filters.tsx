"use client";

import { TrendingUp, Code2, Tags, Activity } from "lucide-react";
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

interface ProjectFiltersProps {
  selectedTags: string[];
  selectedTech: string[];
  status: string | null;
  tagList: string[];
  techList: string[];
  query: string;
  sortBy?: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "alpha", label: "Alphabetical" },
  { value: "status", label: "By status" },
];

/**
 * ProjectFilters Component
 *
 * Consolidated search and filter interface for projects with:
 * - Search input with debounce
 * - Tech stack multi-select
 * - Category/tag multi-select
 * - Status filter (active/in-progress/archived)
 * - Sort by dropdown (newest, oldest, A-Z)
 * - Clear all filters button
 *
 * @param selectedTags - Currently selected category tags
 * @param selectedTech - Currently selected tech stack filters
 * @param status - Currently selected status filter (active/in-progress/archived/all)
 * @param tagList - Array of available category tags
 * @param techList - Array of available technologies
 * @param query - Current search query
 * @param sortBy - Current sort option (newest/oldest/alpha)
 */
export function ProjectFilters({
  selectedTags,
  selectedTech,
  status,
  tagList,
  techList,
  query,
  sortBy = 'newest'
}: ProjectFiltersProps) {
  const { updateParam, toggleMultiParam, clearAll } = useFilterParams({ basePath: "/projects" });
  const { searchValue, setSearchValue } = useFilterSearch({ query, basePath: "/projects" });

  const { hasActive, count } = useActiveFilters({
    tags: selectedTags,
    tech: selectedTech,
    status,
    query,
    sortBy,
  }, {
    sortBy: "newest",
  });

  const toggleTag = (tag: string) => toggleMultiParam("tag", tag, selectedTags);
  const toggleTech = (tech: string) => toggleMultiParam("tech", tech, selectedTech);

  return (
    <div className="space-y-6">
      {/* Search Input - Full Width */}
      <FilterSearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search projects..."
        aria-label="Search projects"
      />

      {/* Filter Controls - Separate Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-wrap gap-3">
          <FilterSelect
            icon={Activity}
            value={status || "all"}
            onChange={(value) => updateParam("status", value, "all")}
            options={STATUS_OPTIONS}
            placeholder="Status"
            className="flex-1 min-w-[130px]"
          />

          <FilterSelect
            icon={TrendingUp}
            value={sortBy}
            onChange={(value) => updateParam("sortBy", value, "newest")}
            options={SORT_OPTIONS}
            placeholder="Sort by"
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

      {/* Tech Stack Badges */}
      {techList.length > 0 && (
        <div className="space-y-2">
          <FilterBadges
            items={techList}
            selected={selectedTech}
            onToggle={toggleTech}
            icon={Code2}
            label="Tech Stack"
          />
        </div>
      )}

      {/* Category Tag Badges */}
      {tagList.length > 0 && (
        <div className="space-y-2">
          <FilterBadges
            items={tagList}
            selected={selectedTags}
            onToggle={toggleTag}
            icon={Tags}
            label="Categories"
          />
        </div>
      )}
    </div>
  );
}
