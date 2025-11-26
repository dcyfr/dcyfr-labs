# Design System Validation (MANDATORY)

**Claude Code MUST follow this checklist before creating or modifying UI components.**

This comprehensive guide ensures consistency, prevents duplication, and maintains design token usage across the codebase.

## Phase 1: Discovery (REQUIRED FIRST)

**STOP before writing any UI code. Complete this discovery phase first.**

### 1. Search for Existing Patterns

**Use Grep/Glob tools to find similar components:**

```bash
# Search for similar component names
glob "**/*-filter*.tsx"              # Find filter components
glob "**/*-card*.tsx"                # Find card components
glob "**/*-button*.tsx"              # Find button variants

# Search for similar functionality
grep "useState.*filter" --type ts   # Find filter state management
grep "useRouter.*push" --type ts    # Find navigation patterns
grep "useDebounce" --type ts         # Find debounce usage
```

**Check standard locations:**
- `src/components/layouts/` - Layout patterns (PageLayout, PageHero, etc.)
- `src/components/ui/` - UI primitives (Button, Card, Badge, etc.)
- `src/components/common/` - Shared components (Phase 4 goal)
- `src/components/analytics/` - Well-organized feature directory

**Verify no duplication before creating:**
- Does a component with this functionality exist?
- Can I extend an existing component instead of creating new?
- Is this pattern already implemented elsewhere?

### 2. Review Design Tokens

**Read `src/lib/design-tokens.ts` for all constants:**

```typescript
// Always import from design tokens
import {
  SPACING,              // Vertical/horizontal spacing
  TYPOGRAPHY,           // Heading/body text styles
  HOVER_EFFECTS,        // Consistent hover transitions
  CONTAINER_WIDTHS,     // Max-width constraints
  PAGE_LAYOUT,          // Page-level layout constants
  ARCHIVE_LAYOUT,       // Archive/list page constants
  ARTICLE_LAYOUT,       // Article/blog post constants
} from "@/lib/design-tokens";
```

**Available design tokens:**

**SPACING:**
```typescript
SPACING.section       // "space-y-12" - Between major sections
SPACING.content       // "space-y-8" - Between content blocks
SPACING.element       // "space-y-4" - Between related elements
SPACING.tight         // "space-y-2" - Between tightly related items
SPACING.grid          // "gap-4" - Grid/flex gap
```

**TYPOGRAPHY:**
```typescript
TYPOGRAPHY.h1.standard    // Page titles
TYPOGRAPHY.h1.large       // Hero titles
TYPOGRAPHY.h2.standard    // Section headings
TYPOGRAPHY.h3.standard    // Subsection headings
TYPOGRAPHY.body.default   // Body text
TYPOGRAPHY.body.large     // Large body text
TYPOGRAPHY.body.small     // Small text
TYPOGRAPHY.body.muted     // Muted text
```

**CONTAINER_WIDTHS:**
```typescript
CONTAINER_WIDTHS.narrow   // "max-w-3xl" - Articles, forms
CONTAINER_WIDTHS.default  // "max-w-4xl" - Standard pages
CONTAINER_WIDTHS.wide     // "max-w-6xl" - Wide layouts
```

### 3. Validate Reusability

**Ask these questions before proceeding:**

1. **Does a similar component exist?**
   - ✅ Yes → Extend it, don't duplicate
   - ❌ No → Proceed with creation

2. **Do design tokens exist for this pattern?**
   - ✅ Yes → Use them (MANDATORY)
   - ❌ No → Discuss adding new tokens first

3. **Can I reuse layout components?**
   - PageLayout → Universal page wrapper
   - PageHero → Hero sections
   - PageSection → Content sections
   - ArchiveLayout → List/archive pages
   - ArticleLayout → Blog posts/articles

4. **Can I use existing UI primitives?**
   - Check `src/components/ui/*` for shadcn components
   - Button, Card, Badge, Skeleton, Dialog, etc.

