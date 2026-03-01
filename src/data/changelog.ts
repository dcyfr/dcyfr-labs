/**
 * Site Changelog Data
 *
 * Manual entries for significant site updates, features, and milestones.
 * These appear in the activity feed alongside blog posts and projects.
 */

export type ChangelogType = 'feature' | 'improvement' | 'fix' | 'milestone';

export interface ChangelogEntry {
  /** Unique identifier */
  id: string;
  /** Entry type for styling */
  type: ChangelogType;
  /** Short title */
  title: string;
  /** Optional longer description */
  description?: string;
  /** ISO date string */
  date: string;
  /** Optional link to related page/commit */
  href?: string;
  /** Whether to show in activity feed */
  visible?: boolean;
}

/**
 * Changelog entries - add new entries at the top
 */
export const changelog: ChangelogEntry[] = [
  {
    id: 'dcyfr-ai-plugin-marketplace',
    type: 'feature',
    title: 'Plugin Marketplace — Security Dashboard',
    description:
      'Plugin marketplace with trust scoring, audit tracking, TLP classification, and sandbox isolation now live.',
    date: '2026-02-28',
    href: '/plugins',
    visible: true,
  },
  {
    id: 'open-source-page',
    type: 'feature',
    title: 'Open Source Packages Page',
    description:
      'New /open-source page showcasing all published npm packages in the @dcyfr/ai ecosystem.',
    date: '2026-03-01',
    href: '/open-source',
    visible: true,
  },
  {
    id: 'dcyfr-ai-framework-page',
    type: 'feature',
    title: '@dcyfr/ai Framework Page',
    description:
      'New /ai landing page covering the full framework — plugin architecture, multi-provider support, delegation, CLI, RAG, and code-gen.',
    date: '2026-03-01',
    href: '/ai',
    visible: true,
  },
  {
    id: 'dcyfr-ai-v2-delegation',
    type: 'milestone',
    title: '@dcyfr/ai v2.0 — Delegation Framework',
    description:
      'Delegation framework with reputation engine, SLA contracts, TLP clearance enforcement, and 8 security scenario mitigations shipped to npm.',
    date: '2026-02-01',
    href: '/ai',
    visible: true,
  },
  {
    id: 'delegation-security-hardening',
    type: 'feature',
    title: 'Delegation Security Hardening',
    description:
      'Eight adversarial security scenario mitigations (CS2–CS10) shipped: HMAC identity verification, TLP clearance enforcement, rate limiting, content policy scanning, chain depth guards, and reputation-gated access.',
    date: '2026-02-25',
    href: '/ai',
    visible: true,
  },
  {
    id: 'plugin-marketplace-core',
    type: 'feature',
    title: 'Plugin Marketplace (Core)',
    description:
      'Plugin catalog launched with trust scoring engine, audit trail, TLP classification, Docker sandbox isolation, and automated CVE scanning.',
    date: '2026-02-10',
    href: '/plugins',
    visible: true,
  },
  {
    id: 'axiom-observability',
    type: 'feature',
    title: 'Axiom Observability Integration',
    description:
      'Real-time monitoring via Axiom — request traces, Web Vitals, delegation events, and automation logs all stream to structured datasets.',
    date: '2026-02-05',
    visible: true,
  },
  {
    id: 'dcyfr-ai-code-gen-npm',
    type: 'milestone',
    title: '@dcyfr/ai-code-gen — Published on npm',
    description:
      'Code generation toolkit for structured TypeScript, tests, and documentation scaffolding published to npm.',
    date: '2026-01-20',
    href: '/open-source',
    visible: true,
  },
  {
    id: 'dcyfr-ai-rag-npm',
    type: 'milestone',
    title: '@dcyfr/ai-rag — Published on npm',
    description:
      'RAG library for semantic search and document retrieval with vector store integrations published to npm.',
    date: '2026-01-10',
    href: '/open-source',
    visible: true,
  },
  {
    id: 'dcyfr-ai-cli-npm',
    type: 'milestone',
    title: '@dcyfr/ai-cli — Published on npm',
    description:
      'CLI tools for AI workflows: agent scaffolding, plugin management, delegation monitoring, and workspace automation published to npm.',
    date: '2025-12-15',
    href: '/open-source',
    visible: true,
  },
  {
    id: 'agent-catalog-expansion',
    type: 'improvement',
    title: 'AI Agent Catalog — 22 Specialist Agents',
    description:
      'Workspace expanded to 22 specialist agents covering full-stack development, security engineering, TypeScript, testing, DevOps, performance, documentation, architecture review, compliance, and governance.',
    date: '2025-12-01',
    href: '/ai',
    visible: true,
  },
  {
    id: 'activity-feed-launch',
    type: 'feature',
    title: 'Launched Universal Activity Timeline',
    description:
      'New social media-inspired activity feed with filtering, time grouping, and multiple display variants.',
    date: '2025-11-29',
    href: '/activity',
    visible: true,
  },
  {
    id: 'blog-launch',
    type: 'milestone',
    title: 'Blog Section Launched',
    description:
      'Technical blog with MDX support, syntax highlighting, and reading time estimates.',
    date: '2025-09-15',
    href: '/blog',
    visible: true,
  },
  {
    id: 'portfolio-launch',
    type: 'milestone',
    title: 'Portfolio Launch',
    description: 'DCYFR Labs portfolio goes live.',
    date: '2025-08-01',
    href: '/',
    visible: true,
  },
];

export const visibleChangelog = changelog.filter((entry) => entry.visible !== false);
