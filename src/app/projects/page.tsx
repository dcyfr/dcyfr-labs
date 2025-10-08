import type { Metadata } from "next";
import { visibleProjects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { GitHubHeatmap } from "@/components/github-heatmap";
import { SITE_URL, AUTHOR_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of my active, in-progress, and archived projects in cybersecurity and software development.",
};

export default function ProjectsPage() {
  // JSON-LD structured data for projects collection
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    description: "A collection of my active, in-progress, and archived projects in cybersecurity and software development.",
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
          url: `${SITE_URL}/projects#${project.slug}`,
          ...(project.links.find(l => l.type === "github") && {
            codeRepository: project.links.find(l => l.type === "github")?.href,
          }),
          programmingLanguage: project.tech,
          keywords: [...project.tech, ...(project.tags || [])].join(", "),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl py-12 md:py-16">
      {/* GitHub activity heatmap */}
      <section className="mb-8">
        <GitHubHeatmap />
      </section>

      {/* Projects Section */}
      <section className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Projects</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
