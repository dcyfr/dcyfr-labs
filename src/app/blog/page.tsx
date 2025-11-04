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
import { getBlogCollectionSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";

const pageTitle = "Blog";
// Optimized meta description (159 characters)
const pageDescription = "In-depth articles on web development, programming, and tech trends.";

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
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // Resolve and parse search parameters
  const resolvedSearchParams = (await searchParams) ?? {};
  const tag = getParamValue(resolvedSearchParams.tag);
  const query = getParamValue(resolvedSearchParams.q);
  const normalizedQuery = query.trim().toLowerCase();
  
  // Sort all posts by date (newest first)
  const allPosts = [...posts].sort((a, b) => 
    a.publishedAt < b.publishedAt ? 1 : -1
  );
  
  // Generate tag list sorted by count
  const tagList = Object.entries(postTagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  
  // Filter posts based on tag and search query
  const filteredPosts = allPosts.filter((post) => {
    const matchesTag = !tag || post.tags.includes(tag);
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;
    
    const haystack = `${post.title} ${post.summary} ${post.tags.join(" ")} ${post.body}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
  
  // Get badge metadata (latest and hottest posts)
  const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);
  
  // Filter state
  const hasActiveFilters = Boolean(tag || normalizedQuery);
  const clearHref = "/blog";
  
  // JSON-LD structured data for blog collection
  const collectionTitle = tag ? `Blog - ${tag}` : pageTitle;
  const collectionDescription = tag 
    ? `Articles tagged with "${tag}"` 
    : pageDescription;
  const jsonLd = getBlogCollectionSchema(filteredPosts, collectionTitle, collectionDescription);
  
  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <div className="mx-auto max-w-5xl py-14 md:py-20">
        {/* Page header */}
        <header className="prose space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {pageDescription}
          </p>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground">
              Showing {describeResults(filteredPosts.length, tag, query)}.{" "}
              <Link href={clearHref} className="underline underline-offset-4">
                Clear filters
              </Link>
              .
            </p>
          )}
        </header>

        {/* Search form */}
        <BlogSearchForm query={query} tag={tag} />

        {/* Tag filters */}
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filter by tag">
          <Badge asChild variant={tag ? "outline" : "secondary"}>
            <Link href={buildTagHref("", query)}>All</Link>
          </Badge>
          {tagList.map((t) => (
            <Badge key={t} asChild variant={tag === t ? "secondary" : "outline"}>
              <Link href={buildTagHref(t, query)}>{t}</Link>
            </Badge>
          ))}
        </nav>

        {/* Blog posts list */}
        <section className="mt-8 space-y-4">
          <PostList 
            posts={filteredPosts}
            latestSlug={latestSlug ?? undefined}
            hottestSlug={hottestSlug ?? undefined}
            titleLevel="h2"
            emptyMessage="No posts found. Try adjusting your search or filters."
          />
        </section>
      </div>
    </>
  );
}
