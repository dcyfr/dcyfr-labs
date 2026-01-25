---
applyTo: "src/components/**/*.tsx"
---

# React Component Standards for dcyfr-labs

When creating or modifying React components in this repository, follow these mandatory patterns and best practices.

## Design Tokens (MANDATORY - NON-NEGOTIABLE)

All spacing, typography, and colors must use design tokens. Never hardcode values.

### Token Categories

**Spacing Tokens:**
```typescript
import { SPACING } from "@/lib/design-tokens";

// ✅ CORRECT
<div className={`gap-${SPACING.compact}`}>
<div className={`mt-${SPACING.content}`}>

// ❌ WRONG - Will be rejected
<div className="gap-4">
<div className="mt-8">
```

**Typography Tokens:**
```typescript
import { TYPOGRAPHY } from "@/lib/design-tokens";

// ✅ CORRECT
<h1 className={TYPOGRAPHY.h1.standard}>Heading</h1>
<p className={TYPOGRAPHY.body.regular}>Text</p>

// ❌ WRONG
<h1 className="text-3xl font-semibold">Heading</h1>
```

**Container Widths:**
```typescript
import { CONTAINER_WIDTHS } from "@/lib/design-tokens";

// ✅ CORRECT
<div className={`mx-auto ${CONTAINER_WIDTHS.standard}`}>
  Content
</div>

// ❌ WRONG
<div className="mx-auto max-w-6xl">
```

**Reference:** [Design System Guide](../../docs/ai/design-system.md)

## Import Strategy (MANDATORY)

Use barrel exports exclusively. Never import from specific files within a component directory.

```typescript
// ✅ CORRECT - Barrel export
import { PostCard, PostList } from "@/components/blog";
import { PageLayout } from "@/components/layouts";

// ❌ WRONG - Direct file import
import PostCard from "@/components/blog/post-card";
import PageLayout from "@/components/layouts/page-layout";
```

**Key Rules:**
- All component directories must have `index.ts` or `index.tsx` barrel export
- Barrel exports list all public exports from that component group
- Internal utilities stay in their own utility files

**Reference:** [Component Patterns](../../docs/ai/component-patterns.md)

## Layout Selection (90% Rule)

### Default: PageLayout
Use `PageLayout` for 90% of pages. It provides:
- Standard header/footer structure
- Proper spacing and margins
- Responsive container widths
- Metadata integration

```typescript
import { PageLayout } from "@/components/layouts";

export default function Page() {
  return (
    <PageLayout>
      <div className={`mx-auto ${CONTAINER_WIDTHS.standard}`}>
        {/* Page content */}
      </div>
    </PageLayout>
  );
}
```

### Special Cases (10%)
- **ArticleLayout** - Blog posts with byline, date, reading time
- **ArchiveLayout** - Collections with filtering and pagination

**Reference:** [Decision Trees](../../docs/ai/decision-trees.md)

## Testing Requirements

### When to Test
- ✅ Components with logic (state, handlers, conditionals)
- ✅ Components that fetch data or integrate with APIs
- ✅ Utility functions used by components
- ✅ Accessibility features (focus states, keyboard nav)

### When NOT to Test
- ❌ Pure presentational components (no logic)
- ❌ Single-line render functions
- ❌ CSS-only styling changes
- ❌ Trivial wrappers

### Test Pattern
```typescript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/my";

describe("MyComponent", () => {
  it("renders with correct heading", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByRole("heading", { name: "Test" })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handler = vi.fn();
    render(<MyComponent onClick={handler} />);
    screen.getByRole("button").click();
    expect(handler).toHaveBeenCalled();
  });
});
```

**Target:** ≥99% test pass rate across all components

**Reference:** [Testing Guide](../../docs/testing/README.md)

## Responsive Design

### Mobile-First Approach
Start with mobile styles, then add breakpoints for larger screens.

```typescript
// ✅ CORRECT - Mobile-first
<div className="text-sm md:text-base lg:text-lg">
  Content
</div>

// ❌ WRONG - Desktop-first
<div className="text-lg sm:text-sm">
```

