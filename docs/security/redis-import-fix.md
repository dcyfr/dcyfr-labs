# Redis Import Error Fix

**Date**: November 9, 2025  
**Issue**: Runtime error with Redis module being imported in client-side code  
**Status**: ✅ Fixed

## Problem

The anti-spam implementation caused a runtime error:
```
Cannot find module 'node:net': Unsupported external type Url for commonjs reference
```

**Root Cause**: 
- `src/lib/anti-spam.ts` imports Redis (Node.js server-side library)
- Client-side hooks (`use-view-tracking.ts`) imported `generateSessionId` from anti-spam.ts
- This caused the entire anti-spam module (including Redis) to be bundled for the client
- Redis uses Node.js native modules (`node:net`) which can't run in the browser

## Solution

**Created separate client-safe module:**

1. **`src/lib/anti-spam-client.ts`** (NEW)
   - Contains only client-safe utilities
   - No Redis or Node.js dependencies
   - Exports: `generateSessionId()`, `isValidSessionId()`

2. **Updated `src/lib/anti-spam.ts`**
   - Re-exports client utilities from `anti-spam-client.ts`
   - Keeps server-side utilities (Redis, request validation)
   - Server-only code remains isolated

3. **Updated client-side hooks:**
   - `src/hooks/use-view-tracking.ts` - imports from `@/lib/anti-spam-client`
   - `src/hooks/use-share-tracking.ts` - dynamic imports from `@/lib/anti-spam-client`

## File Changes

### Created
- ✅ `src/lib/anti-spam-client.ts` - Client-safe utilities (no Redis)

### Modified
- ✅ `src/lib/anti-spam.ts` - Re-exports client utilities, keeps server code
- ✅ `src/hooks/use-view-tracking.ts` - Changed import path
- ✅ `src/hooks/use-share-tracking.ts` - Changed dynamic import path

## Architecture

```
┌─────────────────────────────────────┐
│  Client-Side (Browser)              │
├─────────────────────────────────────┤
│  use-view-tracking.ts               │
│  use-share-tracking.ts              │
│           ↓                          │
│  anti-spam-client.ts                │
│  - generateSessionId()              │
│  - isValidSessionId()               │
│  (NO REDIS)                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Server-Side (Node.js)              │
├─────────────────────────────────────┤
│  /api/views/route.ts                │
│  /api/shares/route.ts               │
│           ↓                          │
│  anti-spam.ts                       │
│  - validateRequest()                │
│  - checkSessionDuplication()        │
│  - detectAbusePattern()             │
│  - recordAbuseAttempt()             │
│  - + re-exports from client module  │
│  (WITH REDIS)                       │
└─────────────────────────────────────┘
```

## Verification

**Dev server starts successfully:**
```bash
✓ Starting...
✓ Compiled middleware in 145ms
✓ Ready in 1278ms
```

**No Redis import errors in client bundles.**

## Key Principle

**Server-only code (Redis, Node.js modules) must never be imported by client components.**

**Solution pattern:**
1. Create separate `-client.ts` file for shared utilities
2. Keep server-only code isolated in main file
3. Re-export from main file if needed for convenience
4. Client code imports from `-client.ts` file

## Testing

```bash
# Start dev server
npm run dev

# Should compile without errors
# Check for: "✓ Ready in [time]ms"
# No Redis import errors
```

## Future Prevention

When adding new utilities to anti-spam system:
- ✅ Client-safe utilities → `anti-spam-client.ts`
- ✅ Server-only utilities → `anti-spam.ts`
- ❌ Never mix Redis/Node.js imports with client utilities in same file

## Related Documentation

- Main implementation: `docs/security/anti-spam-implementation.md`
- Quick reference: `docs/security/anti-spam-quick-ref.md`
- Summary: `docs/security/anti-spam-summary.md`
