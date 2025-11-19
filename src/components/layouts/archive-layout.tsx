/**
 * Archive Layout Component
 * 
 * Universal wrapper for list/grid pages (blog, projects, archives).
 * Provides consistent structure with header, filters, content, and pagination.
 * Now uses PageHero component internally for consistent hero sections.
 * 
 * @example
 * ```tsx
 * <ArchiveLayout
 *   title="Blog Posts"
 *   description="All my writing about web development"
 *   filters={<ArchiveFilters {...filterProps} />}
 *   pagination={<ArchivePagination {...paginationProps} />}
 * >
 *   <PostList posts={posts} />
 * </ArchiveLayout>
 * ```
 */

import { CONTAINER_WIDTHS, SPACING, CONTAINER_VERTICAL_PADDING, CONTAINER_PADDING } from '@/lib/design-tokens';
import { PageHero } from '@/components/layouts/page-hero';
import { cn } from '@/lib/utils';

export interface ArchiveLayoutProps {
  /** Page title */
  title: string;
  
  /** Page description (optional) */
  description?: string;
  
  /** Filter controls (optional) */
  filters?: React.ReactNode;
  
  /** Main content */
  children: React.ReactNode;
  
  /** Pagination controls (optional) */
  pagination?: React.ReactNode;
  
  /** Item count to display in header (optional) */
  itemCount?: number;
  
  /** Custom className for container */
  className?: string;
  
  /** Custom className for content section */
  contentClassName?: string;
}

export function ArchiveLayout({
  title,
  description,
  filters,
  children,
  pagination,
  itemCount,
  className,
  contentClassName,
}: ArchiveLayoutProps) {
  return (
    <>
      {/* Header using PageHero for consistency */}
      <PageHero
        title={title}
        description={description}
        itemCount={itemCount}
      />
      
      <div className={cn("mx-auto", CONTAINER_WIDTHS.standard, CONTAINER_PADDING, "pb-14 md:pb-20", className)}>
        {/* Filters */}
        {filters && (
          <div className="mb-8">
            {filters}
          </div>
        )}

        {/* Content */}
        <div className={cn(SPACING.content, contentClassName)}>
          {children}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-12">
            {pagination}
          </div>
        )}
      </div>
    </>
  );
}
