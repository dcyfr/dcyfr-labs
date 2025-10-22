import Link from "next/link";
import type { Post } from "@/data/posts";
import { PostBadges } from "@/components/post-badges";

interface PostListProps {
  posts: Post[];
  latestSlug?: string;
  hottestSlug?: string;
  titleLevel?: "h2" | "h3";
  emptyMessage?: string;
}

/**
 * Reusable post list component for displaying blog posts consistently
 * Used on homepage, blog list page, and anywhere posts are displayed
 */
export function PostList({ 
  posts, 
  latestSlug,
  hottestSlug,
  titleLevel = "h2",
  emptyMessage = "No posts found."
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const TitleTag = titleLevel;

  return (
    <>
      {posts.map((p) => (
        <article key={p.slug} className="group rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <PostBadges 
              post={p} 
              size="sm"
              isLatestPost={latestSlug === p.slug}
              isHotPost={hottestSlug === p.slug}
            />
            <time dateTime={p.publishedAt}>
              {new Date(p.publishedAt).toLocaleDateString(undefined, { 
                year: "numeric", 
                month: "short", 
                day: "numeric" 
              })}
            </time>
            <span className="hidden md:inline-block">•</span>
            <span>{p.readingTime.text}</span>
            <span className="hidden md:inline-block">•</span>
            <span className="hidden md:inline-block">{p.tags.join(" · ")}</span>
          </div>
          <div className="mt-1">
            <TitleTag className={`font-medium ${titleLevel === "h2" ? "text-lg md:text-xl" : "text-lg"}`}>
              <Link href={`/blog/${p.slug}`}>
                {p.title}
              </Link>
            </TitleTag>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
        </article>
      ))}
    </>
  );
}
