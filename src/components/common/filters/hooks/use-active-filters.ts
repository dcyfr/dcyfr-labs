export interface FilterState {
  [key: string]: string | string[] | null | undefined;
}

export interface FilterDefaults {
  [key: string]: string | string[] | null;
}

export function useActiveFilters(filters: FilterState, defaults: FilterDefaults = {}) {
  const activeFilters: Array<{ key: string; value: string | string[] }> = [];
  let count = 0;

  Object.entries(filters).forEach(([key, value]) => {
    const defaultValue = defaults[key];

    if (Array.isArray(value)) {
      if (value.length > 0) {
        activeFilters.push({ key, value });
        count += value.length;
      }
    } else if (value && value !== defaultValue) {
      activeFilters.push({ key, value });
      count++;
    }
  });

  const hasActive = activeFilters.length > 0;

  return { hasActive, count, activeFilters };
}
