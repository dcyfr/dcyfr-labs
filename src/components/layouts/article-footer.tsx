/**
 * Article Footer Component
 * 
 * Standardized footer for individual item pages with share buttons, sources, and related content.
 * Provides consistent navigation and engagement patterns.
 * 
 * @example
 * ```tsx
 * <ArticleFooter
 *   shareUrl="https://cyberdrew.dev/blog/my-post"
 *   shareTitle="My Blog Post"
 *   relatedItems={[{title: "Related Post", slug: "related"}]}
 *   renderRelatedItem={(item) => <PostCard post={item} />}
 * />
 * ```
 */

import { TYPOGRAPHY, SPACING } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export interface ArticleFooterProps<T = Record<string, unknown>> {
  /** Share URL (enables share section) */
  shareUrl?: string;
  
  /** Share title */
  shareTitle?: string;
  
  /** Custom share component */
  shareComponent?: React.ReactNode;
  
  /** Tags/keywords (optional) */
  tags?: string[];
  
  /** Function to generate tag URLs (returns URL string) */
  onTagClick?: (tag: string) => string;
  
  /** Sources/references links (optional) */
  sources?: Array<{
    title: string;
    url: string;
  }>;
  
  /** Related items to display (optional) */
  relatedItems?: T[];
  
  /** Render function for related items */
  renderRelatedItem?: (item: T, index: number) => React.ReactNode;
  
  /** Related section title (default: "Related Articles") */
  relatedTitle?: string;
  
  /** Custom footer content (optional) */
  children?: React.ReactNode;
  
  /** Custom className */
  className?: string;
}

export function ArticleFooter<T>({
  shareUrl,
  shareComponent,
  tags = [],
  onTagClick,
  sources,
  relatedItems = [],
  renderRelatedItem,
  relatedTitle = "Related Articles",
  children,
  className,
}: ArticleFooterProps<T>) {
  const hasShare = shareUrl || shareComponent;
  const hasTags = tags.length > 0;
  const hasSources = sources && sources.length > 0;
  const hasRelated = relatedItems.length > 0 && renderRelatedItem;
  const hasContent = hasShare || hasTags || hasSources || hasRelated || children;

  if (!hasContent) {
    return null;
  }

  return (
    <div className={cn(SPACING.section, className)}>
      {/* Tags Section */}
      {hasTags && (
        <section className={SPACING.subsection}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Tagged:
            </span>
            {tags.map((tag) => {
              const tagUrl = onTagClick?.(tag);
              const badgeContent = (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    tagUrl && "cursor-pointer hover:bg-secondary/80 transition-colors"
                  )}
                >
                  {tag}
                </Badge>
              );
              
              return tagUrl ? (
                <Link key={tag} href={tagUrl}>
                  {badgeContent}
                </Link>
              ) : badgeContent;
            })}
          </div>
        </section>
      )}

      {/* Share Section */}
      {hasShare && (
        <section className={SPACING.subsection}>
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-4")}>
            Share this article
          </h2>
          {shareComponent || (
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">
                Share functionality will be rendered by the parent component
              </p>
            </div>
          )}
        </section>
      )}

      {/* Sources Section */}
      {hasSources && (
        <section className={SPACING.subsection}>
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-4")}>
            Sources & References
          </h2>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {source.title}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Items Section */}
      {hasRelated && (
        <section className={SPACING.subsection}>
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-6")}>
            {relatedTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((item, index) => renderRelatedItem(item, index))}
          </div>
        </section>
      )}

      {/* Custom Footer Content */}
      {children && (
        <section className={SPACING.subsection}>
          {children}
        </section>
      )}
    </div>
  );
}
