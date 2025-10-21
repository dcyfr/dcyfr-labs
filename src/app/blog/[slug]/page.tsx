import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import {
  SITE_URL,
  SITE_TITLE,
  AUTHOR_NAME,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { MDX } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import { PostBadges } from "@/components/post-badges";
import { getPostViews, incrementPostViews, getMultiplePostViews } from "@/lib/views";
import { ReadingProgress } from "@/components/reading-progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
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
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const incrementedViews = await incrementPostViews(slug);
  const viewCount = incrementedViews ?? (await getPostViews(slug));
  
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

  // JSON-LD structured data for SEO and AI assistants
  const socialImage = getOgImageUrl(post.title, post.summary);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    image: socialImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    wordCount: post.readingTime.words,
    ...(post.archived && { archivedAt: post.updatedAt || post.publishedAt }),
    ...(typeof viewCount === "number" && viewCount > 0
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ReadAction",
            userInteractionCount: viewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl py-14 md:py-20">
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
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{post.title}</h1>
        </div>
        <p className="mt-2 text-lg md:text-xl text-muted-foreground">{post.summary}</p>
        {/* Tags and metadata */}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
          <Badge variant="outline">{post.readingTime.text}</Badge>
          {typeof viewCount === "number" && (
            <Badge variant="outline">
              {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
            </Badge>
          )}
          <PostBadges 
              post={post}
              isLatestPost={latestPost?.slug === post.slug}
              isHotPost={hottestSlug === post.slug && maxViews > 0}
            />
        </div>
      </header>
      <div className="mt-8">
        <MDX source={post.body} />
      </div>
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
    </article>
    </>
  );
}
