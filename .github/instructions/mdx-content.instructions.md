---
applyTo: "src/content/**/*.mdx"
---

# MDX Content Standards for dcyfr-labs

When creating or editing MDX content (blog posts and articles), follow these patterns for consistency, readability, and engagement.

## File Naming & Location

### Naming Convention
```
✅ CORRECT:
- src/content/blog/understanding-react-hooks.mdx
- src/content/articles/design-system-deep-dive.mdx

❌ WRONG:
- src/content/my-post.mdx (missing subdirectory)
- src/content/blog/ReactHooks.mdx (wrong case)
- src/content/UNDERSTANDING_REACT_HOOKS.mdx (wrong case/no extension)
```

### Frontmatter Metadata (REQUIRED)
```yaml
---
title: "Understanding React Hooks"
description: "A comprehensive guide to React Hooks and how to use them effectively"
date: 2026-01-24
published: true
author: "Your Name"
readingTime: 8
tags:
  - React
  - JavaScript
  - Hooks
---
```

## Content Structure

### Heading Hierarchy
Use proper heading hierarchy (h1 → h2 → h3):

```markdown
# Main Title (h1)
Introductory paragraph here.

## Section 1 (h2)
Content for section 1.

### Subsection 1.1 (h3)
Detailed content.

## Section 2 (h2)
Content for section 2.

### Subsection 2.1 (h3)
More detailed content.
```

### Opening Paragraph
Start with compelling hook that captures reader interest:

```markdown
# Why React Hooks Changed Everything

Before React Hooks arrived in 2019, managing state in functional components was impossible.
Developers had to reach for class components with all their complexity.
Then Hooks changed everything...
```

## Custom Components

### KeyTakeaway Component
Highlight key learnings:

```jsx
import { KeyTakeaway } from "@/components/mdx";

<KeyTakeaway>
  **React Hooks** let you use state and side effects in functional components,
  eliminating the need for class components in most cases.
</KeyTakeaway>
```

**When to use:**
- Summarize a complex concept
- Highlight what readers should remember
- End of major sections

### Alert Component
Highlight important warnings, tips, or notes:

```jsx
import { Alert } from "@/components/mdx";

<Alert type="info">
  💡 **Pro Tip:** Always place `useState()` at the top level of your component,
  not inside conditionals or loops.
</Alert>

<Alert type="warning">
  ⚠️ **Important:** Hooks must be called consistently in the same order.
  Never call them conditionally.
</Alert>

<Alert type="error">
  ❌ **Common Mistake:** Forgetting to add dependencies to `useEffect()`
  can cause infinite loops.
</Alert>
```

**Type options:** `"info"`, `"warning"`, `"error"`, `"success"`

### SectionShare Component
Enable social sharing and backlinks for specific sections:

```jsx
import { SectionShare } from "@/components/mdx";

<SectionShare>
  ## Building Custom Hooks

  Custom Hooks let you extract component logic into reusable functions...

  [Full section content here]
</SectionShare>
```

**Best practices:**
- Place after major sections
- Enables readers to share specific insights
- Improves SEO with trackable URLs
- Creates backlink opportunities

### CollapsibleSection Component
Hide optional/advanced content behind expandable sections:

```jsx
import { CollapsibleSection } from "@/components/mdx";

<CollapsibleSection title="Advanced: Understanding Closure">
  This section dives into how closures work in React Hooks...

  [Technical content here]
</CollapsibleSection>
```

**Use for:**
- Advanced topics (keep beginner content clean)
- Role-specific content (frontend vs backend)
- Optional deep dives
- Code snippets for reference

### GlossaryTooltip Component
Define terms with hover tooltips:

```jsx
import { GlossaryTooltip } from "@/components/mdx";

<GlossaryTooltip term="closure">
  A function that has access to variables from its outer scope
  even after the outer function has returned.
</GlossaryTooltip>
```

**When to use:**
- Technical terms
- First mention of important concepts
- Helps both experts and beginners

## Code Formatting

### Inline Code
Use backticks for single terms:

```markdown
Use the `useState()` hook to manage state.
```

### Code Blocks with Syntax Highlighting
```typescript
// ✅ CORRECT - React component with hooks
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Code Block Headers
Use language identifier and optional title:

````markdown
```typescript title="src/hooks/useCounter.ts"
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  return { count, increment: () => setCount(count + 1) };
}
```
````

### Diff Highlighting
Show before/after changes:

````markdown
```typescript diff
- const [count, setCount] = useState(0);
- setCount(count + 1);

