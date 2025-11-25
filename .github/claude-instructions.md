# Claude Code Instructions

Full-stack developer portfolio with Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, MDX blog, GitHub integration, and Redis analytics. Optimized for server-first rendering, type safety, and maintainable architecture.

## Tool Context

**Claude Code (CLI)**: Primary development assistant — performs comprehensive codebase analysis, executes multi-step refactoring, validates changes, and maintains architectural consistency. Use for complex implementation workflows requiring deep context and planning.

**VS Code Copilot Chat (IDE)**: Quick suggestions — inline code completion, simple explanations, and snippet generation. Use for single-file edits and immediate coding assistance.

Claude Code provides superior architectural awareness through deep codebase exploration and can handle the complex refactoring tasks outlined in Phase 4 (component reorganization, code deduplication, library restructuring).

## Current Project Status (November 2025)

**Phase Completion**:
- ✅ **Phase 1**: Foundation & Reliability (testing infrastructure, monitoring, uptime)
- ✅ **Phase 2**: Performance & Visibility (SEO, content calendar, conversion tracking)
- ✅ **Phase 3**: Enhancement & Polish (keyboard shortcuts, analytics dashboard)
- 🔄 **Phase 4**: Code Organization & Structural Improvements (CURRENT)

**Critical Priorities** (from `docs/operations/todo.md`):
1. Component directory reorganization (80 components in root → feature-based structure)
2. Extract common filter logic (eliminate 700+ lines of duplication)
3. Decompose large lib files (6 files exceed 500 lines)
4. Add barrel exports (improve import ergonomics)
5. Consolidate error boundaries and CSS organization

**Testing Status**:
- 986/1049 tests passing (94.0% pass rate)
- 198 integration tests covering all critical workflows
- Comprehensive test coverage for business logic

See [`docs/operations/todo.md`](../docs/operations/todo.md) for complete task list.

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
├── components/            # 🚨 NEEDS REORGANIZATION (Phase 4.1)
│   ├── layouts/           # Reusable page patterns
│   ├── ui/                # shadcn/ui primitives
│   ├── analytics/         # Analytics dashboard (well-organized)
│   ├── dashboard/         # Dashboard utilities (well-organized)
│   └── [80+ files]        # ⚠️ Components in root need grouping
├── content/blog/          # MDX posts with frontmatter
├── data/                  # Typed data (posts, projects, resume)
├── lib/                   # 🚨 NEEDS DECOMPOSITION (Phase 4.4)
│   ├── analytics.ts       # ⚠️ 558 lines, 22 exports
│   ├── metadata.ts        # ⚠️ 496 lines, 7 exports
│   └── [29 other files]   # Some need splitting
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
- Deep dive → See `/docs/architecture/` for migration guides

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
**Session**: Use TodoWrite tool for multi-step tasks within a conversation
**Workflow**:
1. Check `todo.md` for Phase 4 priorities
2. Use TodoWrite to track implementation progress
3. Update both files on completion (mark task complete in todo.md, add session summary to done.md)
4. Archive completed items with learnings and metrics

## Documentation Structure

All docs in `/docs/` organized by domain:
- `/docs/architecture/` — Patterns, migration guides, examples
- `/docs/blog/` — Content creation, MDX pipeline, frontmatter schema
- `/docs/components/` — Component API docs with JSDoc
- `/docs/api/` — API routes, rate limiting, error handling
- `/docs/features/` — Feature guides (Inngest, GitHub, analytics)
- `/docs/security/` — CSP, rate limiting, security patterns
- `/docs/design/` — Design system, tokens, enforcement rules
- `/docs/testing/` — Testing infrastructure, coverage roadmap
- `/docs/operations/` — Todo system, environment setup, done.md archive
- `/docs/platform/` — Vercel config, domain setup, analytics

**For Complex Tasks**: Reference specific docs when implementing Phase 4 refactoring or major features

## Design System Validation (MANDATORY)

**Claude Code MUST follow this checklist before creating or modifying UI components:**

### Phase 1: Discovery (REQUIRED FIRST)

1. **Search for existing patterns:**
   - Use Grep/Glob tools to find similar components
   - Check `src/components/layouts/` for layout patterns
   - Check `src/components/ui/` for UI primitives
   - Verify no duplication before creating new components

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
```

**Colors & Theme:**
```typescript
// ✅ CORRECT: Use semantic color variables
<Card className="bg-card text-card-foreground border">...</Card>
<Button className="bg-primary text-primary-foreground">...</Button>

