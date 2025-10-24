import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { PostList } from "@/components/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { posts } from "@/data/posts";
import { resume } from "@/data/resume";
import { getPostBadgeMetadata } from "@/lib/post-badges";
import { Logo } from "@/components/logo";
import {
  SITE_URL,
  SITE_TITLE,
  AUTHOR_NAME,
  getOgImageUrl,
} from "@/lib/site-config";
import { headers } from "next/headers";

export default async function Home() {
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
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
        description: resume.shortSummary,
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
        description: resume.shortSummary,
        jobTitle: "Cybersecurity Architect & Developer",
        sameAs: [
          "https://linkedin.com/in/dcyfr",
          "https://github.com/dcyfr"
        ],
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
        description: resume.shortSummary,
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
      <div className="mx-auto max-w-5xl py-14 md:py-20">
      {/* page hero */}
        <section className="py-6 md:py-12 space-y-4 md:space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-serif flex items-center gap-2 justify-center">
            Hi, I&apos;m Drew <Logo width={24} height={24} className="ml-2" />
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mx-auto">
            Cybersecurity architect and tinkerer helping organizations build resilient security programs that empower teams to move fast and stay secure.
          </p>
          <div className="flex gap-3 pt-2 justify-center">
            <Button asChild>
              <Link href="/about">Learn more</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog">Read my blog</Link>
            </Button>
            <Button variant="outline" className="hidden sm:inline-block" asChild>
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
          <div className="space-y-4">
            {await (async () => {
              const recentPosts = [...posts]
                .filter(p => !p.archived)
                .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
                .slice(0, 5);
              
              // Get badge metadata (latest and hottest posts)
              const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);
              
              return <PostList 
                posts={recentPosts}
                latestSlug={latestSlug ?? undefined}
                hottestSlug={hottestSlug ?? undefined}
                titleLevel="h3"
              />;
            })()}
          </div>
        </section>
        {/* latest projects */}
        <section className="mt-12 md:mt-16 space-y-4">
          <h2 className="font-serif text-xl md:text-2xl font-medium">Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.slice(0, 2).map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
