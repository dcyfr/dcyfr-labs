import Link from "next/link";
import Image from "next/image";
import { Project, ProjectStatus } from "@/data/projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ensureProjectImage } from "@/lib/default-project-images";

const STATUS_VARIANT: Record<ProjectStatus, "secondary" | "default" | "outline"> = {
  "active": "secondary",
  "in-progress": "default",
  "archived": "outline",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "active": "Active",
  "in-progress": "In progress",
  "archived": "Archived",
};

export function ProjectCard({ 
  project,
  showHighlights = true 
}: { 
  project: Project;
  showHighlights?: boolean;
}) {
  // Always ensure we have an image (custom or default)
  const image = ensureProjectImage(project.image, {
    tags: project.tags,
    tech: project.tech,
  });
  
  return (
    <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative">
      {/* Background Image - always present now (custom or default) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className={cn(
            "object-cover opacity-20 dark:opacity-10 transition-opacity duration-300 group-hover:opacity-30",
            image.position && `object-${image.position}`
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content - positioned above background */}
      <CardHeader className="space-y-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base md:text-lg">{project.title}</CardTitle>
          <Badge variant={STATUS_VARIANT[project.status]}>{STATUS_LABEL[project.status]}</Badge>
        </div>
        {project.timeline && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{project.timeline}</p>
        )}
        <CardDescription className="text-sm md:text-[0.95rem] leading-relaxed">
          {project.description}
        </CardDescription>
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="outline" className="font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      {showHighlights && project.highlights && project.highlights.length > 0 && (
        <CardContent className="relative z-10">
          <ul className="hidden lg:inline-block list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex flex-wrap gap-2 relative z-10">
        {project.links.map((link) => {
          const isExternal = /^(?:https?:)?\/\//.test(link.href);
          const linkClassName = "inline-flex items-center gap-1 text-sm font-medium hover:text-primary";
          return isExternal ? (
            <a
              key={`${project.slug}-${link.href}`}
              className={linkClassName}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <span>{link.label}</span>
              <span aria-hidden>↗</span>
            </a>
          ) : (
            <Link
              key={`${project.slug}-${link.href}`}
              className={linkClassName}
              href={link.href}
            >
              <span>{link.label}</span>
            </Link>
          );
        })}
      </CardFooter>
    </Card>
  );
}
