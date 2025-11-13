import { describe, it, expect } from 'vitest'
import { buildRedirectMap, getCanonicalSlug, getPostByAnySlug } from '@/lib/blog'
import type { Post } from '@/data/posts'

/**
 * Unit tests for blog utility functions
 * 
 * Note: getAllPosts() and getPostBySlug() are file system dependent and
 * are better tested with integration tests or E2E tests.
 * Here we test the pure functions that don't depend on file system.
 */

describe('blog utilities', () => {
  // Mock posts for testing redirect and slug resolution functions
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      slug: 'current-slug',
      title: 'Test Post',
      summary: 'Test summary',
      publishedAt: '2025-01-01',
      tags: ['test'],
      body: 'Content',
      previousSlugs: ['old-slug-1', 'old-slug-2'],
      readingTime: { words: 100, minutes: 1, text: '1 min read' },
    },
    {
      id: 'post-2',
      slug: 'another-slug',
      title: 'Another Post',
      summary: 'Another summary',
      publishedAt: '2025-01-02',
      tags: ['test'],
      body: 'More content',
      previousSlugs: ['another-old-slug'],
      readingTime: { words: 100, minutes: 1, text: '1 min read' },
    },
    {
      id: 'post-3',
      slug: 'no-redirects',
      title: 'No Redirects',
      summary: 'No redirects summary',
      publishedAt: '2025-01-03',
      tags: [],
      body: 'Content',
      readingTime: { words: 100, minutes: 1, text: '1 min read' },
    },
  ]

  describe('buildRedirectMap', () => {
    it('should build redirect map from previousSlugs', () => {
      const redirectMap = buildRedirectMap(mockPosts)
      
      expect(redirectMap.get('old-slug-1')).toBe('current-slug')
      expect(redirectMap.get('old-slug-2')).toBe('current-slug')
      expect(redirectMap.get('another-old-slug')).toBe('another-slug')
      expect(redirectMap.get('non-existent')).toBeUndefined()
    })

    it('should return empty map for posts without previousSlugs', () => {
      const posts: Post[] = [
        {
          id: 'post-1',
          slug: 'current-slug',
          title: 'Test',
          summary: 'Summary',
          publishedAt: '2025-01-01',
          tags: [],
          body: 'Content',
          readingTime: { words: 10, minutes: 1, text: '1 min read' },
        },
      ]

      const redirectMap = buildRedirectMap(posts)
      expect(redirectMap.size).toBe(0)
    })

    it('should handle multiple posts with previousSlugs', () => {
      const redirectMap = buildRedirectMap(mockPosts)
      
      // Should have 3 total redirects (2 from post-1, 1 from post-2)
      expect(redirectMap.size).toBe(3)
    })
  })

  describe('getCanonicalSlug', () => {
    it('should return canonical slug for old slug', () => {
      const canonical = getCanonicalSlug('old-slug-1', mockPosts)
      expect(canonical).toBe('current-slug')
    })

    it('should return canonical slug for another old slug', () => {
      const canonical = getCanonicalSlug('another-old-slug', mockPosts)
      expect(canonical).toBe('another-slug')
    })

    it('should return input slug if not in redirect map', () => {
      const canonical = getCanonicalSlug('some-random-slug', mockPosts)
      expect(canonical).toBe('some-random-slug')
    })

    it('should return current slug as-is', () => {
      const canonical = getCanonicalSlug('current-slug', mockPosts)
      expect(canonical).toBe('current-slug')
    })
  })

  describe('getPostByAnySlug', () => {
    it('should find post by current slug without redirect', () => {
      const result = getPostByAnySlug('current-slug', mockPosts)
      
      expect(result).not.toBeNull()
      expect(result?.post.slug).toBe('current-slug')
      expect(result?.post.title).toBe('Test Post')
      expect(result?.needsRedirect).toBe(false)
      expect(result?.canonicalSlug).toBe('current-slug')
    })

    it('should find post by previous slug with redirect', () => {
      const result = getPostByAnySlug('old-slug-1', mockPosts)
      
      expect(result).not.toBeNull()
      expect(result?.post.slug).toBe('current-slug')
      expect(result?.needsRedirect).toBe(true)
      expect(result?.canonicalSlug).toBe('current-slug')
    })

    it('should find post by another previous slug with redirect', () => {
      const result = getPostByAnySlug('another-old-slug', mockPosts)
      
      expect(result).not.toBeNull()
      expect(result?.post.slug).toBe('another-slug')
      expect(result?.needsRedirect).toBe(true)
      expect(result?.canonicalSlug).toBe('another-slug')
    })

    it('should return null for non-existent slug', () => {
      const result = getPostByAnySlug('non-existent-slug', mockPosts)
      expect(result).toBeNull()
    })

    it('should handle posts without previous slugs', () => {
      const result = getPostByAnySlug('no-redirects', mockPosts)
      
      expect(result).not.toBeNull()
      expect(result?.post.slug).toBe('no-redirects')
      expect(result?.needsRedirect).toBe(false)
    })
  })
})
