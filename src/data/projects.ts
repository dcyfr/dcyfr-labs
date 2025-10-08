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
    slug: "global-security-operations",
    title: "Global Security Operations Program",
    description: "Established comprehensive security operations and incident response programs across multiple global sites, reducing incident response times by 35%.",
    timeline: "2022 → Present",
    status: "active",
    tech: ["SIEM", "SOAR", "EDR/XDR", "Cloud Security", "Incident Response"],
    tags: ["Enterprise Security", "Operations", "Leadership"],
    links: [],
    highlights: [
      "Reduced global incident response times by 35%",
      "Implemented ISO 27001, SOC2, TISAX, and TPN certifications",
      "Led technical audits across multiple business units",
    ],
    featured: true,
    hidden: true,
  },
  {
    slug: "vulnerability-management-program",
    title: "Enterprise Vulnerability Management",
    description: "Implemented technical controls and vulnerability management initiatives that reduced global vulnerabilities by 23% across enterprise infrastructure.",
    timeline: "2023 → Present",
    status: "active",
    tech: ["Vulnerability Scanners", "Risk Assessment", "AWS", "Azure", "GCP"],
    tags: ["Risk Management", "Cloud Security", "Compliance"],
    links: [],
    highlights: [
      "Reduced global vulnerabilities by 23%",
      "Automated vulnerability detection and remediation",
      "Cross-cloud security assessment framework",
    ],
    featured: true,
    hidden: true,
  },
  {
    slug: "security-awareness-program",
    title: "Security Awareness Program",
    description: "Developed and implemented comprehensive security awareness program that improved phishing detection rates by 40% across 1,000+ CJIS-certified systems.",
    timeline: "2020 → 2021",
    status: "archived",
    tech: ["Security Training", "Phishing Simulation", "CJIS Compliance"],
    tags: ["Education", "Awareness", "Public Sector"],
    links: [],
    highlights: [
      "Improved phishing detection rates by 40%",
      "Managed 1,000+ CJIS-certified systems",
      "Implemented CIS and NIST controls",
    ],
    featured: true,
    hidden: true,
  },
  
  {
    slug: "my-portfolio",
    title: SITE_DOMAIN,
    description: "Personal developer portfolio built with Next.js, showcasing projects, blog posts, and professional experience in cybersecurity.",
    timeline: "2025 → Present",
    status: "active",
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
    featured: true,
  },
  {
    slug: "information-security-network",
    title: "Information Security Network",
    description: "Co-founded nonprofit organization focused on security education and awareness, leading virtual seminars and collaborating with industry groups like DC850.",
    timeline: "2019 → 2021",
    status: "archived",
    tech: ["Education", "Community Building", "Event Management"],
    tags: ["Nonprofit", "Education", "Community"],
    links: [],
    highlights: [
      "Led virtual seminars and training events",
      "Organized BSides and Hack Pensacola events",
      "Collaborated with DC850 security community",
    ],
    featured: true,
  }
];

export const projects = Object.freeze(projectDrafts);

export const visibleProjects = Object.freeze(projects.filter((project) => !project.hidden));

export const featuredProjects = Object.freeze(visibleProjects.filter((project) => project.featured));

export const activeProjects = Object.freeze(visibleProjects.filter((project) => project.status === "active"));
