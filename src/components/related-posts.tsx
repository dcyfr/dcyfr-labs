import Link from "next/link";
import type { Post } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

type RelatedPostsProps = {
  posts: Post[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-16 border-t pt-8">
      <h2 className="text-xl font-semibold mb-6">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
