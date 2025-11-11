/**
 * Layout Components Index
 * 
 * Centralized exports for archive and article layout patterns.
 * 
 * @example
 * ```tsx
 * import { ArchiveLayout, ArchiveFilters, ArchivePagination } from '@/components/layouts';
 * import { ArticleLayout, ArticleHeader, ArticleFooter } from '@/components/layouts';
 * ```
 */

// Archive Pattern Components
export { ArchiveLayout } from './archive-layout';
export type { ArchiveLayoutProps } from './archive-layout';

export { ArchiveFilters } from './archive-filters';
export type { ArchiveFiltersProps } from './archive-filters';

export { ArchivePagination } from './archive-pagination';
export type { ArchivePaginationProps } from './archive-pagination';

// Article Pattern Components
export { ArticleLayout } from './article-layout';
export type { ArticleLayoutProps } from './article-layout';

export { ArticleHeader } from './article-header';
export type { ArticleHeaderProps } from './article-header';

export { ArticleFooter } from './article-footer';
export type { ArticleFooterProps } from './article-footer';
