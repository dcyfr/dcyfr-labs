# Blog & Archive Pages Refactor Plan

**Created:** November 10, 2025  
**Status:** Planning Phase  
**Goal:** Simplify and standardize `/blog` and individual blog post pages, with patterns that scale to `/projects` and future archive pages

---

## 🎯 Executive Summary

Refactor blog and archive pages to follow universal, composable patterns that reduce code by 50-67% while improving maintainability and consistency. Create reusable abstractions for:
- **Archive pages** (list/grid views with filtering, pagination)
- **Article pages** (individual items with metadata, navigation, related content)

### Key Metrics
- `/blog/page.tsx`: 248 lines → ~80 lines (67% reduction)
- `/blog/[slug]/page.tsx`: 311 lines → ~120 lines (61% reduction)
- `/projects/page.tsx`: 121 lines → ~60 lines (50% reduction)
- Future archive types: < 100 lines total

---

## 🔍 Current State Analysis

### Problems Identified

1. **Too Much Logic in Page Components**
   - Filtering, pagination, metadata generation all inline
   - Violates separation of concerns
   - Hard to test business logic

2. **Repetitive Boilerplate**
   - Metadata generation duplicated across pages
   - JSON-LD schemas copied and tweaked
   - Query string building scattered

3. **No Shared Abstractions**
   - Blog and projects solve same problems differently
   - No pattern for future archives (/writing, /notes, /bookmarks)
   - Each new archive type requires reinventing patterns

4. **Inconsistent Design Token Usage**
   - Some pages use `getContainerClasses()`, others don't
   - Typography constants used inconsistently
   - Spacing mixed with inline Tailwind

5. **Complex Dependencies**
   - Multiple data fetching calls scattered throughout
   - Analytics (views, shares) called separately
   - Related content logic duplicated

### Current File Sizes
```
src/app/blog/page.tsx           - 248 lines (filtering, pagination, search, layouts)
src/app/blog/[slug]/page.tsx    - 311 lines (TOC, related, series, comments, sharing)
src/app/projects/page.tsx       - 121 lines (GitHub heatmap, project cards)
```

---

## 🏗️ Proposed Architecture

### Core Principles

1. **Separation of Concerns**
   - Pages are thin routing shells (composition only)
   - Business logic lives in `src/lib/*`
   - UI patterns live in `src/components/layouts/*`

2. **Two Universal Patterns**
   - **Archive Pattern**: For list/grid pages with filtering
   - **Article Pattern**: For individual item pages with metadata

3. **Configuration Over Code**
   - Declarative configs define archive behavior
   - Generic helpers handle common logic
   - Type-safe patterns prevent errors

### New Directory Structure

```
src/lib/
├── archive.ts          ← NEW: Generic archive utilities
├── metadata.ts         ← ENHANCED: Unified metadata generation
├── article.ts          ← NEW: Generic article utilities
├── blog.ts             ← KEEP: Blog-specific logic (MDX, reading time)
├── projects.ts         ← KEEP: Project-specific logic
└── related-items.ts    ← RENAMED: Generic related items algorithm

src/components/layouts/
├── archive-layout.tsx  ← NEW: Universal archive wrapper
├── article-layout.tsx  ← NEW: Universal article wrapper
└── archive-filters.tsx ← NEW: Merged BlogFilters + ActiveFilters

src/components/
├── post-list.tsx       ← KEEP: Flexible list renderer
├── blog-search-form.tsx ← KEEP: Search UX
├── mdx.tsx             ← KEEP: Syntax highlighting
└── [other focused components]
```

---

## 📐 Pattern Definitions

### 1. Archive Pattern

**Used for:** `/blog`, `/projects`, future `/writing`, `/notes`, `/bookmarks`

#### Archive Config (Type-Safe)
```typescript
// src/lib/archive.ts
export interface ArchiveConfig<T> {
  // Filtering and sorting
  filterFn: (item: T, filters: Filters) => boolean;
  sortFn: (a: T, b: T) => number;
  searchFields: (keyof T)[];
  
  // Pagination
  itemsPerPage: number;
  
  // Metadata
  generateMetadata: (params: MetadataParams) => Metadata;
  generateJsonLd: (items: T[]) => JsonLd;
}
```

