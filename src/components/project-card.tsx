import Link from "next/link";
import { Project, ProjectStatus } from "@/data/projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
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
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="outline" className="font-normal">
              {tech}
            </Badge>
          ))}
        </div>
      </CardHeader>
      {project.highlights && project.highlights.length > 0 && (
        <CardContent>
          <ul className="hidden lg:inline-block list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex flex-wrap gap-2">
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
