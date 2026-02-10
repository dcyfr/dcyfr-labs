<!-- TLP:CLEAR -->
# Design Token Decision Tree & Cheat Sheet

**Information Classification:** TLP:CLEAR (Public)
**Last Updated:** February 9, 2026
**Quick Reference:** 30-second guide to choosing the right design token

---

## 🌳 Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│              What are you trying to do?                      │
└─────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    SPACING              COLORS              TYPOGRAPHY
        │                    │                    │
        ▼                    ▼                    ▼

┌─ SPACING DECISIONS ─────────────────────────────────────────┐
│                                                              │
│  ❓ What kind of spacing?                                   │
│                                                              │
│  ┌─ Between major sections (hero → features → CTA)          │
│  │  ✅ SPACING.section                                      │
│  │  Example: <div className={SPACING.section}>              │
│  │                                                           │
│  ┌─ Within content area (paragraphs, cards, lists)          │
│  │  ✅ SPACING.content                                      │
│  │  Example: <div className={SPACING.content}>              │
│  │                                                           │
│  ┌─ Compact lists or tight layouts                          │
│  │  ✅ SPACING.compact                                      │
│  │  Example: <ul className={SPACING.compact}>               │
│  │                                                           │
│  ┌─ Horizontal spacing (gap between buttons, badges)        │
│  │  ✅ SPACING.horizontal                                   │
│  │  Example: <div className={SPACING.horizontal}>           │
│  │                                                           │
│  ┌─ Dynamic spacing (template literals)                     │
│  │  ✅ spacing('md') helper                                 │
│  │  Example: <div className={`gap-${spacing('md')}`}>       │
│  │                                                           │
│  └─ Numeric value for style properties                      │
│     ✅ SPACING_SCALE.md                                     │
│     Example: <div style={{ gap: SPACING_SCALE.md }}>        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ COLOR DECISIONS ───────────────────────────────────────────┐
│                                                              │
│  ❓ What kind of color?                                     │
│                                                              │
│  ┌─ Text color                                              │
│  │  ├─ Primary content → SEMANTIC_COLORS.text.primary       │
│  │  ├─ Secondary/meta → SEMANTIC_COLORS.text.secondary      │
│  │  ├─ Error message → SEMANTIC_COLORS.text.error           │
│  │  ├─ Success → SEMANTIC_COLORS.text.success               │
│  │  └─ Warning → SEMANTIC_COLORS.text.warning               │
│  │                                                           │
│  ┌─ Interactive element (button, link)                      │
│  │  ├─ Primary button → SEMANTIC_COLORS.interactive.primary │
│  │  ├─ Secondary button → SEMANTIC_COLORS.interactive.secondary │
│  │  └─ Link hover → SEMANTIC_COLORS.interactive.hover       │
│  │                                                           │
│  ┌─ Alert/notification box                                  │
│  │  ├─ Error alert → SEMANTIC_COLORS.alert.critical.*       │
│  │  ├─ Warning → SEMANTIC_COLORS.alert.warning.*            │
│  │  ├─ Success → SEMANTIC_COLORS.alert.success.*            │
│  │  └─ Info → SEMANTIC_COLORS.alert.info.*                  │
│  │                                                           │
│  ┌─ Status badge/indicator                                  │
│  │  ├─ Success → SEMANTIC_COLORS.status.success             │
│  │  ├─ Error → SEMANTIC_COLORS.status.error                 │
│  │  ├─ Warning → SEMANTIC_COLORS.status.warning             │
│  │  └─ Neutral → SEMANTIC_COLORS.status.neutral             │
│  │                                                           │
│  └─ Series/category color (charts, tags)                    │
│     ├─ Engineering → SEMANTIC_COLORS.series.engineering     │
│     ├─ Design → SEMANTIC_COLORS.series.design               │
│     └─ Operations → SEMANTIC_COLORS.series.operations       │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ TYPOGRAPHY DECISIONS ──────────────────────────────────────┐
│                                                              │
│  ❓ What kind of text?                                      │
│                                                              │
│  ┌─ Page headline (h1)                                      │
│  │  ├─ Standard → TYPOGRAPHY.h1.standard                    │
│  │  ├─ Emphasized → TYPOGRAPHY.h1.emphasized                │
│  │  └─ Enhanced (gradient) → TYPOGRAPHY.h1.enhanced         │
│  │                                                           │
│  ┌─ Section header (h2)                                     │
│  │  ├─ Standard → TYPOGRAPHY.h2.standard                    │
│  │  └─ Emphasized → TYPOGRAPHY.h2.emphasized                │
│  │                                                           │
│  ┌─ Subsection header (h3)                                  │
│  │  ├─ Standard → TYPOGRAPHY.h3.standard                    │
│  │  └─ Emphasized → TYPOGRAPHY.h3.emphasized                │
│  │                                                           │
│  ┌─ Body text                                               │
│  │  └─ TYPOGRAPHY.body                                      │
│  │                                                           │
│  ┌─ Small text (captions, labels, dates)                    │
│  │  └─ TYPOGRAPHY.caption                                   │
│  │                                                           │
│  └─ Code snippet                                            │
│     └─ TYPOGRAPHY.code                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ CONTAINER DECISIONS ───────────────────────────────────────┐
│                                                              │
│  ❓ What kind of container?                                 │
│                                                              │
│  ┌─ Blog post or focus content                              │
│  │  ✅ getContainerClasses('narrow')                        │
│  │                                                           │
│  ┌─ Standard page                                           │
│  │  ✅ getContainerClasses('standard')                      │
│  │                                                           │
│  ┌─ Dashboard or data-heavy page                            │
│  │  ✅ getContainerClasses('wide')                          │
│  │                                                           │
│  └─ Full-width layout                                       │
│     ✅ getContainerClasses('full')                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Reference Cheat Sheet