#### Archive Helpers
```typescript
// Generic data aggregation
export function getArchiveData<T>(config: {
  items: T[];
  params: SearchParams;
  config: ArchiveConfig<T>;
}): ArchiveData<T>

// Individual utilities
export function filterItems<T>(items: T[], filters: Filters, config: ArchiveConfig<T>): T[]
export function paginateItems<T>(items: T[], page: number, perPage: number): PaginatedResult<T>
export function buildQueryString(filters: Filters): string
```

#### Archive Layout Component
```tsx
// src/components/layouts/archive-layout.tsx
interface ArchiveLayoutProps<T> {
  type: 'blog' | 'projects' | 'writing' | 'notes';
  items: T[];
  pagination: PaginationData;
  filters: FilterData;
  renderItem: (item: T) => React.ReactNode;
  headerSlot?: React.ReactNode;  // Optional custom header content
}

export function ArchiveLayout<T>({ ... }: ArchiveLayoutProps<T>) {
  return (
    <div className={getContainerClasses('standard')}>
      <ArchiveHeader {...} />
      <ArchiveFilters {...} />
      <ArchiveGrid items={items} renderItem={renderItem} />
      <ArchivePagination {...pagination} />
    </div>
  );
}
```

#### Example Usage - Blog
```tsx
// src/app/blog/page.tsx (~80 lines)
const BLOG_ARCHIVE_CONFIG: ArchiveConfig<Post> = {
  filterFn: (post, filters) => {
    if (filters.tag && !post.tags.includes(filters.tag)) return false;
    if (filters.readingTime && !matchesReadingTime(post, filters.readingTime)) return false;
    if (filters.query && !searchPost(post, filters.query)) return false;
    return true;
  },
  sortFn: (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1),
  searchFields: ['title', 'summary', 'tags', 'body'],
  itemsPerPage: 12,
  generateMetadata: createBlogArchiveMetadata,
  generateJsonLd: createBlogCollectionSchema,
};

export const metadata = await createArchiveMetadata({
  type: 'blog',
  title: 'Blog',
  description: 'Articles on web development, cybersecurity, AI, and more.',
});

export default async function BlogPage({ searchParams }) {
  const params = await parseSearchParams(searchParams);
  const { items, pagination, filters } = await getArchiveData({
    items: posts,
    params,
    config: BLOG_ARCHIVE_CONFIG,
  });
  
  return (
    <ArchiveLayout
      type="blog"
      items={items}
      pagination={pagination}
      filters={filters}
      renderItem={(post) => <PostCard {...post} />}
    />
  );
}
```

---

### 2. Article Pattern

**Used for:** `/blog/[slug]`, `/projects/[slug]`, future individual pages

#### Article Config (Type-Safe)
```typescript
// src/lib/article.ts
export interface ArticleConfig<T> {
  // Navigation
  getItemBySlug: (slug: string, items: T[]) => T | null;
  getPrevNext: (current: T, items: T[]) => Navigation;
  
  // Related content
  getRelated: (current: T, items: T[], count: number) => T[];
  
  // Analytics
  includeViews?: boolean;
  includeShares?: boolean;
  
  // Metadata
  generateMetadata: (item: T) => Metadata;
  generateJsonLd: (item: T, analytics?: Analytics) => JsonLd;
}
```

#### Article Helpers
```typescript
// Single aggregated data call
export async function getArticleData<T>(config: {
  slug: string;
  items: T[];
  config: ArticleConfig<T>;
}): ArticleData<T>

// Returns: { item, navigation, related, analytics, breadcrumbs }
```

#### Article Layout Component
```tsx
// src/components/layouts/article-layout.tsx
interface ArticleLayoutProps<T> {
  type: 'blog' | 'project';
  item: T;
  navigation: NavigationData;
  related: T[];
  analytics?: AnalyticsData;
  children: React.ReactNode;  // Content slot
  sidebarSlot?: React.ReactNode;  // Optional sidebar (TOC, etc.)
}

export function ArticleLayout<T>({ ... }: ArticleLayoutProps<T>) {
  return (
    <>
      <ReadingProgress />  {/* Optional based on type */}
      <article className={getContainerClasses('prose')}>
        <Breadcrumbs items={breadcrumbs} />
        <ArticleHeader {...item} analytics={analytics} />
        {children}
        <ArticleFooter navigation={navigation} related={related} />
      </article>
    </>
  );
}
```

