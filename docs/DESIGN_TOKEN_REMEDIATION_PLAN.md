# Design Token Remediation Plan

**Generated:** December 28, 2025  
**Scope:** 1657 hardcoded Tailwind violations across 217 files  
**Status:** Discovery phase complete, remediation strategy required

## Executive Summary

Analysis of dcyfr-labs codebase revealed **1657 hardcoded Tailwind class violations** across **217 files** instead of the initially estimated ~40 violations in specific components. This represents a significant discrepancy between:

- **Design Token Requirement:** All styling MUST use `src/lib/design-tokens.ts` constants
- **Current Implementation:** Widespread hardcoded Tailwind classes (`mb-4`, `text-lg`, `gap-2`, etc.)

### Quick Stats

```
📊 VIOLATION SUMMARY
├─ Total Violations: 1657
├─ Affected Files: 217
├─ Average per file: 7.6 violations
├─ Primary Types:
│  ├─ Spacing (mb-, mt-, gap-, p-): ~800
│  ├─ Typography (text-*, font-*): ~600
│  └─ Container (grid-cols-, flex-): ~250
└─ Status: Requires systematic remediation strategy
```

## Violation Breakdown

### By File Type

| Type | Count | Examples |
|------|-------|----------|
| Components | ~900 | ProfileCard, BlogCard, Navbar |
| Pages/Routes | ~400 | /blog, /work, layout.tsx |
| Utility Functions | ~250 | helpers, formatters, utils |
| Layouts | ~100 | app layouts, modals |
| **Total** | **1657** | |

### By Violation Category

| Category | Count | Token Replacement | Example |
|----------|-------|-------------------|---------|
| **Spacing** | ~800 | `SPACING.*` | `mb-4` → `mb-${SPACING.content}` |
| **Typography** | ~600 | `TYPOGRAPHY.*` | `text-lg` → `TYPOGRAPHY.body.base` |
| **Container** | ~250 | `CONTAINER_WIDTHS` | `max-w-4xl` → `CONTAINER_WIDTHS.standard` |
| **Colors** | ~7 | `COLORS.*` | `text-red-500` → `COLORS.error` |

## Root Cause Analysis

### Why Are There So Many Violations?

1. **Legacy Code** - Codebase grew with ad-hoc styling before design token system was enforced
2. **Incomplete ESLint Enforcement** - ESLint rules exist but:
   - Set to `warn` level (not blocking)
   - Complex regex patterns miss many patterns
   - Not configured as pre-commit hook
3. **Missing Automation** - No bulk conversion tool available
4. **Documentation Gap** - Design token system exists but not universally adopted in earlier code

### Why Wasn't This Caught?

- ✅ Design token system created in `src/lib/design-tokens.ts`
- ❌ ESLint rules created but warnings not enforced
- ❌ No pre-commit hooks blocking violations
- ❌ No CI check failing on non-compliance
- ❌ Initial audit estimated impact too low

## Remediation Strategies

### Option A: Automated Bulk Conversion (Recommended for Fast Track)

**Approach:** Create script to convert all hardcoded classes to tokens in one pass

**Pros:**
- Fast (can complete in hours, not weeks)
- Consistent application of token standards
- Automatic and repeatable

**Cons:**
- Requires careful regex to avoid false positives
- Risk of breaking some styling edge cases
- Requires thorough testing afterward

**Timeline:** 1-2 days
**Risk:** Medium (automated changes need careful review)
**Effort:** 20 hours

### Option B: Incremental Component Refactoring (Recommended for Quality)

**Approach:** Prioritize components by impact (most-used first), manually refactor

**Pros:**
- High confidence in each fix
- Opportunity to improve code quality
- Can validate thoroughly before moving on

**Cons:**
- Slower (3-4 weeks for all 217 files)
- Resource intensive
- Requires discipline to maintain pace

**Timeline:** 3-4 weeks
**Risk:** Low (manual review provides quality gate)
**Effort:** 80-100 hours

### Option C: Hybrid Approach (RECOMMENDED - Balanced)

