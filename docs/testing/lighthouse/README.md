# Lighthouse Performance Reports

This directory contains automated Lighthouse performance test reports for dcyfr-labs.

## Latest Report Summary

| Metric         | Current | Target | Status  |
| -------------- | ------- | ------ | ------- |
| Performance    | 98      | >90    | ✅ PASS |
| Accessibility  | 100     | >95    | ✅ PASS |
| Best Practices | 95      | >90    | ✅ PASS |
| SEO            | 100     | >90    | ✅ PASS |

**Overall Score: 98/100**

## Automated Testing

Lighthouse tests run automatically on:

- Every commit to `main` branch
- Pull request reviews
- Daily performance monitoring

### Recent Reports

- **2026-02-22**: Overall 98 - [Deploy 4934caf8](https://github.com/dcyfr/dcyfr-labs/commit/4934caf8)
- **2026-02-21**: Overall 96 - Performance optimization updates
- **2026-02-20**: Overall 94 - Bundle size improvements

## Manual Testing

To run Lighthouse locally:

```bash
# Production build required for accurate results
npm run build
npm start

# Run Lighthouse CLI (separate terminal)
lighthouse http://localhost:3000 --output html --output-path ./docs/testing/lighthouse/report-$(date +%Y%m%d).html

# Or use Chrome DevTools
# Open http://localhost:3000 → DevTools → Lighthouse → Generate report
```

## Performance Optimization

### Key Metrics Monitored

- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms

### Optimization Strategies

1. **Image Optimization**: Next.js Image component with automatic WebP
2. **Code Splitting**: Dynamic imports for non-critical components
3. **Bundle Analysis**: Regular bundle size monitoring
4. **CDN**: Static assets served via Vercel Edge Network
5. **Preloading**: Critical resources preloaded in document head

## CI/CD Integration

Performance tests integrated with GitHub Actions:

- `.github/workflows/lighthouse-ci.yml`
- Fails CI if performance drops below thresholds
- Automatically posts results to PR comments

## Troubleshooting

### Low Performance Scores

```bash
# Check bundle size
npm run analyze

# Profile in development
npm run dev
# → Chrome DevTools → Performance tab
```

### CI Failures

- Ensure production build: `npm run build && npm start`
- Check network throttling in CI environment
- Review bundle size changes in recent commits

---

**Maintained by:** DCYFR Labs Performance Team  
**Last Updated:** February 22, 2026
