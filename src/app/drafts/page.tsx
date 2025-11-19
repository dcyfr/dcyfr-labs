/**
 * Drafts Overview - Developer Tools
 * 
 * Consolidated view of all draft content (pages and blog posts) in the application.
 * Only accessible in development mode.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, Tag, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { TYPOGRAPHY, SPACING, PAGE_LAYOUT } from "@/lib/design-tokens";
import { assertDevOr404 } from "@/lib/dev-only";
import { getAllPosts } from "@/lib/blog";
import type { Post } from "@/data/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Drafts",
  description: "Overview of all draft content in development",
  path: "/drafts",
});

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface DraftPage {
  slug: string;
  title: string;
  description: string;
  path: string;
}

// Registry of all draft pages in the application
const DRAFT_PAGES: DraftPage[] = [
  {
    slug: "team",
    title: "Team",
    description: "Meet the dynamic duo: Drew and DCYFR, building secure and innovative solutions together.",
    path: "/team",
  },
  // Add more draft pages here as they are created
];

function DraftPageCard({ page }: { page: DraftPage }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base">{page.title}</CardTitle>
            <CardDescription className="text-xs">{page.path}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 shrink-0">Draft</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {page.description}
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href={page.path}>
            View Page
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DraftPostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`${TYPOGRAPHY.h3.standard} leading-tight flex-1`}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h3>
            <Badge variant="outline" className="shrink-0">Draft</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.summary}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
          <div className="flex flex-wrap gap-1.5">
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
        )}

        {/* Actions */}
        <Button asChild size="sm" className="w-full">
          <Link href={`/blog/${post.slug}`}>View Post</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DraftsOverview() {
  // Only allow in development
  assertDevOr404();

  // Get all posts including drafts
  const allPosts = getAllPosts();
  const draftPosts = allPosts.filter((post) => post.draft);

  const totalDrafts = DRAFT_PAGES.length + draftPosts.length;

  return (
    <PageLayout>
      <PageHero
        title="Drafts"
        description="Overview of all draft content in the application. Draft pages and blog posts are only visible in development and will not render in preview or production environments."
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
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{totalDrafts}</div>
                <div className="text-sm text-muted-foreground">Total Drafts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{DRAFT_PAGES.length}</div>
                <div className="text-sm text-muted-foreground">Draft Pages</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{draftPosts.length}</div>
                <div className="text-sm text-muted-foreground">Draft Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{allPosts.length - draftPosts.length}</div>
                <div className="text-sm text-muted-foreground">Published</div>
              </CardContent>
            </Card>
          </div>

          {/* Draft Pages Section */}
          {DRAFT_PAGES.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <h2 className={TYPOGRAPHY.h2.standard}>
                  Draft Pages ({DRAFT_PAGES.length})
                </h2>
                <Button asChild variant="outline" size="sm">
                  <Link href="/drafts/pages">View All</Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {DRAFT_PAGES.map((page) => (
                  <DraftPageCard key={page.slug} page={page} />
                ))}
              </div>
            </div>
          )}

          {/* Draft Blog Posts Section */}
          {draftPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={TYPOGRAPHY.h2.standard}>
                  Draft Blog Posts ({draftPosts.length})
                </h2>
                <Button asChild variant="outline" size="sm">
                  <Link href="/drafts/blog">View All</Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {draftPosts.map((post) => (
                  <DraftPostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalDrafts === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className={`${TYPOGRAPHY.h3.standard} mb-2`}>No drafts found</p>
                <p className="text-sm">
                  Create draft pages with <code className="px-1 py-0.5 rounded bg-muted">IS_DRAFT = true</code> or
                  blog posts with <code className="px-1 py-0.5 rounded bg-muted">draft: true</code> in frontmatter.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="border-blue-500/50 bg-blue-500/5 mt-8">
            <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">About Drafts</p>
              <p>
                <strong>Draft Pages:</strong> Use <code className="px-1 py-0.5 rounded bg-muted">const IS_DRAFT = true</code> at
                the top of your page component. These pages return null in non-development environments.
              </p>
              <p>
                <strong>Draft Posts:</strong> Add <code className="px-1 py-0.5 rounded bg-muted">draft: true</code> to
                the MDX frontmatter. These posts are filtered out during build time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
