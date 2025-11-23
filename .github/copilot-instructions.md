# AI contributor guide for this repo

Full-stack developer portfolio with Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, MDX blog, GitHub integration, and Redis analytics. Optimized for server-first rendering, type safety, and maintainable architecture.

## AI Tool Context

**GitHub Copilot CLI Agent (Terminal)**: Task execution — runs commands, edits files, validates changes. Use for "do this task" workflows requiring investigation → implementation → testing.

**VS Code Copilot Chat (IDE)**: Learning & exploration — explains code, suggests patterns, generates snippets. Use for "help me understand/write this" workflows.

Both tools share these instructions but optimize differently: CLI focuses on actionable patterns and validation; Chat emphasizes architectural context and learning resources.

## GitHub Security Code Scanning Alerts

When asked to check or verify GitHub security code scanning alerts (URLs like `https://github.com/{owner}/{repo}/security/code-scanning/{alert_number}`):

**Approach**: Use GitHub API directly via terminal since the GitHub MCP server doesn't have dedicated code scanning tools.

**Available API Endpoints**:
- `GET /repos/{owner}/{repo}/code-scanning/alerts` — List all alerts
- `GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}` — Get specific alert
- `PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}` — Update alert (dismiss/reopen)

**Verification Workflow**:
1. Extract owner, repo, and alert number from URL
2. Use `gh api` command to fetch alert details:
   ```bash
   gh api /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}
   ```
3. Check `state` field: `open`, `closed`, `dismissed`, or `fixed`
4. If alert returns 404, it has been deleted/resolved
5. Validate with `npm audit` for dependency-related alerts

**Example Commands**:
```bash
# Get specific alert
gh api /repos/dcyfr/cyberdrew-dev/code-scanning/alerts/2

# List all alerts (with state filter)
gh api /repos/dcyfr/cyberdrew-dev/code-scanning/alerts --jq '.[] | {number, state, rule: .rule.id}'

# Check if dependency exists
npm ls @package/name
```

**Key Response Fields**:
- `number` — Alert ID
- `state` — Current status (open/closed/dismissed/fixed)
- `rule.id` — Vulnerability identifier
- `most_recent_instance.location` — File/line where issue exists
- `dismissed_reason` — Why alert was dismissed (if applicable)

## Stack & Commands

