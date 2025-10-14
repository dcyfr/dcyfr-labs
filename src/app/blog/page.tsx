import type { Metadata } from "next";
import Link from "next/link";
import { posts, postTagCounts } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";

const pageTitle = "Blog";
const pageDescription = "Articles and notes on web development, DX, and TypeScript.";

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

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const tag = resolvedSearchParams?.tag ?? "";
  const all = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const tagList = Object.entries(postTagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  const filtered = tag ? all.filter((p) => p.tags.includes(tag)) : all;
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Blog</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl"></p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge asChild variant={tag ? "outline" : "secondary"}>
          <Link href="/blog">All</Link>
        </Badge>
        {tagList.map((t) => (
          <Badge key={t} asChild variant={tag === t ? "secondary" : "outline"}>
            <Link href={`/blog?tag=${encodeURIComponent(t)}`}>{t}</Link>
          </Badge>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {filtered.map((p) => (
          <article key={p.slug} className="group rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={p.publishedAt}>
                {new Date(p.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </time>
              <span>•</span>
              <span className="hidden md:inline-block">{p.tags.join(" · ")}</span>
              <span className="hidden md:inline-block">•</span>
              <span>{p.readingTime.text}</span>
              {p.archived && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">Archived</Badge>
                </>
              )}
            </div>
            <h2 className="mt-1 text-lg md:text-xl font-medium">
              <Link href={`/blog/${p.slug}`}>
                {p.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
