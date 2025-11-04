# Default Blog Images

This directory contains fallback featured images for blog posts without custom images.

## Files

- **`hero.svg`** - Gradient variant (blue → violet gradient, generic branding)
- **`minimal.svg`** - Minimal dark variant (code icon, tech-focused)
- **`geometric.svg`** - Geometric variant (grid pattern, design-focused)

## Usage

These images are automatically selected by the `ensurePostImage()` function in `/src/lib/default-images.ts` based on:

1. Post tags (tech/code → minimal, design → geometric, other → gradient)
2. Post title hash (deterministic selection)
3. Explicit variant specification

## Customization

Replace these SVG files with your own designs while maintaining:
- **Dimensions:** 1200x630px (OG image standard)
- **Format:** SVG (preferred) or WebP/PNG
- **File names:** Keep existing names or update references in `default-images.ts`

## Dynamic Generation

For posts that need title overlay, use the API endpoint:
```
/api/default-blog-image?title=Post+Title&style=gradient
```

See `/src/app/api/default-blog-image/route.tsx` for implementation.

## Design Guidelines

When creating custom defaults:
- Use brand colors consistently
- Ensure text is readable at thumbnail size (200x150px)
- Include subtle patterns for visual interest
- Maintain aspect ratio (16:9 or 1.9:1)
- Test in both light and dark themes
- Keep file size under 100KB for performance
