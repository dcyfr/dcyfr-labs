import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Force isDev = true by setting NODE_ENV before module loads
// ---------------------------------------------------------------------------
const { mockDevLogger } = vi.hoisted(() => {
  process.env.NODE_ENV = 'development';

  const mockDevLogger = {
    api: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    trackAsync: vi.fn((_id: string, fn: () => Promise<unknown>) => fn()),
  };
  return { mockDevLogger };
});

vi.mock('@/lib/dev-logger', () => ({
  devLogger: mockDevLogger,
}));

// Unmock so the real code runs (with isDev = true)
vi.unmock('@/lib/api/api-monitor');

import { withApiMonitoring, monitorAsync } from '@/lib/api/api-monitor';

describe('api-monitor (dev mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withApiMonitoring', () => {
    it('wraps handler with logging in dev mode', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
      const wrapped = withApiMonitoring(handler, 'test-route');

      // In dev mode, the handler should be wrapped (not returned as-is)
      expect(wrapped).not.toBe(handler);

      const req = new Request('https://test.com/api/test?q=1');
      const resp = await wrapped(req);

      expect(resp.status).toBe(200);
      expect(handler).toHaveBeenCalledWith(req);
      // Should have logged request and response
      expect(mockDevLogger.api).toHaveBeenCalled();
    });

    it('logs slow requests as warnings', async () => {
      const handler = vi.fn().mockImplementation(async () => {
        // Simulate slow — we mock Date.now to control timing
        return new Response('ok', { status: 200 });
      });

      // Override Date.now to simulate a slow request
      const origDateNow = Date.now;
      let callCount = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => {
        callCount++;
        // First 2 calls = operationId + startTime; subsequent = end time
        return callCount <= 2 ? 1000 : 3000;
      });

      const wrapped = withApiMonitoring(handler, 'slow-route');
      const req = new Request('https://test.com/api/slow');
      await wrapped(req);

      // Should log with warn for slow requests
      expect(mockDevLogger.warn).toHaveBeenCalled();
      Date.now = origDateNow;
    });

    it('logs very slow requests with VERY SLOW marker', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok'));

      let callCount = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => {
        callCount++;
        return callCount <= 2 ? 1000 : 5000; // 4 seconds → very slow
      });

      const wrapped = withApiMonitoring(handler, 'very-slow-route');
      await wrapped(new Request('https://test.com/api/very-slow'));

      const warnCalls = mockDevLogger.warn.mock.calls;
      expect(warnCalls.some((c: unknown[]) => String(c[0]).includes('VERY SLOW'))).toBe(true);
    });

    it('logs errors for 4xx/5xx responses', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('not found', { status: 404 }));
      const wrapped = withApiMonitoring(handler, 'error-route');

      await wrapped(new Request('https://test.com/api/missing'));

      expect(mockDevLogger.error).toHaveBeenCalled();
    });

    it('logs and rethrows handler exceptions', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('boom'));
      const wrapped = withApiMonitoring(handler, 'crash-route');

      await expect(wrapped(new Request('https://test.com/api/crash'))).rejects.toThrow('boom');
      expect(mockDevLogger.error).toHaveBeenCalled();
    });

    it('logs request body when logRequestBody is enabled', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok'));
      const wrapped = withApiMonitoring(handler, 'body-route', { logRequestBody: true });

      const req = new Request('https://test.com/api/body', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
      });
      await wrapped(req);

      expect(mockDevLogger.debug).toHaveBeenCalled();
    });

    it('logs response body on error when logResponseBody is enabled', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('error body', { status: 500 }));
      const wrapped = withApiMonitoring(handler, 'resp-body-route', { logResponseBody: true });

      await wrapped(new Request('https://test.com/api/resp-body'));

      // Should log response body for error responses
      expect(mockDevLogger.debug).toHaveBeenCalled();
    });

    it('uses custom slowThreshold', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok'));

      let callCount = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => {
        callCount++;
        return callCount <= 2 ? 1000 : 1600; // 600ms with 500ms threshold → slow
      });

      const wrapped = withApiMonitoring(handler, 'custom-thresh', { slowThreshold: 500 });
      await wrapped(new Request('https://test.com/api/custom'));

      expect(mockDevLogger.warn).toHaveBeenCalled();
    });
  });

  describe('monitorAsync', () => {
    it('tracks async operation in dev mode', async () => {
      const result = await monitorAsync(async () => 'hello', 'test-op');
      expect(result).toBe('hello');
      expect(mockDevLogger.trackAsync).toHaveBeenCalled();
    });

    it('passes metadata through', async () => {
      await monitorAsync(async () => 42, 'meta-op', { key: 'val' });
      expect(mockDevLogger.trackAsync).toHaveBeenCalled();
    });
  });
});
