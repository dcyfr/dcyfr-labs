# Documentation Index

**Last Updated:** November 15, 2025  
**Status:** Test coverage roadmap created - 3-phase plan to reach 80% coverage ✅

---

## 📊 Current Structure

The documentation is organized into **16 focused directories**:

### 📁 Core Documentation (9 directories)
1. **`architecture/`** - Architecture patterns and refactoring guides
2. **`blog/`** - Blog system documentation + content strategy + RSS feeds
3. **`components/`** - Component documentation (23 files)
4. **`api/`** - API integration references
5. **`features/`** - Feature guides (Inngest, GitHub, MCP, analytics)
6. **`design/`** - Design system and UX (organized by topic)
7. **`security/`** - Security implementation (CSP, rate limiting)
8. **`platform/`** - Platform configuration (env vars, site config)
9. **`operations/`** - Project management (todo, done, deployment)

### 🔧 Development & Optimization (2 directories)
10. **`development/`** - Testing + performance optimization
11. **`optimization/`** - SEO + accessibility + analytics

### 📦 Reference & Archive (3 directories)
12. **`archive/`** - Historical documentation
13. **`ai/`** - AI discovery research
14. **Root files** - `README.md`, `QUICK_START.md`, this `INDEX.md`

---

## 🎉 **LATEST: Test Coverage Roadmap (Nov 15, 2025)**

### What's New
- ✅ **Coverage analysis complete** - Current: 0.63%, Target: 80%
- ✅ **3-phase roadmap created** - 6-8 weeks to reach coverage goals
- ✅ **Prioritized testing plan** - Critical business logic first (metadata, rate-limit, feeds)
- ✅ **Comprehensive documentation** - Testing guide, quick reference, roadmap
- ✅ **Established milestones** - Phase 1: 25%, Phase 2: 50%, Phase 3: 80%

### Testing Documentation
- **[testing/README.md](./testing/README.md)** - Testing overview and setup
- **[testing/coverage-roadmap.md](./testing/coverage-roadmap.md)** - Detailed 3-phase plan
- **[testing/quick-reference.md](./testing/quick-reference.md)** - Commands and patterns

### Next Steps
1. Lower coverage thresholds temporarily (~10%) to unblock CI
2. Start Phase 1: Test critical business logic (14-18 hours)
3. Progress through phases incrementally over 6-8 weeks

---

## 📖 **Documentation Refactoring (Nov 14, 2025)**

### What Changed
- ✅ **Consolidated 21 → 16 directories** (24% reduction)
- ✅ **Archived `/fixes`** → `archive/fixes-2025/`
- ✅ **Created `/optimization`** ← merged seo + accessibility + analytics
- ✅ **Created `/development`** ← merged testing + performance
- ✅ **Moved `/mcp`** → `features/mcp/`
- ✅ **Organized `/design`** → typography/, mobile/, print/, spacing/, ui-patterns/
- ✅ **Merged `/rss`** → `blog/feeds/`
- ✅ **Merged `/content`** → `blog/`

### Benefits
- 🎯 **Clearer organization** - Related docs are together
- 📚 **Easier navigation** - Fewer top-level directories
- 🔍 **Better discoverability** - Logical groupings
- 🧹 **Cleaner structure** - No more scattered small directories

---

## 🏗️ **Architecture Refactoring Complete (Nov 10, 2025)**

Complete architecture overhaul with reusable patterns:

### Core Pages Refactor (Phases 1-4) ✅
- **Homepage**: 255 → 223 lines (12.5% reduction)
- **About Page**: 255 → 159 lines (38% reduction)
- **Contact Page**: 74 → 50 lines (32% reduction)
- **Resume Page**: 129 → 113 lines (12% reduction)
- **Total**: 726 → 569 lines (21.6% reduction)

### New Infrastructure
- ✅ 8 layout components (540+ lines)
- ✅ Centralized metadata helpers (455 lines)
- ✅ Enhanced design tokens
- ✅ Comprehensive documentation (2,000+ lines)

**See [`/docs/architecture/refactoring-complete.md`](./architecture/refactoring-complete.md) for full details.**

---

## 🚀 Quick Navigation

### Getting Started
- **[README.md](./README.md)** - Directory overview and quick links
- **[QUICK_START.md](./QUICK_START.md)** - Single-page navigation hub

