# Post Badges Reorganization

**Date:** October 20, 2024  
**Status:** ✅ Complete

## Overview

Reorganized post status badges to appear consistently after titles across all blog-related pages (homepage, blog list, and post detail pages). Standardized badge colors and created a reusable component.

## Changes Made

### 1. New Component: `PostBadges`

**File:** `src/components/post-badges.tsx`

Created a centralized component for displaying post status badges:

**Features:**
- **Draft badge** (blue) - Only visible in development
- **Archived badge** (amber) - Shows archived posts
- **New badge** (green) - Shows posts published within last 7 days (not archived)
- Size prop for responsive sizing (`default` or `sm`)
- Consistent color classes across all uses

**Badge Colors:**
- Draft: `border-blue-500/50 text-blue-600 dark:text-blue-400`
- Archived: `border-amber-500/50 text-amber-600 dark:text-amber-400`
- New: `border-green-500/50 text-green-600 dark:text-green-400`

### 2. Homepage Updates

**File:** `src/app/page.tsx`

**Changes:**
- Added `PostBadges` import
- Added badges after title in article cards
- Used `size="sm"` for compact display

**Structure:**
```tsx
[Date • Tags • Reading Time]  ← metadata
[Title]                        ← h3 with Link
[Draft] [Archived] [New]      ← status badges (NEW)
[Summary]                      ← post summary
```

### 3. Blog List Updates

**File:** `src/app/blog/page.tsx`

**Changes:**
- Replaced inline badge components with `PostBadges`
- Moved badges from metadata area to after title
- Fixed Archived badge missing color classes

**Before:**
```tsx
<div>
  [Date • Tags • Reading Time • Archived • Draft]
</div>
<h2>[Title]</h2>
```

**After:**
```tsx
<div>
  [Date • Tags • Reading Time]
</div>
<h2>[Title]</h2>
<div>
  [Draft] [Archived] [New]
</div>
```

### 4. Post Detail Page Updates

**File:** `src/app/blog/[slug]/page.tsx`

**Changes:**
- Replaced inline badge logic with `PostBadges` component
- Separated status badges from tags and metadata
- Added visual grouping with separate divs

**Before:**
```tsx
<h1>[Title]</h1>
<p>[Summary]</p>
<div>
  [Tags] [Reading Time] [Views] [Archived] [Draft]
</div>
```

**After:**
```tsx
<h1>[Title]</h1>
<p>[Summary]</p>
<div>
  [Draft] [Archived] [New]  ← status badges
</div>
<div>
  [Tags] [Reading Time] [Views]  ← metadata
</div>
```

## Benefits

### Consistency
- All three pages now show badges in the same location (after title)
- Badge colors are identical across all pages
- Single source of truth for badge logic

### Maintainability
- Centralized component makes updates easier
- Adding new badge types requires changes in one place
- Badge logic (like "New" calculation) is consistent

### User Experience
- Clear visual hierarchy: metadata → title → status → content
- Status badges are visually distinct from metadata badges
- Consistent expectation across the site

### Developer Experience
- Simple API: `<PostBadges post={post} size="sm" />`
- TypeScript support with Post type
- Self-documenting with JSDoc comments

## Usage

### Basic Usage
```tsx
import { PostBadges } from "@/components/post-badges";

<PostBadges post={post} />
```

### With Size Prop
```tsx
// For smaller displays (homepage, blog list)
<PostBadges post={post} size="sm" />

// For larger displays (post detail page)
<PostBadges post={post} />
```

## Badge Logic

### Draft Badge
- **Condition:** `process.env.NODE_ENV === "development" && post.draft`
- **Color:** Blue
- **Purpose:** Indicates work-in-progress posts visible only in development

### Archived Badge
- **Condition:** `post.archived`
- **Color:** Amber
- **Purpose:** Indicates older/deprecated content

### New Badge
- **Condition:** `!post.archived && daysSincePublished <= 7`
- **Color:** Green
- **Purpose:** Highlights recently published content (last 7 days)
- **Note:** Not shown for archived posts

## Testing

### Visual Testing Checklist

- [ ] Homepage shows badges after titles
- [ ] Blog list shows badges after titles (not in metadata)
- [ ] Post detail page separates status badges from metadata
- [ ] Badge colors match across all pages
- [ ] Draft badge only visible in development
- [ ] New badge shows for posts published within 7 days
- [ ] Archived badge shows for archived posts
- [ ] Size prop works correctly (`sm` vs `default`)

### Test Scenarios

1. **Draft post in development**
   - Should show blue "Draft" badge on all pages
   
2. **Archived post**
   - Should show amber "Archived" badge on all pages
   - Should NOT show "New" badge

3. **Recently published post (< 7 days)**
   - Should show green "New" badge on all pages
   - Should NOT show "New" if archived

4. **Regular post (> 7 days old)**
   - Should show no status badges

## Files Changed

```
src/
  components/
    post-badges.tsx                    NEW - Centralized badge component
  app/
    page.tsx                           MODIFIED - Added badges to homepage
    blog/
      page.tsx                         MODIFIED - Moved badges after title
      [slug]/
        page.tsx                       MODIFIED - Separated status from metadata
```

## Related Documentation

- [Draft Posts Implementation](./draft-posts-implementation.md) - Draft post feature
- [Site Config](../platform/site-config.md) - Site configuration
- [Blog Architecture](../ai/discovery/summary.md) - Blog system overview

## Future Enhancements

Potential additions to the badge system:

1. **Hot Badge**
   - Show for posts with high view counts
   - Color: Red/orange
   - Calculation: Views above threshold within timeframe

2. **Updated Badge**
   - Show for recently updated posts
   - Color: Purple
   - Calculation: Updated within last X days

3. **Featured Badge**
   - Show for featured posts
   - Color: Gold
   - Field: `post.featured`

4. **Badge Configuration**
   - Move badge logic to configuration file
   - Allow customization of colors and conditions
   - Add feature flags for enabling/disabling specific badges

## Implementation Notes

- Badge order is consistent: Draft → Archived → New → (future badges)
- Badges use Shadcn/ui Badge component with `variant="outline"`
- Size prop applies `text-xs` class when set to `"sm"`
- Component returns `null` if no badges to display (clean DOM)
- All badges use semantic color coding (blue=draft, amber=archived, green=new)

## Rollback Plan

If issues arise, revert these commits in order:

1. Revert `src/components/post-badges.tsx` (delete file)
2. Revert `src/app/blog/[slug]/page.tsx` (restore inline badge logic)
3. Revert `src/app/blog/page.tsx` (restore badges in metadata)
4. Revert `src/app/page.tsx` (remove badge import and display)

Original badge implementations are preserved in git history.
