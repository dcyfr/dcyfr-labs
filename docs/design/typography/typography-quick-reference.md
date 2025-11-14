# Typography Quick Reference

Quick patterns and usage guide for the typography system.

## Font Classes

```tsx
// Sans-serif (body text)
<p className="font-sans">Body text</p>

// Serif (headings, emphasis)
<h1 className="font-serif">Heading</h1>

// Monospace (code)
<code className="font-mono">code</code>
```

## Common Patterns

### Page Titles
```tsx
<h1 className="font-serif text-3xl md:text-4xl font-bold">
  Page Title
</h1>
```

### Section Headings
```tsx
<h2 className="font-serif text-xl md:text-2xl font-semibold">
  Section Title
</h2>
```

### Subsection Headings
```tsx
<h3 className="font-serif text-lg md:text-xl font-medium">
  Subsection Title
</h3>
```

### Body Text
```tsx
// No class needed - Geist Sans is default
<p className="text-base leading-7">
  Regular paragraph text
</p>
```

### Blockquotes
```tsx
<blockquote className="font-serif border-l-4 border-primary/30 pl-6 my-6 text-muted-foreground">
  Quoted text
</blockquote>
```

### Inline Code
```tsx
<code className="font-mono rounded-md bg-muted px-1.5 py-0.5 text-sm">
  inline code
</code>
```

### Code Blocks
```tsx
<pre className="font-mono">
  <code>{codeContent}</code>
</pre>
```

## MDX Content

Headings and blockquotes in MDX automatically use serif fonts. No additional classes needed.

```mdx
# This uses Source Serif 4
## So does this
### And this

> Blockquotes use Source Serif 4 italic

Regular text uses Geist Sans.

`inline code` uses Geist Mono.
```

## Font Variables

For custom CSS or advanced usage:

```css
/* Sans-serif */
font-family: var(--font-geist-sans);

/* Serif */
font-family: var(--font-serif);

/* Monospace */
font-family: var(--font-geist-mono);
```

## When to Use Each Font

### Geist Sans (Primary)
- ✅ Body paragraphs
- ✅ UI elements (buttons, inputs)
- ✅ Navigation links
- ✅ Lists
- ✅ Form labels
- ✅ Metadata (dates, tags)

### Source Serif 4 (Accent)
- ✅ Page titles (H1)
- ✅ Section headings (H2, H3)
- ✅ Blog post titles
- ✅ Blockquotes
- ✅ Pull quotes
- ❌ Body text (too ornate)
- ❌ UI elements (not suitable)

### Geist Mono (Code)
- ✅ Code blocks
- ✅ Inline code
- ✅ Terminal output
- ✅ File paths
- ✅ URLs in documentation
- ❌ Regular text
- ❌ Headings

## Responsive Typography

```tsx
// Mobile: text-xl, Desktop: text-2xl
<h2 className="font-serif text-xl md:text-2xl font-semibold">
  Responsive Heading
</h2>

// Mobile: text-3xl, Desktop: text-4xl
<h1 className="font-serif text-3xl md:text-4xl font-bold">
  Responsive Title
</h1>
```

## Font Weights

Available weights for each font:

**Geist Sans:**
- 400 (Regular) - Default for body text
- 500 (Medium) - Available but not commonly used
- 600 (Semibold) - Subheadings, emphasis
- 700 (Bold) - Strong emphasis

**Source Serif 4:**
- Variable font: 200-900 (full range)
- 400 (Regular) - Blockquotes, lighter headings
- 600 (Semibold) - Section headings
- 700 (Bold) - Page titles, strong headings
- 800+ (Extra Bold) - Available for special emphasis

**Geist Mono:**
- 400 (Regular) - All code content

## Examples

### Homepage Hero
```tsx
<section className="text-center space-y-4">
  <h1 className="font-serif text-4xl md:text-5xl font-bold">
    Welcome to My Portfolio
  </h1>
  <p className="font-sans text-lg md:text-xl text-muted-foreground">
    Building modern web experiences
  </p>
</section>
```

### Blog Post Header
```tsx
<article>
  <h1 className="font-serif text-3xl md:text-4xl font-semibold">
    Understanding React Server Components
  </h1>
  <div className="font-sans text-sm text-muted-foreground">
    Published on January 15, 2025
  </div>
</article>
```

### Code Example Section
```tsx
<div className="space-y-4">
  <h3 className="font-serif text-xl font-medium">
    Installation
  </h3>
  <p className="font-sans leading-7">
    Install the package using npm:
  </p>
  <pre className="font-mono">
    <code>npm install package-name</code>
  </pre>
</div>
```

### Feature Card
```tsx
<div className="space-y-2">
  <h3 className="font-serif text-lg font-semibold">
    Fast Performance
  </h3>
  <p className="font-sans text-sm text-muted-foreground">
    Optimized for speed and efficiency
  </p>
</div>
```

## Troubleshooting

### Font Not Loading
Check that the font variable is applied to the body:
```tsx
<body className={`${geistSans.variable} ${geistMono.variable} ${crimsonPro.variable}`}>
```

### Wrong Font Showing
Verify the class is correct:
- `font-sans` → Geist Sans
- `font-serif` → Crimson Pro
- `font-mono` → Geist Mono

### Font Flashing (FOIT)
All fonts use `display: "swap"` - this is expected behavior. The page shows system fonts first, then swaps to custom fonts when loaded.

## Related Documentation

- **Complete Guide:** `/docs/design/typography.md`
- **Implementation:** `/docs/operations/typography-implementation.md`
- **Summary:** `/docs/design/typography-implementation-summary.md`

---

**Quick Access:** Bookmark this file for daily reference when building components or pages.