### Architecture & Code
- **[architecture/README.md](./architecture/README.md)** - Architecture overview
- **[architecture/migration-guide.md](./architecture/migration-guide.md)** - Step-by-step migration
- **[components/](./components/)** - 23 component docs

### Blog System
- **[blog/architecture.md](./blog/architecture.md)** - Complete blog architecture
- **[blog/quick-reference.md](./blog/quick-reference.md)** - Common patterns
- **[blog/feeds/](./blog/feeds/)** - RSS/Atom feed documentation

### Features
- **[features/inngest-integration.md](./features/inngest-integration.md)** - Background jobs
- **[features/github-integration.md](./features/github-integration.md)** - GitHub API
- **[features/mcp/](./features/mcp/)** - Model Context Protocol

### Design System
- **[design/typography/](./design/typography/)** - Typography system
- **[design/mobile/](./design/mobile/)** - Mobile-first design
- **[design/spacing/](./design/spacing/)** - Spacing standards

### Development
- **[testing/README.md](./testing/README.md)** - Testing overview ⭐ NEW
- **[testing/coverage-roadmap.md](./testing/coverage-roadmap.md)** - 3-phase coverage plan ⭐ NEW
- **[testing/quick-reference.md](./testing/quick-reference.md)** - Testing commands & patterns ⭐ NEW
- **[development/](./development/)** - Performance optimization guides
- **[optimization/](./optimization/)** - SEO + accessibility + analytics

### Configuration
- **[platform/environment-variables.md](./platform/environment-variables.md)** - Complete env setup
- **[security/](./security/)** - CSP, rate limiting, security guides
- **[api/routes/overview.md](./api/routes/overview.md)** - API architecture

### Operations
- **[operations/todo.md](./operations/todo.md)** - Active tasks
- **[operations/done.md](./operations/done.md)** - Completed work

---

## 📈 Structure Metrics

### Before Refactoring
- **21 top-level directories**
- Scattered small directories (seo, accessibility, analytics, testing, performance)
- Fixes in active docs
- RSS/content separate from blog
- MCP outside features
- Flat design/ directory (32 files)

### After Refactoring
- **16 top-level directories** (24% reduction)
- Consolidated optimization/ and development/
- Fixes archived
- RSS and content merged into blog/
- MCP properly organized under features/
- Design/ organized into subdirectories

---

## 🎯 Directory Purposes

### `architecture/`
Architecture patterns, refactoring guides, migration docs, best practices

### `blog/`
Blog system architecture, content creation, MDX processing, frontmatter schema, RSS feeds, content strategy

### `components/`
23 component docs covering UI components, error boundaries, loading states, and advanced features

### `api/`
API integration references, route documentation, rate limiting, error handling

### `features/`
Feature guides for Inngest, GitHub integration, MCP servers, analytics, OG images

### `design/`
Design system organized by topic:
- `typography/` - Font system and rendering
- `mobile/` - Mobile-first optimization
- `print/` - Print stylesheet
- `spacing/` - Spacing standards
- `ui-patterns/` - Component patterns

### `security/`
Security implementation guides for CSP, rate limiting, and security best practices

### `platform/`
Platform configuration: environment variables, site config, view counts, deployment

### `operations/`
Project management: todo lists, completed work, deployment guides, automation

### `development/`
Testing and performance: Lighthouse CI, bundle analysis, INP optimization, ISR

**Testing subdirectory** (`testing/`):
- Test infrastructure setup (Vitest, Playwright, Testing Library)
- 3-phase coverage roadmap (0.63% → 80% coverage)
- Quick reference for commands and patterns
- Mocking strategies and best practices

### `optimization/`
SEO, accessibility, and analytics: meta tags, alt text, JSON-LD, tag analytics

### `archive/`
Historical documentation retained for reference

### `ai/`
AI discovery research and documentation

---

## 📝 Maintenance Guidelines

- Keep documentation in appropriate topical folders
- Use subdirectories when a category grows beyond 10-12 files
- Archive completed implementations to `archive/`
- Update this INDEX and README when structure changes
- Cross-reference related docs with relative links

---

_Last updated: November 15, 2025. Latest: Test coverage roadmap created - 3-phase plan to 80% coverage._
