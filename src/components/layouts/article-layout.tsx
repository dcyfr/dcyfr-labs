/**
 * Article Layout Component
 * 
 * Universal wrapper for individual item pages (blog posts, project details).
 * Provides consistent structure with header, content, and footer sections.
 * 
 * @example
 * ```tsx
 * <ArticleLayout
 *   header={<ArticleHeader title={post.title} date={post.publishedAt} tags={post.tags} />}
 *   footer={<ArticleFooter relatedItems={related} shareUrl={shareUrl} />}
 * >
 *   <MDX source={post.content} />
 * </ArticleLayout>
 * ```
 */

import { CONTAINER_WIDTHS, SPACING, CONTAINER_VERTICAL_PADDING } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export interface ArticleLayoutProps {
  /** Article header (title, metadata, badges) */
  header?: React.ReactNode;
  
  /** Main content */
  children: React.ReactNode;
  
  /** Article footer (share, related, sources) */
  footer?: React.ReactNode;
  
  /** Use prose container width (default: true) */
  useProseWidth?: boolean;
  
  /** Custom className for container */
  className?: string;
  
  /** Custom className for content wrapper */
  contentClassName?: string;
}

export function ArticleLayout({
  header,
  children,
  footer,
  useProseWidth = true,
  className,
  contentClassName,
}: ArticleLayoutProps) {
  const containerWidth = useProseWidth ? CONTAINER_WIDTHS.prose : CONTAINER_WIDTHS.standard;

  return (
    <article className={cn(containerWidth, "mx-auto px-4 sm:px-6 md:px-8", CONTAINER_VERTICAL_PADDING, className)}>
      {/* Header */}
      {header && (
        <header className="mb-8 md:mb-10">
          {header}
        </header>
      )}

      {/* Content */}
      <div className={cn(SPACING.content, contentClassName)}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <footer className="mt-12 md:mt-16 pt-8 border-t">
          {footer}
        </footer>
      )}
    </article>
  );
}
