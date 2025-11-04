# GitHub Contribution Streak Calculation Bug Fix

**Date:** November 4, 2025  
**Issue:** Current streak showing as 48 days but longest streak showing as only 8 days

## Problem Analysis

### Root Cause
The `calculateStreaks()` function in `src/components/github-heatmap.tsx` had a logic bug where the **current active streak** was not being compared with the **longest streak** before returning results.

### The Bug
```typescript
// Original code (BUGGY)
for (let i = 0; i < sorted.length; i++) {
  // ... current streak calculation
  if (currentStreak > 0 && dayDiff !== 1) {
    break; // ❌ Exits loop early when current streak ends
  }
  
  // ... longest streak calculation runs on remaining data
  tempStreak++;
  longestStreak = Math.max(longestStreak, tempStreak);
}

return { currentStreak, longestStreak }; // ❌ Never compares them!
```

**What went wrong:**
1. Current streak calculation breaks out of the loop when it finds a gap
2. Longest streak calculation continues through remaining contributions
3. If the current active streak is the longest streak in the dataset, it's never compared with `longestStreak`
4. Result: `currentStreak` (48) > `longestStreak` (8) ❌

### Example Scenario
Given contribution data from the last year:

```
Today ← [48 consecutive days] ← [gap] ← [8 consecutive days] ← [gap] ← [5 days] ← ...
         ^                                ^
         |                                |
         currentStreak = 48               longestStreak = 8 (wrong!)
```

The algorithm:
- ✅ Correctly counts current streak: 48 days
- ❌ Breaks out of loop after current streak
- ❌ Only calculates longest streak from remaining data: 8 days
- ❌ Never compares: should be longestStreak = 48!

## The Fix

### Solution
Add one line to ensure the current streak is considered when determining the longest streak:

```typescript
// Fixed code
for (let i = 0; i < sorted.length; i++) {
  // ... current streak and longest streak calculations
}

// ✅ FIX: Ensure current streak is considered as a potential longest streak
longestStreak = Math.max(longestStreak, currentStreak);

return { currentStreak, longestStreak };
```

### Implementation
**File:** `src/components/github-heatmap.tsx`  
**Line:** After line 100 (before the return statement)

```diff
      // Calculate longest streak
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

+ // Ensure current streak is considered as a potential longest streak
+ longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}
```

## Validation

### Test Script
Created `scripts/test-streak-calculation.mjs` to validate the fix with multiple scenarios:

1. ✅ **Current Streak > Previous Streaks** (the bug scenario)
   - Current: 48+ days, Previous: 8 days
   - Result: `longestStreak >= currentStreak` ✅

2. ✅ **Previous Streak > Current Streak**
   - Previous: 50 days, Current: 10 days
   - Result: `longestStreak` correctly reflects previous streak ✅

3. ✅ **Only Current Streak** (no previous streaks)
   - Current: 30 days
   - Result: `longestStreak === currentStreak` ✅

4. ✅ **Multiple Streaks with Gaps**
   - Validates correct comparison across all streaks ✅

5. ✅ **No Contributions**
   - Both values correctly return 0 ✅

### Testing Locally
```bash
# Run the test script
npm run test:streaks
# or
node scripts/test-streak-calculation.mjs
```

### Testing with Real Data
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000`
3. Check GitHub Heatmap section
4. Verify: `longestStreak >= currentStreak` always

## Impact

### Before Fix
- ❌ **Logical Impossibility:** Current streak could be greater than longest streak
- ❌ **User Confusion:** Misleading metrics display
- ❌ **Data Integrity:** Statistics didn't match reality

### After Fix
- ✅ **Mathematically Sound:** `longestStreak >= currentStreak` always holds
- ✅ **Accurate Metrics:** Displays correct contribution statistics
- ✅ **User Trust:** Reliable data presentation

## Related Files

- **Component:** `src/components/github-heatmap.tsx`
- **API Route:** `src/app/api/github-contributions/route.ts`
- **Test Script:** `scripts/test-streak-calculation.mjs`
- **Documentation:** `docs/components/github-heatmap.md`

## Additional Notes

### Why This Bug Occurred
The original implementation separated the "current streak" and "longest streak" calculations into different concerns within the same loop. The current streak calculation used an early break statement (for efficiency), but this created a side effect where the longest streak calculation only processed the remaining data after the current streak ended.

### Why One Line Fixes It
By adding a final comparison `longestStreak = Math.max(longestStreak, currentStreak)` before returning, we ensure that:
1. The longest streak calculation can still be efficient (no need to refactor the loop)
2. The current active streak is always considered as a candidate for longest streak
3. The mathematical invariant `longestStreak >= currentStreak` is guaranteed

### Performance Impact
- **None:** The fix adds only one `Math.max()` comparison outside the loop
- Time complexity remains O(n) where n is the number of contribution days
- No additional memory allocation

## Testing Checklist

- [x] Test script validates all edge cases
- [x] Fix applied to `github-heatmap.tsx`
- [x] Documentation updated
- [ ] Verify on dev server with real GitHub data
- [ ] Deploy to production
- [ ] Monitor for any edge cases
