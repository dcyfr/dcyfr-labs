# View Tracking Fix: Slug Rename Issue

**Date:** October 27, 2025  
**Issue:** View tracking broken after renaming blog posts from "shipping-tiny-portfolio" → "shipping-developer-portfolio" and "hardening-tiny-portfolio" → "hardening-developer-portfolio"  
**Root Cause:** Two issues combined:
  1. Views not tracked on old URLs (code order)
  2. Historical views inaccessible under new slugs (data migration)
**Status:** ✅ Fixed & Migrated (252 views recovered)

---

## Problem Analysis

There were actually **two separate issues** that compounded the problem:

### Issue #1: Views Not Tracked on Old URLs (Immediate)

When visitors accessed old URLs, the view increment happened AFTER redirect (which exits the function), so no views were being recorded.

**Flow (BROKEN):**
```
GET /blog/shipping-tiny-portfolio
  ↓
Post found via previousSlugs mapping
  ↓
Check if redirect needed (yes)
  ↓
REDIRECT to /blog/shipping-developer-portfolio
  ↓ (execution stops here - view never incremented!)
incrementPostViews() never runs
```

### Issue #2: Historical Views Lost (Data Layer)

Old views were stored in Redis under old slug keys like `views:post:shipping-tiny-portfolio`, but the application only looked up views under new slug keys like `views:post:shipping-developer-portfolio`.

**Result:** The analytics dashboard showed 0 views for both renamed posts because the Redis keys didn't match.

---

## Solution #1: Code Order (Prevent Future Loss)

**File:** `src/app/blog/[slug]/page.tsx` (lines ~97-115)

**Changed from:**
```typescript
// BEFORE (broken)
const { post, needsRedirect, canonicalSlug } = result;

if (needsRedirect) {
  redirect(`/blog/${canonicalSlug}`);
}

// Get nonce from middleware for CSP
const nonce = (await headers()).get("x-nonce") || "";
const incrementedViews = await incrementPostViews(post.slug); // Too late!
```

**Changed to:**
```typescript
// AFTER (fixed)
const { post, needsRedirect, canonicalSlug } = result;

// Get nonce from middleware for CSP
const nonce = (await headers()).get("x-nonce") || "";

// Increment views BEFORE redirect to ensure old URL views are tracked
const incrementedViews = await incrementPostViews(post.slug);

// If this is an old slug, redirect to the current one
// Views are tracked before redirect so old URL accesses are counted
if (needsRedirect) {
  redirect(`/blog/${canonicalSlug}`);
}
```

**Why this works:**
- View increment happens before `redirect()` throws
- Even if redirect happens, views are already in Redis
- Future visits to old URLs will be tracked

---

## Solution #2: Data Migration (Recover Historical Views)

**File:** `scripts/migrate-views.mjs` (created)

A one-time migration script that:
1. Reads blog posts to find `previousSlugs` mappings
2. Checks Redis for views under old slug keys
3. Combines old + new views under canonical slug
4. Deletes old keys to clean up

### Migration Results

```
📝 Post: hardening-developer-portfolio
   Previous slugs: hardening-tiny-portfolio
   • Found 95 views on old slug: "hardening-tiny-portfolio"
     ✅ Migrated (new total: 95)

📝 Post: shipping-developer-portfolio
   Previous slugs: shipping-tiny-portfolio
   • Found 157 views on old slug: "shipping-tiny-portfolio"
     ✅ Migrated (new total: 158)

✨ Total recovered: 252 views
```

### How to Run the Migration

```bash
# Must have REDIS_URL in .env.local or environment
node scripts/migrate-views.mjs
```

The script:
- ✅ Automatically finds and loads REDIS_URL from `.env.local`
- ✅ Shows detailed progress for each post
- ✅ Combines views if the new slug already had some views
- ✅ Cleans up old keys after migration
- ✅ Reports total views recovered

---

## Impact

### What's Fixed

✅ All visits to old blog post URLs now increment view counts on the canonical post  
✅ Historical views (252 views) recovered from Redis  
✅ View analytics dashboard now shows accurate totals  
✅ "Hottest post" badge calculation now correct  
✅ Users can still access old URLs (they redirect, but views are counted)

### Current View Counts

- **hardening-developer-portfolio**: 95 views (recovered from `hardening-tiny-portfolio`)
- **shipping-developer-portfolio**: 158 views (157 from `shipping-tiny-portfolio` + 1 from new slug)

---

## How View Tracking Works Now

```
GET /blog/shipping-tiny-portfolio
  ↓
Post found via previousSlugs mapping
  ↓
Get CSP nonce from headers
  ↓
incrementPostViews(post.slug) ← Views INCREMENTED HERE
  ↓
Check if redirect needed (yes)
  ↓
REDIRECT to /blog/shipping-developer-portfolio
  ✅ Views successfully tracked in Redis!
  ✅ Future calls look up "shipping-developer-portfolio" slug
  ✅ Views are visible in analytics dashboard
```

---

## Related Files

### Code Changes
- `src/app/blog/[slug]/page.tsx` - Reordered view increment before redirect

### Scripts
- `scripts/migrate-views.mjs` - One-time migration for historical data

### Documentation
- `/docs/blog/architecture.md` - Blog system overview
- `/docs/blog/slug-redirects-guide.md` - Redirect system documentation

---

## Prevention for Future Renames

When renaming future blog posts:

1. **Add `previousSlugs` to frontmatter** with old name(s)
   ```yaml
   previousSlugs:
     - old-slug-name
   ```

2. **Rebuild/redeploy** (pages with old slugs auto-generate via `generateStaticParams`)

3. **New URL handling automatic:**
   - Views increment before redirect (thanks to Fix #1)
   - Old views are accessible (thanks to Fix #2)
   - No additional work needed!

4. **Optional: Run migration** if you want to consolidate historical data
   ```bash
   node scripts/migrate-views.mjs
   ```

---

## Testing & Verification

### Verify the Fix

1. **Visit old URL:** `http://localhost:3000/blog/shipping-tiny-portfolio`
   - ✅ Should redirect to `/blog/shipping-developer-portfolio`
   - ✅ Should increment view count

2. **Check analytics:** `http://localhost:3000/analytics`
   - ✅ Should show accurate view counts (no longer 0)
   - ✅ Should show recovered views

3. **Check Redis directly:**
   ```bash
   redis-cli
   > GET views:post:shipping-developer-portfolio
   (integer) 158
   > GET views:post:shipping-tiny-portfolio
   (nil)  # Old key should be gone
   ```

---

## Git History

- **Created:** 2025-10-27
- **Tests:** Manual verification completed
- **Status:** Production ready
