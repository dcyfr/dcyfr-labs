import { NextResponse } from 'next/server';
import { redis, getRedisEnvironment, getRedisKeyPrefix } from '@/mcp/shared/redis-client';

/**
 * Verify Redis environment configuration
 *
 * Shows what Redis the app is connecting to and what key prefixes it's using
 */
export async function GET() {
  const environment = getRedisEnvironment();
  const keyPrefix = getRedisKeyPrefix();

  // Check which Redis URLs are configured
  const hasProductionUrl = !!process.env.UPSTASH_REDIS_REST_URL;
  const hasProductionToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasPreviewUrl = !!process.env.UPSTASH_REDIS_REST_URL_PREVIEW;
  const hasPreviewToken = !!process.env.UPSTASH_REDIS_REST_TOKEN_PREVIEW;

  // Determine which Redis is being used
  let usingRedis = 'unknown';
  if (environment === 'production') {
    usingRedis = hasProductionUrl && hasProductionToken ? 'production' : 'none';
  } else {
    if (hasPreviewUrl && hasPreviewToken) {
      usingRedis = 'preview';
    } else if (hasProductionUrl && hasProductionToken) {
      usingRedis = 'production (fallback)';
    } else {
      usingRedis = 'none';
    }
  }

  // Test Redis connection
  let redisConnected = false;
  let redisError = null;

  try {
    await redis.ping();
    redisConnected = true;
  } catch (error) {
    redisError = error instanceof Error ? error.message : String(error);
  }

  // Try to read GitHub cache
  const cacheKey = 'github:contributions:dcyfr';
  let cacheStatus = 'not-checked';
  let cacheData = null;

  if (redisConnected) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached && typeof cached === 'string') {
        const data = JSON.parse(cached);
        cacheStatus = 'found';
        cacheData = {
          totalContributions: data.totalContributions,
          lastUpdated: data.lastUpdated,
          source: data.source,
        };
      } else {
        cacheStatus = `not-found (type: ${typeof cached})`;
      }
    } catch (error) {
      cacheStatus = `error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return NextResponse.json({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      detectedEnv: environment,
    },
    redis: {
      connected: redisConnected,
      error: redisError,
      using: usingRedis,
      keyPrefix,
      credentials: {
        production: {
          url: hasProductionUrl ? 'configured' : 'missing',
          token: hasProductionToken ? 'configured' : 'missing',
        },
        preview: {
          url: hasPreviewUrl ? 'configured' : 'missing',
          token: hasPreviewToken ? 'configured' : 'missing',
        },
      },
    },
    cache: {
      key: `${keyPrefix}${cacheKey}`,
      status: cacheStatus,
      data: cacheData,
    },
    vercel: {
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'not set',
      region: process.env.VERCEL_REGION || 'not set',
      url: process.env.VERCEL_URL || 'not set',
    },
  });
}