#### Example Usage - Blog Post
```tsx
// src/app/blog/[slug]/page.tsx (~120 lines)
const BLOG_ARTICLE_CONFIG: ArticleConfig<Post> = {
  getItemBySlug: getPostByAnySlug,
  getPrevNext: getPostNavigation,
  getRelated: getRelatedPosts,
  includeViews: true,
  includeShares: true,
  generateMetadata: createBlogPostMetadata,
  generateJsonLd: createArticleSchema,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  
  return createArticleMetadata({
    type: 'blog',
    item: post,
    imageUrl: post.image?.url,
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const { item: post, navigation, related, analytics } = await getArticleData({
    slug,
    items: posts,
    config: BLOG_ARTICLE_CONFIG,
  });
  
  if (!post) notFound();
  
  // Blog-specific features
  const headings = extractHeadings(post.body);
  const seriesPosts = post.series ? postsBySeries[post.series.name] ?? [] : [];
  
  return (
    <ArticleLayout
      type="blog"
      item={post}
      navigation={navigation}
      related={related}
      analytics={analytics}
      sidebarSlot={<TableOfContents headings={headings} />}
    >
      <ViewTracker postId={post.id} />
      {post.image && <PostHeroImage image={post.image} title={post.title} />}
      {post.series && <SeriesNavigation currentPost={post} seriesPosts={seriesPosts} />}
      <div className="prose mt-8">
        <MDX source={post.body} />
      </div>
      {!post.draft && <GiscusComments />}
    </ArticleLayout>
  );
}
```

---

## 🔧 Library Functions

### src/lib/archive.ts (NEW)

```typescript
/**
 * Generic archive utilities for list/grid pages with filtering and pagination
 */

export interface ArchiveConfig<T> {
  filterFn: (item: T, filters: Filters) => boolean;
  sortFn: (a: T, b: T) => number;
  searchFields: (keyof T)[];
  itemsPerPage: number;
}

export interface Filters {
  query?: string;
  tag?: string;
  [key: string]: string | undefined;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ArchiveData<T> {
  items: T[];
  pagination: PaginationData;
  filters: Filters;
  allTags?: string[];
}

/**
 * Main aggregation function - gets everything needed for an archive page
 */
export async function getArchiveData<T>(config: {
  items: T[];
  params: URLSearchParams;
  config: ArchiveConfig<T>;
}): Promise<ArchiveData<T>> {
  // Parse filters from params
  const filters = parseFilters(config.params);
  
  // Filter items
  const filteredItems = filterItems(config.items, filters, config.config);
  
  // Paginate
  const page = parseInt(config.params.get('page') || '1', 10);
  const paginatedResult = paginateItems(filteredItems, page, config.config.itemsPerPage);
  
  return {
    items: paginatedResult.items,
    pagination: paginatedResult.pagination,
    filters,
  };
}

/**
 * Generic filtering with type-safe config
 */
export function filterItems<T>(
  items: T[],
  filters: Filters,
  config: ArchiveConfig<T>
): T[] {
  return items
    .filter(item => config.filterFn(item, filters))
    .sort(config.sortFn);
}

/**
 * Generic pagination
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  itemsPerPage: number
): { items: T[]; pagination: PaginationData } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}

/**
 * Build query string from filters
 */
export function buildQueryString(filters: Filters, page?: number): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  
  if (page && page > 1) params.set('page', page.toString());
  
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
```

### src/lib/metadata.ts (ENHANCED)

