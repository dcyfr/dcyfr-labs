# Documentation

This directory is the knowledge base for the portfolio. Content is organized by topic-focused subfolders for faster navigation.

## 🚀 Start Here

**New to this documentation?** Start with:
- **[`QUICK_START.md`](./QUICK_START.md)** – Single-page navigation hub linking all quick-references and guides
- **[`INDEX.md`](./INDEX.md)** – Complete directory structure and search-friendly index
- This `README.md` (current page) – Topic overview and key links

## Directory Overview

- `ai/discovery/` – AI discovery research, including [`overview.md`](./ai/discovery/overview.md), [`summary.md`](./ai/discovery/summary.md), and [`quick-reference.md`](./ai/discovery/quick-reference.md).
- `api/` – API integration references such as [`reference.md`](./api/reference.md).
- `blog/` – Blog system documentation:
	- [`architecture.md`](./blog/architecture.md) - Complete blog system architecture and data flow
	- [`quick-reference.md`](./blog/quick-reference.md) - Quick patterns and common tasks
	- [`content-creation.md`](./blog/content-creation.md) - Post authoring guide
	- [`mdx-processing.md`](./blog/mdx-processing.md) - MDX pipeline and plugins
	- [`frontmatter-schema.md`](./blog/frontmatter-schema.md) - Post metadata reference
- `components/` – Component documentation (15 files):
	- **Quick References:** [`post-badges.md`](./components/post-badges.md) · [`error-boundaries.md`](./components/error-boundaries.md) · [`loading-states.md`](./components/loading-states.md)
	- **Advanced Components:** [`related-posts.md`](./components/related-posts.md) · [`table-of-contents.md`](./components/table-of-contents.md) · [`syntax-highlighting.md`](./components/syntax-highlighting.md)
	- **Core Components:** [`mdx.md`](./components/mdx.md) · [`post-list.md`](./components/post-list.md) · [`blog-search-form.md`](./components/blog-search-form.md)
	- **Additional:** [`reading-progress.md`](./components/reading-progress.md) · [`github-heatmap.md`](./components/github-heatmap.md) · [`giscus-comments.md`](./components/giscus-comments.md) · [`share-buttons.md`](./components/share-buttons.md) · [`logo.md`](./components/logo.md) · [`blog-post-skeleton.md`](./components/blog-post-skeleton.md)
- `design/` – Design system and UX documentation:
	- [`typography.md`](./design/typography.md) - Typography system (Geist Sans, Source Serif 4, Geist Mono) with quick reference
	- [`print-stylesheet.md`](./design/print-stylesheet.md) - Print stylesheet implementation
	- [`color-contrast-improvements.md`](./design/color-contrast-improvements.md) - Accessibility improvements
	- **Mobile-First Design Optimization:**
		- [`mobile-first-optimization-analysis.md`](./design/mobile-first-optimization-analysis.md) - Comprehensive mobile UX analysis (500+ lines)
		- [`mobile-first-quick-reference.md`](./design/mobile-first-quick-reference.md) - Quick wins and priorities
		- [`mobile-first-visual-comparison.md`](./design/mobile-first-visual-comparison.md) - Before/after visual guide
	- [`ui-ux-optimization-roadmap.md`](./design/ui-ux-optimization-roadmap.md) - Animation and micro-interaction roadmap
- `features/` – Feature documentation:
	- [`inngest-integration.md`](./features/inngest-integration.md) - Complete Inngest background jobs guide (500+ lines)
	- [`inngest-testing.md`](./features/inngest-testing.md) - Testing quick reference
	- [`github-integration.md`](./features/github-integration.md) - GitHub API integration
- `mcp/` – Model Context Protocol documentation, including:
	- [`servers.md`](./mcp/servers.md) and [`quick-reference.md`](./mcp/quick-reference.md).
	- `filesystem-git/` for the Filesystem and Git MCP rollout (index, integration, quick reference, ready checklist).
	- `github/` for the GitHub MCP deployment notes and quick references.
	- `tests/` for validation documentation (`servers-test.md`, `servers-test-implementation.md`, `dependency-validation.md`).
- `operations/` – Operational checklists and historical change logs:
	- [`todo.md`](./operations/todo.md) - Active tasks and priorities
	- [`done.md`](./operations/done.md) - Completed projects archive
