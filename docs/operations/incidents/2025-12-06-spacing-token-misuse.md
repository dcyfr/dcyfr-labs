# Incident: SPACING Token Misuse (2025-12-06)

## Summary

**Severity:** High (Build Failure)  
**Status:** Resolved  
**Impact:** Preview deployment failed  
**Root Cause:** Invalid SPACING token property usage

---

## Timeline

- **2025-12-06 (Detection):** Vercel preview build failed with TypeScript error
- **2025-12-06 (Investigation):** Identified `SPACING.compact` usage in `src/app/feeds/page.tsx`
- **2025-12-06 (Resolution):** Fixed invalid token usage, added guardrails
- **2025-12-06 (Prevention):** Enhanced ESLint rules, updated documentation

---

## Details

### Error Message

```
Type error: Property 'compact' does not exist on type '{ readonly section: "space-y-10 md:space-y-12"; ... }'.
  131 | <div className={`flex-1 space-y-${SPACING.compact}`}>
      |                                             ^
```

### Root Cause

Developer used non-existent `SPACING.compact` property in template literal:

```tsx
// ❌ INCORRECT
<div className={`flex-1 space-y-${SPACING.compact}`}>
<div className={`flex flex-wrap gap-${SPACING.compact} pt-2`}>
```

**Why This Failed:**
1. `SPACING` object has no `compact` property (valid properties: `section`, `subsection`, `content`, `proseHero`, `proseSection`, `image`)
2. SPACING tokens are for vertical spacing (`space-y-*`) only, not inline spacing (`gap-*`)
3. Template literal string interpolation bypasses TypeScript checks until build time

---

## Resolution

### Code Fix

```tsx
// ✅ CORRECT
<div className="flex-1 space-y-2">
<div className="flex flex-wrap gap-2 pt-2">
```

**Changed:**
- Replaced `SPACING.compact` with numeric value `2` for small spacing
- Removed template literals for simple numeric values

---

## Prevention Measures

### 1. Enhanced ESLint Rule

Added AST-based rule to catch template literal misuse with SPACING tokens:

```javascript
{
  selector: "TemplateLiteral[expressions.0.object.name='SPACING'][expressions.0.property]:not([quasis.0.value.cooked='']) > .expressions > .property",
  message: "Invalid SPACING token usage. SPACING tokens must be used directly (e.g., className={SPACING.section}), not in template literals..."
}
```

**File:** `eslint.config.mjs`

### 2. Enhanced Documentation

Added comprehensive SPACING usage rules to:
- `src/lib/design-tokens.ts` - Inline JSDoc with examples
- `docs/ai/ENFORCEMENT_RULES.md` - Critical usage section

**Key Documentation Points:**
- Valid SPACING properties listed
- Common mistakes documented
- Clear examples of correct vs incorrect usage
- TypeScript error troubleshooting

### 3. TypeScript Const Assertion

SPACING object already uses `as const` which provides compile-time type safety, but only when used correctly (not in template literals).

---

## Learnings

### What Went Wrong

1. **Template Literals Bypass Type Safety:** Using `${SPACING.property}` in template literals delays type checking until string evaluation
2. **Missing Pre-Build Validation:** TypeScript only caught this during build, not in development
3. **Documentation Gap:** Previous docs didn't explicitly warn against template literal usage with tokens

### What Went Right

1. **Fast Detection:** Build failure immediately blocked deployment
2. **TypeScript Strictness:** Caught the error before reaching production
3. **Clear Error Message:** TypeScript error pinpointed exact location and issue

---

## Best Practices

### SPACING Token Usage

**DO:**
```tsx
// ✅ Use SPACING tokens directly for vertical spacing
<div className={SPACING.section}>

// ✅ Use numeric values for gap, padding, small spacing
<div className="flex gap-4">
<div className="space-y-2">
```

**DON'T:**
```tsx
// ❌ Template literals with SPACING
<div className={`gap-${SPACING.compact}`}>

// ❌ Non-existent properties
<div className={SPACING.tight}>

// ❌ SPACING for non-vertical spacing
<div className={`p-${SPACING.content}`}>
```

### Pre-Flight Checks

Before committing:
1. Run `npm run typecheck` - Catches type errors
2. Run `npm run lint` - Validates token usage
3. Run `npm run check` - All validations

---

## Related Issues

- [Design Token Enforcement Rules](../../ai/ENFORCEMENT_RULES.md#spacing-token-critical-rules)
- [Design Tokens Source](../../../src/lib/design-tokens.ts)

---

## Action Items

- [x] Fix immediate build failure
- [x] Add ESLint rule for template literal detection
- [x] Update SPACING documentation with critical rules
- [x] Add inline JSDoc warnings to `design-tokens.ts`
- [ ] Consider adding pre-build TypeScript check in CI (currently only runs during build)
- [ ] Add test case for design token validation script

---

## Incident Checklist

- [x] Issue identified and understood
- [x] Root cause analysis completed
- [x] Fix implemented and tested
- [x] Prevention measures added
- [x] Documentation updated
- [x] Learnings documented
- [x] Post-incident review completed