**Approach:** 
1. Use automated script for straightforward patterns (80% of violations)
2. Manual review and fix for edge cases (20% of violations)
3. Implement enforcement to prevent new violations

**Pros:**
- Fast for 80% of work
- Quality for important 20%
- Demonstrates immediate progress
- Prevents regression

**Cons:**
- Requires script maintenance
- Two-phase process

**Timeline:** 1 week
**Risk:** Low-Medium (automated + manual review)
**Effort:** 40-50 hours

### Option D: Grandfathered Enforcement (Quick Win for New Code)

**Approach:**
1. Change ESLint rule from `error` to `warn` (no breaking)
2. Implement pre-commit hook to catch NEW violations
3. Incrementally fix existing code (backlog)
4. Generate violation report for prioritization

**Pros:**
- Immediate impact (prevents regression)
- No forced breaking changes
- Incremental progress
- Allows prioritization

**Cons:**
- Existing violations remain
- Debt accumulates longer
- May signal indecision to team

**Timeline:** 1 day (enforcement only)
**Risk:** Very Low
**Effort:** 8 hours

## Recommended Approach: Option C (Hybrid)

### Phase 1: Automated Conversion (Days 1-2)

Create smart conversion script that:

```typescript
// Input: className="mb-4 text-lg gap-2"
// Output: className={`mb-${SPACING.sm} ${TYPOGRAPHY.body.base} gap-${SPACING.sm}`}
```

**Script features:**
- Convert common patterns (mb-*, mt-*, gap-*, text-*, etc.)
- Generate conversion map (spacing-4 → SPACING.sm)
- Create rollback script
- Generate report of automated changes

**Success criteria:**
- 80% of violations converted automatically
- 0 TypeScript errors after conversion
- All tests still passing
- No visual regressions in sample components

### Phase 2: Manual Review & Edge Cases (Days 3-5)

- Review automated conversions
- Fix remaining ~20% of violations
- Handle edge cases (responsive classes, complex patterns)
- Test thoroughly

**Success criteria:**
- All 1657 violations fixed
- Design token compliance ≥95%
- All tests passing
- No breaking changes

### Phase 3: Enforcement & Prevention (Days 6-7)

- Update ESLint to error-level for NEW violations
- Add pre-commit hook
- Add CI check
- Document for team

**Success criteria:**
- No new violations possible
- Violations caught immediately
- Team trained on token system

## Implementation Plan - Week 1

### Day 1: Setup & Analysis
- [ ] Create automated conversion script (`scripts/convert-tokens.mjs`)
- [ ] Generate detailed violation report with file-by-file breakdown
- [ ] Create conversion map (hardcoded → token)
- [ ] Prepare rollback plan

### Day 2: Automated Conversion
- [ ] Run conversion script on entire codebase
- [ ] Run `npm run typecheck` - verify no type errors
- [ ] Run `npm run test:run` - verify all tests pass
- [ ] Manual spot-check 20 files for correctness

### Day 3: Manual Review
- [ ] Review conversion report
- [ ] Fix edge cases and complex patterns
- [ ] Test components manually
- [ ] Verify visual output (Storybook or component tests)

### Day 4: Testing & Validation
- [ ] Run full test suite
- [ ] Run Lighthouse CI
- [ ] E2E tests for critical paths
- [ ] Performance validation (no regression)

### Day 5: Enforcement Setup
- [ ] Update ESLint config (error level)
- [ ] Add barrel export enforcement rule
- [ ] Create pre-commit hook
- [ ] Update CI/CD pipeline

### Day 6-7: Documentation & Team Alignment
- [ ] Update DCYFR.agent.md with metrics
- [ ] Document migration results
- [ ] Team training on design tokens
- [ ] Metrics reporting

## Blockers & Risks

### Risk 1: Responsive/Conditional Classes
- **Problem:** Classes like `sm:mb-4` `md:gap-2` are complex to convert
- **Mitigation:** Create mapping for breakpoint prefixes
- **Fallback:** Manual conversion for these cases

