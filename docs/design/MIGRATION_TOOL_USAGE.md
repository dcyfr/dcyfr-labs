<!-- TLP:CLEAR -->
# Design Token Migration Tool - Usage Guide

**Information Classification:** TLP:CLEAR (Public)
**Last Updated:** February 9, 2026
**Tool Version:** 1.0.0

---

## Overview

The Design Token Migration Tool automatically converts hardcoded Tailwind classes to design tokens using AST-based transformations.

**Features:**
- ✅ Safe, AST-based code transformation (no regex)
- ✅ Dry-run mode (preview before applying)
- ✅ Automatic import management
- ✅ Detailed migration reports
- ✅ Supports spacing, colors, and typography patterns

---

## Quick Start

### Preview Changes (Dry Run - Default)

```bash
# Preview all files
npm run migrate:tokens

# Preview specific directory
npm run migrate:tokens src/components/mdx

# Preview single file
npm run migrate:tokens src/components/mdx/code-block.tsx
```

### Apply Changes

```bash
# Apply to entire codebase
npm run migrate:tokens -- --apply

# Apply to specific directory
npm run migrate:tokens src/components/rivet -- --apply

# Apply to single file
npm run migrate:tokens src/components/mdx/code-block.tsx -- --apply
```

---

## Usage Examples

### Example 1: Migrate Single Component

```bash
# 1. Preview changes
npm run migrate:tokens src/components/ui/button.tsx

# 2. Review output
# 3. Apply if changes look good
npm run migrate:tokens src/components/ui/button.tsx -- --apply

# 4. Verify
npx eslint src/components/ui/button.tsx
```

### Example 2: Migrate Entire Directory

```bash
# 1. Create git checkpoint
git add . && git commit -m "Before design token migration"

# 2. Preview directory changes
npm run migrate:tokens "src/components/mdx/*.tsx"

# 3. Apply changes
npm run migrate:tokens "src/components/mdx/*.tsx" -- --apply

# 4. Verify
npm run lint
npm run check:tokens
```

### Example 3: Full Codebase Migration

```bash
# 1. Ensure clean git state
git status

# 2. Preview all changes
npm run migrate:tokens

# 3. Review report carefully
# (scroll through output)

# 4. Apply changes
npm run migrate:tokens -- --apply

# 5. Run validation
npm run lint
npm run check:tokens
npx tsc --noEmit

# 6. Test application
npm run dev

# 7. Review changes
git diff --stat
git diff src/components/mdx/code-block.tsx

# 8. Commit
git add .
git commit -m "chore: migrate hardcoded values to design tokens"
```

---

## Migration Patterns

### Spacing Migrations

| Hardcoded | → | Design Token | Context |
|-----------|---|--------------|---------|
| `space-y-12`, `space-y-16` | → | `SPACING.section` | Major section spacing |
| `space-y-6`, `space-y-8` | → | `SPACING.content` | Content area spacing |
| `space-y-2`, `space-y-4` | → | `SPACING.compact` | Compact list spacing |
| `gap-2`, `gap-4`, `gap-6` | → | `SPACING.horizontal` | Horizontal gaps |
| `my-6`, `mb-6` | → | `SPACING.content` | Vertical margins |
| `px-4`, `px-6` | → | `SPACING.horizontal` | Horizontal padding |

### Color Migrations

| Hardcoded | → | Design Token | Context |
|-----------|---|--------------|---------|
| `text-red-500` | → | `SEMANTIC_COLORS.text.error` | Error messages |
| `text-green-500` | → | `SEMANTIC_COLORS.text.success` | Success messages |
| `text-yellow-500` | → | `SEMANTIC_COLORS.text.warning` | Warnings |
| `text-gray-500` | → | `SEMANTIC_COLORS.text.secondary` | Secondary text |
| `bg-red-50` | → | `SEMANTIC_COLORS.alert.critical.container` | Error backgrounds |
| `bg-green-50` | → | `SEMANTIC_COLORS.alert.success.container` | Success backgrounds |

### Typography Migrations

