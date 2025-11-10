import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { PostList } from "@/components/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { posts, featuredPosts } from "@/data/posts";
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
import { FeaturedPostHero } from "@/components/featured-post-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import Image from "next/image";
import { 
  getContainerClasses, 
  TYPOGRAPHY, 
  SPACING 
} from "@/lib/design-tokens";

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
  
  // Get featured post for hero section
  const featuredPost = featuredPosts[0];
  
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
      <div className={getContainerClasses('standard')}>
      {/* page hero */}
        <ScrollReveal animation="fade-up">
          <section className={`py-4 md:py-8 ${SPACING.content} text-center`}>
            {/* Avatar */}
            <div className="flex justify-center mb-4 md:mb-5">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/images/avatar.jpg"
                  alt="Drew's profile picture"
                  fill
                  className="rounded-full object-cover ring-4 ring-border shadow-lg"
                  priority
                />
              </div>
            </div>
            
            <h1 className={`${TYPOGRAPHY.h1.hero} flex items-center gap-2 justify-center`}>
              Hi, I&apos;m Drew <Logo width={24} height={24} className="ml-2" />
            </h1>
            <p className={`max-w-2xl mx-auto ${TYPOGRAPHY.description}`}>
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
        </ScrollReveal>

        {/* featured post hero */}
        {featuredPost && (
          <ScrollReveal animation="fade-up" delay={100}>
            <section className="mt-16 md:mt-24">
              <FeaturedPostHero post={featuredPost} />
            </section>
          </ScrollReveal>
        )}

        {/* latest blog articles */}
        <ScrollReveal animation="fade-up" delay={200}>
          <section className={`mt-16 md:mt-24 ${SPACING.content}`}>
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className={`${TYPOGRAPHY.h2.standard} relative`}>
                Latest articles
              </h2>
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
        </ScrollReveal>

        {/* latest projects */}
        <ScrollReveal animation="fade-up" delay={300}>
          <section className={`mt-16 md:mt-24 ${SPACING.content}`}>
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className={`${TYPOGRAPHY.h2.standard} relative`}>
                Projects
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/projects">View all</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProjects.slice(0, 2).map((p) => (
                <ProjectCard key={p.title} project={p} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