- `performance/` – Site performance documentation:
	- [`inp-optimization.md`](./performance/inp-optimization.md) - INP optimization
	- [`isr-implementation.md`](./performance/isr-implementation.md) - ISR setup and benefits
- `platform/` – Platform configuration references:
	- [`environment-variables.md`](./platform/environment-variables.md) - Complete environment setup and all variables
	- [`site-config.md`](./platform/site-config.md) - Domain and URL configuration
	- [`view-counts.md`](./platform/view-counts.md) - Blog analytics and Redis setup
- `rss/` – Feed documentation (`improvements.md`, `quick-reference.md`).
- `security/` – Security guidance including:
	- `csp/` for Content Security Policy implementation and quick reference.
	- `rate-limiting/` for rate limiting guides, flows, and implementation summaries.
	- [`security-findings-resolution.md`](./security/security-findings-resolution.md).
- `archive/` – Historical or superseded documentation retained for reference. Files here are read-only snapshots of earlier milestones.

## Quick Links

| Topic | Primary References |
|-------|--------------------|
| **Getting Started** | **[`QUICK_START.md`](./QUICK_START.md) - Navigation hub** |
| AI Discovery | [`overview.md`](./ai/discovery/overview.md) · [`summary.md`](./ai/discovery/summary.md) |
| APIs | [`api/reference.md`](./api/reference.md) · [`api/routes/overview.md`](./api/routes/overview.md) |
| Blog System | [`blog/architecture.md`](./blog/architecture.md) · [`blog/content-creation.md`](./blog/content-creation.md) · [`blog/quick-reference.md`](./blog/quick-reference.md) |
| Components | [`components/post-badges.md`](./components/post-badges.md) · [`components/error-boundaries.md`](./components/error-boundaries.md) · [`components/mdx.md`](./components/mdx.md) |
| Component List | *15 components documented* – [See components/](./components/) |
| Design System | [`design/typography.md`](./design/typography.md) · [`design/print-stylesheet.md`](./design/print-stylesheet.md) |
| **Mobile-First UX** | **[`design/mobile-first-optimization-analysis.md`](./design/mobile-first-optimization-analysis.md) · [`design/mobile-first-quick-reference.md`](./design/mobile-first-quick-reference.md)** |
| UI/UX Roadmap | [`design/ui-ux-optimization-roadmap.md`](./design/ui-ux-optimization-roadmap.md) |
| **Background Jobs** | **[`features/inngest-integration.md`](./features/inngest-integration.md) · [`features/inngest-testing.md`](./features/inngest-testing.md)** |
| GitHub Integration | [`features/github-integration.md`](./features/github-integration.md) |
| MCP (Core) | [`mcp/servers.md`](./mcp/servers.md) · [`mcp/quick-reference.md`](./mcp/quick-reference.md) |
| **Operations** | **[`operations/todo.md`](./operations/todo.md) · [`operations/done.md`](./operations/done.md)** |
| Performance | [`performance/bundle-analysis.md`](./performance/bundle-analysis.md) |
| Security – CSP | [`security/csp/nonce-implementation.md`](./security/csp/nonce-implementation.md) |
| Security – Rate Limiting | [`security/rate-limiting/guide.md`](./security/rate-limiting/guide.md) |
| **Environment Setup** | **[`platform/environment-variables.md`](./platform/environment-variables.md)** |
| Platform Config | [`platform/site-config.md`](./platform/site-config.md) · [`platform/view-counts.md`](./platform/view-counts.md) |
| RSS/Feeds | [`rss/improvements.md`](./rss/improvements.md) |

## Maintenance Guidelines

- Keep new documentation in the appropriate topical folder; avoid reintroducing flat files at the root.
- Normalize headings to start with a level-one title (`# Title`) followed by a short **Summary** section when adding new content.
- When archiving superseded material, move it into `archive/` and add a note at the top describing why it is archived.
- Update this README whenever folders or key references change to maintain a reliable entry point.

## Related References

- `.github/copilot-instructions.md` – AI contributor guidelines and architectural constraints.
- `agents.md` – Auto-synced instructions consumed by agents.
- Project root `README.md` – High-level overview and developer quick start.

_Last reorganized: October 27, 2025. [QUICK_START.md](./QUICK_START.md) added as primary entry point._
