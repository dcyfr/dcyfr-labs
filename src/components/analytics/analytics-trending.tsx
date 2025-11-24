/**
 * Analytics Trending Posts Component
 * 
 * Displays trending posts with views and 24h activity indicators.
 * Extracted from AnalyticsClient.tsx for reusability.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { PostAnalytics } from "@/types/analytics";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnalyticsTrendingProps {
  /** Trending posts to display */
  trending: PostAnalytics[];
  /** Maximum number of posts to show (default: 3) */
  limit?: number;
}

/**
 * Trending posts grid display
 * 
 * Shows top trending posts with 24h activity badges and view counts.
 * 
 * @example
 * ```tsx
 * <AnalyticsTrending
 *   trending={filteredTrending}
 *   limit={3}
 * />
 * ```
 */
export function AnalyticsTrending({ trending, limit = 3 }: AnalyticsTrendingProps) {
  if (!trending || trending.length === 0) {
    return null;
  }

  const displayPosts = trending.slice(0, limit);

  return (
    <div className="mb-6">
      <h2 className={cn("text-base", "font-semibold", "mb-3")}>Trending Posts</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {displayPosts.map((post) => (
          <Card key={post.slug} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-sm line-clamp-2 flex-1 hover:underline"
                >
                  {post.title}
                </Link>
                <div className="flex flex-col gap-1 shrink-0">
                  {post.views24h > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1 justify-center text-xs px-1.5 py-0">
                      <Flame className="h-3 w-3" />
                      {post.views24h}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs px-1.5 py-0 text-center">
                    {post.views}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.readingTime?.text || `${post.readingTime?.minutes || 0} min read`}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline px-2 py-1 -mr-2 rounded"
                >
                  View →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
