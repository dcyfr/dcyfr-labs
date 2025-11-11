# Documentation

This directory is the knowledge base for the portfolio. Content is organized by topic-focused subfolders for faster navigation.

## 🚀 Start Here

**New to this documentation?** Start with:
- **[`QUICK_START.md`](./QUICK_START.md)** – Single-page navigation hub linking all quick-references and guides
- **[`INDEX.md`](./INDEX.md)** – Complete directory structure and search-friendly index
- This `README.md` (current page) – Topic overview and key links

## Directory Overview

- **`architecture/`** – Architecture patterns and refactoring guides
  - [`README.md`](./architecture/README.md) - Architecture overview
  - [`refactoring-complete.md`](./architecture/refactoring-complete.md) - Complete refactoring summary
  - [`migration-guide.md`](./architecture/migration-guide.md) - Step-by-step migration guide (500+ lines)
  - [`examples.md`](./architecture/examples.md) - Practical code examples (400+ lines)
  - [`best-practices.md`](./architecture/best-practices.md) - Architectural guidelines (550+ lines)
  
- **`blog/`** – Blog system documentation:
  - [`architecture.md`](./blog/architecture.md) - Complete blog system architecture and data flow
  - [`quick-reference.md`](./blog/quick-reference.md) - Quick patterns and common tasks
  - [`content-creation.md`](./blog/content-creation.md) - Post authoring guide
  - [`mdx-processing.md`](./blog/mdx-processing.md) - MDX pipeline and plugins
  - [`frontmatter-schema.md`](./blog/frontmatter-schema.md) - Post metadata reference

- **`components/`** – Component documentation (15+ files):
  - **Quick References:** [`post-badges.md`](./components/post-badges.md) · [`error-boundaries.md`](./components/error-boundaries.md) · [`loading-states.md`](./components/loading-states.md)
  - **Advanced Components:** [`related-posts.md`](./components/related-posts.md) · [`table-of-contents.md`](./components/table-of-contents.md) · [`syntax-highlighting.md`](./components/syntax-highlighting.md)
  - **Core Components:** [`mdx.md`](./components/mdx.md) · [`post-list.md`](./components/post-list.md) · [`blog-search-form.md`](./components/blog-search-form.md)
  - **Additional:** [`reading-progress.md`](./components/reading-progress.md) · [`github-heatmap.md`](./components/github-heatmap.md) · [`giscus-comments.md`](./components/giscus-comments.md) · [`share-buttons.md`](./components/share-buttons.md) · [`logo.md`](./components/logo.md) · [`blog-post-skeleton.md`](./components/blog-post-skeleton.md) · [`about-page-components.md`](./components/about-page-components.md)

- **`api/`** – API integration references:
  - [`routes/overview.md`](./api/routes/overview.md) - API architecture, rate limiting, error handling
  - [`routes/contact.md`](./api/routes/contact.md) - Contact form endpoint
  - [`routes/github-contributions.md`](./api/routes/github-contributions.md) - GitHub API integration
  - [`reference.md`](./api/reference.md) - Quick API reference

- **`features/`** – Feature guides:
  - [`inngest-integration.md`](./features/inngest-integration.md) - Complete Inngest background jobs guide (500+ lines)
  - [`inngest-testing.md`](./features/inngest-testing.md) - Testing and debugging guide
  - [`github-integration.md`](./features/github-integration.md) - GitHub API integration

- **`design/`** – Design system and UX documentation:
  - [`typography.md`](./design/typography.md) - Typography system (Geist Sans, Source Serif 4, Geist Mono)
  - [`print-stylesheet.md`](./design/print-stylesheet.md) - Print stylesheet implementation
  - [`color-contrast-improvements.md`](./design/color-contrast-improvements.md) - Accessibility improvements
  - **Mobile-First Design:**
    - [`mobile-first-optimization-analysis.md`](./design/mobile-first-optimization-analysis.md) - Mobile UX analysis (500+ lines)
    - [`mobile-first-quick-reference.md`](./design/mobile-first-quick-reference.md) - Quick wins
    - [`mobile-first-visual-comparison.md`](./design/mobile-first-visual-comparison.md) - Before/after visual guide
  - [`ui-ux-optimization-roadmap.md`](./design/ui-ux-optimization-roadmap.md) - Animation roadmap

- **`security/`** – Security implementation:
  - `csp/` - Content Security Policy with nonce implementation
  - `rate-limiting/` - Rate limiting guides and flows
  - [`security-findings-resolution.md`](./security/security-findings-resolution.md)

- **`operations/`** – Project management:
  - [`todo.md`](./operations/todo.md) - Active tasks and priorities
  - [`done.md`](./operations/done.md) - Completed projects archive
  
