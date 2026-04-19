import { describe, expect, it, vi } from 'vitest';

// The global setup (vitest.setup.ts) mocks @/lib/redis-client.
// Unmock it so we test the real module.
vi.unmock('@/lib/redis-client');

import { redis, closeRedis, getRedisEnvironment, getRedisKeyPrefix } from '@/lib/redis-client';

// ---------------------------------------------------------------------------
// In test env, UPSTASH_REDIS_REST_URL/TOKEN are not set, so `redis`
// is the stub client. This exercises createStubClient + env helpers.
// ---------------------------------------------------------------------------

describe('redis-client', () => {
  // -----------------------------------------------------------------------
  // Environment helpers
  // -----------------------------------------------------------------------

  describe('getRedisEnvironment', () => {
    it('returns "test" in test environment', () => {
      expect(getRedisEnvironment()).toBe('test');
    });
  });

  describe('getRedisKeyPrefix', () => {
    it('returns test prefix in test env', () => {
      expect(getRedisKeyPrefix()).toBe('dcyfr:test:');
    });
  });

  // -----------------------------------------------------------------------
  // Stub client (no credentials in test env)
  // -----------------------------------------------------------------------

  describe('stub client', () => {
    it('is not open or ready', () => {
      expect(redis.isOpen).toBe(false);
      expect(redis.isReady).toBe(false);
    });

    it('get returns null', async () => {
      expect(await redis.get('key')).toBeNull();
    });

    it('set returns OK', async () => {
      expect(await redis.set('key', 'value')).toBe('OK');
    });

    it('setEx returns OK', async () => {
      expect(await redis.setEx('key', 100, 'value')).toBe('OK');
    });

    it('del returns 0', async () => {
      expect(await redis.del('key')).toBe(0);
    });

    it('exists returns 0', async () => {
      expect(await redis.exists('key')).toBe(0);
    });

    it('incr returns 1', async () => {
      expect(await redis.incr('key')).toBe(1);
    });

    it('decr returns -1', async () => {
      expect(await redis.decr('key')).toBe(-1);
    });

    it('expire returns false', async () => {
      expect(await redis.expire('key', 100)).toBe(false);
    });

    it('ttl returns -2', async () => {
      expect(await redis.ttl('key')).toBe(-2);
    });

    it('pTTL returns -2', async () => {
      expect(await redis.pTTL('key')).toBe(-2);
    });

    it('pExpireAt returns false', async () => {
      expect(await redis.pExpireAt('key', Date.now())).toBe(false);
    });

    it('keys returns empty array', async () => {
      expect(await redis.keys('*')).toEqual([]);
    });

    it('mGet returns empty array', async () => {
      expect(await redis.mGet('a', 'b')).toEqual([]);
    });

    it('ping returns PONG', async () => {
      expect(await redis.ping()).toBe('PONG');
    });

    // Hash operations
    it('hGet returns null', async () => {
      expect(await redis.hGet('key', 'field')).toBeNull();
    });

    it('hGetAll returns empty object', async () => {
      expect(await redis.hGetAll('key')).toEqual({});
    });

    it('hSet returns 0', async () => {
      expect(await redis.hSet('key', 'field', 'value')).toBe(0);
    });

    it('hDel returns 0', async () => {
      expect(await redis.hDel('key', 'field')).toBe(0);
    });

    it('hExists returns false', async () => {
      expect(await redis.hExists('key', 'field')).toBe(false);
    });

    it('hIncrBy returns 0', async () => {
      expect(await redis.hIncrBy('key', 'field', 1)).toBe(0);
    });

    // List operations
    it('lPush returns 0', async () => {
      expect(await redis.lPush('key', 'val')).toBe(0);
    });

    it('rPush returns 0', async () => {
      expect(await redis.rPush('key', 'val')).toBe(0);
    });

    it('lRange returns empty array', async () => {
      expect(await redis.lRange('key', 0, -1)).toEqual([]);
    });

    it('lTrim returns OK', async () => {
      expect(await redis.lTrim('key', 0, -1)).toBe('OK');
    });

    // Set operations
    it('sAdd returns 0', async () => {
      expect(await redis.sAdd('key', 'member')).toBe(0);
    });

    it('sRem returns 0', async () => {
      expect(await redis.sRem('key', 'member')).toBe(0);
    });

    it('sMembers returns empty array', async () => {
      expect(await redis.sMembers('key')).toEqual([]);
    });

    it('sIsMember returns false', async () => {
      expect(await redis.sIsMember('key', 'member')).toBe(false);
    });

    it('sCard returns 0', async () => {
      expect(await redis.sCard('key')).toBe(0);
    });

    // Sorted set operations
    it('zAdd returns 0', async () => {
      expect(await redis.zAdd('key', { score: 1, value: 'a' })).toBe(0);
    });

    it('zCount returns 0', async () => {
      expect(await redis.zCount('key', 0, 100)).toBe(0);
    });

    it('zRemRangeByScore returns 0', async () => {
      expect(await redis.zRemRangeByScore('key', 0, 100)).toBe(0);
    });

    it('zRange returns empty array', async () => {
      expect(await redis.zRange('key', 0, -1)).toEqual([]);
    });

    it('zScore returns null', async () => {
      expect(await redis.zScore('key', 'a')).toBeNull();
    });

    it('zRem returns 0', async () => {
      expect(await redis.zRem('key', 'a')).toBe(0);
    });

    // Scan
    it('scan returns empty cursor/keys', async () => {
      const result = await redis.scan(0);
      expect(result).toEqual({ cursor: 0, keys: [] });
    });

    // Pipeline / multi
    it('multi returns noop pipeline', async () => {
      const pipeline = redis.multi();
      const result = pipeline.get('a').set('b', 'c').del('d');
      expect(result).toBe(pipeline);
      expect(await pipeline.exec()).toEqual([]);
    });

    // Connection lifecycle no-ops
    it('quit resolves', async () => {
      await expect(redis.quit()).resolves.toBeUndefined();
    });

    it('disconnect resolves', async () => {
      await expect(redis.disconnect()).resolves.toBeUndefined();
    });

    it('on() returns client for chaining', () => {
      const result = redis.on('error', () => {});
      expect(result).toBe(redis);
    });
  });

  // -----------------------------------------------------------------------
  // closeRedis
  // -----------------------------------------------------------------------

  describe('closeRedis', () => {
    it('is a no-op that resolves', async () => {
      await expect(closeRedis()).resolves.toBeUndefined();
    });
  });
});
