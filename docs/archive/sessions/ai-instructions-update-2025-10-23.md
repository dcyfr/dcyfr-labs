# AI Instructions Update - October 23, 2025

## Summary

Updated AI contributor instructions to accurately reflect the current state of the cyberdrew-dev project, which has evolved from a minimal portfolio into a full-featured blog and portfolio site.

## Changes Made

### 1. Project Description
**Before:**
> "This repo is a minimal developer portfolio built with Next.js..."

**After:**
> "This repo is a full-featured developer blog and portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui. The site features an MDX-powered blog, GitHub integration, Redis-backed view counts, and comprehensive security features."

### 2. Stack and Workspace
**Added:**
- MDX content processing with `next-mdx-remote`, `gray-matter`, and rehype/remark plugins
- Syntax highlighting via Shiki with dual-theme support
- Redis for post view counts (optional)
- Comprehensive stack description

### 3. Architecture and Routing
**Added:**
- API routes documentation:
  - `/api/contact` - Contact form submission
  - `/api/github-contributions` - GitHub heatmap data (with server-side caching)
- Dynamic routes: `/blog/[slug]` for individual blog posts
- Metadata routes: `sitemap.ts`, `robots.ts`, `/atom.xml`, `/rss.xml`
- Analytics integration in layout

### 4. Conventions and Patterns
**Added:**
- `src/data/posts.ts` for blog post data
- Error handling patterns with dedicated error boundaries
- Loading states with skeleton loaders
- Blog-specific components: `post-list`, `post-badges`, `github-heatmap`

### 5. New Blog System Section
**Comprehensive documentation added for:**
- Content structure (MDX files in `src/content/blog/`)
- Data layer (`src/lib/blog.ts`, `src/data/posts.ts`)
- Post types (draft, archived, featured, tags)
- Features:
  - Post badges (Draft/Archived/New/Hot)
  - Table of Contents auto-generation
  - Related posts algorithm
  - Reading progress indicator
  - View counts (Redis)
  - RSS/Atom feeds
- Rendering pipeline:
  - MDX processing
  - Syntax highlighting (Shiki)
  - Rehype/remark plugins
- Blog pages and components

### 6. New GitHub Integration Section
**Added documentation for:**
- GitHub contributions heatmap component
- API route with server-side caching (1 hour TTL)
- Optional `GITHUB_TOKEN` authentication
- Error handling and fallbacks
- Development indicators

### 7. Adding Pages/Components
**Added:**
- Blog post creation workflow
- Error boundary patterns
- Loading state patterns

### 8. What Not to Change
**Added:**
- Don't modify MDX processing pipeline without understanding plugins
- Don't change blog post frontmatter schema without updating types

### 9. Key Files Reference
**Updated to include blog-related files:**
- `src/app/blog/[slug]/page.tsx`
- `src/lib/blog.ts`
- `src/data/posts.ts`
- `src/components/post-list.tsx`
- `src/components/mdx.tsx`

**Removed outdated references:**
- `src/app/api/contact/route.ts` (still exists but not primary)
- `src/components/project-card.tsx` (still valid but blog is more prominent)

## Files Modified

1. `.github/copilot-instructions.md` - Source of truth for AI instructions
2. `agents.md` - Auto-synced copy for workspace visibility
3. `README.md` - Updated project title and description

## Impact

These updates ensure that AI assistants working on this project have accurate context about:
- The blog system and its features
- GitHub integration capabilities
- Error handling and loading state patterns
- MDX processing and content management
- Current architecture and conventions

This should improve AI assistant effectiveness by:
- Preventing outdated assumptions about project simplicity
- Providing correct patterns for blog-related work
- Documenting all major features and their locations
- Clarifying what should and shouldn't be modified

## Verification

All changes verified through:
- Workspace structure analysis
- Component inventory
- Feature documentation review
- Implementation changelog review
- Actual file presence checks

## Next Steps

None required. The AI instructions now accurately reflect the current project state. Future updates should be made to `.github/copilot-instructions.md` and synced using `npm run sync:agents`.
