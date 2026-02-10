<!-- TLP:AMBER - Internal Use Only -->
# Phase 3: Design Token File Splitting Plan

**Information Classification:** TLP:AMBER (Internal Team Only)
**Created:** February 9, 2026
**Scope:** Split design-tokens.ts (2,977 lines) into modular files
**Estimated Effort:** 6-8 hours

---

## Objective

Split the monolithic `design-tokens.ts` file into 12 focused category files for:
- ✅ Better IDE performance
- ✅ Easier navigation and maintenance
- ✅ Clearer ownership boundaries
- ✅ Potential bundle size wins (tree-shaking)

---

## Proposed File Structure

```
src/lib/design-tokens/
├── index.ts                    # Barrel export (re-exports all tokens)
├── containers.ts              # 6 exports, ~150 lines
├── typography.ts              # 5 exports, ~400 lines
├── spacing.ts                 # 4 exports, ~200 lines
├── colors.ts                  # 3 exports, ~400 lines
├── animation.ts               # 3 exports, ~250 lines
├── effects.ts                 # 5 exports, ~250 lines
├── layout.ts                  # 4 exports, ~250 lines
├── interaction.ts             # 3 exports, ~150 lines
├── utilities.ts               # 4 exports, ~150 lines
├── components.ts              # 4 exports, ~350 lines
└── app.ts                     # 2 exports, ~150 lines
```

**Total:** 12 files (~2,700 lines + 300 lines of imports/exports)

---

## Token Distribution

### containers.ts
- `CONTAINER_WIDTHS` (7 properties)
- `CONTAINER_PADDING`
- `NAVIGATION_HEIGHT`
- `ARCHIVE_CONTAINER_PADDING`
- `CONTAINER_VERTICAL_PADDING`
- `MOBILE_SAFE_PADDING`

### typography.ts
- `TYPOGRAPHY` (35+ variants)
- `WORD_SPACING` (7 properties)
- `FONT_CONTRAST` (5 properties)
- `CONTENT_HIERARCHY` (4 blocks)
- `PROGRESSIVE_TEXT` (5 properties)

### spacing.ts
- `SPACING` (20+ properties)
- `SPACING_VALUES` (5 properties)
- `SPACING_SCALE` (8 properties)
- `spacing()` helper function

### colors.ts
- `SEMANTIC_COLORS` (100+ properties)
- `OPACITY` (5 properties)
- `SERIES_COLORS` (12 themes)

### animation.ts
- `ANIMATION` (30+ classes)
- `ANIMATION_CONSTANTS` (duration, easing, etc.)
- `ARCHIVE_ANIMATIONS` (Framer Motion variants)

### effects.ts
- `HOVER_EFFECTS` (10 effects)
- `BORDERS` (8 styles)
- `SHADOWS` (15+ shadows)
- `GRADIENTS` (40+ gradients)
- `GRADIENT_KEYS` (array)

### layout.ts
- `PAGE_LAYOUT` (12+ layouts)
- `HERO_VARIANTS` (3 variants)
- `GRID_PATTERNS` (4 patterns)
- `SCROLL_BEHAVIOR` (scroll animations)

### interaction.ts
- `TOUCH_TARGET` (15+ targets)
- `BUTTON_SIZES` (10 sizes)
- `FOCUS_RING` (5 rings)

### utilities.ts
- `Z_INDEX` (9 layers)
- `BREAKPOINTS` (responsive breakpoints)
- `SCROLL_OFFSET` (scroll offset values)
- `IMAGE_PLACEHOLDER` (placeholder config)

### components.ts
- `FORM_PATTERNS` (form styles)
- `COMPONENT_PATTERNS` (component styles)
- `ARCHIVE_CARD_VARIANTS` (4 variants)
- `VIEW_MODES` (4 modes)

### app.ts
- `APP_TOKENS` (20+ app-specific tokens)
- `ACTIVITY_IMAGE` (activity feed images)

---

## Migration Strategy

