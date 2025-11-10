import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { posts, postsBySeries } from "@/data/posts";
import { getPostByAnySlug } from "@/lib/blog";
import {
  SITE_URL,
  SITE_TITLE,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { CONTAINER_WIDTHS, CONTAINER_VERTICAL_PADDING, CONTAINER_PADDING, TYPOGRAPHY } from "@/lib/design-tokens";
import { MDX } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import { PostBadges } from "@/components/post-badges";
import { getPostViews, getMultiplePostViews } from "@/lib/views";
import { getPostShares } from "@/lib/shares";
import { ReadingProgress } from "@/components/reading-progress";
import { BlogFABMenu } from "@/components/blog-fab-menu";
import { extractHeadings } from "@/lib/toc";
import { RelatedPosts } from "@/components/related-posts";
import { getRelatedPosts } from "@/lib/related-posts";
import { headers } from "next/headers";
import { ShareButtons } from "@/components/share-buttons";
import { GiscusComments } from "@/components/giscus-comments";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SeriesNavigation } from "@/components/series-navigation";
import { SwipeableBlogPost } from "@/components/swipeable-blog-post";
import { PostHeroImage } from "@/components/post-hero-image";
import { ViewTracker } from "@/components/view-tracker";
import {
  getArticleSchema,
  getBreadcrumbSchema,
  getJsonLdScriptProps,
} from "@/lib/json-ld";

// Enable Incremental Static Regeneration with 1 hour revalidation
// Pages are statically generated at build time and revalidated every hour
export const revalidate = 3600; // 1 hour in seconds

