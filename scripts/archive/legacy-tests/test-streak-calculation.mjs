#!/usr/bin/env node
/**
 * Test script to validate GitHub contribution streak calculations
 * Tests the fix for the bug where currentStreak > longestStreak
 */

/**
 * Calculate streak statistics from contribution data
 * This is the FIXED version of the function
 */
function calculateStreaks(contributions) {
  if (contributions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from most recent date backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    if (sorted[i].count > 0) {
      // Check if this is part of current streak
      if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
        currentStreak++;
      } else if (currentStreak > 0) {
        const prevDate = new Date(sorted[i - 1].date);
        const dayDiff = Math.floor((prevDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // FIX: Ensure current streak is considered as a potential longest streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Generate test data with a long current streak
 */
function generateTestData(currentStreakDays, previousStreakDays, gapDays = 1) {
  const contributions = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate current streak (most recent)
  for (let i = 0; i < currentStreakDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10) + 1, // 1-10 contributions
    });
  }

  // Add gap
  for (let i = 0; i < gapDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - currentStreakDays - i);
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: 0,
    });
  }

  // Generate previous streak (older)
  for (let i = 0; i < previousStreakDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - currentStreakDays - gapDays - i);
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10) + 1,
    });
  }

  return contributions;
}

console.log('🧪 Testing GitHub Contribution Streak Calculation\n');
console.log('=' .repeat(60));

// Test Case 1: Bug scenario - current streak longer than any previous streak
console.log('\n📊 Test Case 1: Current Streak > Previous Streaks');
console.log('-'.repeat(60));
const testData1 = generateTestData(48, 8, 1);
const result1 = calculateStreaks(testData1);
console.log(`Current Streak: ${result1.currentStreak} days`);
console.log(`Longest Streak: ${result1.longestStreak} days`);
console.log(`✅ Valid: ${result1.longestStreak >= result1.currentStreak ? 'PASS' : 'FAIL'}`);
if (result1.longestStreak < result1.currentStreak) {
  console.log('❌ BUG: Longest streak should be at least as long as current streak!');
}

// Test Case 2: Previous streak was longer
console.log('\n📊 Test Case 2: Previous Streak > Current Streak');
console.log('-'.repeat(60));
const testData2 = generateTestData(10, 50, 1);
const result2 = calculateStreaks(testData2);
console.log(`Current Streak: ${result2.currentStreak} days`);
console.log(`Longest Streak: ${result2.longestStreak} days`);
console.log(`✅ Valid: ${result2.longestStreak >= result2.currentStreak ? 'PASS' : 'FAIL'}`);
console.log(`✅ Correct: ${result2.longestStreak === 50 ? 'PASS' : 'FAIL'} (expected 50)`);

// Test Case 3: Current streak is the only streak
console.log('\n📊 Test Case 3: Only Current Streak (No Previous)');
console.log('-'.repeat(60));
const testData3 = generateTestData(30, 0, 0);
const result3 = calculateStreaks(testData3);
console.log(`Current Streak: ${result3.currentStreak} days`);
console.log(`Longest Streak: ${result3.longestStreak} days`);
console.log(`✅ Valid: ${result3.longestStreak >= result3.currentStreak ? 'PASS' : 'FAIL'}`);
console.log(`✅ Equal: ${result3.longestStreak === result3.currentStreak ? 'PASS' : 'FAIL'} (should be equal)`);

// Test Case 4: Multiple gaps with various streak lengths
console.log('\n📊 Test Case 4: Multiple Streaks with Gaps');
console.log('-'.repeat(60));
const testData4 = [
  ...generateTestData(25, 15, 2), // current: 25, previous: 15
  ...(() => {
    // Add another older streak of 30 days
    const contributions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOffset = 25 + 2 + 15 + 2; // After all previous data
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - startOffset - i);
      contributions.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) + 1,
      });
    }
    return contributions;
  })(),
];
const result4 = calculateStreaks(testData4);
console.log(`Current Streak: ${result4.currentStreak} days`);
console.log(`Longest Streak: ${result4.longestStreak} days`);
console.log(`✅ Valid: ${result4.longestStreak >= result4.currentStreak ? 'PASS' : 'FAIL'}`);
console.log(`✅ Correct: ${result4.longestStreak === 30 ? 'PASS' : 'FAIL'} (expected 30)`);

// Test Case 5: No contributions
console.log('\n📊 Test Case 5: No Contributions');
console.log('-'.repeat(60));
const result5 = calculateStreaks([]);
console.log(`Current Streak: ${result5.currentStreak} days`);
console.log(`Longest Streak: ${result5.longestStreak} days`);
console.log(`✅ Valid: ${result5.currentStreak === 0 && result5.longestStreak === 0 ? 'PASS' : 'FAIL'}`);

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!');
console.log('\nThe fix ensures that longestStreak is always >= currentStreak');
console.log('by comparing them before returning the result.');