```typescript
/**
 * Unified metadata generation for all page types
 * Consolidates logic from site-config.ts and scattered metadata generation
 */

import { Metadata } from 'next';
import { SITE_URL, SITE_TITLE, getOgImageUrl, getTwitterImageUrl } from './site-config';

export interface ArchiveMetadataParams {
  type: 'blog' | 'projects' | 'writing' | 'notes';
  title: string;
  description: string;
  url?: string;
  filters?: Record<string, string>;
}

/**
 * Generate metadata for archive/list pages
 */
export function createArchiveMetadata(params: ArchiveMetadataParams): Metadata {
  const url = params.url || `${SITE_URL}/${params.type}`;
  const fullTitle = `${params.title} — ${SITE_TITLE}`;
  
  // Adjust title/description if filters applied
  let title = params.title;
  let description = params.description;
  if (params.filters?.tag) {
    title = `${params.title} - ${params.filters.tag}`;
    description = `${params.description} Tagged: ${params.filters.tag}`;
  }
  
  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_TITLE,
      type: 'website',
      images: [
        {
          url: getOgImageUrl(title, description),
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [getTwitterImageUrl(title, description)],
    },
  };
}

export interface ArticleMetadataParams {
  type: 'blog' | 'project';
  item: {
    title: string;
    summary: string;
    slug: string;
    image?: { url: string; alt?: string; width?: number; height?: number };
  };
}

/**
 * Generate metadata for individual article/item pages
 */
export function createArticleMetadata(params: ArticleMetadataParams): Metadata {
  const { item } = params;
  const url = `${SITE_URL}/${params.type === 'blog' ? 'blog' : 'projects'}/${item.slug}`;
  
  // Use hero image for OG if available, otherwise use dynamic generator
  const hasHeroImage = !!item.image?.url;
  const ogImageUrl = hasHeroImage 
    ? `${SITE_URL}${item.image!.url}`
    : getOgImageUrl(item.title, item.summary);
  const twitterImageUrl = hasHeroImage
    ? `${SITE_URL}${item.image!.url}`
    : getTwitterImageUrl(item.title, item.summary);
  
  const imageWidth = item.image?.width ?? 1200;
  const imageHeight = item.image?.height ?? 630;
  
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      type: 'article',
      url,
      siteName: SITE_TITLE,
      images: [
        {
          url: ogImageUrl,
          width: imageWidth,
          height: imageHeight,
          type: hasHeroImage ? 'image/jpeg' : 'image/png',
          alt: item.image?.alt ?? `${item.title} — ${SITE_TITLE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.summary,
      images: [twitterImageUrl],
    },
  };
}
```

### src/lib/article.ts (NEW)

```typescript
/**
 * Generic article/item page utilities
 */

export interface ArticleConfig<T> {
  getItemBySlug: (slug: string, items: T[]) => T | null;
  getPrevNext: (current: T, items: T[]) => { prev?: T; next?: T };
  getRelated: (current: T, items: T[], count: number) => T[];
  includeViews?: boolean;
  includeShares?: boolean;
}

export interface NavigationData {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

export interface AnalyticsData {
  views?: number;
  shares?: number;
}

export interface ArticleData<T> {
  item: T;
  navigation: NavigationData;
  related: T[];
  analytics?: AnalyticsData;
  breadcrumbs: BreadcrumbItem[];
}

/**
 * Main aggregation function - gets everything needed for an article page
 */
export async function getArticleData<T>(config: {
  slug: string;
  items: T[];
  config: ArticleConfig<T>;
}): Promise<ArticleData<T>> {
  const item = config.config.getItemBySlug(config.slug, config.items);
  if (!item) throw new Error('Item not found');
  
  // Get navigation (prev/next)
  const { prev, next } = config.config.getPrevNext(item, config.items);
  const navigation: NavigationData = {
    prev: prev ? { slug: (prev as any).slug, title: (prev as any).title } : undefined,
    next: next ? { slug: (next as any).slug, title: (next as any).title } : undefined,
  };
  
  // Get related items
  const related = config.config.getRelated(item, config.items, 3);
  
  // Get analytics if enabled
  let analytics: AnalyticsData | undefined;
  if (config.config.includeViews || config.config.includeShares) {
    analytics = {};
    if (config.config.includeViews) {
      analytics.views = await getPostViews((item as any).id);
    }
    if (config.config.includeShares) {
      analytics.shares = await getPostShares((item as any).id);
    }
  }
  
  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(item);
  
  return {
    item,
    navigation,
    related,
    analytics,
    breadcrumbs,
  };
}

/**
 * Generate breadcrumbs for an item
 */
function generateBreadcrumbs<T>(item: any): BreadcrumbItem[] {
  // Logic to build breadcrumb trail
  return [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },  // Dynamic based on type
    { label: item.title },
  ];
}
```

---

## 🎨 Layout Components

### src/components/layouts/archive-layout.tsx (NEW)

```tsx
/**
 * Universal layout for archive/list pages
 * Handles: header, filters, grid/list view, pagination
 */

