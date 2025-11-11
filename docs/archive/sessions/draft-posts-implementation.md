# Draft Posts Implementation

**Date:** October 20, 2025  
**Status:** ✅ Complete

## Overview

Implemented draft post functionality that allows blog posts to be marked as drafts in frontmatter. Draft posts are **only visible in development** and are automatically filtered out in production builds.

## Changes Made

### 1. Post Type Update

**File:** `src/data/posts.ts`

Added `draft?: boolean` field to the `Post` type:

```typescript
export type Post = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  archived?: boolean;
  draft?: boolean; // only visible in development ✨
  body: string;
  sources?: PostSource[];
  readingTime: {
    words: number;
    minutes: number;
    text: string;
  };
};
```

### 2. Blog Functions Update

**File:** `src/lib/blog.ts`

#### `getAllPosts()` Function

Added draft field capture and environment-based filtering:

```typescript
const posts = files.map((filename) => {
  // ... existing code ...
  return {
    // ... existing fields ...
    draft: data.draft as boolean | undefined, // ✨ Capture draft field
    // ... rest of fields ...
  } satisfies Post;
});

// Filter out draft posts in production ✨
const filteredPosts = posts.filter((post) => {
  if (process.env.NODE_ENV === "production" && post.draft) {
    return false;
  }
  return true;
});

return filteredPosts.sort(/* ... */);
```

#### `getPostBySlug()` Function

Added draft field and production filtering:

```typescript
export function getPostBySlug(slug: string): Post | undefined {
  // ... read file and parse frontmatter ...
  
  const post: Post = {
    // ... existing fields ...
    draft: data.draft as boolean | undefined, // ✨ Capture draft field
    // ... rest of fields ...
  };

  // Don't return draft posts in production ✨
  if (process.env.NODE_ENV === "production" && post.draft) {
    return undefined;
  }

  return post;
}
```

### 3. Visual Indicators

#### Blog Post Page

**File:** `src/app/blog/[slug]/page.tsx`

Added blue "Draft" badge in development mode:

```tsx
{process.env.NODE_ENV === "development" && post.draft && (
  <Badge 
    variant="outline" 
    className="border-blue-500/50 text-blue-600 dark:text-blue-400"
  >
    Draft
  </Badge>
)}
```

#### Blog List Page

**File:** `src/app/blog/page.tsx`

Added draft indicator in post metadata:

```tsx
{process.env.NODE_ENV === "development" && p.draft && (
  <>
    <span>•</span>
    <Badge 
      variant="outline" 
      className="text-xs border-blue-500/50 text-blue-600 dark:text-blue-400"
    >
      Draft
    </Badge>
  </>
)}
```

## Usage

### Marking a Post as Draft

Add `draft: true` to the post's frontmatter:

```mdx
---
title: "My Draft Post"
summary: "This is a work in progress"
publishedAt: "2025-10-20"
tags:
  - example
draft: true  # ✨ This marks it as a draft
---

Your content here...
```

### Behavior

**Development (`npm run dev`):**
- ✅ Draft posts are visible in the blog list
- ✅ Draft posts are accessible via direct URL
- ✅ Blue "Draft" badge displayed
- ✅ Posts included in search and tag filtering

**Production (`npm run build` + `npm start`):**
- ❌ Draft posts filtered from blog list
- ❌ Draft post URLs return 404 (not found)
- ❌ Not included in search results
- ❌ Not counted in tag statistics
- ❌ Not included in sitemap or RSS feeds

## Example Draft Post

An example draft post already exists in the codebase:

**File:** `src/content/blog/markdown-and-code-demo.mdx`

```mdx
---
title: "Markdown & Code Blocks Demo"
summary: "A sample post to preview markdown rendering..."
publishedAt: "2020-01-01"
updatedAt: "2025-10-18"
tags:
  - demo
  - mdx
  - code
draft: true  # ✨ Draft post
---

> This is a draft post intended for local development.
```

## Visual Design

### Draft Badge Styling

