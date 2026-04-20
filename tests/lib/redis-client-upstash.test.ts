import { describe, expect, it, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock @upstash/redis BEFORE the module loads.
// vi.hoisted() runs before any mocks or imports so we can also set env vars.
// ---------------------------------------------------------------------------
const { mockUpstashInstance, mockPipeline } = vi.hoisted(() => {
  // Must set env vars before redis-client module evaluates
  process.env.UPSTASH_REDIS_REST_URL = 'https://fake.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';

  const mockPipeline: Record<string, ReturnType<typeof vi.fn>> = {
    get: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    setex: vi.fn().mockReturnThis(),
    del: vi.fn().mockReturnThis(),
    exists: vi.fn().mockReturnThis(),
    incr: vi.fn().mockReturnThis(),
    decr: vi.fn().mockReturnThis(),
    expire: vi.fn().mockReturnThis(),
    ttl: vi.fn().mockReturnThis(),
    pttl: vi.fn().mockReturnThis(),
    mget: vi.fn().mockReturnThis(),
    zadd: vi.fn().mockReturnThis(),
    zcount: vi.fn().mockReturnThis(),
    zremrangebyscore: vi.fn().mockReturnThis(),
    zrange: vi.fn().mockReturnThis(),
    zscore: vi.fn().mockReturnThis(),
    zrem: vi.fn().mockReturnThis(),
    lpush: vi.fn().mockReturnThis(),
    rpush: vi.fn().mockReturnThis(),
    lrange: vi.fn().mockReturnThis(),
    ltrim: vi.fn().mockReturnThis(),
    hget: vi.fn().mockReturnThis(),
    hgetall: vi.fn().mockReturnThis(),
    hset: vi.fn().mockReturnThis(),
    hdel: vi.fn().mockReturnThis(),
    hexists: vi.fn().mockReturnThis(),
    hincrby: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(['r1', 'r2']),
  };

  const mockUpstashInstance = {
    get: vi.fn().mockResolvedValue('value'),
    set: vi.fn().mockResolvedValue('OK'),
    setex: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    exists: vi.fn().mockResolvedValue(1),
    incr: vi.fn().mockResolvedValue(5),
    decr: vi.fn().mockResolvedValue(-1),
    expire: vi.fn().mockResolvedValue(1),
    ttl: vi.fn().mockResolvedValue(100),
    pttl: vi.fn().mockResolvedValue(100_000),
    pexpireat: vi.fn().mockResolvedValue(1),
    keys: vi.fn().mockResolvedValue(['k1', 'k2']),
    mget: vi.fn().mockResolvedValue(['v1', 'v2']),
    zadd: vi.fn().mockResolvedValue(1),
    zcount: vi.fn().mockResolvedValue(5),
    zremrangebyscore: vi.fn().mockResolvedValue(3),
    zrange: vi.fn().mockResolvedValue(['a', 'b']),
    zscore: vi.fn().mockResolvedValue(42),
    zrem: vi.fn().mockResolvedValue(1),
    lpush: vi.fn().mockResolvedValue(2),
    rpush: vi.fn().mockResolvedValue(3),
    lrange: vi.fn().mockResolvedValue(['i1', 'i2']),
    ltrim: vi.fn().mockResolvedValue('OK'),
    hget: vi.fn().mockResolvedValue('fval'),
    hgetall: vi.fn().mockResolvedValue({ f: 'v' }),
    hset: vi.fn().mockResolvedValue(1),
    hdel: vi.fn().mockResolvedValue(1),
    hexists: vi.fn().mockResolvedValue(1),
    hincrby: vi.fn().mockResolvedValue(5),
    sadd: vi.fn().mockResolvedValue(1),
    srem: vi.fn().mockResolvedValue(1),
    smembers: vi.fn().mockResolvedValue(['m1', 'm2']),
    sismember: vi.fn().mockResolvedValue(1),
    scard: vi.fn().mockResolvedValue(3),
    scan: vi.fn().mockResolvedValue([0, ['k1']]),
    ping: vi.fn().mockResolvedValue('PONG'),
    pipeline: vi.fn().mockReturnValue(mockPipeline),
  };

  return { mockUpstashInstance, mockPipeline };
});

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(function () {
    return mockUpstashInstance;
  }),
}));

