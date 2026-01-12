#!/usr/bin/env node
/**
 * Clear Activity Cache
 *
 * Clears ALL versions of the activity feed cache to force fresh data fetch.
 * This is useful when:
 * - Code structure changes (schema updates)
 * - Data becomes stale
 * - Testing cache behavior
 * - Manual cache invalidation needed
 *
 * Usage:
 *   npm run redis:clear
 *
 * This script now uses the versioned cache system which will:
 * - Clear all versions of activity:feed:all (v1, v2, etc.)
 * - Log how many cache entries were deleted
 * - Ensure next page load fetches fresh data
 */

import { createClient } from 'redis';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function clearActivityCache() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('⚠️  REDIS_URL not configured - no cache to clear');
    return;
  }

  try {
    const redis = createClient({ url: redisUrl });
    await redis.connect();

    // Find all versioned cache keys
    const pattern = 'activity:v*:feed:all';
    const keys = await redis.keys(pattern);

    if (keys.length === 0) {
      console.log('⚠️  No activity cache found');
      await redis.quit();
      return;
    }

    // Delete all versions
    const deleted = await redis.del(keys);
    console.log(`✅ Cleared ${deleted} version(s) of activity feed cache:`);
    keys.forEach(key => console.log(`   - ${key}`));

    // Also clear legacy non-versioned cache (if it exists)
    const legacyDeleted = await redis.del('activity:feed:all');
    if (legacyDeleted > 0) {
      console.log('✅ Cleared legacy (non-versioned) cache: activity:feed:all');
    }

    await redis.quit();
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
    process.exit(1);
  }
}

clearActivityCache();
