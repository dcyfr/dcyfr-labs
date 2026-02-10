<!-- TLP:GREEN - Internal Use Only -->
# Design Token Reference for AI Agents

**Information Classification:** TLP:GREEN (Limited Distribution)
**Last Updated:** 2026-02-09
**Audience:** AI coding assistants (Claude, Copilot, etc.)

---

## Quick Reference

**❌ DO NOT USE THESE (they don't exist):**
- `TYPOGRAPHY.caption` → Use `TYPOGRAPHY.label.small` or `TYPOGRAPHY.metadata`
- `TYPOGRAPHY.small` → Use `TYPOGRAPHY.label.small`
- `TYPOGRAPHY.xs` → Use `TYPOGRAPHY.label.xs`
- `CONTAINER_WIDTHS.wide` → Use `CONTAINER_WIDTHS.dashboard` or `CONTAINER_WIDTHS.archive`
- `CONTAINER_WIDTHS.full` → Use `CONTAINER_WIDTHS.dashboard`

---

## Available Design Tokens

### CONTAINER_WIDTHS
```typescript
CONTAINER_WIDTHS.prose       // max-w-4xl - Reading content (45-75 chars/line)
CONTAINER_WIDTHS.narrow      // max-w-4xl - Forms, focused content
CONTAINER_WIDTHS.thread      // max-w-2xl - Thread-style feeds
CONTAINER_WIDTHS.standard    // max-w-5xl - Core pages (homepage, about)
CONTAINER_WIDTHS.content     // max-w-6xl - Blog posts with sidebar
CONTAINER_WIDTHS.archive     // max-w-7xl - Listing pages with filters
CONTAINER_WIDTHS.dashboard   // max-w-[1536px] - Dashboards, dev tools
```

### SPACING
```typescript
SPACING.section      // space-y-8 md:space-y-10 lg:space-y-14 - Major sections
SPACING.subsection   // space-y-5 md:space-y-6 lg:space-y-8 - Subsections
SPACING.content      // space-y-3 md:space-y-4 lg:space-y-5 - Content within sections
SPACING.compact      // space-y-2 - Tight spacing
SPACING.image        // my-6 md:my-8 - Image margins

// Numeric values for direct use
SPACING.xs  // '2'  - 0.5rem
SPACING.sm  // '3'  - 0.75rem
SPACING.md  // '4'  - 1rem
SPACING.lg  // '6'  - 1.5rem
SPACING.xl  // '8'  - 2rem
```

### TYPOGRAPHY

**Headings:**
```typescript
TYPOGRAPHY.h1.standard   // Standard page titles
TYPOGRAPHY.h1.hero       // Archive/listing page titles
TYPOGRAPHY.h1.article    // Blog post titles
TYPOGRAPHY.h1.mdx        // MDX content headings

TYPOGRAPHY.h2.standard   // Section headings
TYPOGRAPHY.h2.featured   // Featured content headings
TYPOGRAPHY.h2.mdx        // MDX section headings

TYPOGRAPHY.h3.standard   // Subsection headings
TYPOGRAPHY.h3.mdx        // MDX subsection headings

TYPOGRAPHY.h4.mdx        // MDX level 4 headings
TYPOGRAPHY.h5.mdx        // MDX level 5 headings
TYPOGRAPHY.h6.mdx        // MDX level 6 headings
```

**Body Text:**
```typescript
TYPOGRAPHY.body          // text-base - Standard body text
TYPOGRAPHY.description   // text-lg - Lead text/descriptions
TYPOGRAPHY.metadata      // text-sm - Dates, reading time, captions
```

**Labels:**
```typescript
TYPOGRAPHY.label.standard  // text-base font-semibold
TYPOGRAPHY.label.small     // text-sm font-semibold
TYPOGRAPHY.label.xs        // text-xs font-semibold
```

**Display:**
```typescript
TYPOGRAPHY.display.stat       // text-3xl - Statistics
TYPOGRAPHY.display.statLarge  // Fluid 36px-48px - Large stats
TYPOGRAPHY.display.error      // Fluid 30px-36px - Error pages
```

**Activity Feed:**
```typescript
TYPOGRAPHY.activity.title          // Primary activity titles
TYPOGRAPHY.activity.subtitle       // Activity subtitles
TYPOGRAPHY.activity.description    // Activity descriptions
TYPOGRAPHY.activity.metadata       // Timestamps, counts
TYPOGRAPHY.activity.replyTitle     // Reply titles
TYPOGRAPHY.activity.replyDescription // Reply content
```

### SEMANTIC_COLORS
```typescript
// Text colors
SEMANTIC_COLORS.text.primary
SEMANTIC_COLORS.text.secondary
SEMANTIC_COLORS.text.muted
SEMANTIC_COLORS.text.accent

// Background colors
SEMANTIC_COLORS.background  // (has sub-properties)

// Border colors
SEMANTIC_COLORS.border      // (has sub-properties)
```

### Other Tokens
```typescript
CONTAINER_PADDING           // 'px-4 sm:px-6 md:px-8'
NAVIGATION_HEIGHT           // 'h-18'
BORDERS.default             // Border styles
ANIMATION.default           // Animation durations
SCROLL_OFFSET.heading       // Scroll offset for heading anchors
```

---

## Validation

Run design token validation before committing:

```bash
cd dcyfr-labs
node scripts/validate-design-tokens.mjs
```

This will catch:
- Non-existent token paths
- Common typos
- Missing imports

---

## Usage Patterns

### ✅ CORRECT
```typescript
import { SPACING, TYPOGRAPHY, CONTAINER_WIDTHS } from '@/lib/design-tokens';

<div className={SPACING.section}>
  <h1 className={TYPOGRAPHY.h1.standard}>Title</h1>
  <p className={TYPOGRAPHY.metadata}>Published on Jan 1, 2026</p>
</div>
```

### ❌ WRONG
```typescript
// Don't use hardcoded values
<div className="space-y-8">
  <h1 className="text-4xl font-bold">Title</h1>
  <p className="text-sm text-gray-500">Published on Jan 1, 2026</p>
</div>

// Don't use non-existent tokens
<p className={TYPOGRAPHY.caption}>...</p>  // TYPOGRAPHY.caption doesn't exist!
```

---

## For AI Agents

**When generating new components:**

1. **Always import design tokens:**
   ```typescript
   import { SPACING, TYPOGRAPHY, SEMANTIC_COLORS } from '@/lib/design-tokens';
   ```

2. **Use tokens for:**
   - Spacing between elements → `SPACING.*`
   - Text sizing and hierarchy → `TYPOGRAPHY.*`
   - Container widths → `CONTAINER_WIDTHS.*`
   - Colors → `SEMANTIC_COLORS.*` (when not using Tailwind theme colors)

3. **If unsure, check this file first or reference:**
   - [src/lib/design-tokens.ts](../src/lib/design-tokens.ts)
   - This reference guide

4. **Common patterns:**
   - Sections: `className={SPACING.section}`
   - Headings: `className={TYPOGRAPHY.h1.standard}`
   - Body text: `className={TYPOGRAPHY.body}`
   - Metadata/captions: `className={TYPOGRAPHY.metadata}`
   - Small labels: `className={TYPOGRAPHY.label.small}`

---

## Expansion Guidelines

If you need a token that doesn't exist:

1. **Check if an existing token serves the purpose** (avoid duplication)
2. **Propose the new token** with:
   - Use case description
   - Token category (TYPOGRAPHY, SPACING, etc.)
   - Specific values
   - Example usage
3. **Update this reference** after adding the token

---

**Target:** 95%+ design token compliance across all components
**Current Status:** Run `npm run check:tokens` to see compliance metrics
