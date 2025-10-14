export type ProjectLink = {
  label: string;
  href: string;
  type?: "demo" | "github" | "article" | "docs";
};

export type ProjectStatus = "active" | "in-progress" | "archived";

export type Project = {
  slug: string;
  title: string;
  description: string;
  timeline?: string;
  status: ProjectStatus;
  tech: string[];
  tags?: string[];
  links: ProjectLink[];
  featured?: boolean;
  hidden?: boolean;
  highlights?: string[];
};

import { SITE_DOMAIN } from "@/lib/site-config";

const projectDrafts: Project[] = [
  {
    slug: "cyberdrew-dev",
    title: SITE_DOMAIN,
    description: "Personal developer portfolio built with Next.js, showcasing projects, blog posts, and professional experience in cybersecurity.",
    timeline: "2025 → Present",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui"],
    tags: ["Portfolio", "Web Development", "Personal"],
    links: [
      { label: "Read more", href: "/blog/shipping-tiny-portfolio", type: "article" },
      { label: "GitHub", href: "https://github.com/dcyfr/cyberdrew-dev", type: "github" },
    ],
    highlights: [
      "Server-first rendering with App Router",
      "Responsive design with Tailwind CSS",
      "Dynamic resume and project data",
    ],
    status: "active",
    featured: true,
  },
  {
    slug: "information-security-network-inc",
    title: "Information Security Network, Inc.",
    description: "Co-founded nonprofit organization focused on security education and awareness, leading virtual seminars and collaborating with industry groups like DC850.",
    timeline: "2019 → 2021",
    tech: ["Education", "Community Building", "Event Management"],
    tags: ["Nonprofit", "Education", "Community"],
    links: [],
    highlights: [
      "Led virtual seminars, training, and events such as BSides and Hack Pensacola.",
      "Promoted security awareness/education in collaboration with DC850.",
      "Aligned IT and security objectives with nonprofit strategies.",
    ],
    status: "archived",
    featured: true,
  }
];

export const projects = Object.freeze(projectDrafts);

export const visibleProjects = Object.freeze(projects.filter((project) => !project.hidden));

export const featuredProjects = Object.freeze(visibleProjects.filter((project) => project.featured));

export const activeProjects = Object.freeze(visibleProjects.filter((project) => project.status === "active"));
