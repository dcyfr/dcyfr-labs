# INP (Interaction to Next Paint) Optimization

## Issue
Event handlers on `a.hover:underline.underline-offset-4` elements were blocking UI updates for 664ms, causing poor INP scores.

## Root Causes
1. **Next.js Link prefetching on hover** - Default behavior prefetches pages on hover, which can block the main thread
2. **Synchronous theme changes** - Theme toggle was causing blocking re-renders
3. **No rendering optimizations** - Links lacked CSS hints for browser optimization
4. **Form submissions blocking UI** - Contact form submissions were synchronous

## Optimizations Applied

### 1. Disabled Hover Prefetching on Links
**File:** `src/components/site-header.tsx`
- Added `prefetch={false}` to all `<Link>` components
- Links will still prefetch when they enter the viewport (better UX)
- Prevents expensive prefetch operations during hover interactions

### 2. Added CSS Performance Hints
**File:** `src/components/site-header.tsx`, `src/components/site-footer.tsx`
- Added `will-change-auto` class to navigation links
- Signals to browser that these elements may change, enabling optimizations

**File:** `src/app/globals.css`
- Added `text-decoration-skip-ink: auto` for better text rendering
- Added `contain: layout style` for layout containment (prevents reflows)
- Added `transform: translateZ(0)` for hardware acceleration
- Added smooth transitions for hover states with media query check

### 3. Non-blocking Theme Toggle
**File:** `src/components/theme-toggle.tsx`
- Wrapped theme changes in `useTransition` hook
- Theme changes now happen in a non-blocking transition
- Button is disabled during transition to prevent rapid clicks
- Prevents blocking the main thread during theme application

### 4. Non-blocking Form Submissions
**File:** `src/app/contact/page.tsx`
- Wrapped state updates in `useTransition`
- Form submission feedback happens without blocking UI updates

## Expected Results
- **INP score improvement:** From 664ms+ to <200ms (Good)
- **Smoother interactions:** Navigation and theme toggle feel instant
- **Better perceived performance:** Users can continue interacting while JS runs
- **No layout shifts:** CSS containment prevents unexpected reflows

## Testing
To verify improvements:
1. Run dev server: `npm run dev`
2. Open Chrome DevTools > Performance Insights
3. Hover over navigation links and click theme toggle
4. Check INP measurements in the Performance panel
5. Target: INP < 200ms (Good), ideally < 100ms (Great)

## Browser Compatibility
All optimizations use modern web standards:
- `useTransition`: React 18+ (already in use)
- `prefetch={false}`: Next.js standard prop
- CSS `contain`: Supported in all modern browsers
- `transform: translateZ(0)`: Wide support

## Additional Recommendations
1. **Monitor Core Web Vitals** in production via Vercel Analytics
2. **Consider code splitting** if more client-side JS is added
3. **Use dynamic imports** for heavy components
4. **Add Suspense boundaries** for async components
5. **Debounce rapid interactions** if needed in future features
