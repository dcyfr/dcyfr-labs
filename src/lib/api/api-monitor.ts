/**
 * API Route Monitoring and Debugging Utility
 *
 * Provides comprehensive request/response logging and timing
 * for API routes to help debug slow or hanging endpoints.
 *
 * Features:
 * - Request/response logging with timing
 * - Slow endpoint detection
 * - Request payload logging
 * - Response size monitoring
 * - Error tracking
 * - Development-only operation
 */

import { NextRequest, NextResponse } from 'next/server';
import { devLogger } from '../dev-logger';

const isDev = process.env.NODE_ENV === 'development';

// Thresholds for warnings
const SLOW_REQUEST_THRESHOLD = 1000; // 1 second
const VERY_SLOW_REQUEST_THRESHOLD = 3000; // 3 seconds

interface RequestMetadata {
  method: string;
  url: string;
  pathname: string;
  searchParams: Record<string, string>;
  headers: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

interface ResponseMetadata {
  status: number;
  statusText: string;
  size?: number;
  headers: Record<string, string>;
}

interface ApiMonitorOptions {
  logRequestBody?: boolean;
  logResponseBody?: boolean;
  slowThreshold?: number;
}

/**
 * Extract request metadata for logging
 */
function extractRequestMetadata(request: Request | NextRequest): RequestMetadata {
  const url = new URL(request.url);
  const searchParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    searchParams[key] = value;
  });

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    // Only log non-sensitive headers
    if (!key.toLowerCase().includes('authorization') && !key.toLowerCase().includes('cookie')) {
      headers[key] = value;
    }
  });

  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return {
    method: request.method,
    url: url.toString(),
    pathname: url.pathname,
    searchParams,
    headers,
    ip,
    userAgent: request.headers.get('user-agent') || undefined,
  };
}

/**
 * Extract response metadata for logging
 */
function extractResponseMetadata(response: Response): ResponseMetadata {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const contentLength = response.headers.get('content-length');
  const size = contentLength ? parseInt(contentLength, 10) : undefined;

  return {
    status: response.status,
    statusText: response.statusText,
    size,
    headers,
  };
}

/**
 * Wrapper for API route handlers with monitoring
 */