// Unmock so the real redis-client code runs (with Upstash credentials set)
vi.unmock('@/lib/redis-client');

import { redis, closeRedis } from '@/lib/redis-client';

// ---------------------------------------------------------------------------
// Tests for the Upstash compat-client path (buildCompatClient)
// ---------------------------------------------------------------------------
describe('redis-client (Upstash compat client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen and isReady are true', () => {
    expect(redis.isOpen).toBe(true);
    expect(redis.isReady).toBe(true);
  });

  // -- String operations --------------------------------------------------

  it('get delegates to upstash.get', async () => {
    expect(await redis.get('mykey')).toBe('value');
    expect(mockUpstashInstance.get).toHaveBeenCalledWith('mykey');
  });

  it('set delegates to upstash.set (no opts)', async () => {
    expect(await redis.set('k', 'v')).toBe('OK');
    expect(mockUpstashInstance.set).toHaveBeenCalledWith('k', 'v');
  });

  it('set with ex option', async () => {
    await redis.set('k', 'v', { ex: 60 });
    expect(mockUpstashInstance.set).toHaveBeenCalledWith('k', 'v', { ex: 60 });
  });

  it('set with px option', async () => {
    await redis.set('k', 'v', { px: 5000 });
    expect(mockUpstashInstance.set).toHaveBeenCalledWith('k', 'v', { px: 5000 });
  });

  it('setEx delegates to upstash.setex', async () => {
    expect(await redis.setEx('k', 60, 'v')).toBe('OK');
    expect(mockUpstashInstance.setex).toHaveBeenCalledWith('k', 60, 'v');
  });

  it('del delegates', async () => {
    expect(await redis.del('k1', 'k2')).toBe(1);
    expect(mockUpstashInstance.del).toHaveBeenCalledWith('k1', 'k2');
  });

  it('exists delegates', async () => {
    expect(await redis.exists('k')).toBe(1);
    expect(mockUpstashInstance.exists).toHaveBeenCalledWith('k');
  });

  it('incr delegates', async () => {
    expect(await redis.incr('counter')).toBe(5);
    expect(mockUpstashInstance.incr).toHaveBeenCalledWith('counter');
  });

  it('decr delegates', async () => {
    expect(await redis.decr('counter')).toBe(-1);
  });

  it('expire converts return to boolean', async () => {
    expect(await redis.expire('k', 120)).toBe(true);
    mockUpstashInstance.expire.mockResolvedValueOnce(0);
    expect(await redis.expire('k', 120)).toBe(false);
  });

  it('ttl delegates', async () => {
    expect(await redis.ttl('k')).toBe(100);
  });

  it('pTTL delegates', async () => {
    expect(await redis.pTTL('k')).toBe(100_000);
  });

  it('pExpireAt converts return to boolean', async () => {
    expect(await redis.pExpireAt('k', Date.now())).toBe(true);
    mockUpstashInstance.pexpireat.mockResolvedValueOnce(0);
    expect(await redis.pExpireAt('k', Date.now())).toBe(false);
  });

  it('keys delegates', async () => {
    expect(await redis.keys('*')).toEqual(['k1', 'k2']);
  });

  it('mGet delegates', async () => {
    expect(await redis.mGet('a', 'b')).toEqual(['v1', 'v2']);
  });

  it('ping delegates', async () => {
    expect(await redis.ping()).toBe('PONG');
  });

  // -- Hash operations ----------------------------------------------------

  it('hGet delegates', async () => {
    expect(await redis.hGet('h', 'f')).toBe('fval');
    expect(mockUpstashInstance.hget).toHaveBeenCalledWith('h', 'f');
  });

  it('hGetAll delegates', async () => {
    expect(await redis.hGetAll('h')).toEqual({ f: 'v' });
  });

  it('hSet delegates with field+value → hset({field:value})', async () => {
    await redis.hSet('h', 'f', 'v');
    expect(mockUpstashInstance.hset).toHaveBeenCalledWith('h', { f: 'v' });
  });

  it('hDel delegates', async () => {
    expect(await redis.hDel('h', 'f1', 'f2')).toBe(1);
  });

  it('hExists converts return to boolean', async () => {
    expect(await redis.hExists('h', 'f')).toBe(true);
    mockUpstashInstance.hexists.mockResolvedValueOnce(0);
    expect(await redis.hExists('h', 'f')).toBe(false);
  });

  it('hIncrBy delegates', async () => {
    expect(await redis.hIncrBy('h', 'f', 3)).toBe(5);
  });

  // -- Set operations -----------------------------------------------------

  it('sAdd delegates', async () => {
    expect(await redis.sAdd('s', 'a', 'b')).toBe(1);
    expect(mockUpstashInstance.sadd).toHaveBeenCalledWith('s', 'a', 'b');
  });

  it('sRem delegates', async () => {
    expect(await redis.sRem('s', 'a')).toBe(1);
  });

  it('sMembers delegates', async () => {
    expect(await redis.sMembers('s')).toEqual(['m1', 'm2']);
  });

  it('sIsMember converts return to boolean', async () => {
    expect(await redis.sIsMember('s', 'a')).toBe(true);
    mockUpstashInstance.sismember.mockResolvedValueOnce(0);
    expect(await redis.sIsMember('s', 'a')).toBe(false);
  });

  it('sCard delegates', async () => {
    expect(await redis.sCard('s')).toBe(3);
  });

  // -- Sorted-set operations -----------------------------------------------

  it('zAdd delegates', async () => {
    expect(await redis.zAdd('z', { score: 1, value: 'a' })).toBe(1);
    expect(mockUpstashInstance.zadd).toHaveBeenCalledWith('z', { score: 1, member: 'a' });
  });

  it('zCount delegates', async () => {
    expect(await redis.zCount('z', 0, 100)).toBe(5);
  });

  it('zRemRangeByScore delegates', async () => {
    expect(await redis.zRemRangeByScore('z', '-inf', '+inf')).toBe(3);
  });

  it('zRange delegates', async () => {
    expect(await redis.zRange('z', 0, -1)).toEqual(['a', 'b']);
  });

  it('zRangeByScore delegates with byScore option', async () => {
    await redis.zRangeByScore('z', 0, 100);
    expect(mockUpstashInstance.zrange).toHaveBeenCalledWith('z', 0, 100, { byScore: true });
  });

  it('zScore delegates', async () => {
    expect(await redis.zScore('z', 'a')).toBe(42);
  });

  it('zRem delegates', async () => {
    expect(await redis.zRem('z', 'a', 'b')).toBe(1);
  });

  // -- List operations ----------------------------------------------------

  it('lPush delegates', async () => {
    expect(await redis.lPush('l', 'v1', 'v2')).toBe(2);
  });

  it('rPush delegates', async () => {
    expect(await redis.rPush('l', 'v1')).toBe(3);
  });

  it('lRange delegates', async () => {
    expect(await redis.lRange('l', 0, -1)).toEqual(['i1', 'i2']);
  });

  it('lTrim delegates', async () => {
    expect(await redis.lTrim('l', 0, 99)).toBe('OK');
  });

  // -- Scan ---------------------------------------------------------------

  it('scan delegates with options', async () => {
    const result = await redis.scan(0, { MATCH: 'prefix:*', COUNT: 100 });
    expect(result).toEqual({ cursor: 0, keys: ['k1'] });
    expect(mockUpstashInstance.scan).toHaveBeenCalledWith(0, { match: 'prefix:*', count: 100 });
  });

  it('scan works with string cursor', async () => {
    await redis.scan('5');
    expect(mockUpstashInstance.scan).toHaveBeenCalledWith(5, {
      match: undefined,
      count: undefined,
    });
  });

  // -- Pipeline (multi) ---------------------------------------------------

  describe('multi (pipeline compat)', () => {
    it('returns chainable pipeline', () => {
      const p = redis.multi();
      const result = p.get('a').set('b', 'v').del('c');
      expect(result).toBe(p);
    });

    it('setEx delegates to pipeline.setex', () => {
      const p = redis.multi();
      p.setEx('k', 60, 'v');
      expect(mockPipeline.setex).toHaveBeenCalledWith('k', 60, 'v');
    });

    it('exists delegates', () => {
      redis.multi().exists('k');
      expect(mockPipeline.exists).toHaveBeenCalledWith('k');
    });

    it('incr/decr delegate', () => {
      const p = redis.multi();
      p.incr('c').decr('c');
      expect(mockPipeline.incr).toHaveBeenCalledWith('c');
      expect(mockPipeline.decr).toHaveBeenCalledWith('c');
    });

    it('expire/ttl/pTTL delegate', () => {
      const p = redis.multi();
      p.expire('k', 60).ttl('k').pTTL('k');
      expect(mockPipeline.expire).toHaveBeenCalledWith('k', 60);
      expect(mockPipeline.ttl).toHaveBeenCalledWith('k');
      expect(mockPipeline.pttl).toHaveBeenCalledWith('k');
    });

    it('mGet delegates', () => {
      redis.multi().mGet('a', 'b');
      expect(mockPipeline.mget).toHaveBeenCalledWith('a', 'b');
    });

    it('sorted-set ops delegate', () => {
      const p = redis.multi();
      p.zAdd('z', { score: 1, value: 'x' });
      expect(mockPipeline.zadd).toHaveBeenCalledWith('z', { score: 1, member: 'x' });
      p.zCount('z', 0, 10);
      p.zRemRangeByScore('z', 0, 5);
      p.zRange('z', 0, -1);
      p.zRangeByScore('z', 0, 100);
      p.zScore('z', 'x');
      p.zRem('z', 'x');
    });

    it('list ops delegate', () => {
      const p = redis.multi();
      p.lPush('l', 'v').rPush('l', 'v').lRange('l', 0, -1).lTrim('l', 0, 99);
      expect(mockPipeline.lpush).toHaveBeenCalled();
      expect(mockPipeline.rpush).toHaveBeenCalled();
      expect(mockPipeline.lrange).toHaveBeenCalled();
      expect(mockPipeline.ltrim).toHaveBeenCalled();
    });

    it('hash ops delegate', () => {
      const p = redis.multi();
      p.hGet('h', 'f')
        .hGetAll('h')
        .hSet('h', 'f', 'v')
        .hDel('h', 'f')
        .hExists('h', 'f')
        .hIncrBy('h', 'f', 1);
      expect(mockPipeline.hget).toHaveBeenCalled();
      expect(mockPipeline.hgetall).toHaveBeenCalled();
      expect(mockPipeline.hset).toHaveBeenCalledWith('h', { f: 'v' });
      expect(mockPipeline.hdel).toHaveBeenCalled();
      expect(mockPipeline.hexists).toHaveBeenCalled();
      expect(mockPipeline.hincrby).toHaveBeenCalled();
    });

    it('exec returns pipeline results', async () => {
      const p = redis.multi();
      p.get('a');
      expect(await p.exec()).toEqual(['r1', 'r2']);
    });
  });

  // -- Connection lifecycle ------------------------------------------------

  it('quit resolves (no-op for HTTP)', async () => {
    await expect(redis.quit()).resolves.toBeUndefined();
  });

  it('disconnect resolves', async () => {
    await expect(redis.disconnect()).resolves.toBeUndefined();
  });

  it('on returns client for chaining', () => {
    expect(redis.on('error', () => {})).toBe(redis);
  });

  it('closeRedis is a no-op', async () => {
    await expect(closeRedis()).resolves.toBeUndefined();
  });
});
