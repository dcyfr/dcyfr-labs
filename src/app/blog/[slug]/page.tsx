import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { posts } from "@/data/posts";
import { getPostByAnySlug } from "@/lib/blog";
import {
  SITE_URL,
  SITE_TITLE,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { MDX } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import { PostBadges } from "@/components/post-badges";
import { getPostViews, incrementPostViews, getMultiplePostViews } from "@/lib/views";
import { ReadingProgress } from "@/components/reading-progress";
import { BlogFABMenu } from "@/components/blog-fab-menu";
import { extractHeadings } from "@/lib/toc";
import { RelatedPosts } from "@/components/related-posts";
import { getRelatedPosts } from "@/lib/related-posts";
import { headers } from "next/headers";
import { ShareButtons } from "@/components/share-buttons";
import { GiscusComments } from "@/components/giscus-comments";
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
  const imageUrl = getOgImageUrl(post.title, post.summary);
  
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
          url: imageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${post.title} — ${SITE_TITLE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [getTwitterImageUrl(post.title, post.summary)],
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

  // Increment views using post ID (stable identifier, not affected by slug changes)
  const incrementedViews = await incrementPostViews(post.id);
  
  // If this is an old slug, redirect to the current one
  // Views are tracked before redirect so old URL accesses are counted
  if (needsRedirect) {
    redirect(`/blog/${canonicalSlug}`);
  }
  const viewCount = incrementedViews ?? (await getPostViews(post.id));
  
  // Extract headings for table of contents
  const headings = extractHeadings(post.body);
  
  // Get related posts based on shared tags
  const relatedPosts = getRelatedPosts(post, posts, 3);
  
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
      <ReadingProgress />
      <BlogFABMenu headings={headings} />
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <article className="mx-auto max-w-3xl py-14 md:py-20" data-url={`${SITE_URL}/blog/${post.slug}`}>
        <header>
          <div className="text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {post.updatedAt && (
              <span className="ml-2 inline-flex items-center gap-1">
                <span aria-hidden>•</span>
                <span>
                  Updated {new Date(post.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </span>
            )}
          </div>
          <div className="mt-2 gap-4">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">{post.title}</h1>
          </div>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground">{post.summary}</p>
          {/* Tags and metadata */}
          <div className="mt-3 flex flex-wrap gap-2">
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
        <div className="prose mt-8">
          <MDX source={post.body} />
        </div>
        
      {/* Share buttons */}
      <div className="mt-12 border-t pt-8">
        <ShareButtons
          url={`${SITE_URL}/blog/${post.slug}`}
          title={post.title}
          tags={post.tags}
        />
      </div>
      
      {/* Comments section - hidden for draft posts */}
      {!post.draft && <GiscusComments />}
      
      {post.sources && post.sources.length > 0 && (
          <footer className="mt-12 border-t pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sources</h2>
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
    </>
  );
}
