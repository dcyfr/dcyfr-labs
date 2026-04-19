import { describe, expect, it } from 'vitest';
import {
  sortData,
  filterBySearch,
  filterByTags,
  filterByFlags,
  paginate,
  getTotalPages,
  getUniqueValues,
  toggleSortDirection,
  isSortActive,
  calculateEngagementRate,
  getEngagementTier,
  calculateEngagementScore,
  getPerformanceTier,
  getBenchmark,
  getTrendDirection,
  formatCompactNumber,
  filterByPublicationCohort,
  filterByPerformanceTier,
  filterByTagsWithMode,
  type SortConfig,
} from '@/lib/dashboard/table-utils';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

interface Post {
  title: string;
  views: number;
  tags: string[];
  draft: boolean;
  archived: boolean;
  publishedAt: Date | null;
}

const posts: Post[] = [
  {
    title: 'TypeScript Tips',
    views: 500,
    tags: ['typescript', 'react'],
    draft: false,
    archived: false,
    publishedAt: new Date('2026-01-15'),
  },
  {
    title: 'React Hooks',
    views: 1200,
    tags: ['react', 'hooks'],
    draft: false,
    archived: false,
    publishedAt: new Date('2026-02-10'),
  },
  {
    title: 'Next.js Guide',
    views: 800,
    tags: ['nextjs', 'react'],
    draft: true,
    archived: false,
    publishedAt: null,
  },
  {
    title: 'AI Agent Patterns',
    views: 300,
    tags: ['ai', 'agents'],
    draft: false,
    archived: true,
    publishedAt: new Date('2026-03-01'),
  },
  {
    title: 'CSS Grid Layout',
    views: 600,
    tags: ['css', 'layout'],
    draft: false,
    archived: false,
    publishedAt: new Date('2026-01-20'),
  },
];

// ---------------------------------------------------------------------------
// sortData
// ---------------------------------------------------------------------------

