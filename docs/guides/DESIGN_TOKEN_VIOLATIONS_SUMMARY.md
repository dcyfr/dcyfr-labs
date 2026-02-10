<!-- TLP:AMBER - Internal Use Only -->
# Design Token Violations Summary

**Information Classification:** TLP:AMBER (Internal Team Only)
**Generated:** February 3, 2026
**Purpose:** Track design token violations discovered by validation script

---

## Executive Summary

The validation script discovered **200+ design token violations** across the codebase. Components are referencing design token paths that don't exist in `src/lib/design-tokens.ts`.

---

## Categories of Violations

### 1. ANIMATION Tokens (Most Common - ~120 violations)

**Invalid Paths Being Used:**
```typescript
❌ ANIMATION.duration.normal     // Used in 15+ files
❌ ANIMATION.duration.fast       // Used in 10+ files
❌ ANIMATION.duration.slow       // Used in 5+ files
❌ ANIMATION.transition.base     // Used in 30+ files
❌ ANIMATION.transition.movement // Used in 20+ files
❌ ANIMATION.transition.theme    // Used in 20+ files
❌ ANIMATION.transition.appearance // Used in 15+ files
❌ ANIMATION.transition.fast     // Used in 3+ files
❌ ANIMATION.transition.slow     // Used in 2+ files
❌ ANIMATION.effects.countUp     // Used in 5+ files
```

**What Actually Exists:**
```typescript
✅ ANIMATION (object exported from design-tokens.ts)
   ↳ Check design-tokens.ts lines ~700-800 for actual structure
```

**Action Required:**
1. Review `ANIMATION` object in design-tokens.ts (lines ~700-800)
2. Determine if these nested paths should exist
3. Either:
   - Add missing paths to ANIMATION object
   - OR update all 120+ references to use correct paths

---

### 2. SEMANTIC_COLORS Tokens (~60 violations)

**Invalid Paths Being Used:**
```typescript
❌ SEMANTIC_COLORS.status.success       // Used in 5+ files
❌ SEMANTIC_COLORS.status.info          // Used in 5+ files
❌ SEMANTIC_COLORS.status.warning       // Used in 2+ files
❌ SEMANTIC_COLORS.alert.warning.border // Used in 5+ files
❌ SEMANTIC_COLORS.alert.warning.container // Used in 5+ files
❌ SEMANTIC_COLORS.alert.warning.text   // Used in 5+ files
❌ SEMANTIC_COLORS.alert.warning.icon   // Used in 3+ files
❌ SEMANTIC_COLORS.alert.critical.container // Used in 4+ files
❌ SEMANTIC_COLORS.alert.critical.border    // Used in 4+ files
❌ SEMANTIC_COLORS.alert.critical.icon      // Used in 4+ files
❌ SEMANTIC_COLORS.alert.critical.text      // Used in 4+ files
❌ SEMANTIC_COLORS.alert.success.container  // Used in 2+ files
❌ SEMANTIC_COLORS.alert.success.text       // Used in 3+ files
❌ SEMANTIC_COLORS.alert.success.icon       // Used in 4+ files
❌ SEMANTIC_COLORS.alert.info.container     // Used in 2+ files
❌ SEMANTIC_COLORS.alert.info.text          // Used in 2+ files
❌ SEMANTIC_COLORS.alert.info.icon          // Used in 2+ files
❌ SEMANTIC_COLORS.highlight.primary        // Used in 2+ files
❌ SEMANTIC_COLORS.highlight.mark           // Used in 1 file
❌ SEMANTIC_COLORS.accent.*.badge           // Used in 12 files (cyan, blue, purple, etc.)
❌ SEMANTIC_COLORS.accent.*.text            // Used in 10+ files
```

**What Actually Exists:**
```typescript
✅ SEMANTIC_COLORS (object exported from design-tokens.ts)
   ↳ Check design-tokens.ts lines ~500-700 for actual structure
```

**Action Required:**
1. Review `SEMANTIC_COLORS` object structure
2. Determine if alert/status/accent nested paths should exist
3. Either:
   - Add missing semantic color paths
   - OR create alternative color system

---

### 3. SPACING Tokens (~15 violations)

**Invalid Paths Being Used:**
```typescript
❌ SPACING.subsection                  // Used in 10+ files
❌ SPACING.contentGrid                 // Used in 1 file
❌ SPACING.sectionDivider.container    // Used in 3 files
❌ SPACING.sectionDivider.heading      // Used in 3 files
❌ SPACING.sectionDivider.grid         // Used in 3 files
```

**What Actually Exists:**
```typescript
✅ SPACING (object exported from design-tokens.ts)
   ↳ Check design-tokens.ts lines ~450-500 for actual structure
```

**Action Required:**
1. Review `SPACING` object structure
2. Add missing spacing tokens or update references

---

### 4. BORDERS Tokens (~5 violations)

**Invalid Paths Being Used:**
```typescript
❌ BORDERS.circle  // Used in 5 files (fab-menu, back-to-top)
```

