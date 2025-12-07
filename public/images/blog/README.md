# Default Blog Images

This directory contains the fallback featured image for blog posts without custom images.

## Files

- **`hero.svg`** - Gradient variant (blue → violet gradient, generic branding)

## Usage

This image is automatically used by the `getDefaultBlogImage()` function in `/src/lib/default-images.ts` for any blog post without a custom featured image.

## Customization

Replace this SVG file with your own design while maintaining:

- **Dimensions:** 1200x630px (OG image standard)
- **Format:** SVG (preferred) or WebP/PNG
- **File name:** Keep as `hero.svg` or update references in `default-images.ts`

## Dynamic Generation

For posts that need title overlay, use the API endpoint:

```
/api/default-blog-image?title=Post+Title&style=gradient
```

See `/src/app/api/default-blog-image/route.tsx` for implementation.

## Design Guidelines

When creating a custom default:

- Use brand colors consistently
- Ensure text is readable at thumbnail size (200x150px)
- Include subtle patterns for visual interest
- Maintain aspect ratio (16:9 or 1.9:1)
- Test in both light and dark themes
- Keep file size under 100KB for performance
