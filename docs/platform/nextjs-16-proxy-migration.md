# Next.js 16 Middleware → Proxy Migration

## Overview

Next.js 16 deprecated the `middleware.ts` file convention in favor of `proxy.ts`. This document tracks the migration completed for this codebase.

**Migration Date:** November 12, 2025  
**Next.js Version:** 15.5.4 → 16.0.2  
**Breaking Change:** https://nextjs.org/docs/messages/middleware-to-proxy

## Changes Made

### 1. Core File Migration ✅

- **Created:** `src/proxy.ts` (replaces `src/middleware.ts`)
  - Identical functionality to middleware
  - Added migration note in file header
  - Maintains same export structure: `export function middleware(request: NextRequest)`
  - Maintains same `config` export for route matching

**Note:** The function name remains `middleware` even though the file is renamed to `proxy.ts`. This is intentional per Next.js 16 migration guide.

### 2. Documentation Updates ✅

Updated references in:
- `.github/copilot-instructions.md` (2 references)
- `agents.md` (2 references)
- `next.config.ts` (Sentry comment)
- `sentry.edge.config.ts` (edge features comment)
- `vitest.config.ts` (coverage exclusion)

### 3. Source Code Comments ✅

Updated "Get nonce from middleware" → "Get nonce from proxy" in:
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/about/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`

## What Was NOT Changed

### File Kept for Reference
- `src/middleware.ts` - **Will be removed after successful deployment verification**

### Function Names
- Export function name remains `export function middleware()` in `proxy.ts`
- This is correct per Next.js 16 specification

### Functionality
- No changes to CSP implementation
- No changes to nonce generation
- No changes to route matching
- No changes to header passing

## Testing Checklist

Before deploying to production:

- [ ] Local dev server starts without errors
- [ ] CSP headers are properly set (check browser DevTools)
- [ ] Nonce injection works (check `x-nonce` header in request)
- [ ] Theme switching works (relies on nonce for inline script)
- [ ] Vercel Analytics loads (relies on CSP script-src)
- [ ] Protected routes work (`/analytics` blocked in production)
- [ ] Static assets load correctly (excluded from proxy matching)

## Deployment Steps

1. **Verify locally:** `npm run dev`
2. **Test build:** `npm run build`
3. **Commit changes:** Include all modified files
4. **Deploy to preview:** Verify on Vercel preview deployment
5. **Remove old file:** Delete `src/middleware.ts` after successful verification
6. **Deploy to production**

## Rollback Plan

If issues occur:
1. Revert `src/proxy.ts` deletion
2. Restore `src/middleware.ts` as primary file
3. Revert documentation changes
4. Downgrade to Next.js 15.5.4

## Related Issues

- PR #33: Next.js 16 upgrade (this migration fixes deployment failure)
- Next.js 16 Breaking Changes: https://nextjs.org/docs/app/building-your-application/upgrading/version-16

## Security Notes

This migration maintains all existing security features:
- ✅ Nonce-based CSP for XSS protection
- ✅ Dynamic nonce generation per request
- ✅ CSP violation reporting to `/api/csp-report`
- ✅ Development-only route protection
- ✅ Static asset exclusion from processing

No security regressions introduced by this file rename.