## Phase 2: Implementation Standards

**Follow these patterns exactly when creating or modifying UI components.**

### Container & Layout Patterns

**✅ CORRECT: Use existing layout components**

```typescript
import { PageLayout, PageHero, PageSection } from "@/components/layouts";

export default function MyPage() {
  return (
    <PageLayout>
      <PageHero
        title="Page Title"
        description="Page description"
        variant="default"  // or "compact" or "centered"
      />
      <PageSection>
        {/* Page content */}
      </PageSection>
    </PageLayout>
  );
}
```

**❌ WRONG: Creating custom layout**

```typescript
// DON'T DO THIS - use PageLayout instead
export default function MyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Page Title</h1>
      <p className="text-muted-foreground mb-8">Description</p>
      {/* content */}
    </div>
  );
}
```

### Typography Patterns

**✅ CORRECT: Use TYPOGRAPHY tokens**

```typescript
import { TYPOGRAPHY } from "@/lib/design-tokens";

function MyComponent() {
  return (
    <>
      <h1 className={TYPOGRAPHY.h1.standard}>Main Title</h1>
      <h2 className={TYPOGRAPHY.h2.standard}>Section Heading</h2>
      <p className={TYPOGRAPHY.body.default}>Body text content</p>
      <p className={TYPOGRAPHY.body.muted}>Secondary text</p>
    </>
  );
}
```

**❌ WRONG: Inline typography**

```typescript
// DON'T DO THIS - use TYPOGRAPHY tokens
function MyComponent() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Title</h1>
      <h2 className="text-2xl font-semibold">Heading</h2>
      <p className="text-base leading-relaxed">Text</p>
      <p className="text-sm text-muted-foreground">Secondary</p>
    </>
  );
}
```

### Spacing Patterns

**✅ CORRECT: Use SPACING tokens**

```typescript
import { SPACING } from "@/lib/design-tokens";

function MyComponent() {
  return (
    <div className={SPACING.content}>  {/* space-y-8 */}
      <section className={SPACING.element}>  {/* space-y-4 */}
        <h2>Section Title</h2>
        <p>Content</p>
      </section>
      <section className={SPACING.element}>
        <h2>Another Section</h2>
        <div className={SPACING.grid}>  {/* gap-4 */}
          <Card />
          <Card />
        </div>
      </section>
    </div>
  );
}
```

**❌ WRONG: Magic numbers**

```typescript
// DON'T DO THIS - use SPACING tokens
function MyComponent() {
  return (
    <div className="space-y-6">  {/* Should be SPACING.content */}
      <section className="space-y-3">  {/* Should be SPACING.element */}
        <h2>Title</h2>
        <p>Content</p>
      </section>
      <div className="gap-6 grid">  {/* Should be SPACING.grid */}
        <Card />
        <Card />
      </div>
    </div>
  );
}
```

### Colors & Theme Patterns

**✅ CORRECT: Use semantic color variables**

```typescript
function MyComponent() {
  return (
    <>
      <Card className="bg-card text-card-foreground border">
        <h3 className="text-foreground">Title</h3>
        <p className="text-muted-foreground">Description</p>
      </Card>

      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        Submit
      </Button>

      <div className="bg-accent text-accent-foreground">
        Highlighted content
      </div>
    </>
  );
}
```

**❌ WRONG: Hardcoded colors**

```typescript
// DON'T DO THIS - use semantic color variables
function MyComponent() {
  return (
    <>
      <Card className="bg-white dark:bg-gray-900 border-gray-200">
        <h3 className="text-black dark:text-white">Title</h3>
        <p className="text-gray-600 dark:text-gray-400">Description</p>
      </Card>

      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        Submit
      </Button>

      <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        Highlighted content
      </div>
    </>
  );
}
```

### Component Composition Patterns

