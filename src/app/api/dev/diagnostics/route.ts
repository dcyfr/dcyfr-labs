/**
 * Development Diagnostics API
 *
 * Provides detailed system diagnostics for debugging async operations,
 * Redis connections, and performance issues in development.
 *
 * Only available in development mode.
 */

import { NextResponse } from 'next/server';
import { devLogger } from '@/lib/dev-logger';
import { redisManager } from '@/lib/redis-debug';
import { apiMetrics } from '@/lib/api-monitor';
import { testRedisConnection } from '@/lib/redis-health';

const isDev = process.env.NODE_ENV === 'development';

export async function GET(request: Request) {
  // Only allow in development
  if (!isDev) {
    return NextResponse.json(
      { error: 'Diagnostics only available in development' },
      { status: 403 }
    );
  }

  try {
    const startTime = Date.now();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeRedis = searchParams.get('redis') !== 'false';
    const includeMemory = searchParams.get('memory') !== 'false';
    const includeApi = searchParams.get('api') !== 'false';
    const includeEnv = searchParams.get('env') !== 'false';

    devLogger.info('Running diagnostics', {
      operation: 'diagnostics',
      metadata: { includeRedis, includeMemory, includeApi, includeEnv },
    });

    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
    };

    // Memory diagnostics
    if (includeMemory && typeof process !== 'undefined') {
      const memUsage = process.memoryUsage();
      diagnostics.memory = {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsedPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      };

      diagnostics.uptime = {
        seconds: Math.round(process.uptime()),
        formatted: formatUptime(process.uptime()),
      };
    }

    // Redis diagnostics
    if (includeRedis) {
      const redisStats = redisManager.getAllStats();
      const redisHealth = await testRedisConnection();

      diagnostics.redis = {
        configured: !!process.env.REDIS_URL,
        url: process.env.REDIS_URL
          ? process.env.REDIS_URL.replace(/:[^:]*@/, ':***@')
          : undefined,
        health: redisHealth,
        connections: redisStats,
      };
    }

    // API metrics
    if (includeApi) {
      diagnostics.api = {
        metrics: apiMetrics.getMetrics(),
      };
    }

    // Environment diagnostics
    if (includeEnv) {
      diagnostics.environment_vars = {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_RUNTIME: process.env.NEXT_RUNTIME,
        VERCEL_ENV: process.env.VERCEL_ENV,
        REDIS_URL_SET: !!process.env.REDIS_URL,
        ADMIN_API_KEY_SET: !!process.env.ADMIN_API_KEY,
        SENTRY_DSN_SET: !!process.env.SENTRY_DSN,
      };
    }

    // Dev logger stats
    diagnostics.devLogger = {
      stats: devLogger.getStats(),
    };

    // Pending operations check
    devLogger.logPendingOperations();

    const duration = Date.now() - startTime;

    devLogger.info('Diagnostics complete', {
      operation: 'diagnostics',
      duration,
    });

    return NextResponse.json(
      {
        success: true,
        diagnostics,
        meta: {
          duration: `${duration}ms`,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    devLogger.error('Diagnostics failed', {
      operation: 'diagnostics',
      error,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Format uptime in human-readable format
 */
function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
