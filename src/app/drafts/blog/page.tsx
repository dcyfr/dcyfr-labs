/**
 * Draft Blog Posts Overview - Developer Tools
 * 
 * Lists all draft blog posts for easy discovery and testing during development.
 * Only accessible in development mode.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Clock, Tag } from "lucide-react";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { TYPOGRAPHY, SPACING, PAGE_LAYOUT } from "@/lib/design-tokens";
import { assertDevOr404 } from "@/lib/dev-only";
import { getAllPosts } from "@/lib/blog";
import type { Post } from "@/data/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Draft Blog Posts",
  description: "Overview of all draft blog posts in development",
  path: "/drafts/blog",
});

// Force dynamic rendering
export const dynamic = "force-dynamic";

function DraftPostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className={`${TYPOGRAPHY.h3.standard} leading-tight`}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <Badge variant="outline" className="shrink-0">Draft</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.summary}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime.text}
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span>{post.tags.length} {post.tags.length === 1 ? "tag" : "tags"}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/blog/${post.slug}`}>View Post</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DraftBlogPostsOverview() {
  // Only allow in development
  assertDevOr404();

  // Get all posts including drafts (getAllPosts filters drafts in production)
  const allPosts = getAllPosts();
  const draftPosts = allPosts.filter((post) => post.draft);

  return (
    <PageLayout>
      <PageHero
        title="Draft Blog Posts"
        description="Overview of all draft blog posts. These posts are only visible in development and will not appear in preview or production environments."
        image={
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <Badge variant="secondary">Development Only</Badge>
          </div>
        }
      />

      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.subsection}>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{draftPosts.length}</div>
              <div className="text-sm text-muted-foreground">Draft Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{allPosts.length - draftPosts.length}</div>
              <div className="text-sm text-muted-foreground">Published Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{allPosts.length}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
        </div>

        {/* Draft Posts List */}
        {draftPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className={`${TYPOGRAPHY.h3.standard} mb-2`}>No draft posts found</p>
              <p className="text-sm">
                Create a new blog post with <code className="px-1 py-0.5 rounded bg-muted">draft: true</code> in the
                frontmatter to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {draftPosts.length} Draft {draftPosts.length === 1 ? "Post" : "Posts"}
              </h2>
            </div>
            <div className="grid gap-4">
              {draftPosts.map((post) => (
                <DraftPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">About Draft Posts</p>
            <p>
              Draft posts use the <code className="px-1 py-0.5 rounded bg-muted">draft: true</code> flag
              in their frontmatter and are automatically filtered out in production builds.
            </p>
            <p>
              To publish a draft, simply remove the <code className="px-1 py-0.5 rounded bg-muted">draft</code> field
              or set it to <code className="px-1 py-0.5 rounded bg-muted">false</code> in the MDX frontmatter.
            </p>
          </CardContent>
        </Card>
        </div>
      </section>
    </PageLayout>
  );
}
