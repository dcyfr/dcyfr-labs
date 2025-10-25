# Print Stylesheet Quick Reference

Quick guide for testing and using the print styles.

## Testing Print Styles

### Method 1: Print Preview
```
Cmd+P (Mac) or Ctrl+P (Windows/Linux)
```

### Method 2: Chrome DevTools
1. Open DevTools (F12)
2. Click ⋮ menu → More tools → Rendering
3. Find "Emulate CSS media type"
4. Select "print"

### Method 3: Test Script
```bash
npm run test:print
```

## What's Hidden in Print

- Site header and footer
- Navigation menus
- Theme toggle buttons
- Table of contents
- Reading progress indicator
- Share buttons
- Comment sections (Giscus)
- Videos and iframes

## What's Enhanced for Print

✅ **Typography**: Serif fonts, optimized sizes  
✅ **Page Layout**: Letter size with proper margins  
✅ **Code Blocks**: Smaller font, word wrap enabled  
✅ **Links**: External URLs shown in parentheses  
✅ **Page Breaks**: Smart breaks for headings, code, images  
✅ **Badges**: Print-friendly styling  
✅ **Metadata**: Dates, reading time, view count  

## File Locations

- Styles: `src/app/print.css`
- Docs: `/docs/design/print-stylesheet.md`
- Test: `scripts/test-print.mjs`

## Quick Customizations

### Change page margins:
```css
@page {
  margin: 2cm 2.5cm; /* Adjust as needed */
}
```

### Hide external link URLs:
```css
/* Comment out or remove this rule */
a[href^="http"]:after {
  content: " (" attr(href) ")";
}
```

### Adjust base font size:
```css
body {
  font-size: 11pt; /* Change value */
}
```

## Browser Print Settings

Recommended settings for best results:

- **Layout**: Portrait
- **Paper**: Letter (8.5" x 11")
- **Margins**: Default (CSS handles it)
- **Headers/Footers**: Off
- **Background graphics**: Off

---

See `/docs/design/print-stylesheet.md` for full documentation.
