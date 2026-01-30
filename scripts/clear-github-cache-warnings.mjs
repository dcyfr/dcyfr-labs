#!/usr/bin/env node

/**
 * Clear stale GitHub cache warnings
 *
 * One-time script to clean up any cached GitHub data that contains
 * warning fields from fallback scenarios. This ensures production
 * displays only real GitHub data without "demo data" warnings.
 *
 * Usage:
 *   node scripts/clear-github-cache-warnings.mjs
 *   npm run clean:github-cache
 */

import { Redis } from '@upstash/redis';

const CACHE_KEY = 'github:contributions:dcyfr';

// Get Redis credentials based on environment
function getRedisCredentials() {
  const isProduction = process.env.VERCEL_ENV === 'production';
  const isPreview = process.env.VERCEL_ENV === 'preview';

  if (isProduction) {
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    };
  }

  if (isPreview) {
    return {
      url: process.env.UPSTASH_REDIS_REST_URL_PREVIEW || process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN_PREVIEW || process.env.UPSTASH_REDIS_REST_TOKEN,
    };
  }

  // Development
  return {
    url: process.env.UPSTASH_REDIS_REST_URL_PREVIEW || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN_PREVIEW || process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

async function clearCacheWarnings() {
  const credentials = getRedisCredentials();

  if (!credentials.url || !credentials.token) {
    console.error('❌ Redis credentials not available');
    console.error('   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
    process.exit(1);
  }

  const redis = new Redis({
    url: credentials.url,
    token: credentials.token,
  });

  console.log('🔍 Checking GitHub cache for warnings...');
  console.log(`   Environment: ${process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'}`);

  try {
    // Read current cache
    const cached = await redis.get(CACHE_KEY);

    if (!cached) {
      console.log('ℹ️  No cached data found (cache empty)');
      return;
    }

    const data = JSON.parse(cached);

    // Check if data has warning field
    if (!data.warning) {
      console.log('✅ Cache data is clean (no warning field)');
      console.log(`   Source: ${data.source}`);
      console.log(`   Total contributions: ${data.totalContributions}`);
      console.log(`   Last updated: ${data.lastUpdated}`);
      return;
    }

    // Data has warning - clean it
    console.log('⚠️  Found warning in cached data:', data.warning);
    console.log('🧹 Cleaning cache...');

    const cleanData = {
      contributions: data.contributions,
      source: data.source,
      totalContributions: data.totalContributions,
      lastUpdated: data.lastUpdated,
      // Explicitly exclude 'warning' field
    };

    // Update cache with cleaned data
    await redis.setex(
      CACHE_KEY,
      60 * 60, // 1 hour TTL
      JSON.stringify(cleanData)
    );

    console.log('✅ Cache cleaned successfully');
    console.log(`   Source: ${cleanData.source}`);
    console.log(`   Total contributions: ${cleanData.totalContributions}`);
    console.log(`   Last updated: ${cleanData.lastUpdated}`);
  } catch (error) {
    console.error('❌ Failed to clean cache:', error.message);
    process.exit(1);
  }
}

// Run the script
clearCacheWarnings().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