### Most Common Patterns

| Use Case | Token | Example |
|----------|-------|---------|
| **Page title** | `TYPOGRAPHY.h1.standard` | `<h1 className={TYPOGRAPHY.h1.standard}>` |
| **Section spacing** | `SPACING.section` | `<div className={SPACING.section}>` |
| **Content spacing** | `SPACING.content` | `<div className={SPACING.content}>` |
| **Error message** | `SEMANTIC_COLORS.text.error` | `<p className={SEMANTIC_COLORS.text.error}>` |
| **Success message** | `SEMANTIC_COLORS.text.success` | `<p className={SEMANTIC_COLORS.text.success}>` |
| **Primary button** | `SEMANTIC_COLORS.interactive.primary` | `<button className={SEMANTIC_COLORS.interactive.primary}>` |
| **Page container** | `getContainerClasses('standard')` | `<div className={getContainerClasses('standard')}>` |
| **Card hover** | `HOVER_EFFECTS.card` | `<div className={HOVER_EFFECTS.card}>` |

---

## 🚫 What NOT to Do

| ❌ Wrong | ✅ Correct | Why |
|---------|-----------|-----|
| `className="space-y-8"` | `className={SPACING.section}` | Hardcoded spacing breaks consistency |
| `className="text-red-500"` | `className={SEMANTIC_COLORS.text.error}` | Semantic meaning > hardcoded color |
| `className="text-4xl font-bold"` | `className={TYPOGRAPHY.h1.standard}` | Typography system ensures consistency |
| `className="mb-4"` | `className={SPACING.content}` | Named tokens are more maintainable |
| `style={{ color: '#ef4444' }}` | `className={SEMANTIC_COLORS.text.error}` | Use tokens for theme consistency |
| `ANIMATIONS.fadeIn` | `ANIMATION.fadeIn` | ANIMATIONS is deprecated |
| `SPACING.md` | `spacing('md')` or `SPACING_SCALE.md` | Use helper for templates, SCALE for values |

---

## 🎯 Common Scenarios

### Scenario 1: Creating an Error Alert

```tsx
import { SEMANTIC_COLORS } from '@/lib/design-tokens';
import { AlertTriangle } from 'lucide-react';

<div className={SEMANTIC_COLORS.alert.critical.container}>
  <AlertTriangle className={SEMANTIC_COLORS.alert.critical.icon} />
  <p className={SEMANTIC_COLORS.alert.critical.text}>
    Something went wrong!
  </p>
</div>
```

### Scenario 2: Building a Card Grid

```tsx
import { SPACING, HOVER_EFFECTS } from '@/lib/design-tokens';

<div className={`grid grid-cols-3 ${SPACING.horizontal}`}>
  <div className={HOVER_EFFECTS.card}>Card 1</div>
  <div className={HOVER_EFFECTS.card}>Card 2</div>
  <div className={HOVER_EFFECTS.card}>Card 3</div>
</div>
```

### Scenario 3: Page with Sections