| Hardcoded | → | Design Token | Context |
|-----------|---|--------------|---------|
| `text-xs` | → | `TYPOGRAPHY.caption` | Small text, labels |

---

## Output Format

### Dry Run Report

```
🔄 Design Token Migration Tool

📋 Mode: 🔍 DRY RUN (preview)
📁 Pattern: src/**/*.{ts,tsx}

============================================================

📂 Scanning files matching: src/**/*.{ts,tsx}
Found 942 files

# 🎨 Design Token Migration Report

**Mode:** 🔍 DRY RUN (preview only)
**Total Files:** 15
**Total Changes:** 47

**Changes by Type:**
- Spacing: 32
- Colors: 8
- Typography: 7
- Mixed: 0

---

## 📄 src/components/mdx/code-block.tsx

**Changes:** 6

📏 **Line 112** (spacing)
  - Before: `my-6`
  - After: `SPACING.content`

📏 **Line 114** (spacing)
  - Before: `px-4 py-2 bg-muted/50`
  - After: `${SPACING.horizontal} py-2 bg-muted/50`

📝 **Line 94** (typography)
  - Before: `text-xs text-muted-foreground/50`
  - After: `${TYPOGRAPHY.caption} text-muted-foreground/50`

---

💡 To apply these changes, run with --apply flag:
   npm run migrate:tokens -- --apply
```

### Apply Report

```
🔄 Design Token Migration Tool

📋 Mode: ✅ APPLY (will save changes)
📁 Pattern: src/**/*.{ts,tsx}

============================================================

📂 Scanning files matching: src/**/*.{ts,tsx}
Found 942 files
💾 Saving changes...

# 🎨 Design Token Migration Report

**Mode:** ✅ APPLY (changes saved)
**Total Files:** 15
**Total Changes:** 47

...

============================================================

✅ Migration complete! Next steps:

   1. Review changes: git diff
   2. Verify: npm run lint
   3. Test: npm run dev && visit affected pages
   4. Commit: git add . && git commit -m "chore: migrate to design tokens"
```

---

## Safety Features

### 1. Dry Run Default

The tool runs in preview mode by default. You must explicitly use `--apply` to make changes.

```bash
# Safe - preview only
npm run migrate:tokens

# Requires explicit --apply flag
npm run migrate:tokens -- --apply
```

### 2. AST-Based Transformations

Uses TypeScript compiler to parse code safely - no regex substitutions.

### 3. Automatic Import Management

Automatically adds missing design token imports:

```tsx
// Before migration
export function MyComponent() {
  return <div className="space-y-8">...</div>;
}

// After migration
import { SPACING } from '@/lib/design-tokens';

export function MyComponent() {
  return <div className={SPACING.section}>...</div>;
}
```

### 4. Git-Based Rollback

Always commit before running:

```bash
# Create checkpoint
git add . && git commit -m "Pre-migration checkpoint"

# Run migration
npm run migrate:tokens -- --apply

# If needed, rollback
git reset --hard HEAD~1
```

---

## Validation After Migration

### Step 1: Verify No Errors

```bash
# TypeScript compilation
npx tsc --noEmit

# Design token validation
npm run check:tokens

# ESLint
npm run lint
```

### Step 2: Test Application

```bash
# Start dev server
npm run dev

# Visit affected pages
# Verify UI looks identical
```

### Step 3: Run Tests

```bash
# Unit tests
npm run test:run

# E2E tests (if applicable)
npm run test:e2e
```

---

## Troubleshooting

### Issue: "No files matching pattern found"

**Cause:** Incorrect glob pattern or path

**Solution:**
```bash
# Use full path
npm run migrate:tokens /full/path/to/file.tsx

# Or relative from project root
npm run migrate:tokens src/components/ui/button.tsx

# Quote patterns with wildcards
npm run migrate:tokens "src/**/*.tsx"
```

### Issue: Template literal className not migrated

**Cause:** Current version only supports string literals

