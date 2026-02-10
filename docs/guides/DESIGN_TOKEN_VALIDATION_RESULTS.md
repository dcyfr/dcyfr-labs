<!-- TLP:AMBER - Internal Use Only -->
# Design Token Validation Results

**Information Classification:** TLP:AMBER (Internal Team Only)
**Generated:** February 3, 2026
**Validation Script:** [scripts/validate-design-tokens.mjs](../../scripts/validate-design-tokens.mjs)

---

## Executive Summary

✅ **Major Improvement:** Reduced violations from 200+ to **72 actual issues**
✅ **Validation Script:** Now properly recognizes nested design token paths
✅ **NPM Integration:** `npm run check:tokens` command added to package.json

---

## Validation Results

### Overall Statistics
- **Files Scanned:** 942 TypeScript/TSX files
- **Invalid Tokens Found:** 72
- **Most Common Issue:** `SEMANTIC_COLORS.status.neutral` (27 occurrences)

### Remaining Violations Breakdown

| Token Path | Count | Status | Recommended Fix |
|-----------|-------|--------|----------------|
| `SEMANTIC_COLORS.status.neutral` | 27 | ❌ Invalid | Use `SEMANTIC_COLORS.status.info` or muted styles |
| `SEMANTIC_COLORS.activity.action.default` | 7 | ⚠️ Check | Verify if this should exist in design-tokens.ts |
| `ANIMATIONS.item` | 6 | ❌ Invalid | Use `ANIMATION.reveal.*` or check ANIMATIONS object |
| `SEMANTIC_COLORS.activity.action.liked` | 4 | ⚠️ Check | Verify if this should exist |
| `ANIMATIONS.transition.all` | 4 | ❌ Invalid | Use `ANIMATION.transition.base` |
| `ANIMATIONS.cardHover` | 4 | ❌ Invalid | Check ANIMATIONS vs ANIMATION |
| `SPACING.activity.contentGap` | 3 | ✅ Valid | Script bug - this exists in design-tokens.ts |
| `SEMANTIC_COLORS.status.inProgress` | 3 | ❌ Invalid | Use `SEMANTIC_COLORS.status.info` |
| `SEMANTIC_COLORS.activity.action.bookmarked` | 2 | ⚠️ Check | Verify if this should exist |
| `TYPOGRAPHY.depth.*` | 6 | ❌ Invalid | Use `TYPOGRAPHY.body`, `TYPOGRAPHY.label.*` |
| `TYPOGRAPHY.small.muted` | 1 | ❌ Invalid | Use `TYPOGRAPHY.label.small` or `.metadata` |
| `CONTAINER_WIDTHS.wide` | 1 | ❌ Invalid | Use `CONTAINER_WIDTHS.dashboard` (not yet fixed) |
| `SPACING.activity.threadGap` | 1 | ✅ Valid | Script bug - this exists |
| `ANIMATIONS.*` (other) | 3 | ⚠️ Check | Verify ANIMATIONS vs ANIMATION usage |

---

## Key Findings

### 1. SEMANTIC_COLORS.status.neutral (27 files)

**Issue:** Code uses `SEMANTIC_COLORS.status.neutral` but only these exist:
- ✅ `SEMANTIC_COLORS.status.success`
- ✅ `SEMANTIC_COLORS.status.warning`
- ✅ `SEMANTIC_COLORS.status.error`
- ✅ `SEMANTIC_COLORS.status.info`

**Recommendation:**
- Use `SEMANTIC_COLORS.status.info` for neutral information
- OR use muted text/background styles directly

