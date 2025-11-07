import type { Metadata } from "next";
import Link from "next/link";
import { posts, postTagCounts } from "@/data/posts";
import { PostList } from "@/components/post-list";
import { BlogSearchForm } from "@/components/blog-search-form";
import { ActiveFilters } from "@/components/active-filters";
import { BlogFilters } from "@/components/blog-filters";
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
const pageDescription = "Articles about coding, tech, cybersecurity, AI, and personal development.";

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

const buildTagHref = (tag: string, query: string, page?: number, readingTime?: string) => {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (query) params.set("q", query);
  if (page && page > 1) params.set("page", page.toString());
  if (readingTime) params.set("readingTime", readingTime);
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
};

const POSTS_PER_PAGE = 12;

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
  const readingTime = getParamValue(resolvedSearchParams.readingTime);
  const pageParam = getParamValue(resolvedSearchParams.page);
  const currentPage = Math.max(1, parseInt(pageParam) || 1);
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
    
    // Reading time filter
    if (readingTime) {
      const minutes = post.readingTime.minutes;
      if (readingTime === "quick" && minutes > 5) return false;
      if (readingTime === "medium" && (minutes <= 5 || minutes > 15)) return false;
      if (readingTime === "deep" && minutes <= 15) return false;
    }
    
    if (!normalizedQuery) return true;
    
    const haystack = `${post.title} ${post.summary} ${post.tags.join(" ")} ${post.body}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
  
  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
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
      <div className="mx-auto max-w-5xl py-14 md:py-20 px-4 sm:px-6 md:px-8">
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
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({totalPosts} total posts)
            </p>
          )}
        </header>

        {/* Search form */}
        <BlogSearchForm query={query} tag={tag} readingTime={readingTime} />

        {/* Dropdown filters */}
        <BlogFilters 
          tag={tag} 
          readingTime={readingTime} 
          tagList={tagList} 
        />

        {/* Active filters */}
        <ActiveFilters tag={tag} query={query} readingTime={readingTime} />

        {/* Blog posts list */}
        <section className="mt-6 space-y-4">
          <PostList 
            posts={paginatedPosts}
            latestSlug={latestSlug ?? undefined}
            hottestSlug={hottestSlug ?? undefined}
            titleLevel="h2"
            emptyMessage="No posts found. Try adjusting your search or filters."
          />
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
            {currentPage > 1 && (
              <Link
                href={buildTagHref(tag, query, currentPage - 1, readingTime)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
                aria-label="Previous page"
              >
                ← Previous
              </Link>
            )}
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                const showEllipsis = 
                  (page === 2 && currentPage > 3) || 
                  (page === totalPages - 1 && currentPage < totalPages - 2);
                
                if (showEllipsis) {
                  return <span key={page} className="px-2 text-muted-foreground">…</span>;
                }
                
                if (!showPage) return null;
                
                return (
                  <Link
                    key={page}
                    href={buildTagHref(tag, query, page, readingTime)}
                    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors min-h-[44px] min-w-[44px] ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>
            
            {currentPage < totalPages && (
              <Link
                href={buildTagHref(tag, query, currentPage + 1, readingTime)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
                aria-label="Next page"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
