# AI contributor guide for this repo

This repo is a full-featured developer blog and portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui. The site features an MDX-powered blog, GitHub integration, Redis-backed view counts, and comprehensive security features. Optimize for small, typed components, server-first rendering, and maintainable data flows.

## Stack and workspace
- Next.js 15 App Router + React 19, strict TypeScript.
- Tailwind v4 utilities; UI primitives from shadcn/ui under `src/components/ui/*` (Radix + CVA).
- MDX content with `next-mdx-remote`, `gray-matter`, and rehype/remark plugins for rich blog posts.
- Syntax highlighting via Shiki with dual-theme support (light/dark).
- Redis for post view counts (optional, falls back gracefully).
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
  - Client components only when needed for interactivity: add `"use client"` (e.g., `contact/page.tsx`, `theme-toggle.tsx`, `github-heatmap.tsx`).
  - Layout: `src/app/layout.tsx` wraps header/footer, theme provider, `Toaster`, and analytics.
  - API routes: `src/app/api/<name>/route.ts` with request handlers and rate limiting.
    - `/api/contact` - Contact form submission
    - `/api/github-contributions` - GitHub heatmap data (with server-side caching)
  - Dynamic routes: `/blog/[slug]` for individual blog posts.
  - Metadata routes: `sitemap.ts`, `robots.ts`, `/atom.xml`, `/rss.xml` for SEO and feeds.
- Static assets and data files live in `public/`.

## Conventions and patterns
- Styling: Tailwind utilities; use `cn` from `src/lib/utils.ts` to merge classes. Avoid adding new CSS systems.
- UI: Prefer existing shadcn/ui components (Button, Card, Input, Textarea, Label, Badge, Skeleton, etc.) from `src/components/ui/*`. Add new primitives there if needed.
- Data: Keep typed data in `src/data`.
  - `src/data/projects.ts` exports `projects: Project[]`
  - `src/data/posts.ts` exports `posts: Post[]` (computed from MDX files)
  - `src/data/resume.ts` exports resume data
- Content: Blog posts as MDX files in `src/content/blog/` with frontmatter.
- Composition: Small, focused components under `src/components/*` (e.g., `post-list`, `post-badges`, `project-card`, `site-header`, `site-footer`, `github-heatmap`).
- Error Handling: All major features have dedicated error boundaries (e.g., `github-heatmap-error-boundary.tsx`, `blog-search-error-boundary.tsx`).
- Loading States: Use skeleton loaders for async content (e.g., `post-list-skeleton.tsx`, `github-heatmap-skeleton.tsx`).
- Imports: Use `@/…` alias consistently.
- Documentation: Store all documentation files (analysis, guides, architecture docs) in `/docs` directory unless explicitly required in the project root (e.g., `README.md`, `LICENSE`). This keeps the workspace organized and separates documentation from code.

## Task tracking
This project uses **two complementary todo systems**:

### 1. Persistent Todo & Done Lists (`docs/operations/`)
- **`todo.md`**: Active and pending work only (focused on what needs to be done)
  - **Purpose**: Track current priorities and work items
  - **Scope**: Only open/pending tasks; keeps focus clear
  - **Updates**: Check this first to understand project priorities
  
- **`done.md`**: Completed projects, features, and improvements (historical reference)
  - **Purpose**: Archive of completed work with dates and details
  - **Scope**: All finished items organized by session and category
  - **Benefit**: Learning resource, project history, milestone tracking
  - **Organization**: Sessions (October 24 → October 3), categorized by type (Features, Code Quality, Security, Docs, Design)

- **Best practices**:
  - Check `todo.md` first for current priorities
  - Refer to `done.md` for patterns, learnings, and historical context
  - Mark items complete when finished (they move to done.md)
  - Document what was learned in each completion

### 2. In-Memory Todo List (`manage_todo_list` tool)
- **Purpose**: Track active work within a single conversation session
- **Scope**: Current task breakdown and progress tracking
- **Persistence**: Session-only, does not survive between conversations
- **Organization**: Sequential task list with status tracking (not-started, in-progress, completed)
- **When to use**:
  - Breaking down a current task into actionable steps
  - Tracking progress on multi-step work in real-time
  - Providing visibility into what you're actively working on
