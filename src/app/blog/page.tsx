import type { Metadata } from "next";
import { posts, type Post } from "@/data/posts";
import { PostList } from "@/components/post-list";
import { BlogFilters } from "@/components/blog-filters";
import { ArchiveLayout } from "@/components/layouts/archive-layout";
import { ArchivePagination } from "@/components/layouts/archive-pagination";
import { getArchiveData } from "@/lib/archive";
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
const pageDescription = "Articles on web development, cybersecurity, artificial intelligence, and more.";
const POSTS_PER_PAGE = 12;

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

interface BlogPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // Resolve search parameters
  const resolvedParams = (await searchParams) ?? {};
  const getParam = (key: string) => {
    const value = resolvedParams[key];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };
  
  // Support multiple tags (comma-separated)
  const tagParam = getParam("tag");
  const selectedTags = tagParam ? tagParam.split(",").filter(Boolean) : [];
  const query = getParam("q");
  const readingTime = getParam("readingTime");
  const layoutParam = getParam("layout");
  const layout = (layoutParam === "magazine" || layoutParam === "default") ? layoutParam : "grid";
  
  // Apply reading time filter (custom filter not in Archive pattern)
  const postsWithReadingTimeFilter = readingTime
    ? posts.filter((post) => {
        const minutes = post.readingTime.minutes;
        if (readingTime === "quick") return minutes <= 5;
        if (readingTime === "medium") return minutes > 5 && minutes <= 15;
        if (readingTime === "deep") return minutes > 15;
        return true;
      })
    : posts;
  
  // Apply multiple tag filter manually before Archive pattern
  const postsWithTagFilter = selectedTags.length > 0
    ? postsWithReadingTimeFilter.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      )
    : postsWithReadingTimeFilter;
  
  // Use Archive Pattern for filtering, sorting, pagination (without tag filter)
  const archiveData = getArchiveData<Post>(
    {
      items: postsWithTagFilter,
      searchFields: ["title", "summary", "body"],
      tagField: "tags",
      dateField: "publishedAt",
      itemsPerPage: POSTS_PER_PAGE,
    },
    {
      search: query,
      page: getParam("page"),
    }
  );
  
  // Get badge metadata (latest and hottest posts)
  const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);
  
  // JSON-LD structured data
  const collectionTitle = selectedTags.length > 0 ? `Blog - ${selectedTags.join(", ")}` : pageTitle;
  const collectionDescription = selectedTags.length > 0 
    ? `Articles tagged with "${selectedTags.join('", "')}"` 
    : pageDescription;
  const jsonLd = getBlogCollectionSchema(
    archiveData.allFilteredItems,
    collectionTitle,
    collectionDescription
  );
  
  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      
      <ArchiveLayout
        title={pageTitle}
        description={pageDescription}
        itemCount={archiveData.totalItems}
        filters={
          <BlogFilters 
            selectedTags={selectedTags}
            readingTime={readingTime} 
            tagList={archiveData.availableTags}
            query={query}
          />
        }
        pagination={
          <ArchivePagination
            currentPage={archiveData.currentPage}
            totalPages={archiveData.totalPages}
            hasPrevPage={archiveData.currentPage > 1}
            hasNextPage={archiveData.currentPage < archiveData.totalPages}
          />
        }
      >
        <PostList 
          posts={archiveData.items}
          latestSlug={latestSlug ?? undefined}
          hottestSlug={hottestSlug ?? undefined}
          titleLevel="h2"
          layout={layout}
          emptyMessage="No posts found. Try adjusting your search or filters."
        />
      </ArchiveLayout>
    </>
  );
}
