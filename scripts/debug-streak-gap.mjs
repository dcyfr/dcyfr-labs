#!/usr/bin/env node
/**
 * Debug script to trace through the streak calculation with real-world scenario
 * Scenario: No contribution on Nov 2, but still showing 48 day streak
 */

function calculateStreaksWithDebug(contributions) {
  console.log('\n🔍 DEBUGGING STREAK CALCULATION\n');
  console.log('Input contributions:', contributions.length, 'days');
  
  if (contributions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  console.log('\nFirst 10 sorted contributions:');
  sorted.slice(0, 10).forEach((c, idx) => {
    console.log(`  [${idx}] ${c.date}: ${c.count} contributions`);
  });

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from most recent date backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log(`\nToday: ${today.toISOString().split('T')[0]}`);
  console.log(`Yesterday: ${yesterday.toISOString().split('T')[0]}`);
  console.log('\nProcessing contributions:\n');

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    // Show what we're processing
    const dateStr = sorted[i].date;
    const count = sorted[i].count;
    
    if (count === 0) {
      console.log(`  [${i}] ${dateStr}: ${count} contributions → SKIPPED (count === 0)`);
    }

    if (sorted[i].count > 0) {
      console.log(`  [${i}] ${dateStr}: ${count} contributions`);
      
      // Check if this is part of current streak
      if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
        currentStreak++;
        console.log(`    ✅ Starting current streak (i === 0, date is today/yesterday)`);
        console.log(`    → currentStreak = ${currentStreak}`);
      } else if (currentStreak > 0) {
        const prevDate = new Date(sorted[i - 1].date);
        const dayDiff = Math.floor((prevDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`    Previous date: ${sorted[i - 1].date}, dayDiff = ${dayDiff}`);
        if (dayDiff === 1) {
          currentStreak++;
          console.log(`    ✅ Consecutive day → currentStreak = ${currentStreak}`);
        } else {
          console.log(`    ❌ Gap detected (${dayDiff} days) → BREAKING current streak calculation`);
          break;
        }
      } else {
        console.log(`    ⏭️  Skipped (not part of current streak calculation)`);
      }

      // Calculate longest streak
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
    
    if (i >= 15) {
      console.log(`\n  ... (showing first 15 iterations)\n`);
      break;
    }
  }

  // Ensure current streak is considered as a potential longest streak
  longestStreak = Math.max(longestStreak, currentStreak);

  console.log(`\n📊 RESULTS:`);
  console.log(`  Current Streak: ${currentStreak} days`);
  console.log(`  Longest Streak: ${longestStreak} days`);

  return { currentStreak, longestStreak };
}

// Simulate the real scenario: Nov 4 is today, no contribution on Nov 2
const testData = [];

// Nov 4 (today) - no contribution
testData.push({ date: '2025-11-04', count: 0 });

// Nov 3 (yesterday) - has contribution
testData.push({ date: '2025-11-03', count: 5 });

// Nov 2 - NO CONTRIBUTION (the gap!)
testData.push({ date: '2025-11-02', count: 0 });

// Nov 1 and going back 50+ days with contributions
for (let i = 1; i <= 50; i++) {
  const date = new Date('2025-11-01');
  date.setDate(date.getDate() - i + 1);
  testData.push({
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10) + 1,
  });
}

console.log('🧪 TEST SCENARIO: Nov 2, 2025 has NO contributions');
console.log('Expected: Current streak should be 1 day (only Nov 3)');
console.log('Bug report: Current streak shows 48+ days\n');

const result = calculateStreaksWithDebug(testData);

console.log('\n' + '='.repeat(60));
if (result.currentStreak > 1) {
  console.log('❌ BUG CONFIRMED: Streak continues past the gap on Nov 2!');
} else {
  console.log('✅ Correct: Streak properly breaks at gap');
}