import { getContainerClasses, TYPOGRAPHY, SPACING } from '@/lib/design-tokens';
import { ArchiveFilters } from './archive-filters';
import { ArchivePagination } from './archive-pagination';

interface ArchiveLayoutProps<T> {
  type: 'blog' | 'projects' | 'writing' | 'notes';
  title: string;
  description: string;
  items: T[];
  pagination: PaginationData;
  filters: FilterData;
  renderItem: (item: T) => React.ReactNode;
  headerSlot?: React.ReactNode;
  layout?: 'grid' | 'list' | 'magazine';
}

export function ArchiveLayout<T>({
  type,
  title,
  description,
  items,
  pagination,
  filters,
  renderItem,
  headerSlot,
  layout = 'grid',
}: ArchiveLayoutProps<T>) {
  return (
    <div className={getContainerClasses('standard')}>
      {/* Header */}
      <header className={SPACING.proseHero}>
        <h1 className={TYPOGRAPHY.h1.standard}>{title}</h1>
        <p className={TYPOGRAPHY.description}>{description}</p>
        {pagination.totalPages > 1 && (
          <p className={TYPOGRAPHY.metadata}>
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalItems} total {type})
          </p>
        )}
        {headerSlot}
      </header>

      {/* Filters */}
      <ArchiveFilters filters={filters} type={type} />

      {/* Content Grid/List */}
      <section className={`mt-6 ${SPACING.content}`}>
        {items.length > 0 ? (
          <div className={getLayoutClasses(layout)}>
            {items.map((item, index) => (
              <div key={index}>{renderItem(item)}</div>
            ))}
          </div>
        ) : (
          <EmptyState type={type} />
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ArchivePagination
          pagination={pagination}
          filters={filters}
          basePath={`/${type}`}
        />
      )}
    </div>
  );
}

function getLayoutClasses(layout: string): string {
  switch (layout) {
    case 'list':
      return 'space-y-6';
    case 'magazine':
      return 'grid grid-cols-1 md:grid-cols-12 gap-6';
    default:  // grid
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }
}

function EmptyState({ type }: { type: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>No {type} found. Try adjusting your search or filters.</p>
    </div>
  );
}
```

### src/components/layouts/article-layout.tsx (NEW)

```tsx
/**
 * Universal layout for individual article/item pages
 * Handles: breadcrumbs, header, content, footer, navigation, related items
 */

import { getContainerClasses, TYPOGRAPHY, SPACING } from '@/lib/design-tokens';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ShareButtons } from '@/components/share-buttons';
import { Badge } from '@/components/ui/badge';
import { SITE_URL } from '@/lib/site-config';

interface ArticleLayoutProps<T> {
  type: 'blog' | 'project';
  item: {
    title: string;
    summary: string;
    slug: string;
    publishedAt: string;
    updatedAt?: string;
    tags?: string[];
    sources?: Array<{ href: string; label: string }>;
  };
  navigation: NavigationData;
  related: T[];
  analytics?: AnalyticsData;
  children: React.ReactNode;
  sidebarSlot?: React.ReactNode;
}

