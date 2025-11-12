/**
 * Table utilities for dashboard components
 * 
 * Provides reusable functions for sorting, filtering, and manipulating table data.
 * Used by dashboard tables to implement common data operations.
 * 
 * Note: This file uses generic any types intentionally for maximum flexibility.
 * 
 * @module dashboard/table-utils
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Generic sort direction type
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort configuration for a table
 */
export interface SortConfig<T> {
  /** Field to sort by */
  field: keyof T;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Sort an array of objects by a specified field and direction
 * 
 * @param data - Array to sort
 * @param field - Field to sort by
 * @param direction - Sort direction (asc or desc)
 * @returns Sorted array
 * 
 * @example
 * ```tsx
 * const sortedPosts = sortData(posts, 'views', 'desc');
 * ```
 */
export function sortData<T extends Record<string, any>>(
  data: T[],
  field: keyof T,
  direction: SortDirection
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === "asc" ? -1 : 1;
    if (bVal == null) return direction === "asc" ? 1 : -1;

    // Handle different value types
    if (typeof aVal === "string" && typeof bVal === "string") {
      const comparison = aVal.localeCompare(bVal);
      return direction === "asc" ? comparison : -comparison;
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    // Check for Date objects (type guard)
    if (
      Object.prototype.toString.call(aVal) === "[object Date]" &&
      Object.prototype.toString.call(bVal) === "[object Date]"
    ) {
      const aTime = (aVal as Date).getTime();
      const bTime = (bVal as Date).getTime();
      return direction === "asc" ? aTime - bTime : bTime - aTime;
    }

    // Fallback: convert to string and compare
    const aStr = String(aVal);
    const bStr = String(bVal);
    const comparison = aStr.localeCompare(bStr);
    return direction === "asc" ? comparison : -comparison;
  });
}

/**
 * Filter data by a search query across multiple fields
 * 
 * @param data - Array to filter
 * @param query - Search query string
 * @param fields - Fields to search in
 * @returns Filtered array
 * 
 * @example
 * ```tsx
 * const filtered = filterBySearch(posts, 'nextjs', ['title', 'summary', 'tags']);
 * ```
 */
export function filterBySearch<T extends Record<string, any>>(
  data: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query || query.trim() === "") return data;

  const lowerQuery = query.toLowerCase().trim();

  return data.filter((item) => {
    return fields.some((field) => {
      const value = item[field];

      if (value == null) return false;

      // Handle arrays (e.g., tags)
      if (Array.isArray(value)) {
        return value.some((v: any) =>
          String(v).toLowerCase().includes(lowerQuery)
        );
      }

      // Handle strings and numbers
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Filter data by selected tags
 * 
 * @param data - Array to filter
 * @param selectedTags - Array of selected tag strings
 * @param tagField - Field name containing tags array
 * @returns Filtered array
 * 
 * @example
 * ```tsx
 * const filtered = filterByTags(posts, ['react', 'typescript'], 'tags');
 * ```
 */
export function filterByTags<T extends Record<string, any>>(
  data: T[],
  selectedTags: string[],
  tagField: keyof T
): T[] {
  if (!selectedTags || selectedTags.length === 0) return data;

  return data.filter((item) => {
    const itemTags = item[tagField];
    if (!Array.isArray(itemTags)) return false;

    // Item must have ALL selected tags (AND logic)
    return selectedTags.every((tag) =>
      itemTags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
    );
  });
}

/**
 * Filter data by boolean flags
 * 
 * @param data - Array to filter
 * @param filters - Object with field names and boolean values
 * @returns Filtered array
 * 
 * @example
 * ```tsx
 * const filtered = filterByFlags(posts, { draft: false, archived: false });
 * ```
 */
export function filterByFlags<T extends Record<string, any>>(
  data: T[],
  filters: Partial<Record<keyof T, boolean>>
): T[] {
  return data.filter((item) => {
    return Object.entries(filters).every(([key, shouldHide]) => {
      if (!shouldHide) return true;
      // Hide items where the flag is true
      return !item[key as keyof T];
    });
  });
}

/**
 * Paginate data array
 * 
 * @param data - Array to paginate
 * @param page - Current page number (1-indexed)
 * @param pageSize - Items per page
 * @returns Paginated slice of array
 * 
 * @example
 * ```tsx
 * const page1 = paginate(posts, 1, 10); // First 10 items
 * const page2 = paginate(posts, 2, 10); // Items 11-20
 * ```
 */
export function paginate<T>(data: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

/**
 * Calculate total number of pages
 * 
 * @param totalItems - Total number of items
 * @param pageSize - Items per page
 * @returns Total page count
 * 
 * @example
 * ```tsx
 * const totalPages = getTotalPages(posts.length, 10);
 * ```
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Get all unique values for a field across an array
 * 
 * Useful for generating filter options (e.g., all unique tags).
 * 
 * @param data - Array to extract values from
 * @param field - Field to extract values from
 * @returns Array of unique values, sorted alphabetically
 * 
 * @example
 * ```tsx
 * const allTags = getUniqueValues(posts, 'tags'); // Flattens arrays
 * const allAuthors = getUniqueValues(posts, 'author');
 * ```
 */
export function getUniqueValues<T extends Record<string, any>>(
  data: T[],
  field: keyof T
): string[] {
  const values = new Set<string>();

  data.forEach((item) => {
    const value = item[field];

    if (value == null) return;

    // Handle arrays (e.g., tags)
    if (Array.isArray(value)) {
      value.forEach((v: any) => {
        if (v != null) values.add(String(v));
      });
    } else {
      values.add(String(value));
    }
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

/**
 * Toggle sort direction
 * 
 * @param currentDirection - Current sort direction
 * @returns Opposite direction
 * 
 * @example
 * ```tsx
 * const newDirection = toggleSortDirection(sortDirection);
 * ```
 */
export function toggleSortDirection(currentDirection: SortDirection): SortDirection {
  return currentDirection === "asc" ? "desc" : "asc";
}

/**
 * Check if a field is currently being sorted
 * 
 * @param field - Field to check
 * @param sortConfig - Current sort configuration
 * @returns True if the field is the active sort field
 * 
 * @example
 * ```tsx
 * const isActive = isSortActive('views', { field: 'views', direction: 'desc' });
 * ```
 */
export function isSortActive<T>(
  field: keyof T,
  sortConfig: SortConfig<T> | null
): boolean {
  return sortConfig?.field === field;
}