### Phase 1: Create File Structure ✅
1. Create `src/lib/design-tokens/` directory
2. Create all 12 category files with proper headers
3. Add TypeScript type exports
4. Create barrel export `index.ts`

### Phase 2: Move Token Definitions ✅
1. Copy tokens to respective category files
2. Maintain all JSDoc comments
3. Preserve `as const` assertions
4. Keep helper functions with related tokens

### Phase 3: Update Barrel Export ✅
1. Re-export all tokens from `index.ts`
2. Maintain backward compatibility
3. Add deprecation notice to old file

### Phase 4: Update Imports (Automated) ✅
1. Find all files importing from `@/lib/design-tokens`
2. Update import paths to `@/lib/design-tokens` (no change needed!)
3. Barrel export maintains compatibility

### Phase 5: Validation ✅
1. Run TypeScript compilation
2. Run design token validation
3. Test production build
4. Verify bundle size

### Phase 6: Cleanup ✅
1. Move old `design-tokens.ts` to `design-tokens.ts.backup`
2. Update documentation
3. Update AGENTS.md if needed

---

## Import Compatibility

**Key Insight:** Barrel export maintains backward compatibility!

**Before:**
```typescript
import { TYPOGRAPHY, SPACING, SEMANTIC_COLORS } from '@/lib/design-tokens';
```

**After (same import path):**
```typescript
import { TYPOGRAPHY, SPACING, SEMANTIC_COLORS } from '@/lib/design-tokens';
```

**No import updates needed!** The barrel export (`index.ts`) handles the re-exports.

---

## Risk Mitigation

### Low Risk
- ✅ Barrel export maintains full backward compatibility
- ✅ No changes to consuming code required
- ✅ Can roll back by restoring original file

### Medium Risk
- ⚠️ Bundle size may change (need to measure)
- ⚠️ Tree-shaking behavior may differ
- ⚠️ IDE indexing may be slower initially

### Mitigation Strategies
1. **Bundle Analysis:** Run before/after comparison
2. **Incremental Testing:** Test after each file creation
3. **Rollback Plan:** Keep original file as `.backup`
4. **Validation:** Run all checks before committing

---

## Success Criteria

- [ ] TypeScript compiles with 0 errors
- [ ] Design token validation passes (0 errors)
- [ ] Production build succeeds
- [ ] Bundle size change < 5% (ideally decreased)
- [ ] All tests pass
- [ ] No runtime errors in dev server

---

## Implementation Checklist

### Setup
- [ ] Create `src/lib/design-tokens/` directory
- [ ] Create 12 category files with headers

### Token Migration (per file)
- [ ] containers.ts - Copy container tokens
- [ ] typography.ts - Copy typography tokens
- [ ] spacing.ts - Copy spacing tokens + helper
- [ ] colors.ts - Copy color tokens
- [ ] animation.ts - Copy animation tokens
- [ ] effects.ts - Copy effect tokens
- [ ] layout.ts - Copy layout tokens
- [ ] interaction.ts - Copy interaction tokens
- [ ] utilities.ts - Copy utility tokens
- [ ] components.ts - Copy component tokens
- [ ] app.ts - Copy app tokens

### Barrel Export
- [ ] Create `index.ts` with all re-exports
- [ ] Verify all exports are included
- [ ] Test import from barrel

### Validation
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run check:tokens`
- [ ] Run `npm run build`
- [ ] Check bundle size
- [ ] Test dev server

### Cleanup
- [ ] Backup original file
- [ ] Update documentation
- [ ] Create completion report

---

## Rollback Plan

If issues arise:
1. Stop immediately
2. Restore `design-tokens.ts` from backup
3. Delete `design-tokens/` directory
4. Run validation to confirm restoration
5. Document issues encountered

---

## Next Steps

Once approved:
1. Begin implementation with containers.ts
2. Test incrementally after each file
3. Complete all 12 files
4. Validate and deploy

---

**Last Updated:** February 9, 2026
**Status:** Ready for implementation
**Estimated Duration:** 6-8 hours
