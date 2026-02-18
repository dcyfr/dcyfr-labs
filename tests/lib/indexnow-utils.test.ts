import { describe, expect, it, vi } from 'vitest';
import {
  buildIndexNowPayloads,
  buildKeyLocation,
  isInngestBranchEnvironmentIssue,
  isUuidV4,
  normalizeValidUrls,
  validateSameDomain,
} from '@/lib/indexnow/indexnow';
import { checkRateLimit, getClientIp } from '@/lib/indexnow/rate-limit';

describe('IndexNow utility helpers', () => {
  describe('isUuidV4', () => {
    it('returns true for valid v4 uuid', () => {
      expect(isUuidV4('00000000-0000-4000-8000-000000000000')).toBe(true);
    });

    it('returns false for invalid uuid format', () => {
      expect(isUuidV4('not-a-uuid')).toBe(false);
      expect(isUuidV4('e53b0a2c-74fb-1987-b6d1-add3616156c9')).toBe(false);
    });
  });

  describe('normalizeValidUrls', () => {
    it('normalizes valid urls and separates invalid urls', () => {
      const { validUrls, invalidUrls } = normalizeValidUrls([
        'https://www.dcyfr.ai/blog/post#section',
        'not-a-url',
      ]);

      expect(validUrls).toEqual(['https://www.dcyfr.ai/blog/post']);
      expect(invalidUrls).toEqual(['not-a-url']);
    });
  });

  describe('buildKeyLocation', () => {
    it('uses explicit keyLocation when provided', () => {
      expect(
        buildKeyLocation(
          'https://www.dcyfr.ai',
          '00000000-0000-4000-8000-000000000000',
          'https://custom.example.com/key.txt'
        )
      ).toBe('https://custom.example.com/key.txt');
    });

    it('builds keyLocation from site url and key', () => {
      expect(
        buildKeyLocation(
          'https://www.dcyfr.ai/',
          '00000000-0000-4000-8000-000000000000'
        )
      ).toBe('https://www.dcyfr.ai/00000000-0000-4000-8000-000000000000.txt');
    });
  });

  describe('validateSameDomain', () => {
    it('passes when siteUrl is missing', () => {
      expect(validateSameDomain(['https://example.com/a'])).toEqual({ isValid: true });
    });

    it('passes when urls match site domain', () => {
      const result = validateSameDomain(
        ['https://www.dcyfr.ai/blog/post'],
        'https://www.dcyfr.ai'
      );

      expect(result.isValid).toBe(true);
      expect(result.allowedDomain).toBe('www.dcyfr.ai');
    });

    it('fails when a url does not match site domain', () => {
      const result = validateSameDomain(
        ['https://malicious.example.com/attack'],
        'https://www.dcyfr.ai'
      );

      expect(result.isValid).toBe(false);
      expect(result.invalidUrl).toBe('https://malicious.example.com/attack');
      expect(result.allowedDomain).toBe('www.dcyfr.ai');
    });
  });

  describe('buildIndexNowPayloads', () => {
    it('creates a single payload when under max url limit', () => {
      const payloads = buildIndexNowPayloads(
        ['https://www.dcyfr.ai/blog/a', 'https://www.dcyfr.ai/blog/b'],
        '00000000-0000-4000-8000-000000000000',
        'https://www.dcyfr.ai/00000000-0000-4000-8000-000000000000.txt'
      );

      expect(payloads).toHaveLength(1);
      expect(payloads[0]).toEqual({
        host: 'www.dcyfr.ai',
        key: '00000000-0000-4000-8000-000000000000',
        keyLocation: 'https://www.dcyfr.ai/00000000-0000-4000-8000-000000000000.txt',
        urlList: ['https://www.dcyfr.ai/blog/a', 'https://www.dcyfr.ai/blog/b'],
      });
    });

    it('batches payloads when valid urls exceed max per request', () => {
      const urls = [
        'https://www.dcyfr.ai/p/1',
        'https://www.dcyfr.ai/p/2',
        'https://www.dcyfr.ai/p/3',
        'https://www.dcyfr.ai/p/4',
        'https://www.dcyfr.ai/p/5',
      ];

      const payloads = buildIndexNowPayloads(
        urls,
        '00000000-0000-4000-8000-000000000000',
        'https://www.dcyfr.ai/00000000-0000-4000-8000-000000000000.txt',
        2,
        3
      );

      expect(payloads).toHaveLength(3);
      expect(payloads.map(payload => payload.urlList.length)).toEqual([2, 2, 1]);
    });
  });

  describe('isInngestBranchEnvironmentIssue', () => {
    it('detects known branch environment errors', () => {
      expect(isInngestBranchEnvironmentIssue('Branch environment name is required')).toBe(true);
      expect(isInngestBranchEnvironmentIssue('Branch environment does not exist')).toBe(true);
      expect(isInngestBranchEnvironmentIssue('Something else failed')).toBe(false);
    });
  });
});

describe('IndexNow submit rate limiter', () => {
  it('allows requests up to the limit and blocks requests above it', () => {
    const key = `rl-${Date.now()}-${Math.random()}`;

    const first = checkRateLimit(key, 2, 60_000);
    const second = checkRateLimit(key, 2, 60_000);
    const third = checkRateLimit(key, 2, 60_000);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('resets counters after the time window expires', () => {
    vi.useFakeTimers();

    try {
      const key = 'window-reset-key';
      vi.setSystemTime(new Date('2026-02-18T00:00:00.000Z'));

      const first = checkRateLimit(key, 1, 1_000);
      const blocked = checkRateLimit(key, 1, 1_000);

      expect(first.allowed).toBe(true);
      expect(blocked.allowed).toBe(false);

      vi.advanceTimersByTime(1_100);

      const afterReset = checkRateLimit(key, 1, 1_000);
      expect(afterReset.allowed).toBe(true);
      expect(afterReset.remaining).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('extracts client ip from forwarding headers', () => {
    const headers = new Headers({
      'x-forwarded-for': '10.0.0.1, 10.0.0.2',
      'x-real-ip': '127.0.0.1',
    });

    expect(getClientIp(headers)).toBe('10.0.0.1');
  });

  it('falls back to x-real-ip and then unknown', () => {
    expect(getClientIp(new Headers({ 'x-real-ip': '127.0.0.1' }))).toBe('127.0.0.1');
    expect(getClientIp(new Headers())).toBe('unknown');
  });
});