**✅ CORRECT: Compose from existing components**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPACING, TYPOGRAPHY } from "@/lib/design-tokens";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={TYPOGRAPHY.h3.standard}>
          {project.title}
        </CardTitle>
        <div className={`flex gap-2 ${SPACING.tight}`}>
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className={TYPOGRAPHY.body.default}>{project.description}</p>
      </CardContent>
    </Card>
  );
}
```

**❌ WRONG: Recreating existing patterns**

```typescript
// DON'T DO THIS - use Card component
export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 pb-0">
        <h3 className="text-2xl font-semibold">{project.title}</h3>
        <div className="flex gap-2 mt-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 pt-2">
        <p className="text-base">{project.description}</p>
      </div>
    </div>
  );
}
```

## Prohibited Patterns (FORBIDDEN)

**Never use these without explicit approval:**

### Spacing Violations

❌ `space-y-5` → Use `SPACING.element` (space-y-4) or `SPACING.content` (space-y-8)
❌ `space-y-6` → Use `SPACING.content` (space-y-8)
❌ `space-y-7` → Use `SPACING.content` (space-y-8)
❌ `space-y-9` → Use `SPACING.section` (space-y-12)
❌ `gap-5` → Use `gap-4` (SPACING.grid)
❌ `gap-6` → Use `gap-4` (SPACING.grid)
❌ `gap-7` → Use `gap-4` (SPACING.grid)
❌ `gap-8` → Use `gap-4` (SPACING.grid)
❌ `p-6` → Use `p-4` or `p-8`
❌ `p-7` → Use `p-4` or `p-8`
❌ `px-6` → Use `px-4` or `px-8`
❌ `py-6` → Use `py-4` or `py-8`

### Typography Violations

❌ `text-xl font-semibold` → Use `TYPOGRAPHY.h3.standard`
❌ `text-2xl font-bold` → Use `TYPOGRAPHY.h2.standard`
❌ `text-3xl font-semibold` → Use `TYPOGRAPHY.h1.standard`
❌ `text-base leading-relaxed` → Use `TYPOGRAPHY.body.default`
❌ Inline font sizes → Use TYPOGRAPHY tokens

### Container Width Violations

❌ `max-w-5xl` → Use `CONTAINER_WIDTHS.wide`
❌ `max-w-7xl` → Use `CONTAINER_WIDTHS.wide`
❌ `max-w-2xl` → Use `CONTAINER_WIDTHS.narrow`
❌ Custom max-widths → Use CONTAINER_WIDTHS constants

### Pattern Violations

❌ Duplicating existing components → Extend or reuse instead
❌ Creating custom layouts → Use PageLayout, PageHero, PageSection
❌ Hardcoded colors → Use semantic color variables
❌ Magic numbers → Use design tokens

## Pre-Commit Validation Checklist

**Before submitting code, verify:**

### 1. Design Token Usage

```bash
# Check for spacing violations
grep -r "space-y-[5-9]" src/components/
grep -r "gap-[5-9]" src/components/
grep -r 'p-[67]"' src/components/

# Should return no results for your new/modified files
```

### 2. Import Statements

```typescript
// ✅ Required imports for new components
import { SPACING, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button, Card } from "@/components/ui/...";
import { PageLayout } from "@/components/layouts";
```

### 3. Component Structure

- [ ] Uses layout components from `@/components/layouts/*`
- [ ] Uses UI primitives from `@/components/ui/*`
- [ ] Imports design tokens where applicable
- [ ] No hardcoded spacing values
- [ ] No inline typography styles
- [ ] Semantic color variables only

### 4. Documentation

- [ ] JSDoc comment added to component
- [ ] Props interface documented
- [ ] Usage examples if complex

```typescript
/**
 * Displays a project card with title, tags, and description
 *
 * @example
 * ```tsx
 * <ProjectCard project={project} />
 * ```
 */
