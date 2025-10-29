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
  tech?: string[];
  tags?: string[];
  links: ProjectLink[];
  featured?: boolean; // false
  hidden?: boolean; // false
  highlights?: string[];
};

const projectDrafts: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    description: "A brief description of the project goes here.",
    timeline: "2024",
    status: "archived",
    tech: ["Tech1", "Tech2", "Tech3"],
    tags: ["Tag1", "Tag2"],
    links: [
      { label: "Article", href: `#`, type: "article" },
      { label: "Website", href: `#`, type: "demo" },
      { label: "Code", href: `#`, type: "github" }
    ],
    featured: false,
    hidden: true,
    highlights: [
      "Highlight 1 about the project.",
      "Highlight 2 about the project.",
      "Highlight 3 about the project."
    ],
  },
  {
    slug: "x64-indie-cyber-publication",
    title: "X64: The Indie Cyber Publication",
    description: "A digital publication focused on cybersecurity, technology trends, and industry insights.",
    timeline: "2024 → Present",
    status: "active",
    tech: ["Ghost", "JavaScript", "CSS"],
    tags: ["Publication", "Cybersecurity", "Writing"],
    links: [
      { label: "Website", href: `https://x64.onl`, type: "demo" }
    ],
    featured: true,
    highlights: [
      "Founded and manage X64, an indie cyber publication delivering high-quality articles on cybersecurity and technology trends.",
      "Write and edit articles, curate content, and engage with a growing community of readers and contributors.",
      "Collaborate with writers and industry experts to deliver diverse perspectives and insights.",
    ],
  },
  {
    slug: "developer-portfolio",
    title: "Developer Portfolio",
    description: "A personal portfolio website showcasing blog articles, projects and proof of concept works.",
    timeline: "2020 → Present",
    status: "active",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    tags: ["Portfolio", "Web Development", "Personal"],
    links: [
      { label: "Website", href: `https://cyberdrew.dev/`, type: "demo" },
      { label: "Code", href: `https://github.com/dcyfr/cyberdrew-dev`, type: "github" }
    ],
    featured: true,
    highlights: [
      "Designed and developed a responsive and accessible personal portfolio website using Next.js and Tailwind CSS.",
      "Implemented a blog section with MDX support for easy content creation and management.",
      "Integrated SEO best practices to improve search engine visibility and organic traffic."
    ],
  },
  {
    slug: "information-security-network",
    title: "Information Security Network, Inc.",
    description: "A non-profit organization dedicated to promoting information security awareness and education.",
    timeline: "2019 → 2021",
    status: "archived",
    tech: ["WordPress", "PHP", "MySQL", "JavaScript", "CSS"],
    tags: ["Non-profit", "Cybersecurity", "Community"],
    links: [],
    highlights: [
      "Co-founded and managed a non-profit organization focused on information security awareness and education.",
      "Organized events, workshops, and training sessions to educate individuals and organizations on cybersecurity best practices.",
      "Collaborated with industry professionals and volunteers to deliver high-quality content and resources to the community."
    ],
  },
];

export const projects = Object.freeze(projectDrafts);

export const visibleProjects = Object.freeze(projects.filter((project) => !project.hidden));

export const featuredProjects = Object.freeze(visibleProjects.filter((project) => project.featured));

export const activeProjects = Object.freeze(visibleProjects.filter((project) => project.status === "active"));

