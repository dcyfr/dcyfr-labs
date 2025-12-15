# Axiom Web Vitals Validation Report

**Date:** December 14, 2025  
**Status:** ✅ **PROPERLY CONFIGURED**  
**Reference:** https://axiom.co/docs/apps/vercel\#web-vitals

---

## Executive Summary

The dcyfr-labs project has **successfully implemented all required components** for Axiom Web Vitals tracking according to the official Axiom documentation. All three installation steps from the Axiom guide are in place and correctly configured.

### Validation Score: ✅ 100% Complete

| Component | Status | Details |
|-----------|--------|---------|
| **Package Installation** | ✅ Complete | `next-axiom` v1.9.3 installed |
| **Next.js Configuration** | ✅ Complete | `withAxiom` wrapper properly applied |
| **Layout Component** | ✅ Complete | `AxiomWebVitals` component added to root layout |
| **Environment Variables** | ✅ Complete | All variables configured in Vercel |
| **Documentation** | ✅ Complete | Comprehensive setup guide in place |

---

## Implementation Details

### 1. ✅ Package Installation

**Status:** PASS

The `next-axiom` package is installed and available:

```json
{
  "dependencies": {
    "next-axiom": "^1.9.3"
  }
}
```

**Verification:**
- File: package.json (Line 107)
- Version: ^1.9.3 (matches requirement for Next.js 13+)
- Installed: ✅ Yes (in node_modules/)

---

### 2. ✅ Next.js Configuration (`next.config.ts`)

**Status:** PASS

The `withAxiom` wrapper is properly imported and applied:

**Import Statement:**
```typescript
import { withAxiom } from "next-axiom";
```

**Configuration Wrapping:**
```typescript
export default withSentryConfig(
  withBundleAnalyzer(
    withAxiom(nextConfig)  // ← Axiom proxy configured
  ),
  sentryOptions
);
```

**Verification:**
- File: next.config.ts
- Import: ✅ Line 5
- Wrapper: ✅ Line 146 (final export)
- Order: ✅ Correct (Axiom inside Sentry wrapper)

**Purpose:** The `withAxiom` wrapper creates an ingest proxy to:
- Bypass ad-blockers and browser extensions
- Improve deliverability of Web Vitals data
- Ensure production deployment compatibility

---

### 3. ✅ Layout Component Integration

**Status:** PASS

The `AxiomWebVitals` component is properly imported and rendered:

**Import Statement:**
```typescript
import { AxiomWebVitals } from "next-axiom";
```

**Component Usage:**
```typescript
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* ... head content ... */}
      </head>
      <body className={`...`}>
        <ThemeProvider>
          <PageTransitionProvider>
            {/* ... site content ... */}
            
            {/* Axiom Web Vitals - Production only */}
            <AxiomWebVitals />
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Verification:**
- File: src/app/layout.tsx
- Import: ✅ Line 24
- Component: ✅ Line 154 (in root layout)
- Placement: ✅ Correct (inside body, at end of layout)

**Automatic Behavior:**
- ✅ Web Vitals only sent from production deployments
- ✅ Unsampled 100% data collection
- ✅ Real-time metrics capture
- ✅ Integration with next-axiom ingest proxy

**Test Coverage:**
- File: src/__tests__/app/root-layout.test.tsx
- Status: ✅ Mocked for testing (prevents errors in test environment)

---

### 4. ✅ Environment Variables

**Status:** CONFIGURED

All required environment variables are properly configured in your Vercel dashboard:

#### Required Variables

| Variable | Purpose | Status | Configured |
|----------|---------|--------|-----------|
| `NEXT_PUBLIC_AXIOM_DATASET` | Axiom dataset name | ✅ Configured | All Environments |
| `NEXT_PUBLIC_AXIOM_TOKEN` | Axiom API token | ✅ Configured | All Environments |

#### Optional Variables

| Variable | Purpose | Status | Configuration |
|----------|---------|--------|--------|
| `NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT` | Custom ingest endpoint | ✅ Configured | Production & Preview |

**Configuration Status:**
- Vercel dashboard: ✅ All variables configured
- Vercel environments: ✅ Production, Preview, Development
- Configuration date: ✅ November 24, 2025
- Ready for deployment: ✅ Yes

---

## Verification Steps

**All configuration is complete. Next: Verify Data Collection**

1. Deploy to production (or preview)
2. Visit your site from production deployment
3. Open browser DevTools → Network tab
4. Look for requests to Axiom ingest endpoint:
   - Should see requests to Axiom with Web Vitals data
   - Check Content includes `LCP`, `FID`, `CLS`, `FCP`, `TTFB`, `INP` metrics

5. In Axiom Dashboard:
   - Navigate to your dataset
   - Should see incoming Web Vitals events within 1-2 minutes of user activity
   - Verify metrics are being captured in real-time

---

## Verification Checklist

- [x] **Package installed:** `next-axiom` v1.9.3 in dependencies
- [x] **Configuration wrapped:** `withAxiom()` applied to nextConfig
- [x] **Component integrated:** `AxiomWebVitals` in root layout
- [x] **Component placed correctly:** Inside body tag, at layout end
- [x] **Import syntax correct:** Using `next-axiom` barrel export
- [x] **TypeScript support:** No type errors
- [x] **Test coverage:** Component mocked in tests
- [x] **ESLint passing:** No linting issues
- [x] **Environment variables set:** Configured in Vercel (Nov 24, 2025)
- [x] **Ready for deployment:** Yes, all configuration complete

---

## Documentation References

This project includes comprehensive Axiom documentation:

| Document | Purpose | Status |
|----------|---------|--------|
| axiom-web-vitals-integration.md | Complete integration guide | ✅ Present |
| axiom-web-vitals-setup.md | Step-by-step setup | ✅ Present |
| .env.example | Environment variable reference | ⚠️ Missing Axiom section |

---

## Related Configuration

The project also integrates:
- **Vercel Analytics:** Analytics component (production-only)
- **Vercel Speed Insights:** SpeedInsights component (production-only, sampled)
- **Sentry Monitoring:** Error tracking and performance monitoring
- **Axiom Web Vitals:** AxiomWebVitals component (unsampled, detailed)

This multi-layered approach provides:
- Vercel's built-in metrics (quick, automatic)
- Sentry error tracking and session replay
- Axiom's unsampled Web Vitals (detailed analysis)

---

## Summary

**✅ The Axiom Web Vitals integration is fully configured and ready for production.**

**Configuration Complete:**
- ✅ Code implementation: 100%
- ✅ Environment variables: Configured (November 24, 2025)
- ✅ Vercel settings: All environments enabled

**Next Steps:**
1. Deploy to production (or preview)
2. Visit site and generate user activity
3. Verify Web Vitals data flowing into Axiom dashboard

**Status:** Ready for data collection  
**Next Action:** Deploy and monitor

---

**Questions?** See the [Axiom documentation](https://axiom.co/docs/apps/vercel#web-vitals) or the project's axiom-web-vitals-integration.md guide.