- **`platform/`** – Platform configuration:
  - [`environment-variables.md`](./platform/environment-variables.md) - Complete environment setup
  - [`site-config.md`](./platform/site-config.md) - Domain and URL configuration
  - [`view-counts.md`](./platform/view-counts.md) - Blog analytics and Redis setup

- **`performance/`** – Site performance:
  - [`inp-optimization.md`](./performance/inp-optimization.md) - INP optimization
  - [`isr-implementation.md`](./performance/isr-implementation.md) - ISR setup

- **`mcp/`** – Model Context Protocol documentation:
  - [`servers.md`](./mcp/servers.md) and [`quick-reference.md`](./mcp/quick-reference.md)
  - Subdirectories for specific MCP implementations

- **`rss/`** – RSS/Atom feed documentation:
  - [`improvements.md`](./rss/improvements.md) · [`quick-reference.md`](./rss/quick-reference.md)

- **`ai/discovery/`** – AI discovery research:
  - [`overview.md`](./ai/discovery/overview.md) · [`summary.md`](./ai/discovery/summary.md) · [`quick-reference.md`](./ai/discovery/quick-reference.md)

- **`archive/`** – Historical documentation (read-only):
  - See [`archive/README.md`](./archive/README.md) for complete archive index
  - Superseded documentation retained for reference

## Quick Links

| Topic | Primary References |
|-------|--------------------|
| **Getting Started** | **[`QUICK_START.md`](./QUICK_START.md) - Navigation hub** |
| **Architecture** | **[`architecture/README.md`](./architecture/README.md) · [`architecture/migration-guide.md`](./architecture/migration-guide.md)** |
| AI Discovery | [`overview.md`](./ai/discovery/overview.md) · [`summary.md`](./ai/discovery/summary.md) |
| APIs | [`api/reference.md`](./api/reference.md) · [`api/routes/overview.md`](./api/routes/overview.md) |
| Blog System | [`blog/architecture.md`](./blog/architecture.md) · [`blog/content-creation.md`](./blog/content-creation.md) · [`blog/quick-reference.md`](./blog/quick-reference.md) |
| Components | [`components/post-badges.md`](./components/post-badges.md) · [`components/error-boundaries.md`](./components/error-boundaries.md) · [`components/mdx.md`](./components/mdx.md) |
| Component List | *15+ components documented* – [See components/](./components/) |
| Design System | [`design/typography.md`](./design/typography.md) · [`design/print-stylesheet.md`](./design/print-stylesheet.md) |
| **Mobile-First UX** | **[`design/mobile-first-optimization-analysis.md`](./design/mobile-first-optimization-analysis.md) · [`design/mobile-first-quick-reference.md`](./design/mobile-first-quick-reference.md)** |
| UI/UX Roadmap | [`design/ui-ux-optimization-roadmap.md`](./design/ui-ux-optimization-roadmap.md) |
| **Background Jobs** | **[`features/inngest-integration.md`](./features/inngest-integration.md) · [`features/inngest-testing.md`](./features/inngest-testing.md)** |
| GitHub Integration | [`features/github-integration.md`](./features/github-integration.md) |
| MCP (Core) | [`mcp/servers.md`](./mcp/servers.md) · [`mcp/quick-reference.md`](./mcp/quick-reference.md) |
| **Operations** | **[`operations/todo.md`](./operations/todo.md) · [`operations/done.md`](./operations/done.md)** |
| Performance | [`performance/inp-optimization.md`](./performance/inp-optimization.md) · [`performance/isr-implementation.md`](./performance/isr-implementation.md) |
| Security – CSP | [`security/csp/nonce-implementation.md`](./security/csp/nonce-implementation.md) |
| Security – Rate Limiting | [`security/rate-limiting/guide.md`](./security/rate-limiting/guide.md) |
| **Environment Setup** | **[`platform/environment-variables.md`](./platform/environment-variables.md)** |
| Platform Config | [`platform/site-config.md`](./platform/site-config.md) · [`platform/view-counts.md`](./platform/view-counts.md) |
| RSS/Feeds | [`rss/improvements.md`](./rss/improvements.md) |
| **Archive** | **[`archive/README.md`](./archive/README.md) - Historical docs** |

## Maintenance Guidelines

- Keep new documentation in the appropriate topical folder; avoid reintroducing flat files at the root.
- Normalize headings to start with a level-one title (`# Title`) followed by a short **Summary** section when adding new content.
- When archiving superseded material, move it into `archive/` and add a note at the top describing why it is archived.
- Update this README whenever folders or key references change to maintain a reliable entry point.

## Related References

- `.github/copilot-instructions.md` – AI contributor guidelines and architectural constraints.
- `agents.md` – Auto-synced instructions consumed by agents.
- Project root `README.md` – High-level overview and developer quick start.

_Last updated: November 10, 2025. Comprehensive cleanup and architecture documentation update._
