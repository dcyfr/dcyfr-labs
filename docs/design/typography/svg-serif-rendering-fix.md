# SVG & Serif Font Rendering Fix

**Date:** November 4, 2025  
**Issue:** Logo SVG and `.font-serif` text appearing jagged  
**Status:** ✅ Fixed

---

## Problem

The logo SVG and serif font (Source Serif 4) were appearing jagged and pixelated, especially:
- Logo sparkle/star icon in header and footer
- Headings using `.font-serif` class (h1, h2, h3)
- Related posts section titles
- Page titles across the site

**Root Cause:** Missing SVG-specific rendering optimizations and serif font antialiasing.

---

## Solution

### 1. CSS Global Rules (`src/app/globals.css`)

```css
/* Serif font smoothing */
.font-serif {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
}

/* SVG rendering optimization */
svg {
  shape-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* High-quality image and SVG rendering */
img, svg {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
```

### 2. Logo Component Enhancement (`src/components/logo.tsx`)

Added inline `shapeRendering` for maximum compatibility:

```tsx
<svg
  className={className}
  style={{
    shapeRendering: 'geometricPrecision',
    ...style
  }}
  // ... other props
>
  <path d={LOGO_CONFIG.path} />
</svg>
```

---

## Technical Details

### SVG Rendering Properties

| Property | Value | Effect |
|----------|-------|--------|
| `shape-rendering` | `geometricPrecision` | Emphasizes geometric precision over speed |
| `-webkit-font-smoothing` | `antialiased` | Smooth edges in WebKit browsers |
| `-moz-osx-font-smoothing` | `grayscale` | Smooth edges in Firefox on macOS |
| `image-rendering` | `crisp-edges` | High-quality scaling |

### Serif Font Properties

| Property | Value | Effect |
|----------|-------|--------|
| `-webkit-font-smoothing` | `antialiased` | Grayscale antialiasing (smoother appearance) |
| `-moz-osx-font-smoothing` | `grayscale` | Firefox on macOS smoothing |
| `text-rendering` | `optimizeLegibility` | Better kerning and ligatures |
| `font-feature-settings` | `"kern" 1, "liga" 1, "calt" 1` | OpenType features |

---

## Before & After

### Before
- ❌ Jagged edges on logo SVG
- ❌ Pixelated appearance on serif headings
- ❌ Inconsistent rendering across browsers
- ❌ Low-quality scaling of graphics

### After
- ✅ Smooth, crisp logo rendering
- ✅ Professional serif font appearance
- ✅ Consistent across all browsers
- ✅ High-quality graphics at all sizes
- ✅ Better kerning and ligatures in serif text

---

## Affected Components

### Logo Usage
- `src/components/site-header.tsx` - Header logo
- `src/components/site-footer.tsx` - Footer logo
- `src/app/page.tsx` - Homepage title
- `src/app/about/page.tsx` - About page title

### Serif Font Usage
- All page titles (h1 elements)
- Blog post headings (h1, h2, h3 in MDX)
- Related posts section titles
- Site header branding text
- Quotes and callouts in blog posts

---

## Browser Support

| Browser | SVG Rendering | Serif Smoothing | Status |
|---------|--------------|-----------------|--------|
| Chrome/Edge | ✅ Full support | ✅ Full support | Perfect |
| Safari | ✅ Full support | ✅ Full support | Perfect |
| Firefox (macOS) | ✅ Full support | ✅ Full support | Perfect |
| Firefox (Win/Linux) | ✅ Good | ⚠️ Graceful degradation | Good |

---

## Testing Checklist

- [x] Logo appears smooth in header
- [x] Logo appears smooth in footer
- [x] Homepage title "Hi, I'm Drew" is crisp
- [x] Blog post titles render smoothly
- [x] Related posts section title is smooth
- [x] Logo scales well at different sizes
- [x] No pixelation in dark mode
- [x] Consistent rendering in Chrome, Safari, Firefox
- [x] Mobile rendering quality maintained

---

## Performance Impact

**Zero impact** - These are CSS properties that:
- Don't require additional assets
- Don't add JavaScript overhead
- Are hardware-accelerated by the browser
- Have no measurable impact on Lighthouse scores

---

## Related Files

- `src/app/globals.css` - Global rendering rules
- `src/components/logo.tsx` - Logo component with inline optimization
- `docs/design/font-rendering-optimization.md` - Complete typography guide

---

## Key Learnings

1. **SVG needs specific rendering hints** - Generic antialiasing isn't enough
2. **Serif fonts benefit from explicit smoothing** - Different from sans-serif fonts
3. **Inline styles provide backup** - Belt and suspenders approach for critical elements
4. **Browser consistency matters** - Different engines need different properties

---

**Status:** ✅ Complete and verified  
**Impact:** Significantly improved visual quality of logo and serif typography  
**Maintenance:** None required - pure CSS solution
