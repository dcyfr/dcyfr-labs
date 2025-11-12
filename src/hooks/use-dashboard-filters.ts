/**
 * Dashboard Filters Hook
 * 
 * Custom hook for managing dashboard filter state with URL synchronization.
 * Handles search, tags, boolean flags, and persistence across page reloads.
 * 
 * @module hooks/use-dashboard-filters
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface DashboardFilters {
  /** Search query string */
  searchQuery: string;
  /** Selected tag filters */
  selectedTags: string[];
  /** Hide draft items */
  hideDrafts: boolean;
  /** Hide archived items */
  hideArchived: boolean;
}

interface UseDashboardFiltersOptions {
  /** Initial filter values */
  initialFilters?: Partial<DashboardFilters>;
  /** Enable URL synchronization (default: true) */
  syncWithUrl?: boolean;
}

interface UseDashboardFiltersReturn extends DashboardFilters {
  /** Update search query */
  setSearchQuery: (query: string) => void;
  /** Update selected tags */
  setSelectedTags: (tags: string[] | ((prev: string[]) => string[])) => void;
  /** Update hide drafts flag */
  setHideDrafts: (hide: boolean) => void;
  /** Update hide archived flag */
  setHideArchived: (hide: boolean) => void;
  /** Reset all filters to defaults */
  resetFilters: () => void;
  /** Check if any filters are active */
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: DashboardFilters = {
  searchQuery: "",
  selectedTags: [],
  hideDrafts: false,
  hideArchived: false,
};

/**
 * Manage dashboard filter state with URL synchronization
 * 
 * @example
 * ```tsx
 * const {
 *   searchQuery,
 *   setSearchQuery,
 *   selectedTags,
 *   setSelectedTags,
 *   hasActiveFilters,
 *   resetFilters
 * } = useDashboardFilters();
 * ```
 */
export function useDashboardFilters({
  initialFilters = {},
  syncWithUrl = true,
}: UseDashboardFiltersOptions = {}): UseDashboardFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQueryState] = useState(
    initialFilters.searchQuery ?? DEFAULT_FILTERS.searchQuery
  );
  const [selectedTags, setSelectedTagsState] = useState<string[]>(
    initialFilters.selectedTags ?? DEFAULT_FILTERS.selectedTags
  );
  const [hideDrafts, setHideDraftsState] = useState(
    initialFilters.hideDrafts ?? DEFAULT_FILTERS.hideDrafts
  );
  const [hideArchived, setHideArchivedState] = useState(
    initialFilters.hideArchived ?? DEFAULT_FILTERS.hideArchived
  );

  // Initialize state from URL on mount
  useEffect(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams.toString());

    // Search query
    const urlSearch = params.get("search");
    if (urlSearch) setSearchQueryState(urlSearch);

    // Tags
    const urlTags = params.get("tags");
    if (urlTags) setSelectedTagsState(urlTags.split(","));

    // Boolean flags
    if (params.get("hideDrafts") === "true") setHideDraftsState(true);
    if (params.get("hideArchived") === "true") setHideArchivedState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update URL when filters change
  useEffect(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams.toString());

    // Update search
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    // Update tags
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
    }

    // Update boolean flags
    if (hideDrafts) {
      params.set("hideDrafts", "true");
    } else {
      params.delete("hideDrafts");
    }

    if (hideArchived) {
      params.set("hideArchived", "true");
    } else {
      params.delete("hideArchived");
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    searchQuery,
    selectedTags,
    hideDrafts,
    hideArchived,
    syncWithUrl,
    router,
    searchParams,
  ]);

  // Wrapper functions for state setters
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setSelectedTags = useCallback(
    (tags: string[] | ((prev: string[]) => string[])) => {
      setSelectedTagsState(tags);
    },
    []
  );

  const setHideDrafts = useCallback((hide: boolean) => {
    setHideDraftsState(hide);
  }, []);

  const setHideArchived = useCallback((hide: boolean) => {
    setHideArchivedState(hide);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQueryState(DEFAULT_FILTERS.searchQuery);
    setSelectedTagsState(DEFAULT_FILTERS.selectedTags);
    setHideDraftsState(DEFAULT_FILTERS.hideDrafts);
    setHideArchivedState(DEFAULT_FILTERS.hideArchived);
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== DEFAULT_FILTERS.searchQuery ||
    selectedTags.length > 0 ||
    hideDrafts !== DEFAULT_FILTERS.hideDrafts ||
    hideArchived !== DEFAULT_FILTERS.hideArchived;

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    hideDrafts,
    setHideDrafts,
    hideArchived,
    setHideArchived,
    resetFilters,
    hasActiveFilters,
  };
}