export function withApiMonitoring<T = unknown>(
  handler: (request: Request) => Promise<Response>,
  routeName: string,
  options: ApiMonitorOptions = {}
): (request: Request) => Promise<Response> {
  if (!isDev) {
    return handler;
  }

  return async (request: Request): Promise<Response> => {
    const operationId = `api:${routeName}:${Date.now()}`;
    const startTime = Date.now();

    // Log request
    const requestMetadata = extractRequestMetadata(request);
    devLogger.api(`→ Request: ${requestMetadata.method} ${requestMetadata.pathname}`, {
      operation: operationId,
      metadata: {
        ...requestMetadata,
        timestamp: new Date().toISOString(),
      },
    });

    // Log request body if enabled
    if (options.logRequestBody && request.body) {
      try {
        const clonedRequest = request.clone();
        const body = await clonedRequest.text();
        if (body) {
          devLogger.debug(`Request body: ${routeName}`, {
            operation: operationId,
            metadata: { body: body.substring(0, 500) }, // Limit body size
          });
        }
      } catch (error) {
        devLogger.warn('Failed to read request body for logging', { error });
      }
    }

    let response: Response;
    try {
      // Execute handler
      response = await handler(request);
    } catch (error) {
      const duration = Date.now() - startTime;

      devLogger.error(`✗ Request failed: ${requestMetadata.method} ${requestMetadata.pathname}`, {
        operation: operationId,
        duration,
        error,
        metadata: requestMetadata as unknown as Record<string, unknown>,
      });

      throw error;
    }

    const duration = Date.now() - startTime;
    const responseMetadata = extractResponseMetadata(response);

    // Determine log level based on response and duration
    const isError = response.status >= 400;
    const isSlow = duration > (options.slowThreshold || SLOW_REQUEST_THRESHOLD);
    const isVerySlow = duration > VERY_SLOW_REQUEST_THRESHOLD;

    const logMessage = `← Response: ${requestMetadata.method} ${requestMetadata.pathname} - ${response.status}`;

    if (isError) {
      devLogger.error(logMessage, {
        operation: operationId,
        duration,
        metadata: {
          request: requestMetadata as unknown as Record<string, unknown>,
          response: responseMetadata as unknown as Record<string, unknown>,
        },
      });
    } else if (isVerySlow) {
      devLogger.warn(`${logMessage} (VERY SLOW!)`, {
        operation: operationId,
        duration,
        metadata: {
          request: requestMetadata as unknown as Record<string, unknown>,
          response: responseMetadata as unknown as Record<string, unknown>,
        },
      });
    } else if (isSlow) {
      devLogger.warn(`${logMessage} (slow)`, {
        operation: operationId,
        duration,
        metadata: {
          request: requestMetadata as unknown as Record<string, unknown>,
          response: responseMetadata as unknown as Record<string, unknown>,
        },
      });
    } else {
      devLogger.api(logMessage, {
        operation: operationId,
        duration,
        metadata: {
          request: { method: requestMetadata.method, pathname: requestMetadata.pathname },
          response: { status: responseMetadata.status, size: responseMetadata.size },
        },
      });
    }

    // Log response body if enabled (only for errors or very slow requests)
    if (options.logResponseBody && (isError || isVerySlow)) {
      try {
        const clonedResponse = response.clone();
        const body = await clonedResponse.text();
        if (body) {
          devLogger.debug(`Response body: ${routeName}`, {
            operation: operationId,
            metadata: { body: body.substring(0, 500) }, // Limit body size
          });
        }
      } catch (error) {
        devLogger.warn('Failed to read response body for logging', { error });
      }
    }

    return response;
  };
}

/**
 * Simple timing wrapper for any async operation
 */
export async function monitorAsync<T>(
  operation: () => Promise<T>,
  operationName: string,
  metadata?: Record<string, unknown>
): Promise<T> {
  if (!isDev) {
    return operation();
  }

  return devLogger.trackAsync(`monitor:${operationName}`, operation, operationName);
}

/**
 * Class to track API metrics
 */
class ApiMetrics {
  private requests: Map<
    string,
    {
      count: number;
      totalDuration: number;
      errors: number;
      slowRequests: number;
    }
  > = new Map();

  recordRequest(
    route: string,
    duration: number,
    isError: boolean,
    isSlow: boolean
  ): void {
    const metrics = this.requests.get(route) || {
      count: 0,
      totalDuration: 0,
      errors: 0,
      slowRequests: 0,
    };

    metrics.count++;
    metrics.totalDuration += duration;
    if (isError) metrics.errors++;
    if (isSlow) metrics.slowRequests++;

    this.requests.set(route, metrics);
  }

  getMetrics(route?: string): Record<string, unknown> {
    if (route) {
      const metrics = this.requests.get(route);
      if (!metrics) return {};

      return {
        route,
        ...metrics,
        avgDuration: Math.round(metrics.totalDuration / metrics.count),
        errorRate: (metrics.errors / metrics.count) * 100,
        slowRate: (metrics.slowRequests / metrics.count) * 100,
      };
    }

    const allMetrics: Record<string, unknown> = {};
    this.requests.forEach((metrics, routeName) => {
      allMetrics[routeName] = {
        ...metrics,
        avgDuration: Math.round(metrics.totalDuration / metrics.count),
        errorRate: (metrics.errors / metrics.count) * 100,
        slowRate: (metrics.slowRequests / metrics.count) * 100,
      };
    });

    return allMetrics;
  }

  clear(): void {
    this.requests.clear();
  }
}

export const apiMetrics = new ApiMetrics();
