import Link from "next/link";
import type { Post } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

/**
 * Props for the RelatedPosts component
 * @typedef {Object} RelatedPostsProps
 * @property {Post[]} posts - Array of related blog posts to display
 */
type RelatedPostsProps = {
  posts: Post[];
};

/**
 * RelatedPosts Component
 *
 * Displays a grid of related blog posts, typically shown at the bottom of a blog post.
 * Used in conjunction with the related posts algorithm that calculates posts sharing tags.
 *
 * Features:
 * - Responsive 3-column grid (1 col mobile, 2 cols tablet, 3 cols desktop)
 * - Post cards with title, summary, tags, and publish date
 * - Reading time estimate display
 * - Interactive hover state with "Read more" indicator
 * - Tag limit (shows first 3, "+N more" badge if additional)
 * - Early exit if no related posts (renders null)
 *
 * @component
 * @param {RelatedPostsProps} props - Component props
 * @param {Post[]} props.posts - Array of related posts to display (typically 1-6 items)
 *
 * @returns {React.ReactElement | null} Grid of post cards or null if empty
 *
 * @example
 * // Display 3 related posts
 * const relatedPosts = [
 *   { slug: "post-1", title: "...", tags: ["react", "typescript"], ...},
 *   { slug: "post-2", title: "...", tags: ["react"], ...},
 *   { slug: "post-3", title: "...", tags: ["typescript"], ...},
 * ];
 * <RelatedPosts posts={relatedPosts} />
 *
 * @styling
 * - Uses Card variant bg-card with hover:bg-accent
 * - Primary color highlight on post title and "Read more" link
 * - Serif font for consistency with blog post titles
 * - Truncated summary at 2 lines (line-clamp-2)
 * - Responsive spacing with gap utilities
 *
 * @accessibility
 * - Links use semantic Next.js Link component
 * - Post dates use time element with dateTime attribute
 * - Decorative bullet (•) has aria-hidden="true"
 * - Arrow icon is not interactive (part of text node)
 * - Hover states visible and announced via CSS transitions
 *
 * @usage
 * Called from blog post template in src/app/blog/[slug]/page.tsx
 * Related posts are calculated in src/lib/blog.ts by matching tags
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 border-t pt-6">
      <h2 className="font-serif text-xl font-semibold mb-4">Related Posts</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="space-y-2">
              <h3 className="font-medium leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.summary}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden>•</span>
                <span>{post.readingTime.text}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-primary pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read more</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
