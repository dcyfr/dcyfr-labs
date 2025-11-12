import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { visibleProjects } from "@/data/projects";
import type { Project } from "@/data/projects";
import {
  SITE_URL,
  SITE_TITLE_PLAIN,
  AUTHOR_NAME,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ensureProjectImage } from "@/lib/default-project-images";
import { headers } from "next/headers";

// Enable Incremental Static Regeneration with 1 hour revalidation
export const revalidate = 3600; // 1 hour in seconds

// Pre-generate all project pages at build time
export async function generateStaticParams() {
  return visibleProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  
  if (!project) return {};
  
  const pageTitle = project.title;
  const pageDescription = project.description;
  const imageUrl = getOgImageUrl(pageTitle, pageDescription);
  
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: `${pageTitle} — ${SITE_TITLE_PLAIN}`,
      description: pageDescription,
      type: "article",
      url: `${SITE_URL}/projects/${project.slug}`,
      siteName: SITE_TITLE_PLAIN,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${pageTitle} — ${SITE_TITLE_PLAIN}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} — ${SITE_TITLE_PLAIN}`,
      description: pageDescription,
      images: [getTwitterImageUrl(pageTitle, pageDescription)],
    },
  };
}

const STATUS_VARIANT: Record<Project["status"], "secondary" | "default" | "outline"> = {
  "active": "secondary",
  "in-progress": "default",
  "archived": "outline",
};

const STATUS_LABEL: Record<Project["status"], string> = {
  "active": "Active",
  "in-progress": "In Progress",
  "archived": "Archived",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  
  if (!project) {
    notFound();
  }
  
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // Always ensure we have an image (custom or default)
  const image = ensureProjectImage(project.image, {
    tags: project.tags,
    tech: project.tech,
  });
  
  // JSON-LD structured data for project
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    ...(project.links.find(l => l.type === "github") && {
      codeRepository: project.links.find(l => l.type === "github")?.href,
    }),
    programmingLanguage: project.tech,
    keywords: [...(project.tech || []), ...(project.tags || [])].join(", "),
    creativeWorkStatus: project.status === "active" ? "Published" : 
                       project.status === "in-progress" ? "Draft" : "Archived",
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <div className="mx-auto max-w-4xl py-14 md:py-20 px-4 sm:px-6 md:px-8">
        {/* Back to Projects */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
        
        {/* Project Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={STATUS_VARIANT[project.status]}>
              {STATUS_LABEL[project.status]}
            </Badge>
            {project.timeline && <span>•</span>}
            {project.timeline && <span>{project.timeline}</span>}
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
            {project.title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          
          {/* Project Links */}
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {project.links.map((link) => {
                const isExternal = /^(?:https?:)?\/\//.test(link.href);
                return isExternal ? (
                  <Button key={link.href} asChild variant="default" size="default">
                    <a href={link.href} target="_blank" rel="noreferrer">
                      <span>{link.label}</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                ) : (
                  <Button key={link.href} asChild variant="default" size="default">
                    <Link href={link.href}>
                      <span>{link.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Featured Image */}
        <Card className="overflow-hidden mb-8">
          <div className="relative aspect-video w-full">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className={cn(
                "object-cover",
                image.position && `object-${image.position}`
              )}
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </Card>
        
        {/* Project Details */}
        <div className="max-w-none">
          {/* Tech Stack */}
          {project.tech && project.tech.length > 0 && (
            <Card className="mb-8">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4 mt-0">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Project Tags */}
          {project.tags && project.tags.length > 0 && (
            <Card className="mb-8">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4 mt-0">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <Card className="mb-8">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4 mt-0">Key Highlights</h2>
                <ul className="space-y-3 list-disc pl-5 mb-0">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="text-base leading-relaxed">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Other Projects */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">Other Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleProjects
              .filter((p) => p.slug !== project.slug)
              .slice(0, 2)
              .map((otherProject) => {
                const otherImage = ensureProjectImage(otherProject.image, {
                  tags: otherProject.tags,
                  tech: otherProject.tech,
                });
                return (
                  <Link
                    key={otherProject.slug}
                    href={`/projects/${otherProject.slug}`}
                    className="group block"
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={otherImage.url}
                          alt={otherImage.alt}
                          fill
                          className={cn(
                            "object-cover group-hover:scale-105 transition-transform duration-300",
                            otherImage.position && `object-${otherImage.position}`
                          )}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {otherProject.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {otherProject.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
