/**
 * Upstash Redis client for MCP servers and main app
 * Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from environment
 *
 * Upstash provides serverless Redis with HTTP-based REST API, perfect for
 * Vercel Edge Functions and serverless deployments (no persistent connections needed)
 */

import { Redis } from '@upstash/redis';

/**
 * Upstash Redis client instance
 * Lazy-initialized on first use to avoid connection in build/test environments
 */
let redisClient: Redis | null = null;

/**
 * Get or create Upstash Redis client
 * Only initializes when first used (lazy loading)
 */
function getRedisClient(): Redis {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!restUrl || !restToken) {
    throw new Error(
      'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local'
    );
  }

  if (!redisClient) {
    redisClient = new Redis({
      url: restUrl,
      token: restToken,
    });
  }

  return redisClient;
}

/**
 * Upstash Redis client
 * Auto-initializes on first use with environment credentials
 *
 * Compatible with standard Redis API:
 * - get, set, setEx, del
 * - zadd, zrange, zrangebyscore
 * - All operations work via HTTP REST API
 */
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const client = getRedisClient();
    const value = client[prop as keyof Redis];

    if (typeof value === 'function') {
      return value.bind(client);
    }

    return value;
  },
});

/**
 * Close Redis connection (for cleanup)
 * Note: Upstash uses HTTP, so no persistent connection to close
 * This is kept for API compatibility with previous implementation
 */
export async function closeRedisClient() {
  // Upstash uses HTTP REST API, no persistent connection to close
  // Just reset the client instance
  redisClient = null;
}