**What Actually Exists:**
```typescript
✅ BORDERS (object exported from design-tokens.ts)
   ↳ Check design-tokens.ts for actual structure
```

**Action Required:**
1. Review `BORDERS` object
2. Add `circle` property if needed

---

### 5. TYPOGRAPHY Tokens (2 violations - FIXED)

**Invalid Paths (Fixed):**
```typescript
❌ TYPOGRAPHY.caption  // Used in 2 files (FIXED in code-comparison, metrics-card)
✅ TYPOGRAPHY.label.small (replacement)
✅ TYPOGRAPHY.metadata (replacement)
```

**Remaining Issues:**
```typescript
❌ TYPOGRAPHY.small.muted     // Used in src/mcp/design-token-server.ts
❌ TYPOGRAPHY.depth.accent    // Used in src/components/demos/varying-depth-demo.tsx
❌ TYPOGRAPHY.depth.subtle    // Used in src/components/demos/varying-depth-demo.tsx
```

---

### 6. CONTAINER_WIDTHS Tokens (1 violation - FIXED)

**Invalid Paths (Fixed):**
```typescript
❌ CONTAINER_WIDTHS.wide  // Used in src/app/dev/page.tsx (FIXED)
✅ CONTAINER_WIDTHS.dashboard (replacement)
```

---

## Files With Most Violations

| File | Violations | Primary Issues |
|------|-----------|---------------|
| src/components/home/trending-technologies-panel.tsx | 18 | SEMANTIC_COLORS.accent.*.badge, ANIMATION.transition.* |
| src/components/home/combined-stats-explore.tsx | 12 | ANIMATION.transition.*, ANIMATION.effects.countUp |
| src/components/home/explore-cards.tsx | 12 | ANIMATION.transition.*, ANIMATION.effects.countUp |
| src/lib/toast.tsx | 12 | ANIMATION.duration.*, SEMANTIC_COLORS.alert.*.icon |
| src/lib/activity/types.ts | 11 | SEMANTIC_COLORS.accent.*.text, alert.*.icon |
| src/components/home/explore-section.tsx | 7 | ANIMATION.transition.* |
| src/components/home/trending-posts-panel.tsx | 7 | ANIMATION.transition.*, ANIMATION.effects.countUp |
| src/components/home/trending-projects-panel.tsx | 7 | ANIMATION.transition.*, SEMANTIC_COLORS.alert.success.text |
| src/components/features/github/server-github-heatmap.tsx | 12 | SEMANTIC_COLORS.alert.*.* |
| src/components/home/featured-post-hero.tsx | 9 | ANIMATION.*, SPACING.subsection |

---

## Recommended Fix Strategy

### Option A: Add Missing Tokens (Preferred)
1. **Review design-tokens.ts structure** for each category
2. **Add missing nested paths** that are commonly used:
   - `ANIMATION.duration.{normal, fast, slow}`
   - `ANIMATION.transition.{base, movement, theme, appearance}`
   - `SEMANTIC_COLORS.alert.{warning, critical, success, info}.{container, border, text, icon}`
   - `SPACING.subsection`, `SPACING.contentGrid`
   - `BORDERS.circle`
3. **Re-run validation** to verify compliance

### Option B: Update All References
1. **Find correct alternative paths** in design-tokens.ts
2. **Mass update references** using script or find-replace
3. **Test thoroughly** to ensure no visual regressions

### Option C: Hybrid Approach (Recommended)
1. **Add commonly-needed tokens** where they make semantic sense
2. **Update references** where existing alternatives are better
3. **Document decision** in design-tokens.ts comments

---

## Validation Workflow

### Run Validation
```bash
npm run check:tokens
```

### Expected Output
- **Exit code 0:** All tokens valid
- **Exit code 1:** Violations found (script provides suggestions)

### Integration Points
- ✅ Added to package.json as `check:tokens`
- ⏳ TODO: Add to pre-commit hooks
- ⏳ TODO: Add to CI/CD workflow

---

## Next Steps

1. **[IMMEDIATE]** Review ANIMATION, SEMANTIC_COLORS objects in design-tokens.ts
2. **[HIGH]** Decide on fix strategy (Option A, B, or C above)
3. **[HIGH]** Fix violations in high-impact files (trending panels, toast, activity types)
4. **[MEDIUM]** Add pre-commit hook for automatic validation
5. **[MEDIUM]** Document final design token structure in DESIGN_TOKENS_REFERENCE.md
6. **[LOW]** Consider TypeScript type generation for compile-time validation

---

**Last Updated:** February 3, 2026
**Script Location:** [scripts/validate-design-tokens.mjs](../../scripts/validate-design-tokens.mjs)
**Reference Documentation:** [DESIGN_TOKENS_REFERENCE.md](DESIGN_TOKENS_REFERENCE.md)
**Enforcement Rules:** [.github/agents/enforcement/DESIGN_TOKENS.md](../../.github/agents/enforcement/DESIGN_TOKENS.md)
