import type { Metadata } from "next";
import { visibleProjects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { GitHubHeatmap } from "@/components/github-heatmap";
import { GitHubHeatmapErrorBoundary } from "@/components/github-heatmap-error-boundary";
import {
  SITE_URL,
  AUTHOR_NAME,
  SITE_TITLE,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { headers } from "next/headers";
import { 
  getContainerClasses, 
  TYPOGRAPHY, 
  SPACING 
} from "@/lib/design-tokens";

const pageTitle = "Projects Archive";
// Optimized meta description (155 characters)
const pageDescription = "Browse my portfolio of development projects, open-source contributions, and published work.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    url: `${SITE_URL}/projects`,
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

export default async function ProjectsPage() {
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data for projects collection
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects Archive",
    description: pageDescription,
    url: `${SITE_URL}/projects`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: visibleProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: project.title,
          description: project.description,
          url: `${SITE_URL}/projects/${project.slug}`,
          ...(project.links.find(l => l.type === "github") && {
            codeRepository: project.links.find(l => l.type === "github")?.href,
          }),
          programmingLanguage: project.tech,
          keywords: [...(project.tech || []), ...(project.tags || [])].join(", "),
          creativeWorkStatus: project.status === "active" ? "Published" : 
                             project.status === "in-progress" ? "Draft" : "Archived",
        },
      })),
    },
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
        {/* hero section */}
        <div className={SPACING.proseHero}>
          <h1 className={TYPOGRAPHY.h1.standard}>Projects</h1>
          <p className={TYPOGRAPHY.description}>
            {pageDescription}
          </p>
        </div>
        {/* github contribution heatmap */}
        <div className="mt-10">
          <GitHubHeatmapErrorBoundary>
            <GitHubHeatmap username="dcyfr" />
          </GitHubHeatmapErrorBoundary>
        </div>
        {/* projects */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}
