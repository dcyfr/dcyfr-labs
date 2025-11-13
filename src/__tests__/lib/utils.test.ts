import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn()', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
      
      const isInactive = false
      expect(cn('base', isInactive && 'inactive')).toBe('base')
    })

    it('should merge Tailwind classes correctly', () => {
      // TailwindMerge should handle conflicting classes
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle arrays of class names', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
    })

    it('should handle objects with boolean values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('should handle undefined and null values', () => {
      expect(cn('foo', undefined, 'bar', null)).toBe('foo bar')
    })

    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('')
    })
  })
})
