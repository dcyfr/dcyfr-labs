# Enforcement Rules

Automated validation and mandatory patterns enforced via ESLint, pre-commit hooks, and CI/CD.

## Table of Contents

- [Design Token Enforcement](#design-token-enforcement)
- [Pre-commit Validation](#pre-commit-validation)
- [CI/CD Requirements](#cicd-requirements)
- [Validation Scripts](#validation-scripts)

---

## Design Token Enforcement

**Current compliance: 92% across all components** ✅

**Status: MANDATORY** - Non-compliant code will be flagged by ESLint and blocked in pre-commit hooks.

### What Are Design Tokens?

Centralized constants for spacing, typography, colors, and breakpoints. Located in `src/lib/design-tokens.ts`.

**Why strict enforcement?**
- Consistent spacing across 100+ components
- Typography hierarchy (h1-h6, body, display)
- Light/dark mode theming
- Responsive breakpoints
- Easy global redesigns

### Import and Use

```typescript
import { SPACING, TYPOGRAPHY, HOVER_EFFECTS, CONTAINER_WIDTHS } from "@/lib/design-tokens";

// ✅ CORRECT - Use tokens
<div className={`gap-${SPACING.content} p-${SPACING.element}`}>
  <h1 className={TYPOGRAPHY.h1.standard}>Title</h1>
  <button className={HOVER_EFFECTS.button}>Click</button>
</div>

// ❌ WRONG - Hardcoded values (ESLint will warn)
<div className="gap-8 p-4">
  <h1 className="text-3xl font-semibold">Title</h1>
  <button className="hover:scale-105">Click</button>
</div>
```

### Available Tokens

```typescript
// Spacing (Tailwind numeric equivalents)
SPACING = {
  section: "12",    // Large gaps between sections
  content: "8",     // Standard content gaps (most common)
  element: "4",     // Small gaps between elements
  tight: "2",       // Compact spacing
  grid: "6",        // Grid/card gaps
}

// Typography (semantic headings)
TYPOGRAPHY = {
  h1: { standard: "...", narrow: "..." },
  h2: { standard: "...", narrow: "..." },
  h3: { standard: "..." },
  // ... h4, h5, h6, body variants
}

// Container widths
CONTAINER_WIDTHS = {
  narrow: "max-w-[672px]",
  standard: "max-w-[896px]",
  content: "max-w-[1120px]",
  archive: "max-w-[1280px]",
  dashboard: "max-w-[1536px]",
}

// Hover effects
HOVER_EFFECTS = {
  button: "transition-transform hover:scale-105...",
  card: "transition-all hover:shadow-lg...",
  // ...
}
```

### ESLint Rules

**File:** `eslint.config.mjs`

Prohibited patterns (will trigger ESLint warnings):

```javascript
// ❌ Hardcoded spacing (gap-5 to gap-9, p-6, p-7, etc.)
"Selector[value=/gap-[5-9]/]"
"Selector[value=/p-[67]/]"

// ❌ Inline typography (text-3xl, text-4xl, font-semibold, etc.)
"Selector[value=/text-(3xl|4xl|5xl)/]"
"Selector[value=/font-(semibold|bold)/]"

// ❌ Hardcoded container widths
"Selector[value=/max-w-\\[\\d+px\\]/]"

// ❌ Manual hover effects
"Selector[value=/hover:scale-/]"
```

**Exclusions:**
- `src/components/ui/**` - shadcn/ui uses its own system
- `src/lib/design-tokens.ts` - Token definitions
- `**/loading.tsx`, `**/skeleton.tsx` - Mirror component structure

### Exceptions (Rare)

If you have a legitimate reason to bypass token enforcement:

1. Add ESLint disable comment with explanation:
```typescript
// eslint-disable-next-line no-restricted-syntax -- Reason: shadcn/ui pattern
<div className="gap-5">
```

2. Document in PR why token doesn't apply

---

## Pre-commit Validation

**Husky + lint-staged** runs on every commit.

### What Gets Validated

```json
// package.json lint-staged config
"*.{ts,tsx}": [
  "eslint --fix",                                    // Auto-fix linting errors
  "node scripts/validate-design-tokens.mjs --warn-only --files"  // Check tokens
]
```

### Behavior

1. **ESLint auto-fixes** - Formatting and simple rule violations
2. **Design token validation** - Warns on hardcoded values (non-blocking)
3. **Commit blocked** if ESLint errors remain after auto-fix

### Manual Validation

```bash
# Check design tokens before committing
node scripts/validate-design-tokens.mjs

# Check specific files
node scripts/validate-design-tokens.mjs --files src/components/my-component.tsx

# Generate full report
node scripts/validate-design-tokens.mjs --output report.json
```

---

## CI/CD Requirements

**All PRs must pass these checks before merge:**

### GitHub Actions Workflows

1. **Design System Validation** (`.github/workflows/design-system-validation.yml`)
   - Runs `validate-design-tokens.mjs`
   - Posts PR comment with violations
   - Blocks merge if compliance drops below 90%

2. **Test Suite** (`.github/workflows/test.yml`)
   - Unit tests: `npm run test`
   - Integration tests: `npm run test:integration`
   - E2E tests: `npm run test:e2e`
   - **Pass rate:** ≥99% (currently 99.5%)

3. **Lighthouse CI** (`.github/workflows/lighthouse.yml`)
   - Performance: ≥90
   - Accessibility: ≥95
   - Best Practices: ≥90
   - SEO: ≥95

4. **TypeScript** (`npm run typecheck`)
   - Strict mode enabled
   - Zero type errors allowed

5. **ESLint** (`npm run lint`)
   - Zero errors allowed
   - Warnings permitted but discouraged

### Quality Gates

```bash
# Run all checks locally (same as CI)
npm run check

# Individual checks
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run build         # Production build
```

---

## Validation Scripts

Located in `scripts/` directory.

### Design Token Validator

**File:** `scripts/validate-design-tokens.mjs`

**Usage:**
```bash
# Default - check all files
node scripts/validate-design-tokens.mjs

# Specific files
node scripts/validate-design-tokens.mjs --files src/components/**/*.tsx

# Warn only (don't exit with error)
node scripts/validate-design-tokens.mjs --warn-only

# JSON output
node scripts/validate-design-tokens.mjs --output report.json
```

**Checks:**
- Hardcoded spacing values (`gap-5`, `p-6`, etc.)
- Inline typography patterns (`text-3xl`, `font-semibold`)
- Hardcoded widths (`max-w-[1120px]`)
- Manual hover effects (`hover:scale-105`)

**Output:**
```
✅ Design Token Compliance: 92%
⚠️  Found 15 violations in 8 files:

src/components/example.tsx:
  Line 42: gap-8 (use SPACING.content)
  Line 56: text-3xl font-semibold (use TYPOGRAPHY.h1.standard)
```

### Other Validators

```bash
# Blog frontmatter validation
node scripts/validate-frontmatter.mjs

# Markdown content standards
node scripts/validate-markdown-content.mjs

# Post ID uniqueness
node scripts/validate-post-ids.mjs

# Structured data (SEO)
node scripts/validate-structured-data.mjs

# Bundle size regression
node scripts/check-bundle-size.mjs

# Test health monitoring
node scripts/analyze-test-health.mjs
```

---

## Compliance Dashboard

**Coming Soon:** `/dev/analytics/compliance` will show:
- Real-time design token compliance %
- Violation trends over time
- Top violating files
- Compliance by directory

---

## Constraints (Do NOT Change)

These are **non-negotiable architecture decisions**. Changing them requires team discussion and approval.

### Mandatory Patterns

1. **Import alias:** Always `@/*` (never relative paths)
2. **Styling:** Tailwind v4 + shadcn/ui (no CSS modules, no styled-components)
3. **Architecture:** Server-first (React Server Components by default)
4. **Design tokens:** Required for spacing, typography, colors
5. **MDX pipeline:** Use existing rehype/remark plugins
6. **Background jobs:** Inngest for async tasks (no manual setTimeout)

### Framework Constraints

- **Next.js 16** - App Router only (no Pages Router)
- **React 19** - Server Components default
- **TypeScript** - Strict mode enabled
- **Node.js** - v20+ required

---

## Related Documentation

- [Component Patterns](./COMPONENT_PATTERNS.md) - Layout usage, imports
- [Quick Reference](./QUICK_REFERENCE.md) - Commands and 80/20 rules
- [Decision Trees](./DECISION_TREES.md) - Visual flowcharts
- [Design System Details](./DESIGN_SYSTEM.md) - Deep dive into token system
