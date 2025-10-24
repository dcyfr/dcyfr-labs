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

### 1. Persistent Todo List (`docs/operations/todo.md`)
- **Purpose**: Project-wide todo tracker for bugs, features, technical debt, and long-term planning
- **Scope**: All issues, improvements, and ideas across the entire project
- **Persistence**: Committed to git, survives across all sessions
- **Organization**: Categorized by type (Bugs, Features, Technical Debt, Security, Documentation, etc.)
- **When to use**: 
  - Planning new features or improvements
  - Tracking bugs and technical debt
  - Documenting long-term project goals
  - Reviewing project status and priorities
- **When to update**: Mark items complete with ✅ when finished, add new items as they arise

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

**Workflow**: Check persistent `todo.md` for project priorities → Create in-memory todo list for active session work → Update `todo.md` when major items complete.

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
- **Features**:
  - Post badges (Draft/Archived/New/Hot) via `PostBadges` component
  - Table of Contents auto-generated from H2/H3 headings
  - Related posts algorithm based on shared tags
  - Reading progress indicator
  - View counts (Redis-backed, optional)
  - RSS/Atom feeds at `/rss.xml` and `/atom.xml`
- **Rendering**: 
  - MDX processed with `next-mdx-remote`
  - Syntax highlighting via Shiki (dual-theme: `github-light` / `github-dark`)
  - Rehype plugins: `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`
  - Remark plugins: `remark-gfm` for GitHub-flavored markdown
- **Pages**:
  - `/blog` - Post list with search and filtering
  - `/blog/[slug]` - Individual post with TOC, related posts, view count
- **Components**: `PostList`, `PostBadges`, `RelatedPosts`, `TableOfContents`, `ReadingProgress`, `MDX`

## GitHub integration
- **Heatmap**: `github-heatmap.tsx` displays contribution activity
- **API Route**: `/api/github-contributions` fetches data with server-side caching (1 hour TTL)
- **Authentication**: Optional `GITHUB_TOKEN` env var increases rate limits (60 → 5,000 req/hour)
- **Error Handling**: Falls back to sample data if GitHub API unavailable
- **Dev Indicators**: Cache badge shows when serving cached data (development only)

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

## What not to change (without discussion)
- Don't introduce a new UI library or CSS framework.
- Don't bypass the `@/*` import alias.
- Don't move SEO routes (`sitemap.ts`, `robots.ts`) out of `src/app/`.
- Don't modify MDX processing pipeline without understanding existing rehype/remark plugins.
- Don't change blog post frontmatter schema without updating type definitions.

Key files for reference: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/blog.ts`, `src/data/posts.ts`, `src/components/post-list.tsx`, `src/components/mdx.tsx`, `src/lib/utils.ts`.