- **Best practices**: 
  - Create at start of complex multi-step tasks
  - Mark ONE item in-progress before starting work
  - Mark completed IMMEDIATELY after finishing each step
  - Read first if user asks "what's next" or "next todo"

**Workflow**: Check `todo.md` for project priorities → Review `done.md` for patterns → Create in-memory todo list for session work → Update both files when major items complete.

## Forms and API
- Client pages use fetch to App Router API routes and `sonner` for UX feedback.
  - Example: `contact/page.tsx` POSTs JSON to `/api/contact` and shows success/error toasts.
- Validate inputs on the server route (see `api/contact/route.ts`) and return JSON via `NextResponse`.
- Rate limiting implemented using Redis on all public API routes.
- If integrating email/SaaS (Resend, Sendgrid), do it inside the server route using env vars; don't leak secrets to the client.

## Blog system
- **Content**: MDX files live in `src/content/blog/` with frontmatter metadata.
- **Data Layer**: 
  - `src/lib/blog.ts` - File system operations, post parsing, reading time calculation
  - `src/data/posts.ts` - Exported post array, computed at build time
- **Post Types**:
  - `draft: true` - Only visible in development mode
  - `archived: true` - Marked as no longer updated
  - `featured: true` - Highlighted on homepage
  - Tags for categorization and related posts
- **Features** (all completed):
  - ✅ Search and tag filtering
  - ✅ Post badges (Draft/Archived/New/Hot) via `PostBadges` component
  - ✅ Table of Contents auto-generated from H2/H3 headings (sticky, collapsible)
  - ✅ Related posts algorithm based on shared tags
  - ✅ Reading progress indicator with GPU-accelerated animations
  - ✅ View counts (Redis-backed with in-memory fallback)
  - ✅ RSS/Atom feeds with full content at `/rss.xml` and `/atom.xml`
- **Rendering**: 
  - MDX processed with `next-mdx-remote/rsc` (server-side)
  - Syntax highlighting via Shiki (dual-theme: `github-light` / `github-dark`)
  - Rehype plugins: `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`
  - Remark plugins: `remark-gfm` for GitHub-flavored markdown
- **Pages**:
  - `/blog` - Post list with search and filtering
  - `/blog/[slug]` - Individual post with TOC, related posts, view count, reading progress
- **Components**: `PostList`, `PostBadges`, `RelatedPosts`, `TableOfContents`, `ReadingProgress`, `MDX`
- **Documentation**: Comprehensive guides in `/docs/blog/` and `/docs/components/`

## Component Documentation & JSDoc
All complex components now have comprehensive JSDoc comments:
- **github-heatmap.tsx** - API integration, caching, rate limiting, error boundaries
- **blog-search-form.tsx** - Search/filter with 250ms debounce, URL state management
- **table-of-contents.tsx** - IntersectionObserver tracking, smooth scroll, accessibility
- **mdx.tsx** - Syntax highlighting pipeline, plugin configuration, custom components
- **related-posts.tsx** - Post filtering, responsive grid, tag display
- **post-list.tsx** - Customizable list rendering, empty states, badge integration

See `/docs/components/` for detailed component documentation including examples and troubleshooting.

## GitHub integration
- **Heatmap**: `github-heatmap.tsx` displays contribution activity
- **API Route**: `/api/github-contributions` fetches data with server-side caching
  - 5-minute server-side cache with 1-minute fallback
  - Rate limiting: 10 requests/minute per IP
  - Graceful fallback to sample data if GitHub API unavailable
- **Authentication**: Optional `GITHUB_TOKEN` env var increases rate limits (60 → 5,000 req/hour)
- **Error Handling**: Error boundary + skeleton loader for loading states
- **Dev Indicators**: Cache badge shows when serving cached data (development only)
- **Documentation**: See `/docs/features/github-integration.md` for setup and best practices

## Security Implementation
The project implements comprehensive security hardening:

### Content Security Policy (CSP)
- ✅ Nonce-based CSP in middleware (`src/middleware.ts`)
- ✅ Dynamic nonce generation per request
- ✅ Replaces `unsafe-inline` with cryptographic nonces for script-src and style-src
- ✅ Zero breaking changes, all features work perfectly
- Documentation: `/docs/security/csp/nonce-implementation.md`