// Pre-generate all blog post pages at build time
export async function generateStaticParams() {
  const allParams = [];
  
  // Add current slugs
  for (const post of posts) {
    allParams.push({ slug: post.slug });
  }
  
  // Add previous slugs for redirect pages
  for (const post of posts) {
    if (post.previousSlugs) {
      for (const oldSlug of post.previousSlugs) {
        allParams.push({ slug: oldSlug });
      }
    }
  }
  
  return allParams;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = getPostByAnySlug(slug, posts);
  
  if (!result) return {};
  
  const post = result.post;
  
  // Use hero image for OG if available, otherwise use dynamic generator
  const hasHeroImage = post.image?.url;
  const ogImageUrl = hasHeroImage 
    ? `${SITE_URL}${post.image?.url}`
    : getOgImageUrl(post.title, post.summary);
  const twitterImageUrl = hasHeroImage
    ? `${SITE_URL}${post.image?.url}`
    : getTwitterImageUrl(post.title, post.summary);
  
  // Use hero image dimensions if provided, otherwise use default OG dimensions
  const imageWidth = post.image?.width ?? 1200;
  const imageHeight = post.image?.height ?? 630;
  
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_TITLE,
      images: [
        {
          url: ogImageUrl,
          width: imageWidth,
          height: imageHeight,
          type: hasHeroImage ? "image/jpeg" : "image/png", // hero images typically JPEG
          alt: post.image?.alt ?? `${post.title} — ${SITE_TITLE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [twitterImageUrl],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getPostByAnySlug(slug, posts);
  
  if (!result) {
    notFound();
  }
  
  const { post, needsRedirect, canonicalSlug } = result;
  
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";

  // Get current view count (views are now tracked client-side for anti-spam protection)
  // Client-side tracking happens via ViewTracker component
  const viewCount = await getPostViews(post.id);
  
  // If this is an old slug, redirect to the current one
  if (needsRedirect) {
    redirect(`/blog/${canonicalSlug}`);
  }
  
  // Get share count for this post
  const shareCount = await getPostShares(post.id);
  
  // Extract headings for table of contents
  const headings = extractHeadings(post.body);
  
  // Get related posts based on shared tags
  const relatedPosts = getRelatedPosts(post, posts, 3);
  
  // Get series posts if this post is part of a series
  const seriesPosts = post.series ? postsBySeries[post.series.name] ?? [] : [];
  
  // Get view counts and determine latest/hottest posts
  const viewMap = await getMultiplePostViews(posts.map(p => p.slug));
  
  // Find the post with the most views
  let hottestSlug: string | null = null;
  let maxViews = 0;
  viewMap.forEach((views, slug) => {
    if (views > maxViews) {
      maxViews = views;
      hottestSlug = slug;
    }
  });
  
  // Latest post (most recent, not archived)
  const latestPost = [...posts]
    .filter(p => !p.archived)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))[0];

  // Get previous and next posts for swipe navigation
  // Filter out draft and archived posts, then sort by publish date (newest first)
  const publishedPosts = posts
    .filter(p => !p.draft && !p.archived)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  
  const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : undefined;
  const nextPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : undefined;

  // Enhanced JSON-LD structured data for SEO and AI assistants
  const socialImage = getOgImageUrl(post.title, post.summary);
  
  // Article schema with all recommended properties
  const articleSchema = getArticleSchema(post, viewCount, socialImage);
  
  // Breadcrumb navigation for better SEO
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);
  
  // Combine schemas in a graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema],
  };

  return (
    <>
      {/* Client-side view tracking with anti-spam protection */}
      <ViewTracker postId={post.id} />
      <ReadingProgress />
      <BlogFABMenu headings={headings} />
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <SwipeableBlogPost
        prevSlug={prevPost?.slug}
        nextSlug={nextPost?.slug}
        prevTitle={prevPost?.title}
        nextTitle={nextPost?.title}
      >
        <article className={`mx-auto ${CONTAINER_WIDTHS.prose} ${CONTAINER_VERTICAL_PADDING} ${CONTAINER_PADDING}`} data-url={`${SITE_URL}/blog/${post.slug}`}>
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title }
        ]} />
        <header className="space-y-6">
          {/* Date metadata with improved size and spacing */}
          <div className="text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {post.updatedAt && (
              <span className="ml-2 inline-flex items-center gap-1.5">
                <span aria-hidden>•</span>
                <span>
                  Updated {new Date(post.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </span>
            )}
          </div>

          {/* Title with generous spacing */}
          <h1 className={TYPOGRAPHY.h1.article}>
            {post.title}
          </h1>

          {/* Summary with improved readability */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {post.summary}
          </p>

          {/* Tags and metadata with clear visual separation */}
          <div className="flex flex-wrap items-center gap-2">
            <PostBadges
              post={post}
              isLatestPost={latestPost?.slug === post.slug}
              isHotPost={hottestSlug === post.slug && maxViews > 0}
            />
            <Badge variant="outline">{post.readingTime.text}</Badge>
            {typeof viewCount === "number" && (
              <Badge variant="outline">
                {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
              </Badge>
            )}
            {post.tags.map((t) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        </header>
        
        {/* Hero image - show after header if post has featured image */}
        {post.image && (
          <PostHeroImage
            image={post.image}
            title={post.title}
            priority={true}
          />
        )}
        
        {/* Series navigation - show after header if post is part of a series */}
        {post.series && seriesPosts.length > 0 && (
          <SeriesNavigation currentPost={post} seriesPosts={seriesPosts} />
        )}
        
        <div className="prose mt-8">
          <MDX source={post.body} />
        </div>
        
      {/* Share buttons */}
      <div className="mt-12 border-t pt-8">
        <ShareButtons
          url={`${SITE_URL}/blog/${post.slug}`}
          title={post.title}
          postId={post.id}
          initialShareCount={shareCount ?? 0}
        />
      </div>
      
      {/* Comments section - hidden for draft posts */}
      {!post.draft && <GiscusComments />}
      
      {post.sources && post.sources.length > 0 && (
          <footer className="mt-12 border-t pt-6">
            <h2 className={`text-sm uppercase tracking-wide text-muted-foreground ${TYPOGRAPHY.h2.standard}`}>Sources</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {post.sources.map((source) => (
                <li key={source.href}>
                  <a className="underline underline-offset-4 hover:text-primary" href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
        <RelatedPosts posts={relatedPosts} />
      </article>
      </SwipeableBlogPost>
    </>
  );
}