**Example:**
```tsx
// Not migrated (complex expression)
<div className={`space-y-${spacing}`}>

// Will be migrated (simple string)
<div className="space-y-8">
```

**Solution:** Manually migrate complex expressions or wait for future enhancement.

### Issue: Migration creates syntax errors

**Cause:** Complex className patterns

**Solution:**
1. Review the dry run report carefully
2. Apply to single file first
3. Verify compilation: `npx tsc --noEmit`
4. If errors, rollback: `git checkout -- <file>`
5. Report issue with file example

###Issue: Too many changes at once

**Solution:** Migrate incrementally by directory:

```bash
# Migrate one directory at a time
npm run migrate:tokens "src/components/ui/*.tsx" -- --apply
npm run migrate:tokens "src/components/mdx/*.tsx" -- --apply
npm run migrate:tokens "src/components/rivet/*.tsx" -- --apply
```

---

## Advanced Usage

### Generate Migration Report File

```bash
# Save report to file
npm run migrate:tokens > migration-report-$(date +%Y-%m-%d).md
```

### Migrate Specific Patterns

```bash
# Only .tsx files
npm run migrate:tokens "src/**/*.tsx"

# Exclude test files
npm run migrate:tokens "src/**/!(*.test).tsx"

# Specific component category
npm run migrate:tokens "src/components/{ui,mdx,rivet}/**/*.tsx"
```

### Pre-Commit Hook Integration

Add to `.husky/pre-commit`:

```bash
# Auto-migrate staged files (optional - use with caution)
STAGED_TSX=$(git diff --cached --name-only --diff-filter=AM | grep '\.tsx$')
if [ -n "$STAGED_TSX" ]; then
  for file in $STAGED_TSX; do
    npx tsx scripts/migrate-design-tokens.ts "$file" --apply
    git add "$file"
  done
fi
```

---

## Limitations

### Current Limitations

1. **Template Literals:** Only simple string literals are migrated
   - ❌ `className={`space-y-${size}`}` - Not migrated
   - ✅ `className="space-y-8"` - Migrated

2. **Conditional Classes:** Complex conditionals not migrated
   - ❌ `className={error ? "text-red-500" : "text-green-500"}` - Not migrated
   - Manual: Use SEMANTIC_COLORS ternary

3. **Dynamic Classes:** Runtime-generated classes not migrated
   - ❌ `className={classes.join(' ')}` - Not migrated

### Future Enhancements

- [ ] Support for template literals
- [ ] Context-aware color mapping (detect error/success from code)
- [ ] Conditional expression migrations
- [ ] CSS-in-JS support (styled-components, emotion)
- [ ] Machine learning for pattern detection

---

## Best Practices

### 1. Always Preview First

```bash
# 👍 Good - Review before applying
npm run migrate:tokens
npm run migrate:tokens -- --apply

# 👎 Bad - Apply without preview
npm run migrate:tokens -- --apply
```

### 2. Migrate Incrementally

```bash
# 👍 Good - One directory at a time
npm run migrate:tokens "src/components/ui/*.tsx" -- --apply

# 👎 Risky - Entire codebase at once
npm run migrate:tokens -- --apply
```

### 3. Validate After Each Migration

```bash
# After applying changes
npm run lint
npm run check:tokens
npx tsc --noEmit
npm run dev
```

### 4. Commit Frequently

```bash
# After each successful directory migration
git add .
git commit -m "chore: migrate ui components to design tokens"
```

### 5. Test Thoroughly

- Visual regression testing
- E2E tests for affected pages
- Manual QA of migrated components

---

## Support

**Issues:** Create GitHub issue with `design-tokens` label
**Questions:** See [Design Token Usage Guide](DESIGN_TOKEN_USAGE_GUIDE.md)
**Examples:** See [Phase 5A Implementation Plan](../plans/PHASE_5A_AUTOMATED_MIGRATION_PLAN_2026-02-09.md)

---

**Last Updated:** February 9, 2026
**Tool Location:** `scripts/migrate-design-tokens.ts`
**Related:** Phase 5A Automated Migration Initiative