```tsx
import { SPACING, TYPOGRAPHY, getContainerClasses } from '@/lib/design-tokens';

<div className={getContainerClasses('standard')}>
  <div className={SPACING.section}>
    <h1 className={TYPOGRAPHY.h1.standard}>Title</h1>
    <div className={SPACING.content}>
      <p className={TYPOGRAPHY.body}>Content</p>
    </div>
  </div>

  <div className={SPACING.section}>
    <h2 className={TYPOGRAPHY.h2.standard}>Another Section</h2>
    {/* More content */}
  </div>
</div>
```

### Scenario 4: Dynamic Spacing

```tsx
import { spacing } from '@/lib/design-tokens';

function DynamicGrid({ gap }: { gap: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`grid gap-${spacing(gap)}`}>
      {/* Grid items */}
    </div>
  );
}
```

---

## 🔍 Troubleshooting Flowchart

```
┌─────────────────────────────────────┐
│  ESLint warning about hardcoded     │
│  spacing/colors/typography?         │
└─────────────────────────────────────┘
              │
              ▼
      ┌───────────────┐
      │ Find warning  │
      │ in ESLint     │
      └───────┬───────┘
              │
     ┌────────┴────────────────────┐
     │                             │
     ▼                             ▼
┌──────────────┐          ┌──────────────┐
│ Spacing?     │          │ Color/       │
│              │          │ Typography?  │
└──────┬───────┘          └──────┬───────┘
       │                         │
       ▼                         ▼
Check SPACING           Check SEMANTIC_COLORS
section above           or TYPOGRAPHY above
       │                         │
       └────────┬────────────────┘
                ▼
      ┌──────────────────┐
      │ Import token     │
      │ from             │
      │ design-tokens.ts │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────┐
      │ Replace hardcoded│
      │ value with token │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────┐
      │ Test locally:    │
      │ npm run dev      │
      │ npm run lint     │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────┐
      │ ✅ Commit!       │
      └──────────────────┘
```

---

## 📏 Spacing Scale Reference

| Value | Pixels | Use Case |
|-------|--------|----------|
| `0.5` | 2px | Micro spacing (borders, fine-tuning) |
| `1.5` | 6px | Fine spacing (tight lists) |
| `xs` | 12px | Compact spacing |
| `sm` | 16px | Small spacing |
| `md` | 20px | **Base unit** (most common) |
| `lg` | 24px | Large spacing |
| `xl` | 32px | Extra large spacing |
| `2xl` | 48px | Major section spacing |

---

## 🎨 Color Semantic Mapping

| Semantic Meaning | Text Color | Background | Use For |
|-----------------|------------|------------|---------|
| **Error/Critical** | `SEMANTIC_COLORS.text.error` | `SEMANTIC_COLORS.alert.critical.container` | Errors, failures |
| **Warning** | `SEMANTIC_COLORS.text.warning` | `SEMANTIC_COLORS.alert.warning.container` | Warnings, cautions |
| **Success** | `SEMANTIC_COLORS.text.success` | `SEMANTIC_COLORS.alert.success.container` | Success states |
| **Info** | `SEMANTIC_COLORS.text.primary` | `SEMANTIC_COLORS.alert.info.container` | Informational |
| **Neutral** | `SEMANTIC_COLORS.text.secondary` | `SEMANTIC_COLORS.background.card` | Default states |

---

## 💡 Pro Tips

1. **Import Once:** Import all tokens at the top of each file
   ```tsx
   import { TYPOGRAPHY, SPACING, SEMANTIC_COLORS } from '@/lib/design-tokens';
   ```

2. **Use Semantic Names:** Choose tokens by meaning, not appearance
   - ✅ `SEMANTIC_COLORS.text.error` (semantic)
   - ❌ `text-red-500` (implementation detail)

3. **Combine Tokens:** Mix and match for complex UIs
   ```tsx
   <div className={`${SPACING.section} ${HOVER_EFFECTS.card}`}>
   ```

4. **Check Navigation:** Use table of contents in design-tokens.ts (Cmd+G line numbers)

5. **Auto-Fix:** Run `npm run lint:fix` to auto-fix many violations

---

## 🔗 Related Resources

- **Full Guide:** [Design Token Usage Guide](DESIGN_TOKEN_USAGE_GUIDE.md)
- **Token Source:** [design-tokens.ts](../../src/lib/design-tokens.ts) (lines 1-90 for navigation)
- **Phase 4 Plan:** [Phase 4 Standardization Plan](../plans/PHASE_4_STANDARDIZATION_PLAN_2026-02-09.md)
- **ESLint Rules:** `eslint-local-rules/`

---

**Print This Page:** Perfect for desk reference or onboarding new developers

**Last Updated:** February 9, 2026