// ❌ WRONG: Hardcoded colors
<Card className="bg-white dark:bg-gray-900">...</Card>
<Button className="bg-blue-500 text-white">...</Button>
```

**For detailed enforcement rules, see `/docs/design/ENFORCEMENT.md`**

### Prohibited Patterns (FORBIDDEN)

**Never use these without explicit approval:**

- `space-y-5`, `space-y-7`, `space-y-9` (use SPACING tokens)
- `gap-5`, `gap-7`, `gap-8` (use gap-2/3/4)
- `p-6`, `p-7`, `p-8` (use p-4/p-5)
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
- [ ] Tests added/updated for new functionality
- [ ] All tests passing (`npm run test`)

## Phase 4: Code Organization Guidelines

**When performing Phase 4 refactoring tasks:**

### Component Reorganization (Phase 4.1)

**Feature-Based Directory Structure:**
```
components/
├── ui/                    # Keep as-is (shadcn primitives)
├── layouts/               # Keep as-is (page patterns)
├── analytics/             # Keep as-is (dashboard components)
├── dashboard/             # Keep as-is (well-organized)
├── blog/                  # NEW - 14 blog components
│   ├── filters/          # blog-filters.tsx
│   ├── sidebar/          # blog-sidebar.tsx
│   ├── post/             # post-list, post-badges, etc.
│   └── index.ts          # Barrel export
├── projects/              # NEW - 4 project components
├── resume/                # NEW - 10 resume components
├── about/                 # NEW - 3 about components
├── home/                  # NEW - 2 homepage components
├── common/                # NEW - Shared components
│   ├── filters/          # Extracted filter logic (Phase 4.2)
│   ├── error-boundaries/
│   ├── skeletons/
│   └── stats/
└── navigation/            # NEW - Nav components
```

**Migration Process:**
1. Create new directory structure first
2. Move components to appropriate locations
3. Update imports using Find/Replace with regex
4. Add barrel exports (index.ts) to each directory
5. Verify TypeScript compilation succeeds
6. Run full test suite
7. Update any documentation references

### Filter Logic Extraction (Phase 4.2)

**Target Files with 90%+ Duplication:**
- `components/blog-filters.tsx` (261 lines)
- `components/project-filters.tsx` (304 lines)
- `components/layouts/archive-filters.tsx`
- `components/analytics/analytics-filters.tsx` (585 lines!)

**Extraction Strategy:**
1. Create `components/common/filters/` directory
2. Extract shared types, hooks, and components
3. Build composable filter system:
   - `FilterProvider.tsx` (context)
   - `SearchInput.tsx` (debounced search)
   - `SelectFilter.tsx` (generic dropdown)
   - `TagFilter.tsx` (multi-select badges)
   - `ClearButton.tsx` (clear all)
   - `useFilterState.ts` (URL param management)
4. Refactor existing filters to use new system
5. Maintain existing functionality and tests

### Library Decomposition (Phase 4.4)

**Large Files Needing Split:**
- `lib/analytics.ts` (558 lines, 22 exports) → `lib/analytics/`
  - `fetching.ts` - Data fetching functions
  - `aggregations.ts` - Data processing
  - `transformations.ts` - Data transformations
  - `index.ts` - Barrel export
- `lib/metadata.ts` (496 lines, 7 exports) → `lib/metadata/`
  - `pages.ts` - Page metadata
  - `structured-data.ts` - JSON-LD schemas
  - `social.ts` - Open Graph/Twitter cards
  - `index.ts` - Barrel export

**Decomposition Process:**
1. Analyze file to identify logical groupings
2. Create subdirectory with descriptive name
3. Split functions into focused files
4. Add comprehensive JSDoc to each function
5. Create barrel export maintaining existing API
6. Update imports across codebase
7. Verify no breaking changes (run tests)

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
- Test coverage (maintain or improve, don't reduce)

**Key reference files**:
- `src/app/layout.tsx` - Root layout
- `src/lib/blog.ts` - Blog utilities
- `src/lib/metadata.ts` - Metadata generation
- `src/lib/design-tokens.ts` - Design system
- `src/proxy.ts` - CSP implementation
- `vitest.config.ts` - Test configuration
- `docs/operations/todo.md` - Current priorities

## CI/CD & Automation

**GitHub Workflows** (`.github/workflows/`):
- `test.yml` — Runs lint, typecheck, unit/e2e tests on push/PR
- `lighthouse-ci.yml` — Performance budgets on PRs (≥90% perf, ≥95% a11y)
- `dependabot-auto-merge.yml` — Auto-merges safe dependency updates
- `codeql.yml` — Security scanning (daily + on code changes)

**Testing Commands**:
```bash
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run check             # Both lint + typecheck
npm run test              # Vitest unit tests
npm run test:coverage     # Coverage report
npm run test:integration  # Integration tests
npm run test:e2e          # Playwright E2E tests
```

**Performance Budgets**:
- Lighthouse Performance ≥ 90%
- Lighthouse Accessibility ≥ 95%
- First Load JS < 150 kB
- Main bundle < 100 kB
- Page bundles < 50 kB

**All PRs must pass:**
- [ ] ESLint (no errors)
- [ ] TypeScript compilation
- [ ] Unit tests (maintain 94%+ pass rate)
- [ ] Integration tests (all passing)
- [ ] Lighthouse CI budgets

## Claude Code Strengths

**Use Claude Code for:**

1. **Comprehensive Codebase Analysis**
   - Structural audits (Phase 4 analysis completed)
   - Dependency mapping and circular dependency detection
   - Code duplication detection across files
   - Architectural pattern analysis

2. **Multi-File Refactoring**
   - Component reorganization (Phase 4.1)
   - Filter logic extraction (Phase 4.2)
   - Library decomposition (Phase 4.4)
   - Import path updates across entire codebase

3. **Complex Implementation Workflows**
   - New feature implementation with multiple touchpoints
   - Test-driven development with comprehensive coverage
   - Security-critical changes (CSP, rate limiting, validation)
   - Performance optimizations requiring measurement

4. **Documentation & Knowledge Management**
   - Updating architectural documentation after refactoring
   - Maintaining todo.md and done.md sync
   - Creating comprehensive session summaries
   - Generating technical specification documents

5. **Problem Investigation**
   - Root cause analysis for bugs
   - Performance bottleneck identification
   - Security vulnerability assessment
   - Test failure diagnosis

**Avoid Claude Code for:**
- Single-line typo fixes (use VS Code directly)
- Simple variable renames in one file (use IDE refactoring)
- Quick config tweaks (edit directly)
- Trivial documentation updates

## MCP Servers (Available in VS Code)

Claude Code has access to these MCP servers via `.vscode/mcp.json`:

- **Memory**: Context preservation across sessions
- **Sequential Thinking**: Complex planning and reasoning
- **Context7**: Library documentation lookup
- **Filesystem**: Direct access to blog content, docs, data files
- **GitHub**: Repository operations, PR management
- **Vercel**: Deployment status, preview URLs
- **Sentry**: Error monitoring, issue tracking

Use these tools when relevant to the task at hand.

## Best Practices for Claude Code

### Starting a Session

1. **Check Current State**
   - Read `docs/operations/todo.md` for priorities
   - Review recent commits for context
   - Check test status: `npm run test`

2. **Plan Before Acting**
   - For Phase 4 tasks, outline approach first
   - Identify all files that need changes
   - Consider backward compatibility
   - Plan for test coverage

3. **Use TodoWrite Tool**
   - Break complex tasks into subtasks
   - Mark progress as you work
   - Update persistent todo.md on completion

### During Implementation

1. **Maintain Test Coverage**
   - Run relevant tests after each change
   - Add new tests for new functionality
   - Update existing tests if behavior changes
   - Aim for ≥94% pass rate

2. **Preserve Architecture**
   - Follow existing patterns
   - Use design tokens and layout components
   - Maintain import conventions
   - Respect file organization

3. **Document as You Go**
   - Update JSDoc for modified functions
   - Add inline comments for complex logic
   - Update README if user-facing changes
   - Note breaking changes clearly

### Completing Work

1. **Validation Checklist**
   - [ ] TypeScript compiles without errors
   - [ ] All tests pass
   - [ ] Lint passes (no errors)
   - [ ] Design token usage verified
   - [ ] No hardcoded values where tokens exist
   - [ ] Barrel exports added where appropriate
   - [ ] Documentation updated

2. **Update Tracking**
   - Mark task complete in `todo.md`
   - Add session summary to `done.md` with:
     - Completion date
     - Effort estimation accuracy
     - Key accomplishments
     - Files changed
     - Learnings and gotchas
     - Impact assessment

3. **Communicate Results**
   - Summarize what was done
   - Note any deviations from plan
   - Highlight important decisions
   - Recommend next steps

## Example Workflows

### Phase 4.1: Component Reorganization

```markdown
1. Read current component structure
2. Create new directory structure in components/
3. Move blog components to components/blog/
4. Update imports using Grep + Edit
5. Create barrel exports (index.ts)
6. Run TypeScript compilation
7. Run test suite
8. Update component documentation
9. Mark task complete in todo.md
10. Add session summary to done.md
```

### Phase 4.2: Filter Logic Extraction

```markdown
1. Analyze all 4 filter components for commonalities
2. Design reusable filter composition API
3. Create components/common/filters/ structure
4. Extract shared types and hooks
5. Build composable filter components
6. Refactor blog-filters.tsx to use new system
7. Verify functionality maintained (test blog filters)
8. Refactor project-filters.tsx
9. Refactor archive-filters.tsx
10. Refactor analytics-filters.tsx
11. Remove duplicated code
12. Run full test suite
13. Update documentation
14. Mark task complete, update done.md
```

---

**Key Difference from Copilot**: Claude Code excels at multi-file refactoring, architectural analysis, and maintaining consistency across large codebases. Use it for Phase 4's complex reorganization tasks where understanding the full context is critical.

**For quick reference during development, see:**
- Design system: `/docs/design/ENFORCEMENT.md`
- Architecture patterns: `/docs/architecture/`
- Testing guide: `/docs/testing/`
- Current priorities: `/docs/operations/todo.md`
