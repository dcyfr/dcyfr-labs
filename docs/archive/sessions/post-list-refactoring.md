# Post List Refactoring

**Date:** October 20, 2024  
**Status:** ✅ Complete

## Overview

Refactored post list rendering into a reusable `PostList` component to ensure consistency across the site. Applied filtering rules to exclude archived posts from homepage while keeping them visible on the blog page. Enhanced badge logic to prevent Draft or Archived posts from receiving "Hot" badge.

## Changes Made

### 1. New Component: `PostList`

**File:** `src/components/post-list.tsx`

**Purpose:**
- Reusable component for displaying blog posts consistently
- Single source of truth for post card layout
- Used on homepage, blog list page, and potentially other locations

**Props:**
```typescript
interface PostListProps {
  posts: Post[];              // Array of posts to display
  latestSlug?: string;         // Slug of latest post (for "New" badge)
  hottestSlug?: string;        // Slug of hottest post (for "Hot" badge)
  titleLevel?: "h2" | "h3";    // Heading level for SEO
  emptyMessage?: string;       // Custom message when no posts
}
```

**Features:**
- Consistent card layout across all pages
- Flexible heading level (h2 for blog list, h3 for homepage)
- Empty state with custom message
- Responsive design with mobile-friendly metadata
- Badge integration via `PostBadges` component

### 2. New Utility: `getPostBadgeMetadata`

**File:** `src/lib/post-badges.ts`

**Purpose:**
- Centralized logic for determining which posts get badges
- Calculates latest and hottest posts
- Ensures consistent badge rules across pages

**Function:**
```typescript
export async function getPostBadgeMetadata(posts: Post[]): Promise<PostBadgeMetadata>
```

**Returns:**
```typescript
interface PostBadgeMetadata {
  latestSlug: string | null;   // Most recent non-archived, non-draft post
  hottestSlug: string | null;  // Most viewed non-archived, non-draft post
}
```

**Badge Eligibility Rules:**
- **Latest Post**: Not archived, not draft, sorted by publishedAt
- **Hottest Post**: Not archived, not draft, has views > 0

### 3. Updated Badge Logic

**File:** `src/components/post-badges.tsx`

**Changes:**
- "New" badge excludes draft posts: `!post.archived && !post.draft`
- "Hot" badge excludes draft and archived posts: `!post.archived && !post.draft`

**Before:**
```tsx
if (isLatestPost && !post.archived) { /* New badge */ }
if (isHotPost && !post.archived) { /* Hot badge */ }
```

**After:**
```tsx
if (isLatestPost && !post.archived && !post.draft) { /* New badge */ }
if (isHotPost && !post.archived && !post.draft) { /* Hot badge */ }
```

### 4. Homepage Updates

**File:** `src/app/page.tsx`

**Changes:**
- Import `PostList` and `getPostBadgeMetadata`
- Filter archived posts: `.filter(p => !p.archived)`
- Use `PostList` component with `titleLevel="h3"`
- Simplified from ~40 lines to ~10 lines

**Before:**
```tsx
const recentPosts = [...posts]
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .slice(0, 3);

// ... complex view fetching logic ...
// ... complex badge calculation ...

return recentPosts.map((p) => (
  <article>...</article>  // 20+ lines of JSX per post
));
```

**After:**
```tsx
const recentPosts = [...posts]
  .filter(p => !p.archived)  // ← Filter out archived posts
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .slice(0, 3);

const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);

return <PostList 
  posts={recentPosts}
  latestSlug={latestSlug ?? undefined}
  hottestSlug={hottestSlug ?? undefined}
  titleLevel="h3"
/>;
```

### 5. Blog Page Updates

**File:** `src/app/blog/page.tsx`

**Changes:**
- Import `PostList` and `getPostBadgeMetadata`
- Use `PostList` component with `titleLevel="h2"`
- Simplified from ~35 lines to ~8 lines
- Archived posts still visible (no filter applied)

**Before:**
```tsx
// ... complex view fetching logic ...
// ... complex badge calculation ...

filtered.map((p) => (
  <article>...</article>  // 20+ lines of JSX per post
))
```

**After:**
```tsx
const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);

<PostList 
  posts={filtered}
  latestSlug={latestSlug ?? undefined}
  hottestSlug={hottestSlug ?? undefined}
  titleLevel="h2"
  emptyMessage="No posts found. Try adjusting your search or filters."
/>
```

## Filtering Rules

### Homepage
- ✅ Show only non-archived posts
- ✅ Show latest 3 posts
- ✅ Draft posts filtered server-side (existing behavior)
- ✅ Archived posts excluded from display

### Blog Page
- ✅ Show all posts (including archived)
- ✅ Apply search and tag filters
- ✅ Draft posts filtered server-side (existing behavior)
- ✅ Archived posts visible with amber badge

### Badge Eligibility

| Badge | Draft Posts | Archived Posts | Requirements |
|-------|-------------|----------------|--------------|
| Draft | ✅ Yes | N/A | Development only |
| Archived | N/A | ✅ Yes | Always |
| New | ❌ No | ❌ No | Latest published post |
| Hot | ❌ No | ❌ No | Most views, > 0 views |

## Benefits

### Code Quality
- **DRY Principle**: Single source of truth for post card layout
- **Maintainability**: Changes to card design happen in one place
- **Consistency**: Identical layout and behavior across pages
- **Testability**: Component can be tested in isolation

