/**
 * Article Header Component
 * 
 * Standardized header for individual item pages with title, date, tags, and badges.
 * Provides consistent metadata display across all article-type pages.
 * 
 * @example
 * ```tsx
 * <ArticleHeader
 *   title="Building a Design System"
 *   date={new Date('2025-11-10')}
 *   tags={['react', 'design', 'typescript']}
 *   badges={<PostBadges draft={false} archived={false} />}
 *   metadata="5 min read · 1,234 views"
 * />
 * ```
 */

import { TYPOGRAPHY } from '@/lib/design-tokens';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ArticleHeaderProps {
  /** Article title */
  title: string;
  
  /** Published date (optional) */
  date?: Date;
  
  /** Tags/keywords (optional) */
  tags?: string[];
  
  /** Custom badges (e.g., Draft, New, etc.) */
  badges?: React.ReactNode;
  
  /** Additional metadata string (e.g., "5 min read · 1,234 views") */
  metadata?: string;
  
  /** Date format (default: "MMMM d, yyyy") */
  dateFormat?: 'short' | 'long';
  
  /** Show tags inline vs below title (default: below) */
  inlineTags?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Function to generate tag URLs (returns URL string) */
  onTagClick?: (tag: string) => string;
}

export function ArticleHeader({
  title,
  date,
  tags = [],
  badges,
  metadata,
  dateFormat = 'long',
  inlineTags = false,
  className,
  onTagClick,
}: ArticleHeaderProps) {
  /**
   * Format date for display
   */
  const formattedDate = date 
    ? date.toLocaleDateString('en-US', 
        dateFormat === 'long' 
          ? { year: 'numeric', month: 'long', day: 'numeric' }
          : { year: 'numeric', month: 'short', day: 'numeric' }
      )
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Badges */}
      {badges && (
        <div className="flex flex-wrap gap-2">
          {badges}
        </div>
      )}

      {/* Title */}
      <h1 className={TYPOGRAPHY.h1.article}>
        {title}
      </h1>

      {/* Metadata Row */}
      {(date || metadata) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          {formattedDate && (
            <time dateTime={date?.toISOString()}>
              {formattedDate}
            </time>
          )}
          
          {metadata && (
            <>
              {formattedDate && <span aria-hidden="true">·</span>}
              <span>{metadata}</span>
            </>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className={cn(
          "flex flex-wrap items-center gap-2",
          !inlineTags && "mt-4"
        )}>
          {!inlineTags && (
            <span className="text-sm text-muted-foreground">
              Tagged:
            </span>
          )}
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
      )}
    </div>
  );
}
