# 🎯 Quick Fix Guide

**Status:** Ready to fix | **Time to Deploy:** ~3.5 hours

---

## 🏃 Quick Reference

### Current Status
```
✅ Build: PASS
✅ TypeScript: PASS
⚠️  Linting: 91 warnings
❌ Tests: 8 failures (hero-overlay)
⚠️  Git: 1 uncommitted file
```

### Critical Issues (Fix First)
1. **8 failing hero-overlay tests** — Component rendering wrong height class
2. **Uncommitted CSS changes** — Breaking scrollbar styling
3. **91 ESLint warnings** — Design token compliance

---

## 🔧 STEP-BY-STEP FIX GUIDE

### Step 1: Revert Uncommitted CSS Changes (5 min)
```bash
cd /Users/drew/Desktop/dcyfr/code/dcyfr-labs

# Check current changes
git status

# Revert the CSS file
git checkout src/app/globals.css

# Verify
git status
# Should show clean working directory
```

---

### Step 2: Investigate Hero Overlay Test Failures (10 min)
```bash
# Run just the failing tests
npm run test:unit -- hero-overlay

# This will show the exact assertion failures
# Key issue: Component outputs 'h-auto' but tests expect 'h-24', 'h-32', 'h-40'
```

**Expected Output:**
```
FAIL  src/__tests__/components/common/hero-overlay.test.tsx
  - HeroOverlay Component > Intensity Levels > should render with light intensity
  - HeroOverlay Component > Intensity Levels > should render with medium intensity (default)
  - ...etc (8 total failures)
```

---

### Step 3: Fix Hero Overlay Component (20-30 min)

**File to Fix:** `src/components/common/hero-overlay.tsx`

```bash
# Open the component
code src/components/common/hero-overlay.tsx

# Look for the height class logic
# Current issue: Using 'h-auto' for all intensities
# Fix: Map intensity prop to correct height class

# Expected fix pattern:
# const heightMap = { light: 'h-24', medium: 'h-32', strong: 'h-40' }
# Then use: className={`... ${heightMap[intensity]} ...`}
```

**After making changes:**
```bash
# Run the specific tests
npm run test:unit -- hero-overlay

# Should see: Tests: 8 passed
```

---

### Step 4: Fix Design Token Warnings (30 min - 2 hours)

#### Step 4a: Fix Invalid SPACING Tokens (3 files, 7 instances)
```bash
# Files to fix:
# 1. src/app/dev/docs/decision-trees/page.tsx (2 instances)
# 2. src/components/dev/interactive-decision-tree.tsx (3 instances)
# 3. src/components/common/mdx.tsx (2 instances)

# Find the pattern:
grep -r "SPACING\." src/app/dev/docs/decision-trees/page.tsx
grep -r "SPACING\." src/components/dev/interactive-decision-tree.tsx
grep -r "SPACING\." src/components/common/mdx.tsx

# Look for: className={`space-y-${SPACING...}` or className={`gap-${SPACING...}`
# These should NOT use template literals with SPACING tokens

# Fix: Use SPACING tokens directly
# ❌ className={`space-y-${SPACING.compact}`}
# ✅ className={SPACING.section}
```

#### Step 4b: Auto-fix remaining issues
```bash
# ESLint can auto-fix some issues
npm run lint:fix

# Check what remains
npm run lint

# Verify design tokens
node scripts/validate-design-tokens.mjs
```

---

### Step 5: Final Validation (15 min)
```bash
# Check everything
npm run check
# This runs: lint + typecheck

# Run all tests
npm run test:unit

# Build for production
npm run build

# Expected outputs:
# ✓ Lint: 0 errors
# ✓ TypeScript: 0 errors
# ✓ Tests: All pass
# ✓ Build: Succeeds
```

---

## 📋 VALIDATION CHECKLIST

Run these commands in order and verify output:

```bash
# 1. Check git status
git status
# Expected: On branch preview, nothing to commit

# 2. Lint
npm run lint
# Expected: 0 errors (warnings acceptable <10)

# 3. TypeScript
npm run typecheck
# Expected: No errors

# 4. Unit tests
npm run test:unit
# Expected: All passed (1449 tests)

# 5. Build
npm run build
# Expected: ✓ Compiled successfully

# 6. Design tokens
node scripts/validate-design-tokens.mjs
# Expected: Validation successful
```

---

## 🚀 DEPLOYMENT COMMANDS

Once all checks pass:

```bash
# Stage changes
git add -A

# Commit
git commit -m "fix: hero-overlay height classes and design token compliance"

# Push to preview
git push origin preview

# Merge to main (via PR)
# GitHub UI or:
git checkout main
git merge preview
git push origin main
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot find h-auto class"
- **Cause:** Tailwind not configured correctly
- **Solution:** Verify `tailwind.config.ts` exists and `h-auto` is standard

### Issue 2: "SPACING tokens undefined"
- **Cause:** Import missing in file
- **Solution:** Add `import { SPACING } from '@/lib/design-tokens';`

### Issue 3: "Test still failing after fix"
- **Cause:** Component changes not matching test expectations
- **Solution:** Debug by logging className output

```typescript
// In component or test for debugging:
console.log('className:', overlay.className);
// This will show what's actually being rendered
```

### Issue 4: CSS scrollbar styles broken after fix
- **Cause:** `hsl()` wrapper is required for CSS variable color conversion
- **Solution:** Ensure CSS uses: `background: hsl(var(--muted));`

---

## 📞 WHEN TO ESCALATE

If you encounter:
- ❌ Hero overlay component doesn't exist
- ❌ Design token system different than documented
- ❌ Build fails with "command not found"
- ❌ Tests pass but E2E fails

→ Check `docs/ai/COMPONENT_PATTERNS.md` or run: `npm run check`

---

## ✅ SUCCESS CRITERIA

Deployment is ready when:

1. ✅ `git status` shows clean working directory
2. ✅ `npm run check` passes with 0 errors
3. ✅ `npm run test:unit` shows 100% pass rate
4. ✅ `npm run build` succeeds
5. ✅ `node scripts/validate-design-tokens.mjs` passes

---

## 📊 BEFORE & AFTER

### BEFORE (Current State)
```
Build:        ✅ Pass
TypeScript:   ✅ Pass
Lint:         ⚠️  91 warnings
Tests:        ❌ 8 failures
Git:          ⚠️  1 uncommitted
Overall:      ❌ NOT READY FOR DEPLOY
```

### AFTER (Target State)
```
Build:        ✅ Pass
TypeScript:   ✅ Pass
Lint:         ✅ <10 warnings
Tests:        ✅ 100% pass
Git:          ✅ Clean
Overall:      ✅ READY FOR DEPLOY
```

---

**Generated:** December 8, 2025  
**Time Estimate:** 2-3 hours  
**Priority:** HIGH - Fix before merge

