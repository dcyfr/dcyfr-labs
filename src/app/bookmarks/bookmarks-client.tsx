"use client";

import * as React from "react";
import Link from "next/link";
import type { Post } from "@/data/posts";
import { PostList } from "@/components/blog/post/post-list";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, BookmarkX } from "lucide-react";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { TYPOGRAPHY, SPACING } from "@/lib/design-tokens";

interface BookmarksClientProps {
  posts: Post[];
}

/**
 * Bookmarks Client Component
 * 
 * Handles client-side bookmark filtering and interactions.
 * Receives all posts from server component, filters by bookmarked slugs.
 * 
 * Features:
 * - Filters posts based on localStorage bookmarks
 * - Clear all bookmarks with confirmation
 * - Empty state with link to blog
 * - Real-time sync across tabs via storage event
 */
export function BookmarksClient({ posts }: BookmarksClientProps) {
  const { bookmarks, clearBookmarks, count } = useBookmarks();
  const [layout] = React.useState<"grid" | "list" | "magazine" | "compact">("magazine");

  // Filter posts to only show bookmarked ones
  const bookmarkedPosts = React.useMemo(() => {
    return posts.filter(post => bookmarks.includes(post.slug));
  }, [posts, bookmarks]);

  const handleClearAll = () => {
    if (window.confirm(`Clear all ${count} bookmarked ${count === 1 ? "post" : "posts"}? This action cannot be undone.`)) {
      clearBookmarks();
      toast.success("All bookmarks cleared");
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className={SPACING.section}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={TYPOGRAPHY.h1.standard}>
              Bookmarks
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              {count === 0 
                ? "No bookmarked posts yet"
                : `${count} ${count === 1 ? "post" : "posts"} saved for later`
              }
            </p>
          </div>

          {/* Clear All Button */}
          {count > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Post List or Empty State */}
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <BookmarkX className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className={TYPOGRAPHY.h2.standard}>No bookmarks yet</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Bookmark posts you want to read later by clicking the bookmark icon on any post card.
          </p>
          <Button asChild>
            <Link href="/blog">
              Browse Blog Posts
            </Link>
          </Button>
        </div>
      ) : (
        <div className={SPACING.section}>
          <PostList 
            posts={bookmarkedPosts} 
            layout={layout}
            emptyMessage="No bookmarked posts found"
          />
        </div>
      )}

      {/* Info Banner */}
      {count > 0 && (
        <div className="mt-8 p-4 rounded-lg border bg-muted/50 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Bookmarks are stored locally</p>
            <p>
              Your bookmarks are saved in your browser&apos;s local storage and will persist across sessions. 
              They won&apos;t sync across devices or browsers.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
