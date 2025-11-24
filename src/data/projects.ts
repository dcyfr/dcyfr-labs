import { SITE_TITLE } from "@/lib/site-config";

export type ProjectLink = {
  label: string;
  href: string;
  type?: "demo" | "github" | "article" | "docs";
};

export type ProjectStatus = "active" | "in-progress" | "archived";

export type ProjectImage = {
  url: string; // local path or external URL
  alt: string; // required for accessibility
  width?: number; // optional, for optimization
  height?: number; // optional, for aspect ratio
  position?: "center" | "top" | "bottom" | "left" | "right"; // background position
};

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
  image?: ProjectImage; // optional featured image
};

const projectDrafts: Project[] = [
  {
    slug: "x64",
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
    image: {
      url: "/projects/default/design.svg",
      alt: "X64 Publication - Cybersecurity and technology publication",
      position: "center",
    },
    highlights: [
      "Founded and manage X64, an indie cyber publication delivering high-quality articles on cybersecurity and technology trends.",
      "Write and edit articles, curate content, and engage with a growing community of readers and contributors.",
      "Collaborate with writers and industry experts to deliver diverse perspectives and insights.",
    ],
  },
  {
    slug: "drews-lab",
    title: SITE_TITLE,
    description: "A personal portfolio website showcasing blog articles, projects and proof of concept works.",
    timeline: "2020 → Present",
    status: "active",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    tags: ["Portfolio", "Web Development", "Personal"],
    links: [
      { label: "Website", href: `https://cyberdrew.dev/`, type: "demo" },
      { label: "Code", href: `https://github.com/dcyfr/cyberdrew-dev`, type: "github" }
    ],
    featured: false,
    image: {
      url: "/projects/default/tech.svg",
      alt: "Drew's Lab - Personal portfolio and blog",
      position: "center",
    },
    highlights: [
      "Designed and developed a responsive and accessible personal portfolio website using Next.js and Tailwind CSS.",
      "Implemented a blog section with MDX support for easy content creation and management.",
      "Integrated SEO best practices to improve search engine visibility and organic traffic."
    ],
  },
  {
    slug: "isn-inc",
    title: "Information Security Network, Inc.",
    description: "A non-profit organization dedicated to promoting information security awareness and education.",
    timeline: "2019 → 2021",
    status: "archived",
    tech: ["WordPress", "PHP", "MySQL", "JavaScript", "CSS"],
    tags: ["Non-profit", "Cybersecurity", "Community"],
    links: [],
    featured: false,
    image: {
      url: "/projects/default/general.svg",
      alt: "Information Security Network - Non-profit cybersecurity organization",
      position: "center",
    },
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