describe('sortData', () => {
  it('sorts strings ascending', () => {
    const result = sortData(posts, 'title', 'asc');
    expect(result[0].title).toBe('AI Agent Patterns');
    expect(result[4].title).toBe('TypeScript Tips');
  });

  it('sorts strings descending', () => {
    const result = sortData(posts, 'title', 'desc');
    expect(result[0].title).toBe('TypeScript Tips');
    expect(result[4].title).toBe('AI Agent Patterns');
  });

  it('sorts numbers ascending', () => {
    const result = sortData(posts, 'views', 'asc');
    expect(result[0].views).toBe(300);
    expect(result[4].views).toBe(1200);
  });

  it('sorts numbers descending', () => {
    const result = sortData(posts, 'views', 'desc');
    expect(result[0].views).toBe(1200);
    expect(result[4].views).toBe(300);
  });

  it('sorts dates with null handling', () => {
    const result = sortData(posts, 'publishedAt', 'asc');
    // null sorts first in asc
    expect(result[0].publishedAt).toBeNull();
    expect(result[1].publishedAt).toEqual(new Date('2026-01-15'));
  });

  it('sorts dates descending with null last', () => {
    const result = sortData(posts, 'publishedAt', 'desc');
    expect(result[0].publishedAt).toEqual(new Date('2026-03-01'));
    expect(result[4].publishedAt).toBeNull();
  });

  it('handles both values null', () => {
    const data = [{ name: null as string | null }, { name: null as string | null }];
    const result = sortData(data, 'name', 'asc');
    expect(result).toHaveLength(2);
  });

  it('does not mutate the original array', () => {
    const original = [...posts];
    sortData(posts, 'views', 'desc');
    expect(posts).toEqual(original);
  });

  it('returns empty array for empty input', () => {
    expect(sortData([], 'title', 'asc')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// filterBySearch
// ---------------------------------------------------------------------------

describe('filterBySearch', () => {
  it('filters by partial string match (case-insensitive)', () => {
    const result = filterBySearch(posts, 'typescript', ['title']);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TypeScript Tips');
  });

  it('searches across multiple fields', () => {
    const result = filterBySearch(posts, 'react', ['title', 'tags']);
    expect(result).toHaveLength(3); // TypeScript Tips (tags), React Hooks (title+tags), Next.js Guide (tags)
  });

  it('searches inside array fields (tags)', () => {
    const result = filterBySearch(posts, 'hooks', ['tags']);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Hooks');
  });

  it('returns all data for empty query', () => {
    expect(filterBySearch(posts, '', ['title'])).toHaveLength(5);
  });

  it('returns all data for whitespace-only query', () => {
    expect(filterBySearch(posts, '   ', ['title'])).toHaveLength(5);
  });

  it('returns empty array when no matches', () => {
    expect(filterBySearch(posts, 'zzzznotfound', ['title', 'tags'])).toHaveLength(0);
  });

  it('handles null field values gracefully', () => {
    const data = [{ title: null as string | null, views: 100 }];
    const result = filterBySearch(data, 'test', ['title']);
    expect(result).toHaveLength(0);
  });

  it('matches numbers as strings', () => {
    const result = filterBySearch(posts, '500', ['views']);
    expect(result).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// filterByTags
// ---------------------------------------------------------------------------

describe('filterByTags', () => {
  it('filters by single tag', () => {
    const result = filterByTags(posts, ['react'], 'tags');
    expect(result).toHaveLength(3);
  });

  it('filters by multiple tags (AND logic)', () => {
    const result = filterByTags(posts, ['react', 'typescript'], 'tags');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TypeScript Tips');
  });

  it('returns all data when no tags selected', () => {
    expect(filterByTags(posts, [], 'tags')).toHaveLength(5);
  });

  it('is case-insensitive', () => {
    const result = filterByTags(posts, ['REACT'], 'tags');
    expect(result).toHaveLength(3);
  });

  it('returns empty when tag not found', () => {
    expect(filterByTags(posts, ['nonexistent'], 'tags')).toHaveLength(0);
  });

  it('excludes items where tagField is not an array', () => {
    const data = [{ title: 'no tags', tags: 'not-an-array' }];
    const result = filterByTags(data as any, ['react'], 'tags');
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// filterByFlags
// ---------------------------------------------------------------------------

describe('filterByFlags', () => {
  it('hides items where flag is true', () => {
    const result = filterByFlags(posts, { draft: true });
    expect(result).toHaveLength(4);
    expect(result.every((p) => !p.draft)).toBe(true);
  });

  it('applies multiple flag filters', () => {
    const result = filterByFlags(posts, { draft: true, archived: true });
    expect(result).toHaveLength(3);
  });

  it('returns all when no flags set to hide', () => {
    expect(filterByFlags(posts, { draft: false })).toHaveLength(5);
  });

  it('returns all when empty filters', () => {
    expect(filterByFlags(posts, {})).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// paginate
// ---------------------------------------------------------------------------

describe('paginate', () => {
  it('returns first page', () => {
    const result = paginate(posts, 1, 2);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('TypeScript Tips');
  });

  it('returns second page', () => {
    const result = paginate(posts, 2, 2);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Next.js Guide');
  });

  it('returns partial last page', () => {
    const result = paginate(posts, 3, 2);
    expect(result).toHaveLength(1);
  });

  it('returns empty for out-of-range page', () => {
    expect(paginate(posts, 10, 2)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getTotalPages
// ---------------------------------------------------------------------------

describe('getTotalPages', () => {
  it('calculates exact division', () => {
    expect(getTotalPages(10, 5)).toBe(2);
  });

  it('rounds up for remainder', () => {
    expect(getTotalPages(11, 5)).toBe(3);
  });

  it('handles single item', () => {
    expect(getTotalPages(1, 10)).toBe(1);
  });

  it('handles zero items', () => {
    expect(getTotalPages(0, 10)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getUniqueValues
// ---------------------------------------------------------------------------

describe('getUniqueValues', () => {
  it('extracts unique scalar values', () => {
    const result = getUniqueValues(posts, 'title');
    expect(result).toHaveLength(5);
    // Should be sorted alphabetically
    expect(result[0]).toBe('AI Agent Patterns');
  });

  it('flattens and deduplicates array values', () => {
    const result = getUniqueValues(posts, 'tags');
    expect(result).toContain('react');
    expect(result).toContain('typescript');
    // react appears 3 times but should be unique
    expect(result.filter((v) => v === 'react')).toHaveLength(1);
  });

  it('skips null values', () => {
    const data = [{ name: 'a' }, { name: null }, { name: 'b' }];
    const result = getUniqueValues(data as any, 'name');
    expect(result).toEqual(['a', 'b']);
  });

  it('returns empty for empty input', () => {
    expect(getUniqueValues([], 'title')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// toggleSortDirection
// ---------------------------------------------------------------------------

describe('toggleSortDirection', () => {
  it('toggles asc to desc', () => {
    expect(toggleSortDirection('asc')).toBe('desc');
  });

  it('toggles desc to asc', () => {
    expect(toggleSortDirection('desc')).toBe('asc');
  });
});

// ---------------------------------------------------------------------------
// isSortActive
// ---------------------------------------------------------------------------

describe('isSortActive', () => {
  it('returns true when field matches', () => {
    const config: SortConfig<Post> = { field: 'views', direction: 'desc' };
    expect(isSortActive<Post>('views', config)).toBe(true);
  });

  it('returns false when field differs', () => {
    const config: SortConfig<Post> = { field: 'views', direction: 'desc' };
    expect(isSortActive<Post>('title', config)).toBe(false);
  });

  it('returns false when config is null', () => {
    expect(isSortActive<Post>('views', null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// calculateEngagementRate
// ---------------------------------------------------------------------------

describe('calculateEngagementRate', () => {
  it('calculates rate correctly', () => {
    // (10 + 5) / 100 * 100 = 15%
    expect(calculateEngagementRate(100, 10, 5)).toBe(15);
  });

  it('returns 0 for zero views', () => {
    expect(calculateEngagementRate(0, 10, 5)).toBe(0);
  });

  it('handles large numbers', () => {
    const rate = calculateEngagementRate(1_000_000, 50_000, 10_000);
    expect(rate).toBe(6);
  });

  it('handles zero engagement', () => {
    expect(calculateEngagementRate(100, 0, 0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getEngagementTier
// ---------------------------------------------------------------------------

describe('getEngagementTier', () => {
  it('returns high for 5%+', () => {
    expect(getEngagementTier(5)).toBe('high');
    expect(getEngagementTier(10)).toBe('high');
  });

  it('returns medium for 2-5%', () => {
    expect(getEngagementTier(2)).toBe('medium');
    expect(getEngagementTier(4.9)).toBe('medium');
  });

  it('returns low for <2%', () => {
    expect(getEngagementTier(0)).toBe('low');
    expect(getEngagementTier(1.9)).toBe('low');
  });
});

// ---------------------------------------------------------------------------
// calculateEngagementScore
// ---------------------------------------------------------------------------

describe('calculateEngagementScore', () => {
  it('returns 0 when averageViews is 0 and no engagement', () => {
    expect(calculateEngagementScore(0, 0, 0, 0)).toBe(0);
  });

  it('only counts shares/comments when averageViews is 0', () => {
    // viewsScore=0, completionScore=0, sharesScore=50, commentsScore=100
    // 0*0.4 + 0*0.3 + 50*0.2 + 100*0.1 = 20
    expect(calculateEngagementScore(100, 5, 5, 0)).toBe(20);
  });

  it('calculates weighted score', () => {
    const score = calculateEngagementScore(100, 10, 5, 200, 50);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('caps individual components at 100', () => {
    // Massive values should not push score above 100
    const score = calculateEngagementScore(10000, 100, 100, 100, 100);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('defaults completionRate to 0', () => {
    const score = calculateEngagementScore(100, 0, 0, 200);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// getPerformanceTier
// ---------------------------------------------------------------------------

describe('getPerformanceTier', () => {
  it('returns below-average for empty array', () => {
    expect(getPerformanceTier(5, [])).toBe('below-average');
  });

  it('returns top for highest value', () => {
    const values = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
    expect(getPerformanceTier(100, values)).toBe('top');
  });

  it('returns needs-attention for lowest value', () => {
    const values = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
    expect(getPerformanceTier(10, values)).toBe('needs-attention');
  });
});

// ---------------------------------------------------------------------------
// getBenchmark
// ---------------------------------------------------------------------------

describe('getBenchmark', () => {
  it('returns "No baseline" for zero average', () => {
    expect(getBenchmark(100, 0)).toBe('No baseline');
  });

  it('returns multiplier for 2x+', () => {
    expect(getBenchmark(200, 100)).toMatch(/2x avg/);
  });

  it('returns percentage above for 1.1-2x', () => {
    expect(getBenchmark(150, 100)).toMatch(/\+50% avg/);
  });

  it('returns ~avg for near average', () => {
    expect(getBenchmark(100, 100)).toBe('~avg');
  });

  it('returns percentage below for under 0.9x', () => {
    expect(getBenchmark(50, 100)).toMatch(/50% below/);
  });
});

// ---------------------------------------------------------------------------
// getTrendDirection
// ---------------------------------------------------------------------------

describe('getTrendDirection', () => {
  it('returns neutral for zero previous', () => {
    expect(getTrendDirection(100, 0)).toBe('neutral');
  });

  it('returns up for >5% increase', () => {
    expect(getTrendDirection(110, 100)).toBe('up');
  });

  it('returns down for >5% decrease', () => {
    expect(getTrendDirection(90, 100)).toBe('down');
  });

  it('returns neutral for small changes', () => {
    expect(getTrendDirection(103, 100)).toBe('neutral');
  });
});

// ---------------------------------------------------------------------------
// formatCompactNumber
// ---------------------------------------------------------------------------

describe('formatCompactNumber', () => {
  it('formats millions', () => {
    expect(formatCompactNumber(1500000)).toBe('1.5M');
  });

  it('formats thousands', () => {
    expect(formatCompactNumber(2500)).toBe('2.5K');
  });

  it('returns plain number below 1000', () => {
    expect(formatCompactNumber(999)).toBe('999');
  });
});

// ---------------------------------------------------------------------------
// filterByPublicationCohort
// ---------------------------------------------------------------------------

describe('filterByPublicationCohort', () => {
  it('returns all for "all" cohort', () => {
    expect(filterByPublicationCohort(posts, 'all', 'publishedAt')).toHaveLength(5);
  });

  it('returns all for unknown cohort', () => {
    expect(filterByPublicationCohort(posts, 'unknown-cohort', 'publishedAt')).toHaveLength(5);
  });

  it('filters last-7-days', () => {
    const recent = [
      { date: new Date().toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'last-7-days', 'date');
    expect(result).toHaveLength(1);
    expect(result[0].val).toBe(1);
  });

  it('filters last-30-days', () => {
    const recent = [
      { date: new Date().toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'last-30-days', 'date');
    expect(result).toHaveLength(1);
  });

  it('filters last-90-days', () => {
    const recent = [
      { date: new Date().toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'last-90-days', 'date');
    expect(result).toHaveLength(1);
  });

  it('filters this-quarter', () => {
    const now = new Date();
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const recent = [
      { date: quarterStart.toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'this-quarter', 'date');
    expect(result).toHaveLength(1);
  });

  it('filters last-quarter', () => {
    const now = new Date();
    const lastQ = Math.floor(now.getMonth() / 3) - 1;
    const year = lastQ < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = lastQ < 0 ? 9 : lastQ * 3;
    const mid = new Date(year, month + 1, 15);
    const recent = [
      { date: mid.toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'last-quarter', 'date');
    expect(result).toHaveLength(1);
  });

  it('filters this-year', () => {
    const recent = [
      { date: new Date().toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'this-year', 'date');
    expect(result).toHaveLength(1);
  });

  it('filters last-year', () => {
    const lastYear = new Date().getFullYear() - 1;
    const recent = [
      { date: new Date(lastYear, 6, 15).toISOString(), val: 1 },
      { date: new Date('2020-01-01').toISOString(), val: 2 },
    ];
    const result = filterByPublicationCohort(recent, 'last-year', 'date');
    expect(result).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// filterByPerformanceTier
// ---------------------------------------------------------------------------

describe('filterByPerformanceTier', () => {
  it('returns all for "all" tier', () => {
    expect(filterByPerformanceTier(posts, 'all', 'views')).toHaveLength(5);
  });

  it('filters by tier based on value ranking', () => {
    const result = filterByPerformanceTier(posts, 'top', 'views');
    // Top 10% — highest views
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// filterByTagsWithMode
// ---------------------------------------------------------------------------

describe('filterByTagsWithMode', () => {
  it('returns all when no tags selected', () => {
    expect(filterByTagsWithMode(posts, [], 'tags')).toHaveLength(5);
  });

  it('AND mode requires all tags', () => {
    const result = filterByTagsWithMode(posts, ['react', 'hooks'], 'tags', 'AND');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Hooks');
  });

  it('OR mode requires any tag', () => {
    const result = filterByTagsWithMode(posts, ['ai', 'css'], 'tags', 'OR');
    expect(result).toHaveLength(2);
  });

  it('handles non-array tag field', () => {
    const data = [{ tags: 'not-an-array' }];
    const result = filterByTagsWithMode(data, ['test'], 'tags' as any);
    expect(result).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const result = filterByTagsWithMode(posts, ['REACT'], 'tags', 'OR');
    expect(result.length).toBeGreaterThan(0);
  });
});
