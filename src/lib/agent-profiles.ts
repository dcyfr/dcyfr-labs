/**
 * Agent Profile Schema and Data
 *
 * Public-facing AI agent profiles for the dcyfr-labs About page.
 * These profiles describe the AI agents that power DCYFR's engineering work.
 */

export type AgentCategory = 'framework' | 'engineering' | 'quality' | 'operations';

export interface AgentProfile {
  /** Stable kebab-case identifier */
  id: string;
  /** Display name */
  name: string;
  /** One-line role description */
  role: string;
  /** 2–3 sentence public description */
  description: string;
  /** 3–5 short capability labels  */
  capabilities: string[];
  /** Category for grouping */
  category: AgentCategory;
  /** Optional link to public docs or README */
  docsUrl?: string;
}

/**
 * Curated agent profiles shown on the About page.
 * Ordered by category: framework first, then engineering, quality, operations.
 */
export const AGENT_PROFILES: AgentProfile[] = [
  // ── Framework ──────────────────────────────────────────────────────────
  {
    id: 'dcyfr',
    name: 'DCYFR',
    role: 'Workspace Orchestrator',
    description:
      'The primary workspace agent. Coordinates cross-project work, enforces quality standards, and routes tasks to the right specialist. Serves as the DCYFR subject-matter expert for architecture decisions and cross-package changes.',
    capabilities: [
      'Cross-project coordination',
      'Agent routing',
      'Quality enforcement',
      'Architecture decisions',
    ],
    category: 'framework',
    docsUrl: 'https://github.com/dcyfr/dcyfr-ai',
  },
  {
    id: 'fullstack-developer',
    name: 'Fullstack Developer',
    role: 'End-to-End Feature Engineer',
    description:
      'Implements complete features from database schema through Next.js UI. Handles React Server Components, API routes, Drizzle ORM, and full test coverage — shipping production-ready code in a single pass.',
    capabilities: [
      'Next.js App Router',
      'Drizzle ORM',
      'TypeScript',
      'API routes',
      'UI components',
    ],
    category: 'engineering',
  },
  {
    id: 'typescript-pro',
    name: 'TypeScript Pro',
    role: 'Type System Specialist',
    description:
      'Deep TypeScript expertise: advanced generics, mapped types, conditional types, and strict null-safety. Migrates JavaScript to TypeScript and designs type-safe APIs that prevent entire categories of runtime errors.',
    capabilities: [
      'Advanced generics',
      'Type inference',
      'Strict mode',
      'API type safety',
      'Migration',
    ],
    category: 'engineering',
  },
  {
    id: 'database-architect',
    name: 'Database Architect',
    role: 'Data Layer Designer',
    description:
      'Designs PostgreSQL schemas with Drizzle ORM, creates migrations, and optimises slow queries. Balances normalisation with read performance and ensures referential integrity across the data model.',
    capabilities: [
      'PostgreSQL',
      'Drizzle ORM',
      'Schema design',
      'Query optimisation',
      'Migrations',
    ],
    category: 'engineering',
  },
  // ── Quality ────────────────────────────────────────────────────────────
  {
    id: 'security-engineer',
    name: 'Security Engineer',
    role: 'Security & Vulnerability Specialist',
    description:
      'Audits code for OWASP vulnerabilities, performs threat modelling, and hardens authentication and authorisation flows. Enforces TLP classification and reviews dependency risk via automated Dependabot triage.',
    capabilities: [
      'OWASP auditing',
      'Threat modelling',
      'Auth hardening',
      'Dependency review',
      'TLP classification',
    ],
    category: 'quality',
  },
  {
    id: 'architecture-reviewer',
    name: 'Architecture Reviewer',
    role: 'Design Pattern Validator',
    description:
      'Reviews system designs against SOLID principles, identifies coupling risks, and writes Architecture Decision Records (ADRs). Ensures new patterns align with established conventions before implementation begins.',
    capabilities: [
      'SOLID principles',
      'ADR writing',
      'Design patterns',
      'Coupling analysis',
      'Refactoring plans',
    ],
    category: 'quality',
  },
  {
    id: 'test-engineer',
    name: 'Test Engineer',
    role: 'Test Strategy & Coverage',
    description:
      'Designs Vitest test suites for unit, integration, and end-to-end scenarios. Achieves ≥99% pass rates, generates coverage reports, and enforces testing conventions so regressions are caught before merge.',
    capabilities: [
      'Vitest',
      'Unit testing',
      'Integration tests',
      'Coverage reporting',
      'Test architecture',
    ],
    category: 'quality',
  },
  // ── Operations ─────────────────────────────────────────────────────────
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    role: 'CI/CD & Infrastructure',
    description:
      'Manages GitHub Actions workflows, Vercel deployments, and Docker containerisation. Maintains the 30-job automation platform and ensures every commit reaches production safely and verifiably.',
    capabilities: [
      'GitHub Actions',
      'Vercel',
      'Docker',
      'Automation platform',
      'Deployment pipelines',
    ],
    category: 'operations',
  },
  {
    id: 'performance-profiler',
    name: 'Performance Profiler',
    role: 'Core Web Vitals Optimiser',
    description:
      'Profiles Next.js bundle sizes, optimises images, and eliminates render-blocking resources. Targets Lighthouse scores ≥95 and tracks Core Web Vitals regressions using the Elvis benchmark suite.',
    capabilities: [
      'Core Web Vitals',
      'Bundle analysis',
      'Image optimisation',
      'Lighthouse',
      'React profiling',
    ],
    category: 'operations',
  },
];

/**
 * Get profiles filtered by category, preserving canonical order.
 */
export function getProfilesByCategory(category: AgentCategory): AgentProfile[] {
  return AGENT_PROFILES.filter((p) => p.category === category);
}

export const AGENT_CATEGORY_LABELS: Record<AgentCategory, string> = {
  framework: 'Framework',
  engineering: 'Engineering',
  quality: 'Quality',
  operations: 'Operations',
};