export function ProjectCard({ project }: ProjectCardProps) {
  // ...
}
```

### 5. Tests

- [ ] Tests added for new functionality
- [ ] Tests updated if behavior changed
- [ ] All tests passing (`npm run test`)

### 6. Build Validation

```bash
npm run typecheck  # TypeScript must compile
npm run lint       # Linting must pass
npm run build      # Build must succeed
```

## Enforcement Workflow

**For every UI component you create or modify:**

1. **Discovery** (MANDATORY FIRST)
   - [ ] Searched for existing patterns
   - [ ] Reviewed design tokens
   - [ ] Validated no duplication

2. **Implementation**
   - [ ] Used layout components
   - [ ] Used TYPOGRAPHY tokens
   - [ ] Used SPACING tokens
   - [ ] Used semantic colors
   - [ ] Composed from UI primitives

3. **Validation**
   - [ ] No prohibited patterns
   - [ ] All imports present
   - [ ] JSDoc added
   - [ ] Tests passing
   - [ ] Build succeeds

## Quick Reference Card

**Copy this checklist for each new component:**

```markdown
## Component Design System Checklist

### Discovery
- [ ] Searched for similar components (Grep/Glob)
- [ ] Reviewed src/lib/design-tokens.ts
- [ ] Confirmed no duplication exists

### Implementation
- [ ] Imported SPACING, TYPOGRAPHY tokens
- [ ] Used PageLayout/PageHero if page component
- [ ] Used UI primitives from @/components/ui/*
- [ ] No hardcoded spacing (space-y-6, gap-8, p-7)
- [ ] No inline typography (text-3xl font-semibold)
- [ ] Semantic colors only (bg-card, text-primary)

### Validation
- [ ] JSDoc comment added
- [ ] Tests added/updated
- [ ] npm run typecheck (passes)
- [ ] npm run lint (passes)
- [ ] npm run test (passes)
- [ ] npm run build (succeeds)
```

## Common Mistakes and Fixes

### Mistake: Creating custom spacing

```typescript
// ❌ WRONG
<div className="space-y-6">...</div>

// ✅ CORRECT
import { SPACING } from "@/lib/design-tokens";
<div className={SPACING.content}>...</div>
```

### Mistake: Inline typography

```typescript
// ❌ WRONG
<h1 className="text-3xl font-semibold tracking-tight">Title</h1>

// ✅ CORRECT
import { TYPOGRAPHY } from "@/lib/design-tokens";
<h1 className={TYPOGRAPHY.h1.standard}>Title</h1>
```

### Mistake: Recreating Card component

```typescript
// ❌ WRONG
<div className="rounded-lg border bg-card p-6">...</div>

// ✅ CORRECT
import { Card, CardContent } from "@/components/ui/card";
<Card><CardContent>...</CardContent></Card>
```

### Mistake: Hardcoded colors

```typescript
// ❌ WRONG
<div className="bg-white dark:bg-gray-900">...</div>

// ✅ CORRECT
<div className="bg-card">...</div>
```

## Additional Resources

- **Design tokens source**: [`src/lib/design-tokens.ts`](../../src/lib/design-tokens.ts)
- **Layout components**: [`src/components/layouts/`](../../src/components/layouts/)
- **UI primitives**: [`src/components/ui/`](../../src/components/ui/)
- **Enforcement details**: [`/docs/design/ENFORCEMENT.md`](../design/ENFORCEMENT.md)
- **Best practices**: [`/docs/ai/BEST_PRACTICES.md`](./BEST_PRACTICES.md)

## Getting Help

**If you're unsure whether to create a new component:**
1. Search the codebase first (Grep/Glob)
2. Check if design tokens exist for the pattern
3. Ask if the pattern should be abstracted
4. Prefer extending existing components over creating new ones

**If you need a new design token:**
1. Check if existing tokens can be combined
2. Propose the new token with use cases
3. Add to `src/lib/design-tokens.ts` with clear naming
4. Document in this guide
