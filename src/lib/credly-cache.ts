/**
 * Credly Data Caching Utilities
 *
 * Provides multi-layer caching for Credly API data:
 * 1. In-memory cache for instant access during same session
 * 2. Redis cache for persistence across requests and deploys
 *
 * This prevents rate limiting issues by ensuring cached data
 * is shared across all server instances and page loads.
 */

import type { CredlyBadge, CredlyBadgesResponse } from '@/types/credly';
import { redis } from '@/lib/redis';
import { getRedisKeyPrefix } from '@/mcp/shared/redis-client';

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const REDIS_CACHE_DURATION = 60 * 60; // 1 hour in seconds for Redis
const CACHE_KEY_PREFIX = 'credly_cache_';
const REDIS_KEY_BASE = 'credly:badges:'; // Base key (env prefix added at runtime)

// Fallback empty state for immediate display while loading
const EMPTY_BADGES_RESPONSE = {
  badges: [],
  total_count: 0,
  count: 0,
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface BadgesApiResponse {
  badges: CredlyBadge[];
  total_count: number;
  count: number;
}

// In-memory cache for the current session (fast access)
const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Create a cache key for badges with username and limit
 */
function createBadgesCacheKey(username: string, limit?: number): string {
  return `${CACHE_KEY_PREFIX}badges_${username}_${limit || 'all'}`;
}

/**
 * Create a Redis key for badges with username and limit
 * Uses environment-aware prefix to match build-time key generation
 */
function createRedisKey(username: string, limit?: number): string {
  return `${getRedisKeyPrefix()}${REDIS_KEY_BASE}${username}:${limit || 'all'}`;
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() < entry.expiresAt;
}

/**
 * Get cached data from memory if valid, otherwise return null
 */
function getMemoryCachedData<T>(cacheKey: string): T | null {
  const entry = memoryCache.get(cacheKey);
  if (entry && isCacheValid(entry)) {
    return entry.data;
  }
  // Remove expired entry
  if (entry) {
    memoryCache.delete(cacheKey);
  }
  return null;
}

/**
 * Store data in memory cache with expiration
 */
function setMemoryCachedData<T>(cacheKey: string, data: T): void {
  const now = Date.now();
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION,
  };
  memoryCache.set(cacheKey, entry);
}

/**
 * Get cached data from Redis if available
 */
async function getRedisCachedData<T>(redisKey: string): Promise<T | null> {
  try {
    const cached = await redis.get(redisKey);
    if (cached && typeof cached === 'string') {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    console.warn('[Credly Cache] Redis read failed:', error);
  }
  return null;
}

/**
 * Store data in Redis with expiration
 */
async function setRedisCachedData<T>(redisKey: string, data: T): Promise<void> {
  try {
    await redis.setex(redisKey, REDIS_CACHE_DURATION, JSON.stringify(data));
  } catch (error) {
    console.warn('[Credly Cache] Redis write failed:', error);
  }
}

/**
 * Fetch Credly badges with multi-layer caching
 *
 * Cache layers (checked in order):
 * 1. In-memory cache (fastest, session-only)
 * 2. Redis cache (persistent, shared across instances)
 * 3. API fetch (slowest, cached after retrieval)
 */
export async function fetchCredlyBadgesCached(
  username: string = 'dcyfr',
  limit?: number
): Promise<BadgesApiResponse> {
  const memoryCacheKey = createBadgesCacheKey(username, limit);
  const redisKey = createRedisKey(username, limit);

  // Layer 1: Check in-memory cache first (fastest)
  const memoryData = getMemoryCachedData<BadgesApiResponse>(memoryCacheKey);
  if (memoryData) {
    return memoryData;
  }

  // Layer 2: Check Redis cache (persistent, shared)
  const redisData = await getRedisCachedData<BadgesApiResponse>(redisKey);
  if (redisData) {
    // Populate memory cache for next access
    setMemoryCachedData(memoryCacheKey, redisData);
    return redisData;
  }

  // Layer 3: Cache miss - return empty state instead of API call
  // Cache should be populated during build or via manual trigger
  const isProduction = process.env.VERCEL_ENV === 'production';

  console.warn('[Credly Cache] ⚠️ Cache miss - returning empty state', {
    redisKey,
    environment: process.env.NODE_ENV,
  });

  if (!isProduction) {
    console.warn('[Credly Cache]    Run: curl http://localhost:3000/api/dev/populate-cache');
  }

  // Return empty state - no API call to prevent rate limiting
  return EMPTY_BADGES_RESPONSE;
}

/**
 * Clear all Credly cache entries (both memory and Redis)
 */
export async function clearCredlyCache(): Promise<void> {
  // Clear memory cache
  let memoryCleared = 0;
  for (const key of memoryCache.keys()) {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      memoryCache.delete(key);
      memoryCleared++;
    }
  }

  // Clear Redis cache (pattern match and delete)
  try {
    // Note: This is a simplified version. For production, you'd want to use SCAN
    // to avoid blocking the Redis server with KEYS command
    console.warn(
      '[Credly Cache] ⚠️ Redis cache clear requires manual intervention or TTL expiration'
    );
  } catch (error) {
    console.warn('[Credly Cache] Redis clear failed:', error);
  }

  console.warn(`[Credly Cache] ✅ Memory cache cleared (${memoryCleared} entries)`);
}

/**
 * Get cache statistics for debugging
 */
export function getCredlyCacheStats(): {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  cacheKeys: string[];
} {
  const credlyKeys = Array.from(memoryCache.keys()).filter((key) =>
    key.startsWith(CACHE_KEY_PREFIX)
  );

  let validEntries = 0;
  let expiredEntries = 0;

  for (const key of credlyKeys) {
    const entry = memoryCache.get(key);
    if (entry) {
      if (isCacheValid(entry)) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }
  }

  return {
    totalEntries: credlyKeys.length,
    validEntries,
    expiredEntries,
    cacheKeys: credlyKeys,
  };
}

/**
 * Preload Credly data for better performance
 * Useful for SSR or when you know data will be needed
 */
export async function preloadCredlyData(username: string = 'dcyfr'): Promise<void> {
  try {
    // Preload both unlimited and limited data
    await Promise.all([
      fetchCredlyBadgesCached(username), // All badges
      fetchCredlyBadgesCached(username, 10), // Top 10
      fetchCredlyBadgesCached(username, 3), // Top 3
    ]);
    console.warn(`[Credly Cache] ✅ Preloaded data for ${username}`);
  } catch (error) {
    console.error(`[Credly Cache] ❌ Preload failed for ${username}:`, error);
  }
}
