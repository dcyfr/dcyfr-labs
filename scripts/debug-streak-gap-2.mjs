#!/usr/bin/env node
/**
 * Debug script - Scenario 2: Contribution today, none on Nov 2
 */

function calculateStreaksWithDebug(contributions) {
  if (contributions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastStreakDate = null; // Track the last date counted in current streak

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log(`Today: ${today.toISOString().split('T')[0]}`);
  console.log(`Yesterday: ${yesterday.toISOString().split('T')[0]}\n`);

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    if (sorted[i].count > 0) {
      const dateStr = sorted[i].date;
      const count = sorted[i].count;
      console.log(`[${i}] ${dateStr}: ${count} contributions`);
      
      // Check if this is part of current streak
      if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
        currentStreak++;
        lastStreakDate = contribDate;
        console.log(`  ✅ START: i === 0, date is today/yesterday → currentStreak = ${currentStreak}`);
      } else if (currentStreak > 0 && lastStreakDate) {
        const dayDiff = Math.floor((lastStreakDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`  Last streak date: ${lastStreakDate.toISOString().split('T')[0]}, dayDiff = ${dayDiff}`);
        if (dayDiff === 1) {
          currentStreak++;
          lastStreakDate = contribDate;
          console.log(`  ✅ CONTINUE: consecutive → currentStreak = ${currentStreak}`);
        } else {
          console.log(`  ❌ BREAK: gap of ${dayDiff} days`);
          break;
        }
      }

      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
    
    if (i >= 8) break;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  console.log(`\n📊 Current Streak: ${currentStreak} days`);
  console.log(`📊 Longest Streak: ${longestStreak} days`);

  return { currentStreak, longestStreak };
}

console.log('🧪 SCENARIO 2: Contribution TODAY, gap on Nov 2\n');

const testData = [];

// Nov 4 (today) - HAS contribution
testData.push({ date: '2025-11-04', count: 3 });

// Nov 3 (yesterday) - has contribution
testData.push({ date: '2025-11-03', count: 5 });

// Nov 2 - NO CONTRIBUTION (the gap!)
testData.push({ date: '2025-11-02', count: 0 });

// Nov 1 and going back with contributions
for (let i = 1; i <= 50; i++) {
  const date = new Date('2025-11-01');
  date.setDate(date.getDate() - i + 1);
  testData.push({
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10) + 1,
  });
}

const result = calculateStreaksWithDebug(testData);

console.log('\n' + '='.repeat(60));
console.log('Expected: Should show 2-day streak (Nov 3-4 only)');
console.log('Should NOT continue past Nov 2 gap!');
if (result.currentStreak > 2) {
  console.log(`❌ BUG: Streak is ${result.currentStreak} days - continues past gap!`);
} else {
  console.log(`✅ Correct: Streak is ${result.currentStreak} days`);
}
