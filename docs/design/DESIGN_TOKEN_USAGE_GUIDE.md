<!-- TLP:CLEAR -->
# Design Token Usage Guide

**Information Classification:** TLP:CLEAR (Public)
**Last Updated:** February 9, 2026
**Version:** 1.0.0

---

## Table of Contents

- [Quick Start](#quick-start)
- [Token Categories](#token-categories)
- [Common Patterns](#common-patterns)
- [Anti-Patterns](#anti-patterns)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)
- [ESLint Integration](#eslint-integration)

---

## Quick Start

### Import Design Tokens

```tsx
import {
  TYPOGRAPHY,
  SPACING,
  SEMANTIC_COLORS,
  SPACING_SCALE,
  spacing, // helper function for template literals
  ANIMATION_CONSTANTS,
} from '@/lib/design-tokens';
```

### Basic Usage

```tsx
export function MyComponent() {
  return (
    <div className={SPACING.section}>
      <h1 className={TYPOGRAPHY.h1.standard}>Page Title</h1>
      <p className={TYPOGRAPHY.body}>Content here</p>
    </div>
  );
}
```

### Dynamic Spacing (Template Literals)

```tsx
// ✅ Use spacing() helper for type-safe dynamic values
<div className={`gap-${spacing('md')} p-${spacing('lg')}`}>
  {items.map(item => <Card key={item.id} />)}
</div>

// ✅ Use SPACING_SCALE for numeric spacing
<div style={{ gap: SPACING_SCALE.md }}>
```

---

## Token Categories

### 1. Container & Layout Tokens

**Use For:** Page containers, content widths, responsive layouts

```tsx
import { CONTAINER_WIDTHS, getContainerClasses } from '@/lib/design-tokens';

// Page container
<div className={getContainerClasses('standard')}>
  {/* Page content */}
</div>

// Custom container
<div className={CONTAINER_WIDTHS.standard}>
  {/* Max-width container */}
</div>
```

**Available Container Types:**
- `narrow` - Blog posts, focus content
- `standard` - Default pages
- `wide` - Dashboards, data-heavy pages
- `full` - Full-width layouts

---

### 2. Typography Tokens

**Use For:** All text styling (headings, body, captions, code)

```tsx
import { TYPOGRAPHY } from '@/lib/design-tokens';

// Page headlines
<h1 className={TYPOGRAPHY.h1.standard}>Main Title</h1>
<h2 className={TYPOGRAPHY.h2.standard}>Section Header</h2>
<h3 className={TYPOGRAPHY.h3.standard}>Subsection Header</h3>

// Body text
<p className={TYPOGRAPHY.body}>Regular paragraph text</p>
<span className={TYPOGRAPHY.caption}>Small label or meta text</span>

// Code snippets
<code className={TYPOGRAPHY.code}>const example = true;</code>

// Emphasis styles
<h1 className={TYPOGRAPHY.h1.enhanced}>Enhanced headline with gradient</h1>
```

**Typography Variants:**
- `.standard` - Default styling
- `.emphasized` - Bold/emphasized version
- `.enhanced` - With accent colors or gradients
- `.compact` - Tighter spacing for lists/tables

---

### 3. Spacing Tokens

**Use For:** Vertical/horizontal spacing, gaps, padding, margins

```tsx
import { SPACING, SPACING_SCALE, spacing } from '@/lib/design-tokens';

// Vertical spacing between sections
<div className={SPACING.section}>
  {/* Major section */}
</div>

// Vertical spacing within content
<div className={SPACING.content}>
  {/* Content block */}
</div>

// Compact spacing (lists, cards)
<div className={SPACING.compact}>
  {/* Tight spacing */}
</div>

// Horizontal spacing
<div className={SPACING.horizontal}>
  {/* Horizontal gap between elements */}
</div>

// Dynamic spacing (template literals)
function Card({ size }: { size: 'sm' | 'md' | 'lg' }) {
  return <div className={`p-${spacing(size)}`}>Content</div>;
}

// Numeric spacing values (for style properties)
<div style={{ marginTop: SPACING_SCALE.lg }}>
```

**Available Spacing Values:**
- `0.5` - 2px (micro spacing)
- `1.5` - 6px (fine spacing)
- `xs` - 12px
- `sm` - 16px
- `md` - 20px (base unit)
- `lg` - 24px
- `xl` - 32px
- `2xl` - 48px

---

### 4. Color Tokens (Semantic)

**Use For:** Text colors, backgrounds, borders, status indicators

```tsx
import { SEMANTIC_COLORS } from '@/lib/design-tokens';

// Text colors
<p className={SEMANTIC_COLORS.text.primary}>Primary text</p>
<span className={SEMANTIC_COLORS.text.secondary}>Secondary text</span>
<span className={SEMANTIC_COLORS.text.error}>Error message</span>

// Interactive elements
<button className={SEMANTIC_COLORS.interactive.primary}>
  Click Me
</button>

// Status indicators (badges, alerts)
<div className={SEMANTIC_COLORS.status.success}>✓ Success</div>
<div className={SEMANTIC_COLORS.status.warning}>⚠ Warning</div>
<div className={SEMANTIC_COLORS.status.error}>✕ Error</div>

// Alert states (full alert boxes)
<div className={SEMANTIC_COLORS.alert.critical.container}>
  <AlertTriangle className={SEMANTIC_COLORS.alert.critical.icon} />
  <p className={SEMANTIC_COLORS.alert.critical.text}>Critical error</p>
</div>

// Series colors (charts, categories)
<div className={SEMANTIC_COLORS.series.engineering}>Engineering</div>
```

---

### 5. Animation Tokens

**Use For:** Transitions, animations, motion

```tsx
import { ANIMATION, ANIMATION_CONSTANTS } from '@/lib/design-tokens';

// Pre-built animations
<div className={ANIMATION.fadeIn}>
  Fades in on mount
</div>

<div className={ANIMATION.slideUp}>
  Slides up on mount
</div>

// Animation constants (for custom animations)
<div className="transition-all" style={{
  transitionDuration: ANIMATION_CONSTANTS.duration.normal,
  transitionTimingFunction: ANIMATION_CONSTANTS.easing.smooth,
}}>
  Custom animated element
</div>
```

**Available Animations:**
- `fadeIn` - Fade in from transparent
- `fadeOut` - Fade out to transparent
- `slideUp` - Slide up from bottom
- `slideDown` - Slide down from top
- `scaleIn` - Scale up from center
- `pulse` - Pulsing animation

---

### 6. Effects Tokens

**Use For:** Hover states, focus states, shadows, gradients

```tsx
import { HOVER_EFFECTS, FOCUS_EFFECTS, GRADIENT_EFFECTS } from '@/lib/design-tokens';

// Hover effects
<div className={HOVER_EFFECTS.card}>
  Card that lifts on hover
</div>

<button className={HOVER_EFFECTS.button}>
  Button with hover state
</button>

// Focus effects (for accessibility)
<input className={FOCUS_EFFECTS.input} />

// Gradient backgrounds
<div className={GRADIENT_EFFECTS.primary}>
  Gradient background
</div>
```

---

## Common Patterns

### Pattern 1: Page Layout

```tsx
import { PageLayout } from '@/components/layouts';
import { SPACING, TYPOGRAPHY } from '@/lib/design-tokens';

export default function MyPage() {
  return (
    <PageLayout layout="standard">
      <div className={SPACING.section}>
        <h1 className={TYPOGRAPHY.h1.standard}>Page Title</h1>

        <div className={SPACING.content}>
          <p className={TYPOGRAPHY.body}>Page content here</p>
        </div>
      </div>
    </PageLayout>
  );
}
```

### Pattern 2: Card Component

```tsx
import { SPACING, HOVER_EFFECTS, SEMANTIC_COLORS } from '@/lib/design-tokens';

export function Card({ title, children }: CardProps) {
  return (
    <div className={`${HOVER_EFFECTS.card} ${SEMANTIC_COLORS.background.card} ${SPACING.content}`}>
      <h3 className={TYPOGRAPHY.h3.standard}>{title}</h3>
      {children}
    </div>
  );
}
```

### Pattern 3: Alert/Status Message

```tsx
import { SEMANTIC_COLORS } from '@/lib/design-tokens';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function Alert({ type, message }: AlertProps) {
  const config = {
    error: {
      container: SEMANTIC_COLORS.alert.critical.container,
      icon: SEMANTIC_COLORS.alert.critical.icon,
      text: SEMANTIC_COLORS.alert.critical.text,
      Icon: AlertTriangle,
    },
    success: {
      container: SEMANTIC_COLORS.alert.success.container,
      icon: SEMANTIC_COLORS.alert.success.icon,
      text: SEMANTIC_COLORS.alert.success.text,
      Icon: CheckCircle,
    },
    info: {
      container: SEMANTIC_COLORS.alert.info.container,
      icon: SEMANTIC_COLORS.alert.info.icon,
      text: SEMANTIC_COLORS.alert.info.text,
      Icon: Info,
    },
  }[type];

  return (
    <div className={config.container}>
      <config.Icon className={config.icon} />
      <p className={config.text}>{message}</p>
    </div>
  );
}
```

### Pattern 4: Dynamic Spacing

```tsx
import { spacing, SPACING_SCALE } from '@/lib/design-tokens';

// Template literals with spacing() helper
function Grid({ gap }: { gap: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`grid gap-${spacing(gap)}`}>
      {/* Grid items */}
    </div>
  );
}

// Style properties with SPACING_SCALE
function CustomSpacing({ size }: { size: keyof typeof SPACING_SCALE }) {
  return (
    <div style={{ padding: SPACING_SCALE[size] }}>
      {/* Content */}
    </div>
  );
}
```

---

## Anti-Patterns ❌

### ❌ Hardcoded Spacing Values

```tsx
// BAD: Hardcoded Tailwind classes
<div className="space-y-8 mb-6 gap-4">

// GOOD: Design tokens
<div className={`${SPACING.section} ${SPACING.horizontal}`}>
```

### ❌ Hardcoded Color Values

```tsx
// BAD: Direct color references
<p className="text-red-500">Error message</p>

// GOOD: Semantic color token
<p className={SEMANTIC_COLORS.text.error}>Error message</p>
```

### ❌ Hardcoded Typography

```tsx
// BAD: Manual typography classes
<h1 className="text-4xl font-bold leading-tight">

// GOOD: Typography token
<h1 className={TYPOGRAPHY.h1.standard}>
```

### ❌ Inline Styles for Design Values

```tsx
// BAD: Inline styles
<div style={{ marginTop: '32px', color: '#ef4444' }}>

// GOOD: Design tokens
<div className={SPACING.section} style={{ color: SEMANTIC_COLORS.text.error }}>
```

### ❌ Magic Numbers

```tsx
// BAD: Unexplained numeric values
<div style={{ gap: 20, padding: 24 }}>

// GOOD: Named constants
<div style={{ gap: SPACING_SCALE.md, padding: SPACING_SCALE.lg }}>
```

### ❌ Deprecated Token Usage

```tsx
// BAD: Deprecated ANIMATIONS
import { ANIMATIONS } from '@/lib/design-tokens';
<div className={ANIMATIONS.fadeIn}>

// GOOD: Use ANIMATION_CONSTANTS or ANIMATION
import { ANIMATION } from '@/lib/design-tokens';
<div className={ANIMATION.fadeIn}>

// BAD: Deprecated SPACING numeric properties
<div className={SPACING.md}>

// GOOD: Use SPACING_SCALE or spacing() helper
<div className={`gap-${spacing('md')}`}>
```

---

## Migration Guide

### Migrating from Hardcoded Values

**Step 1: Identify Violations**

Run ESLint to find all hardcoded values:
```bash
npm run lint
```

**Step 2: Import Design Tokens**

Add imports at the top of your file:
```tsx
import { TYPOGRAPHY, SPACING, SEMANTIC_COLORS } from '@/lib/design-tokens';
```

**Step 3: Replace Hardcoded Classes**

| Old (Hardcoded) | New (Design Token) |
|----------------|-------------------|
| `className="space-y-8"` | `className={SPACING.section}` |
| `className="gap-6"` | `className={SPACING.content}` |
| `className="text-4xl font-bold"` | `className={TYPOGRAPHY.h1.standard}` |
| `className="text-red-500"` | `className={SEMANTIC_COLORS.text.error}` |
| `className="mb-4"` | `className={SPACING.content}` |

**Step 4: Test Changes**

```bash
npm run dev
npm run test:run
npm run check:tokens
```

### Migrating Deprecated Tokens

**ANIMATIONS → ANIMATION_CONSTANTS**

```tsx
// Before
import { ANIMATIONS } from '@/lib/design-tokens';
<div style={{ animationDuration: ANIMATIONS.duration.normal }}>

// After
import { ANIMATION_CONSTANTS } from '@/lib/design-tokens';
<div style={{ animationDuration: ANIMATION_CONSTANTS.duration.normal }}>
```

**SPACING numeric → SPACING_SCALE**

```tsx
// Before
<div className={`gap-${SPACING.md}`}>

// After (template literal)
import { spacing } from '@/lib/design-tokens';
<div className={`gap-${spacing('md')}`}>

// After (style property)
import { SPACING_SCALE } from '@/lib/design-tokens';
<div style={{ gap: SPACING_SCALE.md }}>
```

---

## Troubleshooting

### Issue: ESLint warnings on valid design token usage

**Symptom:** ESLint flags design token usage as errors

**Solution:** Ensure you're using the correct import path:
```tsx
// ✅ Correct
import { SPACING } from '@/lib/design-tokens';

// ❌ Wrong
import { SPACING } from '../lib/design-tokens';
```

### Issue: Template literal spacing not working

**Symptom:** `className={`gap-${spacing('md')}`}` doesn't apply spacing

**Solution:** Ensure Tailwind JIT sees the full class name. For dynamic values, prefer predefined tokens:
```tsx
// ✅ Preferred
<div className={SPACING.horizontal}>

// ⚠️ Fallback for truly dynamic cases
const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};
<div className={gapClasses[size]}>
```

### Issue: TypeScript errors on SPACING_SCALE

**Symptom:** `Property 'md' does not exist on type...`

**Solution:** Import SPACING_SCALE explicitly:
```tsx
import { SPACING_SCALE } from '@/lib/design-tokens';

// Type-safe access
const spacing: keyof typeof SPACING_SCALE = 'md';
```

### Issue: Color tokens not applying

**Symptom:** Semantic colors don't show in browser

**Solution:** Check for CSS specificity conflicts. Design token classes should have appropriate specificity:
```tsx
// Ensure design token class is applied last
<div className={`custom-class ${SEMANTIC_COLORS.background.card}`}>
```

---

## ESLint Integration

### Custom Rules

The project includes custom ESLint rules to enforce design token usage:

**Rules:**
- `dcyfr-local/no-hardcoded-spacing` (warn) - Detects hardcoded spacing classes
- `dcyfr-local/no-hardcoded-colors` (warn) - Detects hardcoded color classes
- `dcyfr-local/no-hardcoded-typography` (warn) - Detects hardcoded typography
- `dcyfr-local/no-deprecated-design-tokens` (error) - Prevents deprecated token usage

### Running Lint Checks

```bash
# Check all files
npm run lint

# Auto-fix violations (where possible)
npm run lint:fix

# Check specific file
npx eslint src/components/my-component.tsx
```

### Suppressing False Positives

For legitimate cases where hardcoded values are necessary:

```tsx
// eslint-disable-next-line dcyfr-local/no-hardcoded-spacing
<div className="p-4">
  {/* Specific use case requiring hardcoded value */}
</div>
```

---

## Quick Reference

### Decision Tree

```
Need spacing?
  ├─ Between sections? → SPACING.section
  ├─ Within content? → SPACING.content
  ├─ Compact lists? → SPACING.compact
  ├─ Horizontal gap? → SPACING.horizontal
  └─ Dynamic (template)? → spacing('md')

Need colors?
  ├─ Error/warning/success? → SEMANTIC_COLORS.alert.*
  ├─ Links/buttons? → SEMANTIC_COLORS.interactive.*
  ├─ Status badge? → SEMANTIC_COLORS.status.*
  └─ Series/theme? → SEMANTIC_COLORS.series.*

Need typography?
  ├─ Page title (h1)? → TYPOGRAPHY.h1.standard
  ├─ Section header (h2)? → TYPOGRAPHY.h2.standard
  ├─ Body text? → TYPOGRAPHY.body
  └─ Small labels? → TYPOGRAPHY.caption

Need container?
  ├─ Blog post? → getContainerClasses('narrow')
  ├─ Standard page? → getContainerClasses('standard')
  └─ Dashboard? → getContainerClasses('wide')
```

---

**Questions?** See [design-tokens.ts](../../src/lib/design-tokens.ts) for full token definitions.

**Report Issues:** Create a GitHub issue with the label `design-tokens`.

**Last Updated:** February 9, 2026
