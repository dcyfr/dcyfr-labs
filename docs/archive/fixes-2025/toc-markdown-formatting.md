# Table of Contents - Markdown Formatting Fix

**Date:** November 11, 2025  
**Issue:** Markdown characters (`**`, `*`, `` ` ``) appearing in Table of Contents  
**Status:** ✅ Fixed

---

## Problem

The Table of Contents was displaying raw markdown formatting characters instead of plain text:

```
❌ Before:
- 1. **Memory for Project Context**
- 2. **Sequential Thinking for Complex Tasks**
- 3. **Filesystem Operations Stay Local**
```

This happened because the `extractHeadings()` function in `src/lib/toc.ts` was extracting heading text as-is, including markdown formatting.

---

## Solution

Added a `stripMarkdown()` function to remove markdown formatting from heading text before displaying in the TOC.

### Implementation

**File:** `src/lib/toc.ts`

**Added function:**
```typescript
function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')  // **bold**
    .replace(/\*(.+?)\*/g, '$1')      // *italic*
    .replace(/__(.+?)__/g, '$1')      // __bold__
    .replace(/_(.+?)_/g, '$1')        // _italic_
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Remove links [text](url)
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[(.+?)\]\(.+?\)/g, '$1')
    // Remove strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    .trim();
}
```

**Updated `extractHeadings()`:**
```typescript
const rawText = match[2].trim();
const text = stripMarkdown(rawText); // Strip markdown for display
const id = generateSlug(rawText);    // Use raw text for ID matching
```

---

## Result

```
✅ After:
- 1. Memory for Project Context
- 2. Sequential Thinking for Complex Tasks
- 3. Filesystem Operations Stay Local
```

Clean, readable text in the Table of Contents while preserving proper heading IDs for navigation.

---

## Supported Markdown Removal

The fix handles:
- ✅ Bold: `**text**` and `__text__`
- ✅ Italic: `*text*` and `_text_`
- ✅ Inline code: `` `text` ``
- ✅ Links: `[text](url)`
- ✅ Images: `![alt](url)`
- ✅ Strikethrough: `~~text~~`

---

## Why Keep Raw Text for IDs?

The `id` generation uses the raw text (with markdown) to match what `rehype-slug` generates for the actual heading elements in the rendered HTML. This ensures:

1. TOC links match the heading IDs in the page
2. Smooth scroll navigation works correctly
3. Active heading highlighting is accurate

---

## Testing

**Test with:**
1. Navigate to `/blog/ai-development-workflow`
2. Check Table of Contents (mobile: FAB button, desktop: right sidebar)
3. Verify headings show clean text without `**` characters
4. Verify clicking headings scrolls correctly

**Expected headings:**
- "Patterns I've Learned"
  - "1. Memory for Project Context"
  - "2. Sequential Thinking for Complex Tasks"
  - "3. Filesystem Operations Stay Local"
- "The Developer Experience"

All should display without markdown formatting characters.
