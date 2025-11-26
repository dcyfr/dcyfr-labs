# Claude Code Instructions

Full-stack developer portfolio with Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, MDX blog, GitHub integration, and Redis analytics. Optimized for server-first rendering, type safety, and maintainable architecture.

## Current Focus (November 2025)

**Phase 4: Code Organization & Structural Improvements** 🔄

Critical priorities (see [`docs/operations/todo.md`](docs/operations/todo.md)):

1. Component reorganization (80 → feature-based structure)
2. Extract filter logic (eliminate 700+ lines duplication)
3. Decompose large lib files (6 files >500 lines)
4. Add barrel exports
5. Consolidate error boundaries

**Test Status**: 986/1049 passing (94.0%)

## Quick Reference

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + MDX
**Commands**: `npm run dev` • `npm run build` • `npm run lint` • `npm run test`
**Imports**: Always use `@/*` alias (never relative paths)

## Essential Patterns

**Layouts** (`src/components/layouts/`):

- Use `PageLayout` for all pages
- Use `PageHero` for hero sections
- Use `ArchiveLayout` for list pages
- Use `ArticleLayout` for blog posts

**Metadata** (`src/lib/metadata.ts`):
- `createPageMetadata()` for standard pages
- `createArchivePageMetadata()` for list pages
- `createArticlePageMetadata()` for blog posts

**Design Tokens** (`src/lib/design-tokens.ts`):
- Import `SPACING`, `TYPOGRAPHY`, `CONTAINER_WIDTHS`
- Never hardcode spacing or typography

## Design System Rules (MANDATORY)

**Before creating/modifying UI components:**

1. **Search for existing patterns** (use Grep/Glob)
2. **Check design tokens** in `src/lib/design-tokens.ts`
3. **Reuse components** from `layouts/` and `ui/`

**Always use:**
- ✅ `TYPOGRAPHY.h1.standard` for headings
- ✅ `SPACING.content` for spacing
- ✅ Semantic colors: `bg-card`, `text-primary`
- ✅ `PageLayout`, `PageHero` for layouts

**Never use:**
- ❌ Hardcoded spacing: `space-y-6`, `gap-8`, `p-7`
- ❌ Inline typography: `text-3xl font-semibold`
- ❌ Hardcoded colors: `bg-white dark:bg-gray-900`
- ❌ Duplicate existing components

**See [`docs/ai/DESIGN_SYSTEM.md`](docs/ai/DESIGN_SYSTEM.md) for comprehensive validation checklist**

## Key Constraints

**Do NOT change without discussion:**
- UI framework (Tailwind + shadcn/ui)
- Import alias (`@/*`)
- SEO routes (`sitemap.ts`, `robots.ts` location)
- MDX pipeline
- Design tokens
- Test coverage (maintain ≥94%)

## Workflow Guidelines

**Starting a session:**

1. Check [`docs/operations/todo.md`](docs/operations/todo.md) for priorities
2. Review recent commits: `git log --oneline -5`
3. Run tests: `npm run test`

**During implementation:**

1. Use TodoWrite for multi-step tasks
2. Follow existing patterns (layouts, metadata, design tokens)
3. Maintain test coverage
4. Be token-conscious (see optimization guide)

**Completing work:**

1. ✅ TypeScript compiles (`npm run typecheck`)
2. ✅ All tests pass (`npm run test`)
3. ✅ Lint passes (`npm run lint`)
4. ✅ Design tokens used (no hardcoded values)
5. Update `todo.md` and `done.md`

## Documentation

**Comprehensive guides** (load only when needed):

- [`docs/ai/BEST_PRACTICES.md`](docs/ai/BEST_PRACTICES.md) - Workflow best practices
- [`docs/ai/DESIGN_SYSTEM.md`](docs/ai/DESIGN_SYSTEM.md) - Complete design validation
- [`docs/ai/OPTIMIZATION_STRATEGY.md`](docs/ai/OPTIMIZATION_STRATEGY.md) - Token optimization
- [`docs/operations/PHASE_4_GUIDE.md`](docs/operations/PHASE_4_GUIDE.md) - Phase 4 workflows

**Domain-specific docs:**

- `/docs/architecture/` - Patterns, migration guides
- `/docs/design/` - Design system enforcement
- `/docs/testing/` - Test infrastructure
- `/docs/features/` - Feature guides
- `/docs/operations/` - Todo system, done.md

## Token Optimization

**Be conscious of context window usage:**

- Use **Grep** instead of Read for searching
- Read files **only when editing** them
- Load detailed docs **only when needed**
- Use agents **judiciously** (prefer direct tools)

**Typical budgets:**
- Quick fix: <20k tokens
- Feature: <50k tokens
- Refactoring: <100k tokens

See [`docs/ai/OPTIMIZATION_STRATEGY.md`](docs/ai/OPTIMIZATION_STRATEGY.md) for details.

## CI/CD

**All PRs must pass:**
- ESLint (0 errors)
- TypeScript compilation
- Tests (≥94% pass rate)
- Lighthouse CI (≥90% perf, ≥95% a11y)

## MCP Servers

Available via `.vscode/mcp.json`:
- Memory, Sequential Thinking, Context7
- Filesystem, GitHub, Vercel, Sentry

---

**For quick tasks**: Use this guide + design tokens
**For complex tasks**: Load relevant detailed guides from `/docs/ai/`
**For Phase 4 work**: See [`docs/operations/PHASE_4_GUIDE.md`](docs/operations/PHASE_4_GUIDE.md)
