# Section Navigation - Quick Start

Add keyboard navigation (PageUp/PageDown) to any page in 3 steps.

## 1. Import Components

```tsx
import { SectionNavigator, Section } from "@/components/section-navigator";
import { SCROLL_BEHAVIOR } from "@/lib/design-tokens";
```

## 2. Wrap Your Sections

```tsx
<SectionNavigator scrollOffset={SCROLL_BEHAVIOR.offset.standard}>
  <Section>Hero Section</Section>
  <Section>Features Section</Section>
  <Section>Projects Section</Section>
</SectionNavigator>
```

## 3. Done! 🎉

Users can now press:

- **PageDown** → Next section
- **PageUp** → Previous section

## Options

```tsx
// Custom scroll offset (for taller headers)
<SectionNavigator scrollOffset={100}>

// Disable navigation
<SectionNavigator disabled>

// Enable scroll snap
<SectionNavigator enableScrollSnap>
```

## Accessibility

✅ Respects `prefers-reduced-motion`  
✅ Ignores keypresses in form inputs  
✅ Works with screen readers  
✅ No keyboard traps

## Examples

See implementations in:

- `src/app/page.tsx` (Homepage)
- `src/app/about/page.tsx` (About page)

## Full Documentation

→ `/docs/features/section-navigation.md`
