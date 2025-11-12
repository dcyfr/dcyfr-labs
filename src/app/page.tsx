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
  SITE_TITLE_PLAIN,
} from "@/lib/site-config";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { FeaturedPostHero } from "@/components/featured-post-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import Image from "next/image";
import { 
  TYPOGRAPHY, 
  SPACING,
  PAGE_LAYOUT,
} from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { createPageMetadata, getJsonLdScriptProps } from "@/lib/metadata";

// Optimized meta description for homepage (157 characters)
const pageDescription = "Cybersecurity architect and tinkerer helping organizations build resilient security programs that empower teams to move fast and stay secure.";

export const metadata: Metadata = createPageMetadata({
  title: SITE_TITLE_PLAIN,
  description: pageDescription,
  path: "/",
});

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
    <PageLayout>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      
      {/* Hero Section */}
      <ScrollReveal animation="fade-up">
        <section className={PAGE_LAYOUT.hero.container}>
          <div className={`${PAGE_LAYOUT.hero.content} text-center`}>
            {/* Avatar */}
            <div className="flex justify-center">
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
            
            {/* Title */}
            <h1 className={`${TYPOGRAPHY.h1.hero} flex items-center gap-2 justify-center`}>
              Hi, I&apos;m Drew <Logo width={24} height={24} />
            </h1>
            
            {/* Description */}
            <p className={`max-w-2xl mx-auto ${TYPOGRAPHY.description}`}>
              Cybersecurity architect and tinkerer helping organizations build resilient security programs that empower teams to move fast and stay secure.
            </p>
            
            {/* Actions */}
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
          </div>
        </section>
      </ScrollReveal>

        {/* stats section 
        <ScrollReveal animation="fade-up" delay={75}>
          <section className="mt-12 md:mt-16">
            <HomepageStats
              postsCount={posts.length}
              projectsCount={projects.filter(p => !p.hidden).length}
              yearsOfExperience={5}
              technologiesCount={90}
            />
          </section>
        </ScrollReveal>
        */}

        {/* featured post hero */}
        {featuredPost && (
          <ScrollReveal animation="fade-up" delay={100}>
            <section className={PAGE_LAYOUT.section.container}>
              <FeaturedPostHero post={featuredPost} />
            </section>
          </ScrollReveal>
        )}

        {/* latest blog articles */}
        <ScrollReveal animation="fade-up" delay={200}>
          <section className={PAGE_LAYOUT.section.container}>
            <div className={SPACING.content}>
              <div className="flex items-center justify-between mb-8 pb-2 border-b">
                <h2 className={TYPOGRAPHY.h2.standard}>
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
            </div>
          </section>
        </ScrollReveal>

        {/* latest projects */}
        <ScrollReveal animation="fade-up" delay={300}>
          <section className={PAGE_LAYOUT.section.container}>
            <div className={SPACING.content}>
              <div className="flex items-center justify-between mb-8 pb-2 border-b">
                <h2 className={TYPOGRAPHY.h2.standard}>
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
            </div>
          </section>
        </ScrollReveal>
      </PageLayout>
  );
}