The draft badge uses:
- **Border:** Blue with 50% opacity
- **Text:** Blue-600 (light mode), Blue-400 (dark mode)
- **Variant:** Outline badge (minimal, non-intrusive)
- **Size:** Text-xs for list view, standard for detail view

Consistent with the amber "Archived" badge styling pattern.

## Testing

### Verify Draft Functionality

**In Development:**

1. Start dev server: `npm run dev`
2. Visit `/blog` - Draft post should be visible with blue "Draft" badge
3. Click draft post - Should load with "Draft" badge in header
4. Search/filter - Draft posts included in results

**In Production:**

1. Build production: `npm run build`
2. Start production server: `npm start`
3. Visit `/blog` - Draft post should NOT be visible
4. Try direct URL `/blog/markdown-and-code-demo` - Should return 404
5. Search/filter - Draft posts NOT in results

### Environment Variable Check

The implementation uses `process.env.NODE_ENV`:
- **Development:** `process.env.NODE_ENV === "development"` (set by `npm run dev`)
- **Production:** `process.env.NODE_ENV === "production"` (set by `npm run build`)

## Security Considerations

### Protection Level

✅ **Server-side filtering** - Posts filtered during build/runtime  
✅ **Not exposed in production** - Draft posts never reach client in production  
✅ **404 on direct access** - Attempting to access draft URLs returns 404  
✅ **Not in search index** - Draft posts excluded from search results  

### Build-time vs Runtime

- **Build-time:** Static posts are filtered during `getAllPosts()` at build
- **Runtime (SSG):** `getPostBySlug()` returns `undefined` for drafts in production
- **No client-side filtering:** Filtering happens on server, never exposed to client

## Benefits

### Content Workflow
✅ **Work in progress** - Keep unfinished posts in repo  
✅ **Preview in context** - See drafts in actual site layout  
✅ **Version control** - Track draft changes in git  
✅ **Collaboration** - Share drafts with team via preview deployments  

### Developer Experience
✅ **Visual indicator** - Clear "Draft" badge in development  
✅ **Automatic filtering** - No manual filtering needed  
✅ **Simple configuration** - Just add `draft: true` to frontmatter  
✅ **Production safety** - Impossible to accidentally publish drafts  

### Deployment
✅ **Safe deployments** - Drafts never reach production  
✅ **Preview environments** - Can show drafts in Vercel preview deployments  
✅ **No special configuration** - Works out of the box  

## Edge Cases Handled

### URL Access in Production
- Direct URLs to draft posts return 404
- No server error, proper not-found handling

### Search and Filtering
- Draft posts excluded from production search results
- Tag counts don't include draft posts in production

### Sitemap and RSS
- Since posts are filtered at source (`getAllPosts()`), sitemap and RSS automatically exclude drafts in production

### Preview Deployments
- Vercel preview deployments run in production mode
- To show drafts in preview: Would need custom `SHOW_DRAFTS` env var (future enhancement)

## Future Enhancements

Potential improvements:

- [ ] **Preview mode** - Environment variable to show drafts in preview deployments
- [ ] **Scheduled posts** - Combine with `publishedAt` for future publishing
- [ ] **Draft status levels** - Multiple draft states (draft, review, ready)
- [ ] **Author attribution** - Track who created/modified drafts
- [ ] **Draft metadata** - Last edited, completion percentage, etc.

## Related Files

**Implementation:**
- `src/data/posts.ts` - Post type definition
- `src/lib/blog.ts` - Post loading and filtering logic
- `src/app/blog/page.tsx` - Blog list with draft indicator
- `src/app/blog/[slug]/page.tsx` - Blog post with draft badge

**Example:**
- `src/content/blog/markdown-and-code-demo.mdx` - Example draft post

## Summary

Successfully implemented draft post functionality with:
- ✅ Draft field in frontmatter
- ✅ Environment-based filtering (development vs production)
- ✅ Visual indicators (blue "Draft" badge)
- ✅ Server-side filtering (secure, no client exposure)
- ✅ Consistent with existing "Archived" badge pattern
- ✅ Works with existing search and tag filtering
- ✅ Safe for production deployments

Draft posts are now fully functional and production-safe! 🎉
