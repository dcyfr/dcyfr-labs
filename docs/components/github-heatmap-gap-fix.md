# Streak Calculation Bug Fix #2: Gap Detection

**Date:** November 4, 2025  
**Issue:** 48-day streak displayed despite having no contributions on Nov 2, 2025

---

## 🐛 The Second Bug

After fixing the first bug (currentStreak > longestStreak), a more critical issue was discovered:

### User Report
> "How do I have a 48 day streak when I made no contributions on Nov. 2nd 2025?"

This revealed that the streak calculation was **ignoring gaps** in contributions and counting right through days with zero contributions.

---

## 🔍 Root Cause Analysis

### The Bug
The original code compared the current contribution date with `sorted[i - 1].date` (the previous array index):

```typescript
// BUGGY CODE
if (sorted[i].count > 0) {
  if (currentStreak > 0) {
    const prevDate = new Date(sorted[i - 1].date);  // ❌ Wrong!
    const dayDiff = Math.floor((prevDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      currentStreak++;  // Incorrectly continues through gaps!
    }
  }
}
```

### Why It Failed

**Scenario:**
```
Array:     Index:  Date:        Count:  Processed:
sorted[0]  [0]     Nov 4        3       ✅ Start streak (i===0)
sorted[1]  [1]     Nov 3        5       ✅ Compare to Nov 4, diff=1, continue
sorted[2]  [2]     Nov 2        0       ⏭️  SKIPPED (count === 0)
sorted[3]  [3]     Nov 1        4       ❌ Compare to sorted[2] (Nov 2), diff=1
                                            Should compare to Nov 3!
```

**The Problem:**
When processing Nov 1 (index 3), the code looked at `sorted[3-1]` = `sorted[2]` = Nov 2.
- Since Nov 2 was skipped (count === 0), it was never added to the streak
- But the day difference calculation still used Nov 2's date
- Nov 1 to Nov 2 = 1 day → streak continues ❌
- **Should have compared Nov 1 to Nov 3 (last counted date) = 2 days → break!** ✅

---

## ✅ The Fix

### Solution
Track the **last date that was actually counted** in the streak, not just the previous array index:

```typescript
// FIXED CODE
let lastStreakDate: Date | null = null; // Track last counted date

for (let i = 0; i < sorted.length; i++) {
  const contribDate = new Date(sorted[i].date);
  contribDate.setHours(0, 0, 0, 0);

  if (sorted[i].count > 0) {
    if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
      currentStreak++;
      lastStreakDate = contribDate; // ✅ Remember this date
    } else if (currentStreak > 0 && lastStreakDate) {
      // ✅ Compare to last COUNTED date, not previous array index
      const dayDiff = Math.floor((lastStreakDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        currentStreak++;
        lastStreakDate = contribDate; // ✅ Update for next iteration
      } else {
        break; // Gap detected!
      }
    }
  }
}
```

---

## 🧪 Validation

### Before Fix
```
Contributions:
- Nov 4: 3 contributions
- Nov 3: 5 contributions
- Nov 2: 0 contributions ← GAP!
- Nov 1 and earlier: continuous

Result: 8+ day streak ❌ (continues through gap)
```

### After Fix
```
Contributions:
- Nov 4: 3 contributions
- Nov 3: 5 contributions
- Nov 2: 0 contributions ← GAP!
- Nov 1 and earlier: continuous

Result: 2 day streak ✅ (Nov 3-4 only)
```

### Test Script
Created `scripts/debug-streak-gap-2.mjs` to validate:

```bash
node scripts/debug-streak-gap-2.mjs
```

**Output:**
```
[0] 2025-11-04: 3 contributions
  ✅ START: currentStreak = 1
[1] 2025-11-03: 5 contributions
  Last streak date: 2025-11-04, dayDiff = 1
  ✅ CONTINUE: currentStreak = 2
[3] 2025-11-01: 1 contributions
  Last streak date: 2025-11-03, dayDiff = 2  ← Correctly compares to last counted!
  ❌ BREAK: gap of 2 days

📊 Current Streak: 2 days ✅
```

---

## 📝 Complete Bug Summary

### Bug #1: `currentStreak > longestStreak`
- **Issue:** Current streak not compared with longest streak
- **Fix:** Added `longestStreak = Math.max(longestStreak, currentStreak)`
- **Status:** ✅ Fixed

### Bug #2: Streaks Continue Through Gaps
- **Issue:** Day difference calculated using array index, not last counted date
- **Fix:** Track `lastStreakDate` and compare against it
- **Status:** ✅ Fixed

---

## 🎯 Impact

### Before Fixes
- ❌ Current streak could be > longest streak (mathematically impossible)
- ❌ Streaks continued through days with 0 contributions
- ❌ Completely unreliable metrics
- ❌ User confusion and loss of trust

### After Fixes
- ✅ `longestStreak >= currentStreak` always holds
- ✅ Gaps (days with 0 contributions) properly break streaks
- ✅ Accurate, trustworthy contribution statistics
- ✅ Zero performance impact (O(n) time complexity maintained)

---

## 📦 Files Modified

### Core Fix
1. **`src/components/github-heatmap.tsx`**
   - Added `lastStreakDate` tracking variable
   - Changed day difference calculation to use last counted date
   - Previous fix (`longestStreak = Math.max(...)`) still in place

### Test & Debug Scripts
2. **`scripts/test-streak-calculation.mjs`** - Original streak tests
3. **`scripts/debug-streak-gap.mjs`** - Debug scenario 1 (no contrib today)
4. **`scripts/debug-streak-gap-2.mjs`** - Debug scenario 2 (contrib today, gap on Nov 2)

### Documentation
5. **`docs/components/github-heatmap-streak-fix.md`** - First bug documentation
6. **`docs/components/github-heatmap-gap-fix.md`** - This document

---

## ✅ Testing Checklist

- [x] Bug identified and root cause analyzed
- [x] Fix implemented in component
- [x] Debug scripts created and validated
- [x] Original test suite still passes
- [x] Gap scenarios correctly handled
- [x] Documentation updated
- [ ] Test with real GitHub data on dev server
- [ ] Deploy to production
- [ ] Monitor for edge cases

---

## 🚀 Next Steps

1. **Test Locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Check GitHub Heatmap section
   # Verify streak counts correctly with any gaps
   ```

2. **Run Tests:**
   ```bash
   npm run test:streaks
   node scripts/debug-streak-gap-2.mjs
   ```

3. **Deploy:** Once validated, deploy to production

---

## 📚 Key Learnings

### Why This Bug Was Subtle
The bug only manifested when:
1. You had contributions today or yesterday (to start the streak)
2. AND there was a gap (0 contributions) in recent history
3. AND there were contributions before the gap

Without all three conditions, the bug wasn't visible. That's why it passed basic tests but failed with real-world data.

### Defensive Programming
The fix demonstrates an important principle: **track what you actually process, not what you assume from data structure position**. The array index (`i - 1`) was convenient but semantically wrong. The explicit `lastStreakDate` variable is more verbose but semantically correct.

---

**Status:** ✅ **RESOLVED**  
**Validation:** ✅ **TESTED**  
**Impact:** 🔥 **CRITICAL BUG FIXED**
