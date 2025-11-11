/**
 * Archive Layout Component
 * 
 * Universal wrapper for list/grid pages (blog, projects, archives).
 * Provides consistent structure with header, filters, content, and pagination.
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

import { CONTAINER_WIDTHS, TYPOGRAPHY, SPACING, CONTAINER_VERTICAL_PADDING } from '@/lib/design-tokens';
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
    <div className={cn("mx-auto", CONTAINER_WIDTHS.standard, "px-4 sm:px-6 md:px-8", CONTAINER_VERTICAL_PADDING, SPACING.section, className)}>
      {/* Header */}
      <header className={SPACING.subsection}>
        <h1 className={TYPOGRAPHY.h1.standard}>
          {title}
        </h1>
        
        {description && (
          <p className={cn(TYPOGRAPHY.description, "mt-4")}>
            {description}
            {itemCount !== undefined && (
              <span className="text-muted-foreground">
                {' '}({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </p>
        )}
      </header>

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
  );
}
