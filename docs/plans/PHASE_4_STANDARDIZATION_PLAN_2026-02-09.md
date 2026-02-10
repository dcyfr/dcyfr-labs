<!-- TLP:AMBER - Internal Use Only -->
# Phase 4: Standardization & Automation - Implementation Plan

**Information Classification:** TLP:AMBER (Internal Team Only)
**Created:** February 9, 2026
**Goal:** Automated enforcement, comprehensive documentation, and developer guidelines
**Estimated Effort:** 10-12 hours
**Status:** 🚧 In Progress

---

## Objective

Establish automated quality gates and comprehensive documentation to ensure design token best practices are followed consistently across the team.

**Key Outcomes:**
- ✅ Automated validation in development and CI/CD
- ✅ Clear developer guidelines and decision trees
- ✅ Pre-commit hooks prevent violations before commit
- ✅ GitHub Actions enforce standards on every PR

---

## Phase 4 Deliverables

### 4.1: ESLint Rules for Design Tokens ⭐ HIGH PRIORITY

**Objective:** Automated enforcement of design token usage patterns

**Custom ESLint Rules:**
1. **no-hardcoded-spacing** - Detect hardcoded space-y-*, gap-*, p-*, m-* values
2. **no-hardcoded-colors** - Detect hardcoded text-*, bg-*, border-* color values
3. **no-hardcoded-typography** - Detect hardcoded text-*, font-*, leading-* values
4. **require-design-token-import** - Ensure design-tokens are imported when using token patterns
5. **no-deprecated-tokens** - Warn on usage of deprecated tokens (SPACING.xs, ANIMATIONS, etc.)

**Implementation:**
```javascript
// eslint-local-rules/no-hardcoded-spacing.js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded spacing values, require design tokens',
      category: 'Best Practices',
    },
    messages: {
      hardcodedSpacing: 'Use SPACING tokens instead of hardcoded "{{value}}"',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'className') {
          const value = node.value.value;
          const hardcodedPattern = /(space-y-|gap-|p-|m-|mb-|mt-|mx-|my-)\d+/;
          if (hardcodedPattern.test(value)) {
            context.report({
              node,
              messageId: 'hardcodedSpacing',
              data: { value },
            });
          }
        }
      },
    };
  },
};
```

**Effort:** 4-5 hours
**Impact:** High (prevents regressions)

---

### 4.2: Developer Usage Guide 📚

**Objective:** Comprehensive guide for using design tokens effectively

**Document:** `docs/design/DESIGN_TOKEN_USAGE_GUIDE.md`

**Sections:**
1. **Quick Start** - Import and basic usage
2. **Token Categories** - When to use which category
3. **Common Patterns** - Real-world examples
4. **Anti-Patterns** - What NOT to do
5. **Migration Guide** - Moving legacy code to tokens
6. **Troubleshooting** - Common issues and solutions

**Example Content:**
```markdown
## Quick Start

### Import Design Tokens
```tsx
import {
  TYPOGRAPHY,
  SPACING,
  SEMANTIC_COLORS,
  spacing // helper function for template literals
} from '@/lib/design-tokens';
```

### Basic Usage
```tsx
export function MyComponent() {
  return (
    <div className={SPACING.section}>
      <h1 className={TYPOGRAPHY.h1.standard}>Title</h1>
      <p className={TYPOGRAPHY.body}>Content</p>
    </div>
  );
}
```

### Dynamic Spacing (Template Literals)
```tsx
// Use spacing() helper for type-safe dynamic values
<div className={`gap-${spacing('md')} p-${spacing('lg')}`}>
  {items.map(item => <Card key={item.id} />)}
</div>
```

## Common Patterns

### Pattern 1: Page Layout
```tsx
import { getContainerClasses } from '@/lib/design-tokens';

export default function Page() {
  return (
    <div className={getContainerClasses('standard')}>
      {/* Page content */}
    </div>
  );
}
```

### Pattern 2: Alert States
```tsx
<div className={SEMANTIC_COLORS.alert.critical.container}>
  <AlertTriangle className={SEMANTIC_COLORS.alert.critical.icon} />
  <p className={SEMANTIC_COLORS.alert.critical.text}>Error message</p>
</div>
```

## Anti-Patterns ❌

### ❌ Hardcoded Values
```tsx
// BAD: Hardcoded spacing
<div className="space-y-8">

// GOOD: Design token
<div className={SPACING.section}>
```

### ❌ Inline Styles
```tsx
// BAD: Inline color
<p style={{ color: '#ef4444' }}>

// GOOD: Semantic color token
<p className={SEMANTIC_COLORS.text.error}>
```
```

**Effort:** 2-3 hours
**Impact:** High (developer onboarding and consistency)

---

### 4.3: Pre-Commit Hooks with Husky 🪝

**Objective:** Validate changes before commit

**Setup:**
```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Configuration:** `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Validate design tokens
npm run check:tokens

# Run TypeScript type checking
npx tsc --noEmit
```

**lint-staged Configuration:** `package.json`
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/lib/design-tokens.ts": [
      "node scripts/validate-design-tokens.mjs"
    ]
  }
}
```

**Benefits:**
- ✅ Catch violations before commit
- ✅ Auto-fix formatting issues
- ✅ Prevent broken code from entering git history

**Effort:** 1-2 hours
**Impact:** Medium (prevents bad commits)

---

### 4.4: GitHub Actions CI/CD Workflow 🤖

**Objective:** Automated validation on every PR

**File:** `.github/workflows/design-token-validation.yml`

