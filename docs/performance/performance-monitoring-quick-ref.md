# Performance Monitoring Quick Reference

**Last Updated:** November 19, 2025

## 🎯 Quick Commands

```bash
# Check bundle sizes against budgets
npm run perf:check

# Interactive bundle analysis
npm run perf:analyze

# Full performance check (includes Lighthouse)
npm run lighthouse:ci

# Type check all new code
npm run typecheck
```

## 📊 Performance Budgets

### Core Web Vitals

| Metric | Target | Warning | Error | Description |
|--------|--------|---------|-------|-------------|
| LCP | < 2.5s | < 3.0s | < 4.0s | Largest Contentful Paint |
| INP | < 200ms | < 300ms | < 500ms | Interaction to Next Paint |
| CLS | < 0.1 | < 0.15 | < 0.25 | Cumulative Layout Shift |
| FCP | < 1.8s | < 2.4s | < 3.0s | First Contentful Paint |
| TTFB | < 800ms | < 1.2s | < 1.8s | Time to First Byte |

### Bundle Sizes

| Type | Target | Warning | Error |
|------|--------|---------|-------|
| First Load JS | 150 kB | 200 kB | 250 kB |
| Main Bundle | 100 kB | 130 kB | 170 kB |
| Page Bundle | 50 kB | 70 kB | 100 kB |

## 🔍 Where to Find Data

### Vercel Dashboard

1. Navigate to project → **Speed Insights**
2. View Core Web Vitals for all pages
3. Check geographic distribution
4. Review device/browser breakdown

### Lighthouse CI

1. GitHub → Pull Requests → **Checks tab**
2. Lighthouse CI workflow → **Details**
3. View performance scores and recommendations

### Local Development

```bash
# Terminal output during build
npm run build

# Look for "First Load JS" column
# Compare against budgets in performance-budgets.json
```

## 🚨 Alert Thresholds

**Immediate Action Required:**

- ❌ LCP > 4.0s
- ❌ INP > 500ms
- ❌ CLS > 0.25
- ❌ First Load JS > 250 kB
- ❌ Lighthouse Performance < 90

**Review Soon:**

- ⚠️ Any metric in "warning" range
- ⚠️ Trend showing consistent degradation over 2 weeks

## 📝 Weekly Review Checklist

**Every Monday, 10:30 AM PST**

- [ ] Open Vercel Speed Insights dashboard
- [ ] Check Core Web Vitals trends (7-day view)
- [ ] Run `npm run perf:check` locally
- [ ] Review recent Lighthouse CI results
- [ ] Log findings in `docs/operations/performance-review-log.md`
- [ ] Create GitHub issues for problems
- [ ] Update team on any concerns

## 🛠️ Quick Fixes

### LCP > 4.0s

```bash
# 1. Check largest image
# 2. Optimize with Next.js Image component
# 3. Add priority prop to hero images

import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preload critical image
/>
```

### High CLS

```jsx
// Always specify dimensions for images
<Image src="/img.jpg" width={800} height={600} alt="Content" />

// Reserve space for dynamic content
<div className="min-h-[200px]">{dynamicContent}</div>

// Use font-display: swap (already configured)
```

### Large Bundle Size

```bash
# 1. Run bundle analyzer
npm run perf:analyze

# 2. Identify large dependencies
# 3. Consider alternatives or lazy loading

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />
});
```

## 📚 Documentation

- **Full Guide:** `docs/performance/performance-monitoring.md`
- **Review Log:** `docs/operations/performance-review-log.md`
- **Budgets Config:** `performance-budgets.json`
- **Lighthouse CI:** `docs/performance/lighthouse-ci.md`

## 🔗 Useful Links

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Need Help?** Check the troubleshooting section in `docs/performance/performance-monitoring.md`
