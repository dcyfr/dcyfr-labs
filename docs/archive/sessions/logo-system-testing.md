# Logo System Testing Guide

## Quick Visual Tests

Run these tests after starting the dev server (`npm run dev`).

### 1. Component Usage Tests

#### Site Header
- **URL:** http://localhost:3000
- **Check:** Logo appears in header next to "Drew's Lab"
- **Expected:** 20×20px sparkle logo, inherits theme color
- **Action:** Toggle dark/light mode, verify color changes

#### Homepage Hero
- **URL:** http://localhost:3000
- **Check:** Logo appears inline with "Hi, I'm Drew"
- **Expected:** 28×28px sparkle logo next to heading
- **Action:** Toggle theme, verify it matches text color

### 2. Dynamic Icon Generation Tests

#### Favicon (Main)
- **URL:** http://localhost:3000/icon
- **Expected:** 
  - 512×512px PNG
  - Dark gradient background (#020617 → #111827)
  - Large white sparkle logo centered
- **Browser Test:** Check favicon in browser tab

#### Apple Touch Icon
- **URL:** http://localhost:3000/apple-icon
- **Expected:**
  - 180×180px PNG
  - Same dark gradient background
  - White sparkle logo centered
- **iOS Test:** Add to home screen, check icon

#### Open Graph Image
- **URL:** http://localhost:3000/opengraph-image
- **Expected:**
  - 1200×630px PNG
  - Dark gradient background
  - "Drew's Lab" as title (top)
  - Description text (middle)
  - Small logo (28×28) + "cyberdrew.dev" (bottom)
- **With Custom Content:** http://localhost:3000/opengraph-image?title=Test+Title&description=Test+Description

#### Twitter Card Image
- **URL:** http://localhost:3000/twitter-image
- **Expected:**
  - Identical to Open Graph image
  - 1200×630px PNG
  - Logo in footer alongside domain
- **With Custom Content:** http://localhost:3000/twitter-image?title=Test+Title&description=Test+Description

### 3. Social Media Preview Tests

Use these validators to test real-world social sharing:

#### Facebook/Meta
1. Go to https://developers.facebook.com/tools/debug/
2. Enter: `https://cyberdrew.dev`
3. Click "Scrape Again"
4. **Check:**
   - OG image shows with logo
   - Title and description correct
   - Image dimensions: 1200×630

#### Twitter/X
1. Go to https://cards-dev.twitter.com/validator
2. Enter: `https://cyberdrew.dev`
3. **Check:**
   - Card type: summary_large_image
   - Image displays with logo
   - Preview renders correctly

#### LinkedIn
1. Go to https://www.linkedin.com/post-inspector/
2. Enter: `https://cyberdrew.dev`
3. **Check:**
   - Image preview shows
   - Logo visible in footer
   - Correct metadata

### 4. Browser Compatibility Tests

#### Desktop Browsers
- [ ] Chrome/Edge - Favicon in tab
- [ ] Firefox - Favicon in tab
- [ ] Safari - Favicon in tab
- [ ] Check theme toggle affects logo color

#### Mobile Browsers
- [ ] iOS Safari - Add to home screen icon
- [ ] Android Chrome - Add to home screen icon
- [ ] Check touch icon displays correctly

### 5. Accessibility Tests

#### Screen Reader
- [ ] Logo has `role="img"`
- [ ] Logo has `aria-label="Drew's Logo"`
- [ ] Announces correctly

#### Keyboard Navigation
- [ ] Logo in header is keyboard accessible (part of link)
- [ ] Focus indicator shows on header link

#### Color Contrast
- [ ] Logo visible in light mode
- [ ] Logo visible in dark mode
- [ ] currentColor inheritance works

### 6. Performance Tests

#### Lighthouse
Run Lighthouse audit:
```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse
```

**Check:**
- [ ] Performance score unchanged
- [ ] Accessibility score 100
- [ ] Best Practices score high
- [ ] SEO includes proper meta tags

#### Network Tab
1. Open DevTools > Network
2. Reload page
3. **Check:**
   - [ ] `/icon` served as PNG
   - [ ] OG image served as PNG
   - [ ] Response headers include caching
   - [ ] Icons load quickly

### 7. Build & Deployment Tests

#### Local Build
```bash
npm run build
```

**Check Build Output:**
```
✓ Generating static pages
  ✓ /icon (edge)
  ✓ /apple-icon (edge) 
  ✓ /opengraph-image (edge)
  ✓ /twitter-image (edge)
```

#### Preview Deploy
1. Push to preview branch
2. Wait for Vercel deployment
3. Visit preview URL
4. **Test:**
   - [ ] Favicon appears
   - [ ] OG image validates on Facebook
   - [ ] Twitter card validates
   - [ ] Icons load from edge

### 8. Regression Tests

#### Previous Functionality
- [ ] Site header still renders correctly
- [ ] Homepage hero still looks good
- [ ] Theme toggle still works
- [ ] No console errors
- [ ] No 404s in Network tab

#### Static File Cleanup
After confirming everything works:
- [ ] Delete `/public/icons/icon-light.png`
- [ ] Delete `/public/icons/icon-dark.png`
- [ ] Verify site still works without them

## Automated Testing Commands

### Quick Check Script
```bash
# Start dev server
npm run dev

# In another terminal, test routes
curl -I http://localhost:3000/icon
curl -I http://localhost:3000/apple-icon
curl -I http://localhost:3000/opengraph-image
curl -I http://localhost:3000/twitter-image

# Should all return: HTTP/1.1 200 OK
```

### TypeScript Check
```bash
npm run type-check
# Should have no errors in icon/image routes
```

### Lint Check
```bash
npm run lint
# Should pass all rules
```

## Expected Results Summary

| Asset | Format | Size | Background | Logo Size | Location |
|-------|--------|------|------------|-----------|----------|
| Site Header | SVG | 20×20 | Transparent | 20×20 | Inline |
| Homepage Hero | SVG | 28×28 | Transparent | 28×28 | Inline |
| Favicon | PNG | 512×512 | Dark gradient | 360×360 | `/icon` |
| Apple Icon | PNG | 180×180 | Dark gradient | 120×120 | `/apple-icon` |
| OG Image | PNG | 1200×630 | Dark gradient + text | 28×28 | `/opengraph-image` |
| Twitter Image | PNG | 1200×630 | Dark gradient + text | 28×28 | `/twitter-image` |

## Troubleshooting

### Issue: Favicon not showing
**Solution:**
1. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
2. Clear browser cache
3. Check Network tab for 404s
4. Verify `/icon` returns 200

### Issue: OG image not updating on social media
**Solution:**
1. Use "Scrape Again" in Facebook debugger
2. Wait 24 hours for cache to expire
3. Add query param to force new version: `?v=2`

### Issue: Logo wrong color
**Solution:**
1. Check parent element has text color set
2. Verify Logo uses `fill="currentColor"`
3. Check theme provider is wrapping layout
4. Inspect with DevTools to see computed color

### Issue: Icon route returns 500
**Solution:**
1. Check TypeScript errors in route file
2. Verify logoPath string is correct
3. Check Edge Runtime compatibility
4. Review server logs for specific error

## Success Criteria

✅ All icon routes return 200 OK  
✅ Favicon visible in browser tabs  
✅ Social previews show logo correctly  
✅ Logo color adapts to theme  
✅ No console errors or 404s  
✅ Build completes without errors  
✅ Lighthouse scores unchanged or improved  
✅ Validators (Facebook/Twitter) show correct previews  

## Sign-off

After completing all tests, update this checklist and mark the refactoring as verified.

**Tested by:** _________________  
**Date:** _________________  
**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _________________
