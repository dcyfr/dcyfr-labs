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
      "Utilized Next.js and Tailwind CSS to create a fast, accessible, and visually appealing user experience.",
      "Leveraged shadcn/ui components to ensure a consistent and modern design system.",
      "Set up automated deployment and hosting using Vercel for seamless updates and scalability.",
    ],
    links: [
      { label: "Website", href: `/`, type: "demo" },
      { label: "GitHub", href: `https://github.com/dcyfr/cyberdrew-dev`, type: "github" },
    ],
  },
  {
    status: "active",
    featured: true,
    hidden: false,
    title: "X64: The Indie Cyber Publication",
    description: "A digital publication focused on cybersecurity, technology trends, and industry insights.",
    slug: "x64",
    timeline: "2024 → Present",
    tech: ["Ghost", "JavaScript", "CSS"],
    tags: ["Publication", "Cybersecurity", "Writing"],
    highlights: [
      "Founded and manage X64, an indie cyber publication delivering high-quality articles on cybersecurity and technology trends.",
      "Write and edit articles, curate content, and engage with a growing community of readers and contributors.",
      "Collaborate with writers and industry experts to deliver diverse perspectives and insights.",
    ],
    links: [
      { label: "Website", href: `https://x64.onl`, type: "demo" }
    ],
  },
];

export const projects = Object.freeze(projectDrafts);

export const visibleProjects = Object.freeze(projects.filter((project) => !project.hidden));

export const featuredProjects = Object.freeze(visibleProjects.filter((project) => project.featured));

export const activeProjects = Object.freeze(visibleProjects.filter((project) => project.status === "active"));