### Touch Targets
Minimum 44x44px per WCAG standards (all interactive elements):
```typescript
// ✅ CORRECT
<button className="px-4 py-3 min-h-11">Click me</button>

// ❌ WRONG
<button className="px-2 py-1">Too small</button>
```

### Browser Coverage
Test across:
- iOS Safari (WebKit)
- Android Chrome (Chromium)
- Desktop Firefox (for accessibility)

## Accessibility (A11y)

### Semantic HTML
Use semantic elements for better screen reader support:
```typescript
// ✅ CORRECT
<header>
  <nav>
    <ul>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

// ❌ WRONG
<div class="header">
  <div class="nav">
    <div class="menu-item"><a href="/about">About</a></div>
  </div>
</div>
```

### ARIA Labels
Add labels for screen readers when semantic HTML isn't sufficient:
```typescript
// ✅ CORRECT
<button aria-label="Close menu" onClick={closeMenu}>
  <X size={24} />
</button>

// ❌ WRONG
<button onClick={closeMenu}>
  <X size={24} />
</button>
```

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18pt+)
- Use `dcyfr-accessibility` skill for audits

### Keyboard Navigation
All interactive elements must be keyboard accessible:
- Use native `<button>` and `<a>` elements
- Add `tabIndex` only when necessary
- Manage focus with `useRef()` or `autoFocus`

**Reference:** [Accessibility Guide](../../docs/accessibility/wcag-2.1-compliance.md)

## State Management

### Simple State
Use `useState()` for component-local state:
```typescript
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
```

### Complex State
Use context only when state is shared across multiple components:
```typescript
const { user, setUser } = useContext(UserContext);
```

### Avoid Prop Drilling
If passing props through 3+ levels, consider context or state management.

## External APIs & Async Operations

### In Server Components (Default)
Fetch directly in component:
```typescript
export default async function Page() {
  const data = await fetch("/api/data").then(r => r.json());
  return <div>{data}</div>;
}
```

### In Client Components
Use `useEffect()` with proper cleanup:
```typescript
import { useEffect, useState } from "react";

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/data")
      .then(r => r.json())
      .then(data => {
        if (isMounted) setData(data);
      });

    return () => { isMounted = false; };
  }, []);

  return <div>{data && <p>{data}</p>}</div>;
}
```

**Reference:** [API Patterns](../../docs/ai/best-practices.md)

## MDX Components

When building components used in MDX content:

```typescript
// ✅ CORRECT - Named export
export function Alert({ children, type = "info" }) {
  return (
    <div className={`alert alert-${type}`}>
      {children}
    </div>
  );
}

// In MDX:
<Alert type="warning">This is important</Alert>
```

**Reference:** [MDX Authoring](../../docs/ai/dcyfr-mdx-authoring.md)

## Performance Optimization

### Code Splitting
Lazy-load heavy components:
```typescript
const HeavyChart = lazy(() => import("./HeavyChart"));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Memoization
Use `memo()` for components that receive same props:
```typescript
export const PostCard = memo(function PostCard({ post }) {
  return <article>{post.title}</article>;
});
```

### Image Optimization
Always use Next.js `<Image>` component:
```typescript
import Image from "next/image";

// ✅ CORRECT
<Image src="/photo.jpg" alt="Description" width={400} height={300} />

// ❌ WRONG
<img src="/photo.jpg" alt="Description" />
```

## Validation Checklist

Before committing, verify:

- [ ] All spacing/colors use design tokens (SPACING, TYPOGRAPHY, SEMANTIC_COLORS)
- [ ] Imports use barrel exports (no relative file imports)
- [ ] Layout follows 90% PageLayout rule
- [ ] Tests exist for logic (≥99% pass rate)
- [ ] Component is responsive (mobile-first, tested)
- [ ] Accessibility met (semantic HTML, ARIA, keyboard nav, color contrast)
- [ ] TypeScript compiles (0 errors)
- [ ] ESLint passes (0 errors)

## Related Documentation

- [Component Patterns](../../docs/ai/component-patterns.md) - Full patterns guide
- [Design System](../../docs/ai/design-system.md) - Token reference
- [Testing Guide](../../docs/testing/README.md) - Test best practices
- [Templates](../../docs/templates/) - Copy-paste examples
- [Quick Reference](../../docs/ai/quick-reference.md) - Common imports
