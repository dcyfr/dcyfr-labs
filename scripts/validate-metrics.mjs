#!/usr/bin/env node
/**
 * Validate GitHub contribution metrics against real data
 * Checks: longest streak, active days, daily average
 */

async function fetchRealGitHubData() {
  try {
    const response = await fetch('http://localhost:3000/api/github-contributions?username=dcyfr');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error.message);
    return null;
  }
}

function calculateMetrics(contributions) {
  if (!contributions || contributions.length === 0) {
    return null;
  }

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastStreakDate = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log(`\n📅 Today: ${today.toISOString().split('T')[0]}`);
  console.log(`📅 Yesterday: ${yesterday.toISOString().split('T')[0]}`);
  console.log(`📊 Total days in dataset: ${sorted.length}\n`);

  for (let i = 0; i < sorted.length; i++) {
    const contribDate = new Date(sorted[i].date);
    contribDate.setHours(0, 0, 0, 0);

    if (sorted[i].count > 0) {
      // Current streak calculation
      if (i === 0 && (contribDate.getTime() === today.getTime() || contribDate.getTime() === yesterday.getTime())) {
        currentStreak++;
        lastStreakDate = contribDate;
      } else if (currentStreak > 0 && lastStreakDate) {
        const dayDiff = Math.floor((lastStreakDate.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
          lastStreakDate = contribDate;
        } else {
          // Current streak ended, but continue for longest streak
        }
      }

      // Longest streak calculation
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Ensure current streak is considered
  longestStreak = Math.max(longestStreak, currentStreak);

  // Calculate active days (days with count > 0)
  const activeDays = sorted.filter(d => d.count > 0).length;

  // Calculate total contributions
  const totalContributions = sorted.reduce((sum, d) => sum + d.count, 0);

  // Calculate daily average (total contributions / total days in dataset)
  const dailyAverage = (totalContributions / sorted.length).toFixed(2);

  return {
    currentStreak,
    longestStreak,
    activeDays,
    totalDays: sorted.length,
    totalContributions,
    dailyAverage: parseFloat(dailyAverage),
    contributions: sorted
  };
}

function showRecentContributions(contributions, count = 20) {
  console.log(`\n📋 Most Recent ${count} Days:\n`);
  console.log('Date         | Count | Note');
  console.log('-------------|-------|---------------------------');
  
  for (let i = 0; i < Math.min(count, contributions.length); i++) {
    const contrib = contributions[i];
    const date = contrib.date;
    const countStr = contrib.count.toString().padStart(5, ' ');
    let note = '';
    
    if (contrib.count === 0) {
      note = '⚠️  Gap (no contributions)';
    } else if (i === 0) {
      note = '🏁 Most recent contribution';
    }
    
    console.log(`${date} | ${countStr} | ${note}`);
  }
}

function findStreaks(contributions) {
  console.log('\n🔥 All Streaks in Dataset:\n');
  
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const streaks = [];
  let currentStreakStart = null;
  let currentStreakEnd = null;
  let currentStreakLength = 0;
  let lastDate = null;
  
  for (const contrib of sorted) {
    const date = new Date(contrib.date);
    date.setHours(0, 0, 0, 0);
    
    if (contrib.count > 0) {
      if (currentStreakLength === 0) {
        // Start new streak
        currentStreakStart = contrib.date;
        currentStreakEnd = contrib.date;
        currentStreakLength = 1;
      } else {
        // Check if consecutive
        const dayDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreakEnd = contrib.date;
          currentStreakLength++;
        } else {
          // Streak ended, save it
          streaks.push({
            start: currentStreakEnd, // End is earlier, so it's the start chronologically
            end: currentStreakStart,
            length: currentStreakLength
          });
          // Start new streak
          currentStreakStart = contrib.date;
          currentStreakEnd = contrib.date;
          currentStreakLength = 1;
        }
      }
      lastDate = date;
    } else if (currentStreakLength > 0) {
      // Gap found, save current streak
      streaks.push({
        start: currentStreakEnd,
        end: currentStreakStart,
        length: currentStreakLength
      });
      currentStreakLength = 0;
      currentStreakStart = null;
      currentStreakEnd = null;
    }
  }
  
  // Save last streak if exists
  if (currentStreakLength > 0) {
    streaks.push({
      start: currentStreakEnd,
      end: currentStreakStart,
      length: currentStreakLength
    });
  }
  
  // Sort by length descending
  streaks.sort((a, b) => b.length - a.length);
  
  console.log('Rank | Length | Start      | End        | Note');
  console.log('-----|--------|------------|------------|------------------');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  streaks.forEach((streak, idx) => {
    const endDate = new Date(streak.end);
    endDate.setHours(0, 0, 0, 0);
    
    let note = '';
    if (endDate.getTime() === today.getTime() || endDate.getTime() === yesterday.getTime()) {
      note = '🔥 Active streak';
    }
    
    console.log(`${(idx + 1).toString().padStart(4, ' ')} | ${streak.length.toString().padStart(6, ' ')} | ${streak.start} | ${streak.end} | ${note}`);
    
    if (idx >= 9) {
      console.log('  ... (showing top 10 streaks)');
      return;
    }
  });
  
  return streaks;
}

async function main() {
  console.log('🔍 Validating GitHub Contribution Metrics');
  console.log('=' .repeat(70));
  
  const data = await fetchRealGitHubData();
  
  if (!data || !data.contributions) {
    console.error('❌ Failed to fetch contribution data');
    return;
  }
  
  console.log(`\n✅ Fetched ${data.contributions.length} days of contribution data`);
  console.log(`📊 Total contributions: ${data.totalContributions || 'calculating...'}`);
  console.log(`🔄 Data source: ${data.source || 'unknown'}`);
  
  const metrics = calculateMetrics(data.contributions);
  
  if (!metrics) {
    console.error('❌ Failed to calculate metrics');
    return;
  }
  
  // Show recent contributions
  showRecentContributions(metrics.contributions);
  
  // Find all streaks
  findStreaks(metrics.contributions);
  
  // Display calculated metrics
  console.log('\n' + '='.repeat(70));
  console.log('📊 CALCULATED METRICS:\n');
  console.log(`🔥 Current Streak:    ${metrics.currentStreak} days`);
  console.log(`🏆 Longest Streak:    ${metrics.longestStreak} days`);
  console.log(`✅ Active Days:       ${metrics.activeDays} days (days with contributions > 0)`);
  console.log(`📅 Total Days:        ${metrics.totalDays} days (in dataset)`);
  console.log(`🎯 Total Contributions: ${metrics.totalContributions}`);
  console.log(`📈 Daily Average:     ${metrics.dailyAverage} contributions/day`);
  
  // Validation against expected values
  console.log('\n' + '='.repeat(70));
  console.log('✅ VALIDATION:\n');
  
  const expectedLongestStreak = 8; // Actual longest streak from Oct 14-21
  const expectedActiveDays = 48;
  const expectedDailyAverage = 0.71; // 259 contributions / 367 days
  
  console.log(`Longest Streak: ${metrics.longestStreak} (expected: ${expectedLongestStreak})`);
  if (metrics.longestStreak === expectedLongestStreak) {
    console.log('  ✅ MATCHES expected value');
  } else {
    console.log(`  ❌ DOES NOT MATCH (difference: ${metrics.longestStreak - expectedLongestStreak})`);
  }
  
  console.log(`\nActive Days: ${metrics.activeDays} (expected: ${expectedActiveDays})`);
  if (metrics.activeDays === expectedActiveDays) {
    console.log('  ✅ MATCHES expected value');
  } else {
    console.log(`  ❌ DOES NOT MATCH (difference: ${metrics.activeDays - expectedActiveDays})`);
  }
  
  console.log(`\nDaily Average: ${metrics.dailyAverage} (expected: ${expectedDailyAverage})`);
  const avgDiff = Math.abs(metrics.dailyAverage - expectedDailyAverage);
  if (avgDiff < 0.01) {
    console.log('  ✅ MATCHES expected value');
  } else {
    console.log(`  ❌ DOES NOT MATCH (difference: ${avgDiff.toFixed(2)})`);
  }
  
  console.log('\n' + '='.repeat(70));
}

// Wait a bit for server to be ready
setTimeout(main, 2000);
