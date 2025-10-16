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

const projectDrafts: Project[] = [
  {
    status: "in-progress",
    featured: true,
    hidden: true,
    title: "Project Template",
    description: "A brief description of the project goes here.",
    slug: "project-template",
    timeline: "2024",
    tech: ["Tech1", "Tech2", "Tech3"],
    tags: ["Tag1", "Tag2"],
    highlights: [
      "Highlight 1 about the project.",
      "Highlight 2 about the project."
    ],
    links: [
      { label: "GitHub", href: `#`, type: "github" },
      { label: "Demo", href: `#`, type: "demo" },
    ],
  },
  {
    status: "active",
    featured: true,
    hidden: false,
    title: "cyberdrew.dev",
    description: "My personal website and portfolio, showcasing my projects, blog posts, and resume.",
    slug: "cyberdrew-dev",
    timeline: "2025 → Present",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui"],
    tags: ["Portfolio", "Web Development", "Personal"],
    highlights: [
      "Developed a modern, responsive personal website to showcase my projects, blog posts, and resume.",
      "Utilized Next.js and Tailwind CSS to create a fast, accessible, and visually appealing user experience.",
    ],
    links: [
      { label: "Website", href: `/`, type: "demo" },
      { label: "GitHub", href: `https://github.com/dcyfr/cyberdrew-dev`, type: "github" },
    ],
  }
];

export const projects = Object.freeze(projectDrafts);

export const visibleProjects = Object.freeze(projects.filter((project) => !project.hidden));

export const featuredProjects = Object.freeze(visibleProjects.filter((project) => project.featured));

export const activeProjects = Object.freeze(visibleProjects.filter((project) => project.status === "active"));