**Core**: Next.js 16 + React 19 + TypeScript (strict) + Tailwind v4 + shadcn/ui + MDX
**Data**: Redis (optional), Inngest (background jobs)
**Dev**: `npm run dev` (Turbopack) → localhost:3000
**Build**: `npm run build` • **Start**: `npm start` • **Lint**: `npm run lint`
**Hosting**: Vercel (analytics auto-enabled in `layout.tsx`)

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── <segment>/page.tsx  # Routes (server components default)
│   ├── api/               # API routes with rate limiting
│   │   ├── contact/       # Form submission (Inngest)
│   │   ├── github-contributions/  # Cached GitHub data
│   │   └── inngest/       # Background job handler
│   ├── layout.tsx         # Root layout (theme, toaster, analytics)
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # SEO config
├── components/
│   ├── layouts/           # Reusable page patterns (see below)
│   └── ui/                # shadcn/ui primitives
├── content/blog/          # MDX posts with frontmatter
├── data/                  # Typed data (posts, projects, resume)
├── lib/                   # Utilities, metadata, design tokens
└── inngest/               # Background job functions
```

**Import alias**: `@/*` → `src/*` (always use, avoid relative paths)

## Reusable Patterns

**Layout Components** (`src/components/layouts/`):
- `PageLayout` — Universal page wrapper with width/spacing constraints
- `PageHero` — Hero sections with style variants
- `ArchiveLayout` — List pages with filters/pagination (blog, projects)
- `ArticleLayout` — Individual content pages (blog posts)

**Metadata Helpers** (`src/lib/metadata.ts`):
- `createPageMetadata()` — Standard pages
- `createArchivePageMetadata()` — List/archive pages
- `createArticlePageMetadata()` — Blog posts
- `createCollectionSchema()` — JSON-LD structured data

**Design Tokens** (`src/lib/design-tokens.ts`):
- `PAGE_LAYOUT` — Container widths, spacing patterns
- `ARCHIVE_LAYOUT` — Grid and pagination spacing
- `ARTICLE_LAYOUT` — Typography and content spacing

**Quick Reference**:
- New page → `PageLayout` + `createPageMetadata()`
- List page → `ArchiveLayout` + `createArchivePageMetadata()`
- Blog post → `ArticleLayout` + `createArticlePageMetadata()`
- Deep dive → See `/docs/architecture/` for migration guides and examples

## Key Features

**Blog System** (`src/content/blog/` + `src/lib/blog.ts`):
- MDX with frontmatter (draft/archived/featured flags)
- Server-side rendering with `next-mdx-remote/rsc`
- Syntax highlighting (Shiki dual-theme)
- Search/filtering, ToC, related posts, reading progress
- Redis view counts (fallback to memory)
- See `/docs/blog/` for content creation guide

**Background Jobs** (Inngest at `/api/inngest`):
- Contact form emails, GitHub sync, blog analytics
- Use for operations >500ms or requiring retries
- Dev UI at `localhost:3000/api/inngest`
- See `/docs/features/inngest-integration.md`

**GitHub Integration** (`/api/github-contributions`):
- Contribution heatmap with 5-min cache
- Rate limiting: 10 req/min per IP
- Optional `GITHUB_TOKEN` env (60 → 5k req/hr limit boost)

**Security**:
- Nonce-based CSP (`src/proxy.ts`)
- Redis rate limiting on public APIs
- Input validation + error boundaries
- See `/docs/security/` for implementation details

## Conventions

**Styling**: Tailwind utilities only; use `cn()` from `@/lib/utils` to merge classes
**UI Components**: shadcn/ui in `@/components/ui/*` (Button, Card, Badge, Skeleton, etc.)
**Client Components**: Add `"use client"` only when needed for interactivity
**Error Handling**: Wrap async features in error boundaries (`*-error-boundary.tsx`)
**Loading States**: Provide skeleton loaders (`*-skeleton.tsx`)
**Data Layer**:
- `@/data/posts.ts` — Blog posts (computed from MDX)
- `@/data/projects.ts` — Project listings
- `@/data/resume.ts` — Resume data
**API Routes**: Validate inputs, use `NextResponse`, implement rate limiting
**Forms**: Client pages POST to API routes, use `sonner` for toast feedback

## Task Tracking

**Persistent**: `docs/operations/todo.md` (active work) + `done.md` (completed history)
**Session**: Use in-memory todo tool for multi-step tasks within a conversation
**Workflow**: 
1. Check `todo.md` for existing tasks
2. Create session list for current work using manage_todo_list tool
3. Update both files on completion (session → persistent)
4. Archive completed items to `done.md`

## Documentation

All docs in `/docs/` organized by domain:
- `/docs/architecture/` — Patterns, migration guides, examples
- `/docs/blog/` — Content creation, MDX pipeline, frontmatter schema
- `/docs/components/` — Component API docs with JSDoc
- `/docs/api/` — API routes, rate limiting, error handling
- `/docs/features/` — Feature guides (Inngest, GitHub integration)
- `/docs/security/` — CSP, rate limiting, security patterns
- `/docs/operations/` — Todo system, environment setup
- `/docs/platform/` — Vercel config, domain setup, analytics

**For Chat**: Explore these for learning context and architectural decisions
**For CLI**: Reference specific docs when implementing features or debugging

## Constraints

**Do NOT change without discussion**:
- UI library/CSS framework (stick to Tailwind + shadcn/ui)
- Import alias pattern (always use `@/*`)
- SEO routes location (`sitemap.ts`, `robots.ts` in `src/app/`)
- MDX processing pipeline (rehype/remark plugins)
- Blog post frontmatter schema (update types if changed)
- Error boundaries or skeleton loaders (maintain patterns)
- Security headers or CSP (discuss implications first)

**Key reference files**: `src/app/layout.tsx`, `src/lib/blog.ts`, `src/lib/metadata.ts`, `src/lib/design-tokens.ts`, `src/proxy.ts`

---

## Design System Validation (MANDATORY)

**AI agents MUST follow this checklist before creating or modifying UI components:**

### Phase 1: Discovery (REQUIRED FIRST)

1. **Search for existing patterns:**
   - Use `semantic_search()` for similar components
   - Use `grep_search()` for similar styling patterns
   - Check `src/components/layouts/` for layout patterns
   - Check `src/components/ui/` for UI primitives

2. **Review design tokens:**
   - Read `src/lib/design-tokens.ts` for all constants
   - Import tokens: `SPACING`, `TYPOGRAPHY`, `HOVER_EFFECTS`, `CONTAINER_WIDTHS`, `PAGE_LAYOUT`

3. **Validate reusability:**
   - Does a similar component exist? → Extend it, don't duplicate
   - Do design tokens exist for this pattern? → Use them
   - Can I reuse PageLayout/PageHero/PageSection? → Always prefer reuse

### Phase 2: Implementation Standards

**Container & Layout:**
```typescript
// ✅ CORRECT: Use existing layout components
import { PageLayout, PageHero } from "@/components/layouts";
<PageLayout><PageHero title="..." /></PageLayout>

// ❌ WRONG: Creating custom layout
<div className="max-w-4xl mx-auto px-4">...</div>
```

**Typography:**
```typescript
// ✅ CORRECT: Use TYPOGRAPHY tokens
import { TYPOGRAPHY } from "@/lib/design-tokens";
<h1 className={TYPOGRAPHY.h1.standard}>Title</h1>

// ❌ WRONG: Inline typography
<h1 className="text-3xl font-semibold">Title</h1>
```

**Spacing:**
```typescript
// ✅ CORRECT: Use SPACING tokens
import { SPACING } from "@/lib/design-tokens";
<div className={SPACING.content}>...</div>

// ❌ WRONG: Magic numbers
<div className="space-y-6">...</div>
<div className="space-y-12">...</div>
```

**Padding (Cards & Sections):**
```typescript
// ✅ CORRECT: Standard values
<Card className="p-5">...</Card>          // Standard (20px)
<Card className="p-4">...</Card>          // Compact (16px)
<Card className="p-4 sm:p-6">...</Card>  // Responsive

// ❌ WRONG: Non-standard values
<Card className="p-6">...</Card>
<Card className="p-8">...</Card>
```

**Gaps (Grids & Flex):**
```typescript
// ✅ CORRECT: Standard values
<div className="grid gap-2">...</div>     // 8px tight
<div className="grid gap-3">...</div>     // 12px standard
<div className="grid gap-4">...</div>     // 16px comfortable

// ❌ WRONG: Non-standard values
<div className="grid gap-5">...</div>
<div className="grid gap-7">...</div>
```

**Hover Effects:**
```typescript
// ✅ CORRECT: Use HOVER_EFFECTS tokens
import { HOVER_EFFECTS } from "@/lib/design-tokens";
<Card className={HOVER_EFFECTS.card}>...</Card>

// ❌ WRONG: Custom hover
<Card className="hover:shadow-lg hover:-translate-y-1">...</Card>
```

**Colors & Theme:**
```typescript
// ✅ CORRECT: Use semantic color variables
<Card className="bg-card text-card-foreground border">...</Card>
<Button className="bg-primary text-primary-foreground">...</Button>
<p className="text-muted-foreground">...</p>

// ❌ WRONG: Hardcoded colors
<Card className="bg-white dark:bg-gray-900">...</Card>
<Button className="bg-blue-500 text-white">...</Button>
<p className="text-gray-600 dark:text-gray-400">...</p>

// ✅ CORRECT: Gradient overlays (use standard pattern)
<div className="bg-linear-to-b from-background/60 via-background/70 to-background/80" />

// ❌ WRONG: Non-standard opacity values
<div className="bg-linear-to-b from-background/50 via-background/65 to-background/90" />

// ⚠️ EXCEPTION: Destructive text (intentional for contrast)
<Button variant="destructive" className="text-white">Delete</Button>
```

**Borders & Shadows:**
```typescript
// ✅ CORRECT: Use semantic border classes
<Card className="border border-border">...</Card>
<Input className="border-input focus:ring-ring">...</Input>

// ✅ CORRECT: Use Tailwind shadow utilities
<Card className="shadow-sm">...</Card>    // Subtle
<Card className="shadow-md">...</Card>    // Default
<Card className="shadow-lg">...</Card>    // Prominent

// ❌ WRONG: Hardcoded borders
<Card className="border border-gray-200 dark:border-gray-800">...</Card>

// ❌ WRONG: Custom shadow values
<Card className="shadow-[0_0_20px_rgba(0,0,0,0.1)]">...</Card>
```

### Prohibited Patterns (FORBIDDEN)

**Never use these without explicit approval:**

- `space-y-5`, `space-y-7`, `space-y-9`, `space-y-12` (use SPACING tokens)
- `gap-5`, `gap-7`, `gap-8` (use gap-2/3/4)
- `p-6`, `p-7`, `p-8`, `py-6`, `px-7` (use p-4/p-5)
- `text-xl font-semibold`, `text-2xl font-bold` (use TYPOGRAPHY tokens)
- `max-w-5xl`, `max-w-7xl` (use CONTAINER_WIDTHS)
- Duplicating existing components (extend instead)

### Pre-Commit Validation

**Before submitting code, verify:**

- [ ] No hardcoded spacing values (use SPACING tokens)
- [ ] No inline typography (use TYPOGRAPHY tokens)
- [ ] Imports from `@/lib/design-tokens` where applicable
- [ ] UI primitives from `@/components/ui/*`
- [ ] Layout patterns from `@/components/layouts/*`
- [ ] No duplicate component implementations
- [ ] Component JSDoc documentation updated
- [ ] Skeleton component synced (if applicable)

**For detailed enforcement rules, see `/docs/design/ENFORCEMENT.md` and `/docs/design/ui-design-patterns-audit-2025.md`**

---

## Constraints

**Do NOT change without discussion**:
- UI library/CSS framework (stick to Tailwind + shadcn/ui)
- Import alias pattern (always use `@/*`)
- SEO routes location (`sitemap.ts`, `robots.ts` in `src/app/`)
- MDX processing pipeline (rehype/remark plugins)
- Blog post frontmatter schema (update types if changed)
- Error boundaries or skeleton loaders (maintain patterns)
- Security headers or CSP (discuss implications first)
- Design tokens or core component patterns (validate first)

**Key reference files**: `src/app/layout.tsx`, `src/lib/blog.ts`, `src/lib/metadata.ts`, `src/lib/design-tokens.ts`, `src/proxy.ts`

---

## CI/CD & Automation

**GitHub Workflows** (`.github/workflows/`):
- `test.yml` — Runs lint, typecheck, unit/e2e tests on push/PR
- `deploy.yml` — Deploys to Vercel (main → production, preview → staging)
- `dependabot-auto-merge.yml` — Auto-merges safe dependency updates
- `lighthouse-ci.yml` — Performance budgets on PRs to main
- `codeql.yml` — Security scanning (daily + on code changes)
- `sync-preview-branch.yml` — Keeps preview branch in sync with main
- `stale.yml` — Manages inactive issues/PRs

**Optimization principles**:
- Use concurrency groups to cancel redundant runs
- Cache dependencies and build artifacts
- Run independent jobs in parallel
- Fail fast on validation errors
- Use path filters to skip unnecessary runs

**Dependabot** (`.github/dependabot.yml`):
- Weekly npm updates (Monday 9am PT)
- Grouped by category (Next.js, dev deps, TypeScript, testing, UI, etc.)
- Auto-merge enabled for safe updates (dev deps patches/minors, prod patches)
- Manual review required for major versions or breaking changes

---

**VS Code Copilot Chat**: Available MCP servers for extended capabilities:
- Memory (context preservation), Sequential Thinking (complex planning), Context7 (library docs)
- Sentry (error monitoring), Vercel (deployments), GitHub PRs
Use these tools when relevant to the task at hand.