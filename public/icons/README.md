# Icons Directory

## Current Icon Generation

All site icons are now **dynamically generated** using Next.js metadata routes with the site's Logo component SVG. Icons automatically adapt to the user's system theme preference.

The following routes handle all icon generation:

- **`/src/app/icon.tsx`** - Main favicon, light mode (512×512, dark logo on light background)
- **`/src/app/icon-dark.tsx`** - Main favicon, dark mode (512×512, light logo on dark background)
- **`/src/app/apple-icon.tsx`** - Apple touch icon, light mode (180×180, dark logo on light background)
- **`/src/app/apple-icon-dark.tsx`** - Apple touch icon, dark mode (180×180, light logo on dark background)
- **`/src/app/opengraph-image.tsx`** - Open Graph social preview (1200×630)
- **`/src/app/twitter-image.tsx`** - Twitter card preview (1200×630)

## Icon Design

All icons feature:
- **Transparent background** with rounded circular gradient
- **Automatic theme switching** based on `prefers-color-scheme`
- **Light mode:** Light gray gradient background (`#f9fafb` → `#e5e7eb`) with dark sparkle logo (`#020617`)
- **Dark mode:** Dark gradient background (`#020617` → `#111827`) with light sparkle logo (`#f9fafb`)

## Benefits of Dynamic Icons

✅ **Single source of truth** - Logo SVG defined once in `/src/components/logo.tsx`  
✅ **Automatic theme support** - Icons adapt to system light/dark mode preference  
✅ **Transparent backgrounds** - Icons blend seamlessly with any UI  
✅ **Rounded design** - Modern circular icons with gradient fills  
✅ **Consistent branding** - All icons use the same sparkle/star logo  
✅ **Edge-optimized** - Generated on-demand with Edge Runtime  
✅ **No build artifacts** - Icons are generated at runtime, no static files needed

## Migration Complete

This directory previously contained static PNG icon files (`icon-light.png`, `icon-dark.png`).

✅ **Migration completed:** October 23, 2025  
✅ **Static files removed:** All PNG files deleted  
✅ **Dynamic generation active:** All icons now served via metadata routes
