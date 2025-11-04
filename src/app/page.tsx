import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { PostList } from "@/components/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { posts } from "@/data/posts";
import { getPostBadgeMetadata } from "@/lib/post-badges";
import { Logo } from "@/components/logo";
import { getSocialUrls } from "@/data/socials";
import {
  SITE_URL,
  SITE_TITLE,
  AUTHOR_NAME,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { headers } from "next/headers";
import type { Metadata } from "next";

// Optimized meta description for homepage (157 characters)
const pageDescription = "Cybersecurity architect and developer building resilient security programs. Explore my blog on secure development, projects, and technical insights.";

export const metadata: Metadata = {
  description: pageDescription,
  openGraph: {
    title: SITE_TITLE,
    description: pageDescription,
    url: SITE_URL,
    siteName: SITE_TITLE,
    type: "website",
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: pageDescription,
    images: [getTwitterImageUrl()],
  },
};

export default async function Home() {
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // Prepare recent posts for homepage
  const recentPosts = [...posts]
    .filter(p => !p.archived)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3);
  
  // Get badge metadata (latest and hottest posts)
  const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);
  
  const socialImage = getOgImageUrl();
  // JSON-LD structured data for home page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: pageDescription,
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: SITE_URL,
        image: socialImage,
        description: pageDescription,
        jobTitle: "Cybersecurity Architect & Developer",
        sameAs: getSocialUrls(),
        knowsAbout: [
          "Cybersecurity",
          "Software Development",
          "Web Development",
          "Cloud Computing",
          "DevOps",
          "Programming",
          "Technology",
          "Open Source",
          "Networking",
          "System Administration"
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://cyberdrew.dev/#webpage",
        url: "https://cyberdrew.dev",
        name: "Drew's Lab - Cybersecurity Architect & Developer",
        isPartOf: {
          "@id": "https://cyberdrew.dev/#website",
        },
        about: {
          "@id": "https://cyberdrew.dev/#person",
        },
        description: pageDescription,
        inLanguage: "en-US",
        image: socialImage,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <div className="mx-auto max-w-5xl py-14 md:py-20 px-4 sm:px-6 md:px-8">
      {/* page hero */}
        <section className="py-6 md:py-12 space-y-4 md:space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-serif flex items-center gap-2 justify-center">
            Hi, I&apos;m Drew <Logo width={24} height={24} className="ml-2" />
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mx-auto">
            Cybersecurity architect and tinkerer helping organizations build resilient security programs that empower teams to move fast and stay secure.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 justify-center">
            <Button asChild size="default">
              <Link href="/about">Learn more</Link>
            </Button>
            <Button variant="outline" asChild size="default">
              <Link href="/blog">Read my blog</Link>
            </Button>
            <Button variant="outline" className="hidden sm:inline-flex" asChild size="default">
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </section>
        {/* latest blog articles */}
        <section className="mt-12 md:mt-16 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl md:text-2xl font-medium">Latest articles</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">View all</Link>
            </Button>
          </div>
          <PostList 
            posts={recentPosts}
            latestSlug={latestSlug ?? undefined}
            hottestSlug={hottestSlug ?? undefined}
            titleLevel="h3"
          />
        </section>
        {/* latest projects */}
        <section className="mt-12 md:mt-16 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl md:text-2xl font-medium">Projects</h2>
            <Button variant="ghost" asChild>
              <Link href="/projects">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.slice(0, 2).map((p) => (
              <ProjectCard key={p.title} project={p} showHighlights={false} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
