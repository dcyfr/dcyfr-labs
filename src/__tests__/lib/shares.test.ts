import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { RedisClientType } from 'redis'

// Mock the redis module
vi.mock('redis', () => ({
  createClient: vi.fn(() => ({
    connect: vi.fn(),
    get: vi.fn(),
    incr: vi.fn(),
    zAdd: vi.fn(),
    zCount: vi.fn(),
    on: vi.fn(),
    isOpen: false,
  })),
}))

describe('Shares Utilities', () => {
  let mockRedisClient: any

  beforeEach(async () => {
    vi.resetModules()
    
    // Setup mock Redis client
    mockRedisClient = {
      connect: vi.fn().mockResolvedValue(undefined),
      get: vi.fn(),
      incr: vi.fn(),
      zAdd: vi.fn(),
      zCount: vi.fn(),
      on: vi.fn(),
      isOpen: false,
    }

    const { createClient } = await import('redis')
    vi.mocked(createClient).mockReturnValue(mockRedisClient as any)

    // Clear global client
    globalThis.__redisClient = undefined
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.REDIS_URL
    globalThis.__redisClient = undefined
  })

  describe('incrementPostShares', () => {
    it('returns null when REDIS_URL is not set', async () => {
      delete process.env.REDIS_URL
      
      const { incrementPostShares } = await import('@/lib/shares')
      const result = await incrementPostShares('test-post-id')
      
      expect(result).toBeNull()
    })

    it('increments share count and returns new value', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.incr.mockResolvedValue(5)
      mockRedisClient.zAdd.mockResolvedValue(1)

      const { incrementPostShares } = await import('@/lib/shares')
      const result = await incrementPostShares('test-post-id')

      expect(result).toBe(5)
      expect(mockRedisClient.incr).toHaveBeenCalledWith('shares:post:test-post-id')
    })

    it('records share in history with timestamp', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.incr.mockResolvedValue(1)
      mockRedisClient.zAdd.mockResolvedValue(1)

      const { incrementPostShares } = await import('@/lib/shares')
      await incrementPostShares('test-post-id')

      expect(mockRedisClient.zAdd).toHaveBeenCalledWith(
        'shares:history:post:test-post-id',
        expect.objectContaining({
          score: expect.any(Number),
          value: expect.any(String),
        })
      )
    })

    it('returns null on Redis error', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.incr.mockRejectedValue(new Error('Redis error'))

      const { incrementPostShares } = await import('@/lib/shares')
      const result = await incrementPostShares('test-post-id')

      expect(result).toBeNull()
    })

    it('handles different post IDs', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.incr.mockResolvedValue(1)
      mockRedisClient.zAdd.mockResolvedValue(1)

      const { incrementPostShares } = await import('@/lib/shares')
      
      await incrementPostShares('post-1')
      expect(mockRedisClient.incr).toHaveBeenCalledWith('shares:post:post-1')

      await incrementPostShares('post-2')
      expect(mockRedisClient.incr).toHaveBeenCalledWith('shares:post:post-2')
    })
  })

  describe('getPostShares', () => {
    it('returns null when REDIS_URL is not set', async () => {
      delete process.env.REDIS_URL

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('test-post-id')

      expect(result).toBeNull()
    })

    it('returns share count for existing post', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue('42')

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('test-post-id')

      expect(result).toBe(42)
      expect(mockRedisClient.get).toHaveBeenCalledWith('shares:post:test-post-id')
    })

    it('returns null for non-existent post', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue(null)

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('non-existent')

      expect(result).toBeNull()
    })

    it('returns null for invalid number values', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue('not-a-number')

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('test-post-id')

      expect(result).toBeNull()
    })

    it('handles zero shares', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue('0')

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('test-post-id')

      expect(result).toBe(0)
    })

    it('returns null on Redis error', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'))

      const { getPostShares } = await import('@/lib/shares')
      const result = await getPostShares('test-post-id')

      expect(result).toBeNull()
    })
  })

  describe('getPostShares24h', () => {
    it('returns null when REDIS_URL is not set', async () => {
      delete process.env.REDIS_URL

      const { getPostShares24h } = await import('@/lib/shares')
      const result = await getPostShares24h('test-post-id')

      expect(result).toBeNull()
    })

    it('returns share count for last 24 hours', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.zCount.mockResolvedValue(15)

      const { getPostShares24h } = await import('@/lib/shares')
      const result = await getPostShares24h('test-post-id')

      expect(result).toBe(15)
    })

    it('queries correct time range', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.zCount.mockResolvedValue(10)

      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)

      const { getPostShares24h } = await import('@/lib/shares')
      await getPostShares24h('test-post-id')

      const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000

      expect(mockRedisClient.zCount).toHaveBeenCalledWith(
        'shares:history:post:test-post-id',
        twentyFourHoursAgo,
        now
      )
    })

    it('returns 0 for posts with no recent shares', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.zCount.mockResolvedValue(0)

      const { getPostShares24h } = await import('@/lib/shares')
      const result = await getPostShares24h('test-post-id')

      expect(result).toBe(0)
    })

    it('returns null on Redis error', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.zCount.mockRejectedValue(new Error('Redis error'))

      const { getPostShares24h } = await import('@/lib/shares')
      const result = await getPostShares24h('test-post-id')

      expect(result).toBeNull()
    })
  })

  describe('Redis Client Management', () => {
    it('reuses existing Redis client', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue('1')

      const { getPostShares } = await import('@/lib/shares')
      
      await getPostShares('post-1')
      await getPostShares('post-2')

      const { createClient } = await import('redis')
      expect(createClient).toHaveBeenCalledTimes(1)
    })

    it('connects to Redis if not already open', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.isOpen = false
      mockRedisClient.get.mockResolvedValue('1')

      const { getPostShares } = await import('@/lib/shares')
      await getPostShares('test-post-id')

      expect(mockRedisClient.connect).toHaveBeenCalled()
    })

    it('does not reconnect if already open', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.isOpen = true
      mockRedisClient.get.mockResolvedValue('1')

      const { getPostShares } = await import('@/lib/shares')
      await getPostShares('test-post-id')

      expect(mockRedisClient.connect).not.toHaveBeenCalled()
    })
  })

  describe('Key Formatting', () => {
    it('uses correct key prefix for share counts', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.get.mockResolvedValue('1')

      const { getPostShares } = await import('@/lib/shares')
      await getPostShares('my-post-id')

      expect(mockRedisClient.get).toHaveBeenCalledWith('shares:post:my-post-id')
    })

    it('uses correct key prefix for share history', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      mockRedisClient.zCount.mockResolvedValue(1)

      const { getPostShares24h } = await import('@/lib/shares')
      await getPostShares24h('my-post-id')

      expect(mockRedisClient.zCount).toHaveBeenCalledWith(
        'shares:history:post:my-post-id',
        expect.any(Number),
        expect.any(Number)
      )
    })
  })
})