```yaml
name: Design Token Validation

on:
  pull_request:
    paths:
      - 'src/lib/design-tokens.ts'
      - 'scripts/validate-design-tokens.mjs'
      - 'src/**/*.{ts,tsx}'
  push:
    branches:
      - main
      - preview

jobs:
  validate-tokens:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate design tokens
        run: npm run check:tokens

      - name: TypeScript type check
        run: npx tsc --noEmit

      - name: Run ESLint (design token rules)
        run: npm run lint

      - name: Comment PR with results
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Design token validation failed. Please fix violations before merging.'
            })
```

**Benefits:**
- ✅ Automated validation on every PR
- ✅ Prevents merging broken code
- ✅ Comments on PR when violations detected

**Effort:** 2 hours
**Impact:** High (prevents regressions in production)

---

### 4.5: Decision Tree / Cheat Sheet 🌳

**Objective:** Quick reference for token selection

**File:** `docs/design/DESIGN_TOKEN_DECISION_TREE.md`

**Visual Decision Tree:**
```
┌─ Need spacing? ─────────────────────────┐
│                                          │
├─ Vertical spacing between sections?     │
│  └─ Use: SPACING.section                │
│                                          │
├─ Within content blocks?                 │
│  └─ Use: SPACING.content                │
│                                          │
├─ Template literal (dynamic)?            │
│  └─ Use: spacing('md') helper           │
│                                          │
└─ Compact list spacing?                  │
   └─ Use: SPACING.compact                │

┌─ Need colors? ──────────────────────────┐
│                                          │
├─ Error/warning/success state?           │
│  └─ Use: SEMANTIC_COLORS.alert.*        │
│                                          │
├─ Interactive element (button, link)?    │
│  └─ Use: SEMANTIC_COLORS.interactive.*  │
│                                          │
├─ Status indicator (badge)?              │
│  └─ Use: SEMANTIC_COLORS.status.*       │
│                                          │
└─ Series/theme color?                    │
   └─ Use: SERIES_COLORS.*                │

┌─ Need typography? ──────────────────────┐
│                                          │
├─ Page headline (h1)?                    │
│  └─ Use: TYPOGRAPHY.h1.standard         │
│                                          │
├─ Section headline (h2)?                 │
│  └─ Use: TYPOGRAPHY.h2.standard         │
│                                          │
├─ Body text?                             │
│  └─ Use: TYPOGRAPHY.body                │
│                                          │
└─ Small meta text (dates, labels)?       │
   └─ Use: TYPOGRAPHY.caption              │
```

**Quick Reference Table:**

| Need | Token | Example |
|------|-------|---------|
| Page container | `CONTAINER_WIDTHS.standard` | `<div className={CONTAINER_WIDTHS.standard}>` |
| Vertical spacing | `SPACING.section` | `<div className={SPACING.section}>` |
| Page title | `TYPOGRAPHY.h1.standard` | `<h1 className={TYPOGRAPHY.h1.standard}>` |
| Error message | `SEMANTIC_COLORS.alert.critical.*` | `<div className={SEMANTIC_COLORS.alert.critical.container}>` |
| Hover effect | `HOVER_EFFECTS.card` | `<div className={HOVER_EFFECTS.card}>` |
| Animation | `ANIMATION.fadeIn` | `<div className={ANIMATION.fadeIn}>` |

**Effort:** 1-2 hours
**Impact:** Medium (quick developer reference)

---

## Implementation Timeline

### Week 1 (8 hours)
- [x] Day 1-2: ESLint rules (4-5 hours)
- [x] Day 3: Developer usage guide (2-3 hours)
- [x] Day 4: Pre-commit hooks (1-2 hours)

### Week 2 (4 hours)
- [x] Day 1: GitHub Actions workflow (2 hours)
- [x] Day 2: Decision tree/cheat sheet (1-2 hours)

---

## Success Criteria

- [ ] ESLint rules catch 90%+ of hardcoded value violations
- [ ] Pre-commit hooks prevent invalid commits
- [ ] GitHub Actions workflow runs on every PR
- [ ] Developer guide covers all major use cases
- [ ] Decision tree provides quick answers (<30 seconds to find right token)
- [ ] Zero design token validation errors in CI/CD

---

## Rollout Strategy

### Phase 4A: Development Environment (Week 1)
1. Add ESLint rules (warn mode initially)
2. Add pre-commit hooks
3. Publish developer guide
4. Team training session

### Phase 4B: CI/CD Integration (Week 2)
1. Add GitHub Actions workflow
2. Monitor for failures
3. Switch ESLint rules from warn → error
4. Enforce on all new PRs

### Phase 4C: Retrospective (Week 3)
1. Gather team feedback
2. Adjust thresholds if needed
3. Document learnings

---

## Risk Mitigation

**Risk:** ESLint rules too strict, block legitimate patterns
**Mitigation:** Start with warn mode, collect feedback, adjust rules

**Risk:** Pre-commit hooks slow down development
**Mitigation:** Keep hooks fast (<5 seconds), only validate changed files

**Risk:** CI/CD workflow flaky
**Mitigation:** Comprehensive testing, retry logic, clear error messages

---

## Next Steps

1. Start with ESLint rules (highest ROI)
2. Create developer usage guide
3. Set up pre-commit hooks
4. Add CI/CD workflow
5. Create decision tree
6. Document completion

---

**Last Updated:** February 9, 2026
**Status:** 🚧 In Progress
**Next Action:** Begin ESLint rule implementation