+ const [count, setCount] = useState(0);
+ const increment = () => setCount(c => c + 1);
```
````

## Writing Best Practices

### Clarity First
- Use clear, concise language
- Explain "why" before "how"
- Avoid unnecessary jargon
- Define technical terms on first use

### Actionable Content
- Include practical examples
- Provide copy-paste ready code
- Link to related resources
- Include "next steps" at end

### Accessibility
- Use semantic HTML
- Include alt text for images
- Use descriptive link text (not "click here")
- Maintain proper heading hierarchy
- Use lists for multiple items

### Length & Pacing
- Aim for 800-2000 words
- Break into short paragraphs (2-3 sentences)
- Use subheadings every 200-300 words
- Include code examples every 200-300 words

## Internal Links

### Link Format
```markdown
[link text](../related-article.mdx)
[Decision Trees](/dev/docs/decision-trees)
[API Patterns](/docs/ai/best-practices.md)
```

### Cross-Content Links
Link to:
- ✅ Related blog posts
- ✅ Documentation guides
- ✅ Decision trees
- ✅ Templates
- ✅ Other articles

## SEO Optimization

### Meta Tags
```yaml
---
title: "Understanding React Hooks: A Complete Guide"
description: "Learn how to use React Hooks effectively. Complete guide with examples and best practices."
tags:
  - React
  - Hooks
  - JavaScript
  - "state-management"
---
```

### Title Guidelines
- Include target keyword naturally
- Keep 50-60 characters
- Lead with main topic
- Make it compelling

### Description Guidelines
- 150-160 characters
- Include main keyword
- Describe what reader will learn
- Include call to action

### Heading Optimization
- H1: Main topic (one per page)
- H2: Major sections (include keywords)
- Include related keywords in headings

## Engagement Best Practices

### Open with Hook
```markdown
# Why Most React Developers Get Hooks Wrong

Hooks are powerful, but many developers misunderstand them.
This leads to bugs and performance problems. Here's what you need to know...
```

### Interactive Elements
```jsx
<SectionShare>
  ## Key Concept: Closure in Hooks
  [Important content readers want to share]
</SectionShare>

<CollapsibleSection title="Try It Yourself">
  [Code sandbox or interactive example]
</CollapsibleSection>
```

### Clear Takeaways
```jsx
<KeyTakeaway>
  **Three things to remember:**
  1. Hooks must be at top level
  2. Always include dependencies
  3. Extract into custom hooks for reusability
</KeyTakeaway>
```

### Call to Action
```markdown
## Next Steps

Ready to master React Hooks? Check out:
- [Building Custom Hooks](/articles/custom-hooks.mdx)
- [Hooks Best Practices](/articles/hooks-patterns.mdx)
- [Testing Hooks](/articles/testing-hooks.mdx)
```

## Images & Media

### Image Sizing
```markdown
![React Hooks Flow Diagram](/images/articles/hooks-flow.png)
```

### Optimization
- Use `.webp` format when possible
- Compress to <100KB
- Use descriptive alt text
- Include dimensions

## Validation Checklist

Before publishing content:

- [ ] Frontmatter complete (title, description, date, tags)
- [ ] Main heading (h1) present and compelling
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] No hardcoded emojis (use `<Alert>` component instead)
- [ ] Includes at least one `<KeyTakeaway>`
- [ ] Includes at least one code example
- [ ] Internal links included (related content)
- [ ] Alt text on all images
- [ ] Title 50-60 characters
- [ ] Description 150-160 characters
- [ ] Reading time accurate
- [ ] Spelling & grammar checked
- [ ] No markdown syntax errors

## Related Documentation

- [MDX Authoring Guide](../../docs/ai/dcyfr-mdx-authoring.md) - Complete MDX patterns
- [Component Library](../../docs/content/rivet-component-library.md) - All MDX components
- [Blog Guidelines](../../docs/blog/content-creation.md) - Blog-specific guidance
- [SEO Checklist](../../docs/optimization/seo-checklist.md) - SEO best practices
- [Templates](../../docs/templates/MDX_TEMPLATE.md) - Copy-paste template