### Performance
- **Efficient**: Batch fetch view counts once per page
- **Cached**: Badge metadata can be cached in the future
- **Optimized**: Filters applied early in data pipeline

### User Experience
- **Consistent**: Posts look the same everywhere
- **Clear**: Archived posts hidden on homepage, visible on blog
- **Meaningful**: Badges only on eligible posts (no hot archived posts)

## Component Structure

```tsx
PostList
├── Empty State (if posts.length === 0)
│   └── Custom message in dashed border box
└── Post Cards (mapped from posts array)
    ├── Metadata Line
    │   ├── Date
    │   ├── Reading Time
    │   └── Tags (hidden on mobile)
    ├── Title Row (flex layout)
    │   ├── Heading (h2 or h3)
    │   └── Badges (floating right)
    │       └── PostBadges component
    └── Summary Text
```

## Usage Examples

### Homepage (3 Recent Posts, No Archived)
```tsx
const recentPosts = [...posts]
  .filter(p => !p.archived)
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .slice(0, 3);

const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);

<PostList 
  posts={recentPosts}
  latestSlug={latestSlug}
  hottestSlug={hottestSlug}
  titleLevel="h3"
/>
```

### Blog Page (All Posts, Including Archived)
```tsx
const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);

<PostList 
  posts={filteredPosts}
  latestSlug={latestSlug}
  hottestSlug={hottestSlug}
  titleLevel="h2"
  emptyMessage="No posts found. Try adjusting your search or filters."
/>
```

### Custom Use Case
```tsx
const featuredPosts = posts.filter(p => p.featured);
const { latestSlug, hottestSlug } = await getPostBadgeMetadata(posts);

<PostList 
  posts={featuredPosts}
  latestSlug={latestSlug}
  hottestSlug={hottestSlug}
  titleLevel="h2"
  emptyMessage="No featured posts yet."
/>
```

## Testing Checklist

- [ ] Homepage shows 3 recent non-archived posts
- [ ] Homepage excludes archived posts
- [ ] Blog page shows all posts including archived
- [ ] Blog page filters work correctly
- [ ] "New" badge only on latest non-archived, non-draft post
- [ ] "Hot" badge only on most-viewed non-archived, non-draft post
- [ ] Draft posts don't receive "New" or "Hot" badges
- [ ] Archived posts don't receive "New" or "Hot" badges
- [ ] Empty states display correctly
- [ ] Heading levels are semantically correct (h3 on homepage, h2 on blog)
- [ ] Mobile layout hides tags correctly
- [ ] Badge floating works on all screen sizes

## Migration Notes

### Breaking Changes
None - this is a refactoring that maintains existing behavior while adding new rules.

### Behavioral Changes
1. **Homepage**: Now excludes archived posts (new filter)
2. **Badge Eligibility**: Draft and archived posts cannot be "Hot" (new rule)
3. **Badge Calculation**: Centralized in `getPostBadgeMetadata` utility

### Non-Breaking Changes
1. **Code Organization**: Logic moved to reusable components/utilities
2. **Line Count**: Reduced by ~50 lines across both pages
3. **Consistency**: Layout guaranteed identical across pages

## Future Enhancements

### Potential Additions

1. **Pagination Support**
   ```tsx
   interface PostListProps {
     // ... existing props
     pagination?: {
       currentPage: number;
       totalPages: number;
       onPageChange: (page: number) => void;
     };
   }
   ```

2. **Loading States**
   ```tsx
   interface PostListProps {
     // ... existing props
     isLoading?: boolean;
     skeleton?: boolean;
   }
   ```

3. **View Modes**
   ```tsx
   interface PostListProps {
     // ... existing props
     viewMode?: "card" | "compact" | "grid";
   }
   ```

4. **Custom Card Renderer**
   ```tsx
   interface PostListProps {
     // ... existing props
     renderCard?: (post: Post, metadata: BadgeMetadata) => ReactNode;
   }
   ```

## Files Changed

```
src/
  components/
    post-list.tsx             NEW - Reusable post list component
    post-badges.tsx           MODIFIED - Enhanced badge eligibility
  lib/
    post-badges.ts            NEW - Badge metadata utility
  app/
    page.tsx                  MODIFIED - Use PostList, filter archived
    blog/
      page.tsx                MODIFIED - Use PostList
```

## Performance Impact

- **Before**: ~70 lines of duplicated JSX/logic per page
- **After**: ~10 lines per page using shared component
- **Bundle Size**: Minimal increase (~2KB for new component)
- **Runtime**: Identical performance, single badge calculation per page
- **Redis Calls**: Same (1 mGet call per page)

## Related Documentation

- [Badge Floating Layout](./badge-floating-layout.md) - Badge positioning
- [Post Badges Reorganization](./post-badges-reorganization.md) - Badge system
- [Draft Posts Implementation](./draft-posts-implementation.md) - Draft filtering

## Rollback Plan

To revert this refactoring:

1. Delete `src/components/post-list.tsx`
2. Delete `src/lib/post-badges.ts`
3. Revert `src/app/page.tsx` to inline post mapping
4. Revert `src/app/blog/page.tsx` to inline post mapping
5. Revert `src/components/post-badges.tsx` badge eligibility rules

Original implementations are preserved in git history.
