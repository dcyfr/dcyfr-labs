# AI contributor guide for this repo

This repo is a minimal developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui. Optimize for small, typed components, server-first rendering, and simple data flows.

## Stack and workspace
- Next.js 15 App Router + React 19, strict TypeScript.
- Tailwind v4 utilities; UI primitives from shadcn/ui under `src/components/ui/*` (Radix + CVA).
- Theming via `next-themes` (`ThemeProvider`) and toasts via `sonner` (`Toaster`).
- Path alias: `@/*` -> `src/*` (see `tsconfig.json`). Prefer `@/…` imports over long relative paths.

## MCP servers in VS Code
Active MCP servers configured for this session:

### Core MCPs
- **Context7** (`@upstash/context7-mcp@latest`): Documentation lookup for Next.js, React, Tailwind, shadcn/ui, and other libraries.
- **Sequential Thinking** (`@modelcontextprotocol/server-sequential-thinking`): Complex problem-solving, planning, and multi-step task breakdown.
- **Memory** (`@modelcontextprotocol/server-memory`): Maintains project context, decisions, and patterns across the conversation.

### Project Workflow MCPs
- **Filesystem** (`@modelcontextprotocol/server-filesystem`): Safe file operations, navigation, and bulk edits across the project workspace.
- **GitHub** (`ghcr.io/github/github-mcp-server`): GitHub integration for repository management, issues, PRs, CI/CD, and code analysis.

Additional tools available:
- **Snyk Extension**: Security scanning and vulnerability analysis.
- **GitHub Pull Requests Extension**: PR management and review.

**Usage guidelines:**
- Use Context7 to fetch up-to-date library documentation before making assumptions about APIs or patterns.
- Use Sequential Thinking for architectural decisions, debugging complex issues, or planning multi-step refactors.
- Use Memory to track project decisions, learned patterns, and context to avoid repetition.
- Use Filesystem MCP for project-wide file operations, refactoring, and navigation (safer than terminal operations).
- Prefer MCP servers for local/secure integrations instead of making direct network calls.
- Security: Never exfiltrate secrets. Keep all credentials within MCP boundaries; do not print tokens or environment details. Prefer server-side routes for any third‑party calls (see `src/app/api/*`).
- Offline-friendly: When network is restricted, rely on MCP-backed indexes and local workspace context.

## Run and build
- Dev: `npm run dev` (Turbopack) → http://localhost:3000
- Build: `npm run build` (Turbopack) • Start: `npm start`
- Lint: `npm run lint` (ESLint Flat config extending Next.js + TS)
 - Hosting: optimized for Vercel. Analytics (`@vercel/analytics`) and Speed Insights are rendered in `layout.tsx` and work on Vercel deployments by default.
  - Vercel config: `vercel.json` sets cache headers for static assets and basic security headers; App Router handles routing.

## Architecture and routing
- App Router under `src/app`.
  - Pages: `src/app/<segment>/page.tsx` (server components by default).
  - Client components only when needed for interactivity: add `"use client"` (e.g., `contact/page.tsx`, `theme-toggle.tsx`).
  - Layout: `src/app/layout.tsx` wraps header/footer, theme provider, and `Toaster`.
  - API routes: `src/app/api/<name>/route.ts` with request handlers (e.g., `api/contact/route.ts`).
- Static assets live in `public/`.

## Conventions and patterns
- Styling: Tailwind utilities; use `cn` from `src/lib/utils.ts` to merge classes. Avoid adding new CSS systems.
- UI: Prefer existing shadcn/ui components (Button, Card, Input, Textarea, Label, etc.) from `src/components/ui/*`. Add new primitives there if needed.
- Data: Keep simple typed data in `src/data`.
  - Example: `src/data/projects.ts` exports `projects: Project[]`, where `Project` is the type from `src/components/project-card.tsx`.
- Composition: Small, focused components under `src/components/*` (e.g., `project-card`, `site-header`, `site-footer`).
- Imports: Use `@/…` alias consistently.
- Documentation: Store all documentation files (analysis, guides, architecture docs) in `/docs` directory unless explicitly required in the project root (e.g., `README.md`, `LICENSE`). This keeps the workspace organized and separates documentation from code.

## Forms and API
- Client pages use fetch to App Router API routes and `sonner` for UX feedback.
  - Example: `contact/page.tsx` POSTs JSON to `/api/contact` and shows success/error toasts.
- Validate inputs on the server route (see `api/contact/route.ts`) and return JSON via `NextResponse`.
- If integrating email/SaaS (Resend, Sendgrid), do it inside the server route using env vars; don’t leak secrets to the client.

## SEO and metadata
- Global `metadata` is in `src/app/layout.tsx` (uses `metadataBase` plus dynamic `/opengraph-image` and `/twitter-image` routes).
- `sitemap.ts` and `robots.ts` are typed metadata routes. Update the base URL consistently when changing domains/environments.

## Adding pages or components (examples)
- New page: create `src/app/<slug>/page.tsx` and optionally `export const metadata = { title: "…" }` (see `about/page.tsx`, `projects/page.tsx`).
- New card/listing: define a typed component (like `ProjectCard`) and drive it from a `src/data/*` array.
- Interactivity: mark the component/page with `"use client"`, use shadcn/ui primitives, and handle state locally.

## What not to change (without discussion)
- Don’t introduce a new UI library or CSS framework.
- Don’t bypass the `@/*` import alias.
- Don’t move SEO routes (`sitemap.ts`, `robots.ts`) out of `src/app/`.

Key files for reference: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/contact/route.ts`, `src/components/project-card.tsx`, `src/data/projects.ts`, `src/lib/utils.ts`. 