export function ArticleLayout<T>({
  type,
  item,
  navigation,
  related,
  analytics,
  children,
  sidebarSlot,
}: ArticleLayoutProps<T>) {
  const url = `${SITE_URL}/${type === 'blog' ? 'blog' : 'projects'}/${item.slug}`;
  
  return (
    <article className={getContainerClasses('prose')} data-url={url}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: type === 'blog' ? 'Blog' : 'Projects', href: `/${type === 'blog' ? 'blog' : 'projects'}` },
        { label: item.title },
      ]} />

      {/* Header */}
      <header className="space-y-6">
        {/* Metadata */}
        <div className="text-sm text-muted-foreground">
          <time dateTime={item.publishedAt}>
            {new Date(item.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {item.updatedAt && (
            <span className="ml-2">
              <span aria-hidden>•</span> Updated{' '}
              {new Date(item.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className={TYPOGRAPHY.h1.article}>{item.title}</h1>

        {/* Summary */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {item.summary}
        </p>

        {/* Tags and Analytics */}
        {(item.tags || analytics) && (
          <div className="flex flex-wrap items-center gap-2">
            {analytics?.views !== undefined && (
              <Badge variant="outline">
                {analytics.views.toLocaleString()} {analytics.views === 1 ? 'view' : 'views'}
              </Badge>
            )}
            {item.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="mt-12 space-y-8">
        {/* Share Buttons */}
        <div className="border-t pt-8">
          <ShareButtons
            url={url}
            title={item.title}
            postId={(item as any).id}
            initialShareCount={analytics?.shares ?? 0}
          />
        </div>

        {/* Sources */}
        {item.sources && item.sources.length > 0 && (
          <div className="border-t pt-6">
            <h2 className={`text-sm uppercase tracking-wide text-muted-foreground ${TYPOGRAPHY.h2.standard}`}>
              Sources
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {item.sources.map((source) => (
                <li key={source.href}>
                  <a
                    className="underline underline-offset-4 hover:text-primary"
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Items */}
        {related.length > 0 && (
          <div className="border-t pt-8">
            <RelatedItemsSection items={related} type={type} />
          </div>
        )}
      </footer>
    </article>
  );
}
```

### src/components/layouts/archive-filters.tsx (NEW)

```tsx
/**
 * Unified filters component for archive pages
 * Merges BlogFilters + ActiveFilters into single component
 */

import { BlogSearchForm } from '@/components/blog-search-form';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ArchiveFiltersProps {
  filters: {
    query?: string;
    tag?: string;
    readingTime?: string;
    [key: string]: string | undefined;
  };
  type: string;
  tagList?: string[];
}

export function ArchiveFilters({ filters, type, tagList }: ArchiveFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="space-y-4">
      {/* Search Form */}
      <BlogSearchForm
        query={filters.query}
        tag={filters.tag}
        readingTime={filters.readingTime}
      />

      {/* Filter Dropdowns (if applicable) */}
      {tagList && tagList.length > 0 && (
        <div className="flex gap-2">
          {/* Tag dropdown, reading time dropdown, etc. */}
        </div>
      )}

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.tag && (
            <Badge variant="secondary">
              Tag: {filters.tag}
              <Link href={`/${type}`} className="ml-1">×</Link>
            </Badge>
          )}
          {filters.query && (
            <Badge variant="secondary">
              Search: {filters.query}
              <Link href={`/${type}`} className="ml-1">×</Link>
            </Badge>
          )}
          <Link href={`/${type}`} className="text-sm text-primary hover:underline">
            Clear all
          </Link>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 Migration Plan

### Phase 1: Foundation (Week 1)
**Goal:** Create new abstractions without breaking anything

1. **Create new library functions**
   - [ ] `src/lib/archive.ts` - Archive helpers with tests
   - [ ] `src/lib/metadata.ts` - Enhanced metadata helpers
   - [ ] `src/lib/article.ts` - Article helpers with tests
   - [ ] Keep all existing lib functions (no deletions)

2. **Create new layout components**
   - [ ] `src/components/layouts/archive-layout.tsx`
   - [ ] `src/components/layouts/article-layout.tsx`
   - [ ] `src/components/layouts/archive-filters.tsx`
   - [ ] `src/components/layouts/archive-pagination.tsx`

3. **Documentation**
   - [ ] Document new patterns in `/docs/architecture/`
   - [ ] Write migration guide for future archive types
   - [ ] Create comparison doc (before/after examples)

4. **Testing**
   - [ ] Unit tests for archive helpers
   - [ ] Unit tests for article helpers
   - [ ] Integration tests for layout components

### Phase 2: Blog Refactor (Week 2)
**Goal:** Refactor blog pages to use new patterns

1. **Blog list page**
   - [ ] Refactor `/blog/page.tsx` (248 → ~80 lines)
   - [ ] Use `ArchiveLayout` component
   - [ ] Use `getArchiveData()` helper
   - [ ] Verify all features: search, filters, pagination, layouts
   - [ ] Test mobile responsiveness

2. **Blog post page**
   - [ ] Refactor `/blog/[slug]/page.tsx` (311 → ~120 lines)
   - [ ] Use `ArticleLayout` component
   - [ ] Use `getArticleData()` helper
   - [ ] Verify all features: TOC, related posts, comments, sharing
   - [ ] Test swipeable navigation

3. **Verification**
   - [ ] Run all existing tests
   - [ ] Manual QA of all blog features
   - [ ] Check Lighthouse scores (no regression)
   - [ ] Validate SEO metadata and JSON-LD

### Phase 3: Projects Refactor (Week 3)
**Goal:** Apply same patterns to projects

1. **Projects list page**
   - [ ] Refactor `/projects/page.tsx` (121 → ~60 lines)
   - [ ] Use `ArchiveLayout` component
   - [ ] Integrate GitHub heatmap into layout
   - [ ] Test responsive grid

2. **Projects detail page** (if needed)
   - [ ] Create `/projects/[slug]/page.tsx` using `ArticleLayout`
   - [ ] Or enhance project cards if detail pages not needed

3. **Verification**
   - [ ] Test GitHub heatmap integration
   - [ ] Verify project card rendering
   - [ ] Check responsive layouts

### Phase 4: Cleanup & Documentation (Week 4)
**Goal:** Remove old code, finalize documentation

1. **Code cleanup**
   - [ ] Remove deprecated functions from old libs
   - [ ] Merge `BlogFilters` + `ActiveFilters` → `ArchiveFilters`
   - [ ] Remove unused components
   - [ ] Update imports across codebase

2. **Documentation updates**
   - [ ] Update `/docs/blog/` guides
   - [ ] Update component documentation
   - [ ] Create `/docs/architecture/archive-pattern.md`
   - [ ] Create `/docs/architecture/article-pattern.md`
   - [ ] Archive old docs to `/docs/archive/`

3. **Final verification**
   - [ ] Full regression test suite
   - [ ] Accessibility audit
   - [ ] Performance benchmarking
   - [ ] SEO validation

---

## ✅ Success Criteria

### Code Metrics
- [ ] Blog list page: < 100 lines (target: ~80)
- [ ] Blog post page: < 150 lines (target: ~120)
- [ ] Projects page: < 80 lines (target: ~60)
- [ ] Zero breaking changes to user-facing features
- [ ] 100% test coverage for new lib functions

### Quality Metrics
- [ ] All existing tests pass
- [ ] No Lighthouse score regression
- [ ] No accessibility regressions
- [ ] SEO metadata unchanged (same output)
- [ ] Performance: Same or better page load times

### Maintainability Metrics
- [ ] Can add new archive type in < 100 lines
- [ ] Clear separation of concerns (data/logic/UI)
- [ ] Comprehensive documentation for patterns
- [ ] Type-safe configs prevent common errors

---

## 🎁 Benefits

### For Developers
- **67% less code** in page components
- **Reusable patterns** for future archives
- **Easy to test** business logic separately
- **Type-safe configs** catch errors early
- **Clear conventions** for new features

### For Users
- **Zero breaking changes** - all features work
- **Consistent UX** across archive types
- **Better performance** (same or faster)
- **Improved accessibility** (enforced in layouts)

### For Future
- **Easy to add** new archive types (/writing, /notes, /bookmarks)
- **Easy to extend** with new features (sorting, advanced filters)
- **Easy to maintain** with clear patterns and documentation

---

## 🚀 Next Steps

1. **Review this plan** - Get feedback on approach
2. **Start Phase 1** - Create foundation (1 week)
3. **Test foundation** - Ensure helpers work correctly
4. **Phase 2 & 3** - Refactor blog and projects (2 weeks)
5. **Phase 4** - Cleanup and document (1 week)

**Total Estimated Time:** 4 weeks with testing and documentation

---

## 📚 References

- Current blog architecture: `/docs/blog/architecture.md`
- Design tokens: `/src/lib/design-tokens.ts`
- Component documentation: `/docs/components/`
- Next.js App Router patterns: [Next.js Docs](https://nextjs.org/docs/app)

---

**Document Status:** Draft for review  
**Last Updated:** November 10, 2025
