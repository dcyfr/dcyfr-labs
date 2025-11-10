# Share Count Revert Bug Fix

**Date:** November 10, 2025  
**Issue:** Share count reverts after incrementing in all environments, including private browser sessions and different browsers (Safari, Chrome, etc.)

## Root Cause

The `ShareButtons` component (`src/components/share-buttons.tsx`) was implementing its own share tracking logic that **only sent the `postId`** to the `/api/shares` endpoint:

```typescript
// ❌ INCORRECT - Missing required fields
const response = await fetch('/api/shares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ postId }), // Missing sessionId and timeOnPage!
});
```

However, the API route (`src/app/api/shares/route.ts`) **requires three fields** for anti-spam protection:
1. `postId` - Permanent post identifier ✅
2. `sessionId` - Client-generated session ID (from sessionStorage) ❌ **MISSING**
3. `timeOnPage` - Milliseconds since page load (must be >= 2000) ❌ **MISSING**

### What Was Happening

1. User clicks share button
2. Component sends incomplete request (only `postId`)
3. API validates request and finds `sessionId` is invalid/missing
4. API returns error: `{ error: "Invalid sessionId", recorded: false }` with **400 Bad Request**
5. Component's error handler reverts the optimistic count update
6. Share count returns to original value

## The Fix

**Modified:** `src/components/share-buttons.tsx`

Changed the component to use the existing `useShareTracking` hook, which properly handles:
- ✅ Session ID generation and management (stored in sessionStorage)
- ✅ Time-on-page tracking (ensures minimum 2 seconds)
- ✅ Client-side rate limiting (1 second between shares)
- ✅ Proper error handling with meaningful messages

```typescript
// ✅ CORRECT - Using the proper hook
import { useShareTracking } from "@/hooks/use-share-tracking";

export function ShareButtons({ url, title, postId, initialShareCount = 0 }: ShareButtonsProps) {
  // Use the proper share tracking hook with anti-spam protection
  const { trackShare: trackShareAPI, shareCount: apiShareCount } = useShareTracking(postId);
  const [shareCount, setShareCount] = useState(initialShareCount);

  // Update share count when API returns a value
  useEffect(() => {
    if (apiShareCount !== null) {
      setShareCount(apiShareCount);
    }
  }, [apiShareCount]);

  /**
   * Increment share count in database
   * Uses the proper hook with sessionId and timeOnPage validation
   */
  const trackShare = async () => {
    try {
      const result = await trackShareAPI();
      if (result.success && result.count !== undefined && result.count !== null) {
        setShareCount(result.count);
      }
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };
  
  // ... rest of component
}
```

## What the Hook Does

The `useShareTracking` hook (`src/hooks/use-share-tracking.ts`) properly implements:

```typescript
// Generates/retrieves session ID
let sessionId = sessionStorage.getItem("viewTrackingSessionId");
if (!sessionId) {
  sessionId = generateSessionId(); // Creates UUID
  sessionStorage.setItem("viewTrackingSessionId", sessionId);
}

// Calculates time on page
const timeOnPage = Date.now() - pageLoadTimeRef.current;

// Sends complete request
const response = await fetch("/api/shares", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    postId,      // ✅ Permanent post identifier
    sessionId,   // ✅ Client session ID
    timeOnPage,  // ✅ Time since page load
  }),
});
```

## Testing

To verify the fix works:

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to any blog post** with share buttons

3. **Click any share button** (Twitter, LinkedIn, Copy Link, or Native Share)

4. **Expected behavior:**
   - ✅ Share count increments and **stays incremented**
   - ✅ Counter shows the updated value from server
   - ✅ No revert/flickering
   - ✅ Works in private/incognito mode
   - ✅ Works across different browsers

5. **Verify in console** (F12 Developer Tools):
   - No 400 errors from `/api/shares`
   - Should see 200 OK response with `{ count: X, recorded: true }`

6. **Test deduplication** (click same share button again within 5 minutes):
   - Should see: `{ recorded: false, message: "Share already recorded for this session" }`
   - Count should remain stable (not revert, not increment)

## API Protection Layers Still Enforced

The fix maintains all existing anti-spam protections:

1. ✅ **Session deduplication** - 1 share per session per post per 5 minutes
2. ✅ **IP-based rate limiting** - 3 shares per 60 seconds per IP
3. ✅ **User-agent validation** - Blocks bots and suspicious clients
4. ✅ **Timing validation** - Requires minimum 2 seconds on page
5. ✅ **Abuse pattern detection** - Tracks and blocks repeat offenders

## Files Changed

- `src/components/share-buttons.tsx` - Fixed to use `useShareTracking` hook

## Files Referenced (No Changes)

- `src/hooks/use-share-tracking.ts` - Already correctly implemented
- `src/app/api/shares/route.ts` - API validation working as designed
- `src/lib/shares.ts` - Redis increment working correctly
- `src/lib/anti-spam.ts` - Session validation working correctly

## Related Documentation

- `/docs/api/reference.md` - API endpoint documentation
- `/docs/security/anti-spam-implementation.md` - Anti-spam protection overview
- `/docs/components/share-buttons.md` - Component documentation (should be updated)

## Prevention

To prevent this issue in the future:

1. **Always use existing hooks** for tracking instead of reimplementing
2. **Review API requirements** before making direct fetch calls
3. **Test in private/incognito mode** to catch session-related issues
4. **Check API responses** in browser DevTools during testing
5. **Follow the pattern** established in other tracking components (e.g., `ViewTracker`)

## Verification Steps

Run the automated test suite:
```bash
node scripts/test-tracking.mjs
```

Expected output should show:
- ✅ Share recorded successfully
- ✅ Duplicate share correctly rejected
- ✅ Redis key exists with incremented value

---

**Status:** ✅ **FIXED**  
**Tested:** Development environment  
**Ready for:** Testing in preview/production