**Affected Files (27):**
- src/app/dev/maintenance/components/status-cards.tsx
- src/components/activity/ActivityItem.tsx (3 occurrences)
- src/components/dashboard/* (multiple files)
- ...and 23 more

---

### 2. SEMANTIC_COLORS.activity.action.* (13 occurrences)

**Issue:** Code uses activity action states that may not exist:
- `SEMANTIC_COLORS.activity.action.default` (7)
- `SEMANTIC_COLORS.activity.action.liked` (4)
- `SEMANTIC_COLORS.activity.action.bookmarked` (2)

**Action Required:**
1. Check if `SEMANTIC_COLORS.activity.action` object exists in design-tokens.ts
2. If it doesn't exist, decide whether to:
   - Add these semantic colors for activity engagement states
   - OR use existing alert/status colors instead

---

### 3. ANIMATIONS vs ANIMATION Confusion (17 occurrences)

**Issue:** Code uses both `ANIMATION` and `ANIMATIONS` - need to clarify:
- ✅ `ANIMATION` - Tailwind CSS class-based animations (primary system)
- ✅ `ANIMATIONS` - JavaScript animation constants (durations, easing, etc.)

**Invalid Usage:**
- ❌ `ANIMATIONS.item` - Should be `ANIMATION.reveal.*`
- ❌ `ANIMATIONS.transition.all` - Should be `ANIMATION.transition.base`
- ❌ `ANIMATIONS.cardHover` - Should be `ANIMATION.hover.lift`

**Recommendation:** Audit all `ANIMATIONS.*` usage and migrate to `ANIMATION.*` where appropriate

---

### 4. TYPOGRAPHY.depth.* (6 occurrences)

**Issue:** Code uses `TYPOGRAPHY.depth.*` variants:
- ❌ `.primary`, `.secondary`, `.tertiary`, `.accent`, `.subtle`

**These don't exist.** Use instead:
- ✅ `TYPOGRAPHY.body` (standard text)
- ✅ `TYPOGRAPHY.label.small` (secondary text)
- ✅ `TYPOGRAPHY.metadata` (tertiary/subtle text)

---

### 5. Validation Script Bugs (4 occurrences)

**Issue:** Script incorrectly flags valid tokens as invalid:
- `SPACING.activity.threadGap` ✅ Actually valid
- `SPACING.activity.contentGap` ✅ Actually valid

**Fix Required:** Update validation script to properly handle nested object arrays in SPACING definition

---

## Validation Script Status

### ✅ Fixed Issues
1. Now recognizes nested design token paths (ANIMATION.duration.fast, etc.)
2. Added comprehensive VALID_TOKENS definition with 30+ token groups
3. Handles special cases like SEMANTIC_COLORS.accent.{color}.{property}
4. Provides helpful suggestions via COMMON_MISTAKES mapping
5. Integrated into package.json as `npm run check:tokens`

### ⚠️ Known Limitations
1. Nested array-object combinations in SPACING need better handling
2. ANIMATIONS vs ANIMATION distinction needs clarification
3. Dynamic token paths (accent colors) could be improved

---

## Next Steps

### High Priority
1. **Fix SEMANTIC_COLORS.status.neutral (27 files)**
   - Decision: Use `.info` or muted styles?
   - Create migration script or manual fixes
   - Estimated effort: 30 minutes

2. **Verify SEMANTIC_COLORS.activity.action.* (13 files)**
   - Check if these should exist in design-tokens.ts
   - If yes: add them
   - If no: migrate to alternative patterns
   - Estimated effort: 15 minutes (verification) + 30 minutes (fixes)

3. **Fix CONTAINER_WIDTHS.wide (1 file)**
   - File: src/mcp/design-token-server.ts
   - Change to `CONTAINER_WIDTHS.dashboard`
   - Estimated effort: 2 minutes

### Medium Priority
4. **Audit ANIMATIONS vs ANIMATION usage (17 files)**
   - Clarify when to use each
   - Migrate invalid ANIMATIONS.* references
   - Estimated effort: 1 hour

5. **Fix TYPOGRAPHY.depth.* references (6 files)**
   - Replace with TYPOGRAPHY.body/label.*/metadata
   - Estimated effort: 15 minutes

6. **Fix validation script bugs**
   - Handle SPACING.activity.* properly
   - Estimated effort: 15 minutes

### Low Priority
7. **Add pre-commit hook**
   - Auto-run validation on staged TS/TSX files
   - Estimated effort: 30 minutes

8. **Integrate into CI/CD**
   - Add to GitHub Actions workflow
   - Fail builds on design token violations
   - Estimated effort: 15 minutes

---

## Commands

### Run Validation
```bash
npm run check:tokens
```

### Analyze Violations
```bash
# Count violations by token type
npm run check:tokens 2>&1 | grep "Token:" | sort | uniq -c | sort -rn

# List all affected files
npm run check:tokens 2>&1 | grep "src/" | sort | uniq
```

### Fix Single Issue
```bash
# Find all uses of a specific token
grep -r "SEMANTIC_COLORS.status.neutral" src/
```

---

## Success Metrics

**Current State:**
- ✅ 72 violations identified (down from 200+)
- ✅ Validation script working
- ✅ NPM command integrated

**Target State:**
- ⏳ 0 violations
- ⏳ Pre-commit hook active
- ⏳ CI/CD integration complete
- ⏳ 100% design token compliance

---

**Last Updated:** February 3, 2026
**Validation Command:** `npm run check:tokens`
**Related Docs:**
- [DESIGN_TOKENS_REFERENCE.md](DESIGN_TOKENS_REFERENCE.md)
- [DESIGN_TOKEN_VIOLATIONS_SUMMARY.md](DESIGN_TOKEN_VIOLATIONS_SUMMARY.md)
- [.github/agents/enforcement/DESIGN_TOKENS.md](../../.github/agents/enforcement/DESIGN_TOKENS.md)
