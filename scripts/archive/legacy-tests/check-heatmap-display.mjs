#!/usr/bin/env node
/**
 * Quick check of what the GitHub heatmap component would calculate
 */

// Same logic as in the component
function calculateStreaks(contributions) {
  if (contributions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastStreakDate = null;
  let currentStreakEnded = false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    if (sorted[i].count > 0) {
      if (!currentStreakEnded) {
        if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
          currentStreak++;
          lastStreakDate = contribDate;
        } else if (currentStreak > 0 && lastStreakDate) {
          const dayDiff = Math.floor((lastStreakDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            currentStreak++;
            lastStreakDate = contribDate;
          } else {
            currentStreakEnded = true;
          }
        }
      }

      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

async function check() {
  try {
    const response = await fetch('http://localhost:3000/api/github-contributions?username=dcyfr');
    const data = await response.json();
    
    console.log('\n🔍 GitHub Heatmap Component Calculation Check\n');
    console.log(`Data source: ${data.source}`);
    console.log(`Total days: ${data.contributions.length}`);
    console.log(`Total contributions: ${data.totalContributions}`);
    
    const result = calculateStreaks(data.contributions);
    
    console.log('\n📊 Calculated Metrics:');
    console.log(`Current Streak: ${result.currentStreak} days`);
    console.log(`Longest Streak: ${result.longestStreak} days`);
    
    console.log('\n✅ This is what the heatmap component should display');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
