import type { Metadata } from "next";
import Link from "next/link";
import { posts, postTagCounts } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import { PostList } from "@/components/post-list";
import { BlogSearchForm } from "@/components/blog-search-form";
import { getPostBadgeMetadata } from "@/lib/post-badges";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";

const pageTitle = "Blog";
const pageDescription = "Articles about cybersecurity and secure software development.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    url: `${SITE_URL}/blog`,
    siteName: SITE_TITLE,
    type: "website",
    images: [
      {
        url: getOgImageUrl(pageTitle, pageDescription),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${pageTitle} — ${SITE_TITLE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    images: [getTwitterImageUrl(pageTitle, pageDescription)],
  },
};

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
};

const buildTagHref = (tag: string, query: string) => {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (query) params.set("q", query);
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
};

const describeResults = (count: number, tag: string, query: string) => {
  const noun = count === 1 ? "post" : "posts";
  const pieces: string[] = [`${count} ${noun}`];
  if (query) {
    pieces.push(`matching “${query}”`);
  }
  if (tag) {
    pieces.push(`tagged “${tag}”`);
  }
  return pieces.join(" ");
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const tag = getParamValue(resolvedSearchParams.tag);
  const query = getParamValue(resolvedSearchParams.q);
  const normalizedQuery = query.trim().toLowerCase();
  const all = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const tagList = Object.entries(postTagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  const filtered = all.filter((post) => {
    const matchesTag = !tag || post.tags.includes(tag);
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;
    const haystack = `${post.title} ${post.summary} ${post.tags.join(" ")} ${post.body}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
  const hasActiveFilters = Boolean(tag || normalizedQuery);
  const clearHref = "/blog";
  
  // Get badge metadata (latest and hottest posts)
  const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);
  
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">Blog</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {pageDescription}
        </p>
        {hasActiveFilters && (
          <p className="text-sm text-muted-foreground">
            Showing {describeResults(filtered.length, tag, query)}. {" "}
            <Link href={clearHref} className="underline underline-offset-4">
              Clear filters
            </Link>
            .
          </p>
        )}
      </div>

      <BlogSearchForm query={query} tag={tag} />

      {/* Tag Filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge asChild variant={tag ? "outline" : "secondary"}>
          <Link href={buildTagHref("", query)}>All</Link>
        </Badge>
        {tagList.map((t) => (
          <Badge key={t} asChild variant={tag === t ? "secondary" : "outline"}>
            <Link href={buildTagHref(t, query)}>{t}</Link>
          </Badge>
        ))}
      </div>

      {/* Posts List */}
      <div className="mt-8 space-y-6">
        <PostList 
          posts={filtered}
          latestSlug={latestSlug ?? undefined}
          hottestSlug={hottestSlug ?? undefined}
          titleLevel="h2"
          emptyMessage="No posts found. Try adjusting your search or filters."
        />
      </div>
    </div>
  );
}