### Risk 2: Dynamic Classes
- **Problem:** `className={isOpen ? 'mb-4' : 'mb-2'}` requires token logic
- **Mitigation:** Convert to token-based conditionals
- **Fallback:** Flag for manual review

### Risk 3: Third-Party Component Props
- **Problem:** Can't change classes passed to external libs
- **Mitigation:** Create wrapper components with token classes
- **Fallback:** Accept minimal violations for unavoidable cases

### Risk 4: Performance Impact
- **Problem:** Class size might increase with token references
- **Mitigation:** Monitor bundle size and CSS output
- **Fallback:** Optimize token extraction if needed

## Tools & Scripts

### 1. Conversion Script (create)
```bash
npm run convert:tokens    # Run automated conversion
npm run convert:tokens -- --dry-run  # Preview changes
npm run convert:tokens -- --rollback  # Undo changes
```

### 2. Validation Script (create)
```bash
npm run validate:tokens   # Check for remaining violations
npm run validate:tokens -- --report  # Generate detailed report
```

### 3. Enforcement (existing)
```bash
npm run lint             # ESLint check (will error on new violations)
npm run test:run         # Vitest suite
npm run typecheck        # TypeScript strict mode
```

## Success Criteria

| Criterion | Target | Current | Timeline |
|-----------|--------|---------|----------|
| Design Token Compliance | ≥95% | 40% | End of Week 1 |
| ESLint Errors | 0 | 0 | Maintained |
| TypeScript Errors | 0 | 0 | Maintained |
| Test Pass Rate | ≥99% | 98.7% | Maintained |
| No New Violations | 100% | N/A | With enforcement |

## Decision Matrix

**Choose based on:**

| Decision Point | Favors Option A | Favors Option B | Favors Option C | Favors Option D |
|---|---|---|---|---|
| "We need it ASAP" | ✅✅✅ | | ✅ | ✅ |
| "Quality > Speed" | | ✅✅✅ | ✅ | |
| "Limited budget" | ✅ | | ✅ | ✅✅ |
| "New code matters most" | | | ✅ | ✅✅✅ |
| "Full compliance needed" | ✅ | ✅✅✅ | ✅✅ | |

## Next Steps

**Decision required from project lead:**

1. ✅ Which remediation approach? (A, B, C, or D)
2. ✅ Timeline/deadline for completion?
3. ✅ Risk tolerance (automated vs manual)?
4. ✅ Resource availability (hours/people)?

**Upon decision:**
- Create detailed implementation task list
- Build conversion scripts (if Option A or C)
- Schedule work in sprint/milestone
- Track progress with metrics

---

## Appendix: Technical Details

### Token Categories Available

From `src/lib/design-tokens.ts`:

```typescript
SPACING: {
  xs, sm, content, md, lg, xl, xxl  // 0.25rem to 6rem
}

TYPOGRAPHY: {
  h1: { standard, large },
  h2: { standard },
  h3: { standard },
  h4: { standard },
  body: { base, sm, xs },
  mono: { base, sm }
}

CONTAINER_WIDTHS: {
  narrow, standard, wide, full
}

COLORS: {
  primary, secondary, success, warning, error, info
}

// Plus: SHADOWS, TRANSITIONS, BORDERS, etc.
```

### Violation Detection Regex

```regex
/(mb|mt|ms|me|px|py|gap|p)-\d+/          # Spacing
/(text|font)-(xs|sm|base|lg|xl|2xl)/     # Typography
/(max-w|w)-[\w-]+/                       # Container widths
/(bg|text|border)-(red|blue|green|etc)/ # Colors
```

### Automated Conversion Examples

```typescript
// Before
className="mb-4 text-lg gap-2 flex items-center"

// After  
className={`mb-${SPACING.md} ${TYPOGRAPHY.body.base} gap-${SPACING.sm} flex items-center`}

// Or using template helper:
className={clsx(spacing.mb4, typography.bodyBase, spacing.gap2, 'flex items-center')}
```

---

**Prepared by:** DCYFR AI Lab  
**Status:** Ready for decision  
**Last Updated:** December 28, 2025