### API Security
- ✅ Rate limiting for `/api/contact` (3 req/60s per IP, Redis-backed with fallback)
- ✅ Input validation on all API routes
- ✅ Graceful error handling with meaningful responses
- ✅ PII protection: contact form logs only metadata (domain, length), no sensitive data
- ✅ Only send GitHub `Authorization` header when `GITHUB_TOKEN` is configured
- Documentation: `/docs/api/routes/overview.md` for architecture overview

### HTTP Security Headers
- ✅ X-Frame-Options: DENY (clickjacking protection)
- ✅ X-Content-Type-Options: nosniff (MIME-sniffing protection)
- ✅ HSTS, Referrer-Policy, Permissions-Policy configured in `vercel.json`
- ✅ Safe MDX rendering with `next-mdx-remote/rsc`

See `/docs/security/` directory for detailed documentation and implementation guides.

## SEO and metadata
- Global `metadata` is in `src/app/layout.tsx` (uses `metadataBase` plus dynamic `/opengraph-image` and `/twitter-image` routes).
- `sitemap.ts` and `robots.ts` are typed metadata routes. Update the base URL consistently when changing domains/environments.

## Adding pages or components (examples)
- New page: create `src/app/<slug>/page.tsx` and optionally `export const metadata = { title: "…" }` (see `about/page.tsx`, `projects/page.tsx`).
- New blog post: create `src/content/blog/<slug>.mdx` with frontmatter (see `src/content/blog/README.md` for schema).
- New card/listing: define a typed component (like `ProjectCard` or `PostList`) and drive it from a `src/data/*` array.
- Interactivity: mark the component/page with `"use client"`, use shadcn/ui primitives, and handle state locally.
- Error boundaries: wrap async components in error boundaries (pattern: `<ComponentName>ErrorBoundary`)
- Loading states: provide skeleton loaders for components that fetch data (pattern: `<ComponentName>Skeleton`)
- JSDoc comments: Add comprehensive JSDoc to complex components for IDE support and type documentation

## Documentation Structure

All project documentation lives in `/docs` directory:

- **`/docs/blog/`** - Blog system architecture and guides
  - `architecture.md` - Blog system design and data flow
  - `quick-reference.md` - Quick guide for common tasks
  - `mdx-processing.md` - MDX pipeline and plugins
  - `content-creation.md` - Post authoring guide with examples
  - `frontmatter-schema.md` - Complete frontmatter reference

- **`/docs/components/`** - Component documentation with JSDoc
  - `github-heatmap.md` - Heatmap implementation and API integration
  - `blog-search-form.md` - Search component with debounce and URL state
  - `table-of-contents.tsx` - TOC with IntersectionObserver
  - `mdx.md` - MDX rendering and syntax highlighting
  - `reading-progress.md` - Reading progress indicator
  - `related-posts.md` - Related posts algorithm

- **`/docs/api/`** - API documentation
  - `routes/overview.md` - API architecture, rate limiting, error handling
  - `routes/contact.md` - Contact form endpoint documentation
  - `routes/github-contributions.md` - GitHub API integration
  - `reference.md` - Quick API reference

- **`/docs/features/`** - Feature guides
  - `github-integration.md` - Complete GitHub integration guide with setup

- **`/docs/security/`** - Security implementation
  - `csp/nonce-implementation.md` - CSP with nonce-based security
  - `rate-limiting/guide.md` - Rate limiting implementation
  - Other security documentation

- **`/docs/operations/`** - Project management
  - `todo.md` - Active/pending work only
  - `done.md` - Completed projects and historical reference
  - `environment-variables.md` - Complete environment setup guide

When adding documentation: keep it in `/docs`, use consistent markdown format, include examples, and cross-reference related docs.

## What not to change (without discussion)
- Don't introduce a new UI library or CSS framework.
- Don't bypass the `@/*` import alias.
- Don't move SEO routes (`sitemap.ts`, `robots.ts`) out of `src/app/`.
- Don't modify MDX processing pipeline without understanding existing rehype/remark plugins.
- Don't change blog post frontmatter schema without updating type definitions.
- Don't remove error boundaries or skeleton loaders from async components.
- Don't disable CSP or security headers without discussion.

Key files for reference: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/blog.ts`, `src/data/posts.ts`, `src/components/post-list.tsx`, `src/components/mdx.tsx`, `src/lib/utils.ts`, `src/middleware.ts`.