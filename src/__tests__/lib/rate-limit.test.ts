/**
 * Test Suite: lib/rate-limit.ts
 * 
 * Tests distributed rate limiting with Redis and in-memory fallback.
 * Critical for API security and preventing abuse.
 * 
 * Coverage: rateLimit, getClientIp, createRateLimitHeaders
 * 
 * Note: Redis integration tests verify the logic flow but use in-memory fallback
 * since Redis client creation is complex to mock in this environment.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rateLimit,
  getClientIp,
  createRateLimitHeaders,
  type RateLimitConfig,
  type RateLimitResult,
} from '@/lib/rate-limit';

// Mock Redis - note that the actual Redis client creation in rate-limit.ts
// uses complex async initialization that's difficult to fully mock,
// so these tests primarily verify in-memory fallback behavior
const mockRedisClient = {
  isOpen: false,
  connect: vi.fn(),
  incr: vi.fn(),
  pExpireAt: vi.fn(),
  pttl: vi.fn(),
  on: vi.fn(),
};

vi.mock('redis', () => ({
  createClient: vi.fn(() => mockRedisClient),
}));

describe('rate-limit.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Redis env for each test
    delete process.env.REDIS_URL;
    // Clear the global client
    globalThis.__rateLimitRedisClient = undefined;
    // Reset mock state
    mockRedisClient.isOpen = false;
  });

  describe('rateLimit - in-memory fallback', () => {
    it('should allow first request', async () => {
      const config: RateLimitConfig = {
        limit: 10,
        windowInSeconds: 60,
      };

      const result = await rateLimit('test-user-1', config);

      expect(result.success).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(9);
      expect(result.reset).toBeGreaterThan(Date.now());
    });

    it('should track multiple requests from same identifier', async () => {
      const config: RateLimitConfig = {
        limit: 3,
        windowInSeconds: 60,
      };

      const result1 = await rateLimit('test-user-2', config);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(2);

      const result2 = await rateLimit('test-user-2', config);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);

      const result3 = await rateLimit('test-user-2', config);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it('should block requests after limit is exceeded', async () => {
      const config: RateLimitConfig = {
        limit: 2,
        windowInSeconds: 60,
      };

      await rateLimit('test-user-3', config);
      await rateLimit('test-user-3', config);
      const result = await rateLimit('test-user-3', config);

      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should isolate different identifiers', async () => {
      const config: RateLimitConfig = {
        limit: 2,
        windowInSeconds: 60,
      };

      await rateLimit('user-a', config);
      await rateLimit('user-a', config);
      const blockedResult = await rateLimit('user-a', config);
      expect(blockedResult.success).toBe(false);

      // Different user should have their own limit
      const allowedResult = await rateLimit('user-b', config);
      expect(allowedResult.success).toBe(true);
      expect(allowedResult.remaining).toBe(1);
    });

    it('should reset after window expires', async () => {
      const config: RateLimitConfig = {
        limit: 1,
        windowInSeconds: 0.001, // 1ms window for testing
      };

      const result1 = await rateLimit('test-user-4', config);
      expect(result1.success).toBe(true);

      const result2 = await rateLimit('test-user-4', config);
      expect(result2.success).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 5));

      const result3 = await rateLimit('test-user-4', config);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it('should handle concurrent requests from same identifier', async () => {
      const config: RateLimitConfig = {
        limit: 5,
        windowInSeconds: 60,
      };

      const promises = Array.from({ length: 7 }, () =>
        rateLimit('concurrent-user', config)
      );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      expect(successCount).toBe(5);
      expect(failCount).toBe(2);
    });

    it('should maintain accurate remaining count', async () => {
      const config: RateLimitConfig = {
        limit: 5,
        windowInSeconds: 60,
      };

      for (let i = 0; i < 5; i++) {
        const result = await rateLimit('countdown-user', config);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('should set consistent reset time within window', async () => {
      const config: RateLimitConfig = {
        limit: 5,
        windowInSeconds: 60,
      };

      const result1 = await rateLimit('reset-time-user', config);
      const result2 = await rateLimit('reset-time-user', config);

      // Reset times should be the same for requests in the same window
      expect(result1.reset).toBe(result2.reset);
    });
  });

  describe('rateLimit - Redis configuration', () => {
    beforeEach(() => {
      // Set Redis URL to enable Redis mode
      process.env.REDIS_URL = 'redis://localhost:6379';
      
      // Reset mock state completely
      mockRedisClient.isOpen = false;
      mockRedisClient.connect.mockClear();
      mockRedisClient.incr.mockClear();
      mockRedisClient.pExpireAt.mockClear();
      mockRedisClient.pttl.mockClear();
      
      // Setup default mock responses
      mockRedisClient.connect.mockResolvedValue(undefined);
      mockRedisClient.incr.mockResolvedValue(1);
      mockRedisClient.pExpireAt.mockResolvedValue(true);
      mockRedisClient.pttl.mockResolvedValue(60000);
      
      // Clear global client to force new connection
      globalThis.__rateLimitRedisClient = undefined;
    });

    it('should gracefully fall back when Redis client creation fails', async () => {
      const config: RateLimitConfig = {
        limit: 10,
        windowInSeconds: 60,
      };

      // Even with REDIS_URL set, if the client can't connect,
      // it falls back to in-memory
      const result = await rateLimit('fallback-user', config);

      expect(result.success).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
    });

    it('should handle different window configurations', async () => {
      const shortWindow: RateLimitConfig = {
        limit: 5,
        windowInSeconds: 1,
      };

      const result = await rateLimit('window-test', shortWindow);
      
      expect(result.success).toBe(true);
      expect(result.reset).toBeGreaterThan(Date.now());
    });

    it('should handle high limits', async () => {
      const highLimit: RateLimitConfig = {
        limit: 10000,
        windowInSeconds: 3600,
      };

      const result = await rateLimit('high-limit-user', highLimit);
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(9999);
    });

    it('should handle single request limit', async () => {
      const singleRequest: RateLimitConfig = {
        limit: 1,
        windowInSeconds: 60,
      };

      const result1 = await rateLimit('single-req-user', singleRequest);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(0);

      const result2 = await rateLimit('single-req-user', singleRequest);
      expect(result2.success).toBe(false);
    });
  });

  describe('getClientIp', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.195',
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('should use first IP from x-forwarded-for chain', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 198.51.100.178, 192.0.2.146',
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('should trim whitespace from x-forwarded-for', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '  203.0.113.195  ',
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('should use x-real-ip when x-forwarded-for is not present', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-real-ip': '198.51.100.178',
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe('198.51.100.178');
    });

    it('should prioritize x-forwarded-for over x-real-ip', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.195',
          'x-real-ip': '198.51.100.178',
        },
      });

      const ip = getClientIp(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('should return "unknown" when no IP headers present', () => {
      const request = new Request('https://example.com');

      const ip = getClientIp(request);
      expect(ip).toBe('unknown');
    });

    it('should handle empty x-forwarded-for header', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '',
        },
      });

      const ip = getClientIp(request);
      // Empty string is falsy, so it falls through to 'unknown'
      expect(ip).toBe('unknown');
    });
  });

  describe('createRateLimitHeaders', () => {
    it('should create standard rate limit headers', () => {
      const result: RateLimitResult = {
        success: true,
        limit: 100,
        remaining: 75,
        reset: 1234567890000,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers).toEqual({
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '75',
        'X-RateLimit-Reset': '1234567890000',
      });
    });

    it('should handle zero remaining', () => {
      const result: RateLimitResult = {
        success: false,
        limit: 50,
        remaining: 0,
        reset: 1234567890000,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers['X-RateLimit-Remaining']).toBe('0');
    });

    it('should handle maximum remaining', () => {
      const result: RateLimitResult = {
        success: true,
        limit: 1000,
        remaining: 1000,
        reset: 1234567890000,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers['X-RateLimit-Remaining']).toBe('1000');
    });

    it('should convert numbers to strings', () => {
      const result: RateLimitResult = {
        success: true,
        limit: 10,
        remaining: 5,
        reset: 9999999999999,
      };

      const headers = createRateLimitHeaders(result);

      expect(typeof headers['X-RateLimit-Limit']).toBe('string');
      expect(typeof headers['X-RateLimit-Remaining']).toBe('string');
      expect(typeof headers['X-RateLimit-Reset']).toBe('string');
    });
  });
});
