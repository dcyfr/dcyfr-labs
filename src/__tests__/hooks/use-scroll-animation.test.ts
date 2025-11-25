import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import * as React from 'react'

describe('useScrollAnimation Hook', () => {
  let observerMock: {
    observe: ReturnType<typeof vi.fn>
    unobserve: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
  }
  let matchMediaMock: {
    matches: boolean
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }
  let observerCallback: ((entries: any[]) => void) | null = null

  // Helper to trigger the callback with entries
  function triggerIntersection(entries: any[]) {
    if (observerCallback) {
      act(() => {
        observerCallback(entries)
      })
    }
  }

  // Helper function that sets ref synchronously during render
  function setupHookWithRef(options?: Parameters<typeof useScrollAnimation>[0]) {
    const element = document.createElement('div')
    const result = renderHook(() => {
      const hookResult = useScrollAnimation(options)
      // Set ref synchronously during render (before useEffect runs)
      if (!hookResult.ref.current) {
        hookResult.ref.current = element
      }
      return hookResult
    })
    
    return { result: result.result, element }
  }

  beforeEach(() => {
    vi.useFakeTimers()
    observerCallback = null

    // Mock IntersectionObserver
    observerMock = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    global.IntersectionObserver = vi.fn(function(callback, options) {
      // Store callback for manual triggering
      observerCallback = callback
      return observerMock
    }) as any

    // Mock matchMedia for reduced motion
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => matchMediaMock),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('returns ref object', () => {
      const { result } = renderHook(() => useScrollAnimation())
      expect(result.current.ref).toBeDefined()
      expect(result.current.ref.current).toBeNull()
    })

    it('starts with isVisible false', () => {
      const { result } = renderHook(() => useScrollAnimation())
      expect(result.current.isVisible).toBe(false)
    })

    it('starts with hasAnimated false', () => {
      const { result } = renderHook(() => useScrollAnimation())
      expect(result.current.hasAnimated).toBe(false)
    })

    it('starts with shouldAnimate false', () => {
      const { result } = renderHook(() => useScrollAnimation())
      expect(result.current.shouldAnimate).toBe(false)
    })
  })

  describe('IntersectionObserver Setup', () => {
    it('creates IntersectionObserver with default options when element is present', () => {
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation()
        // Simulate ref being attached during render
        if (!hookResult.ref.current) {
          hookResult.ref.current = document.createElement('div')
        }
        return hookResult
      })
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '0px',
        }
      )
    })

    it('creates IntersectionObserver with custom threshold', () => {
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation({ threshold: 0.5 })
        if (!hookResult.ref.current) {
          hookResult.ref.current = document.createElement('div')
        }
        return hookResult
      })
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.5,
          rootMargin: '0px',
        }
      )
    })

    it('creates IntersectionObserver with custom rootMargin', () => {
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation({ rootMargin: '50px' })
        if (!hookResult.ref.current) {
          hookResult.ref.current = document.createElement('div')
        }
        return hookResult
      })
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      )
    })

    it('observes element when present', () => {
      const element = document.createElement('div')
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation()
        if (!hookResult.ref.current) {
          hookResult.ref.current = element
        }
        return hookResult
      })
      
      expect(observerMock.observe).toHaveBeenCalledWith(element)
    })
  })

  describe('Visibility Detection', () => {
    it('updates isVisible when element enters viewport', async () => {
      const element = document.createElement('div')
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation()
        // Set ref synchronously during render (before useEffect runs)
        if (!hookResult.ref.current) {
          hookResult.ref.current = element
        }
        return hookResult
      })

      // Manually verify observer was created and callback stored
      expect(observerCallback).not.toBeNull()
      expect(observerMock.observe).toHaveBeenCalledWith(element)

      // Trigger intersection
      triggerIntersection([{ isIntersecting: true, target: element }])

      expect(result.current.isVisible).toBe(true)
    })

    it('updates isVisible when element leaves viewport', async () => {
      const element = document.createElement('div')
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation({ triggerOnce: false })
        if (!hookResult.ref.current) {
          hookResult.ref.current = element
        }
        return hookResult
      })

      expect(observerCallback).not.toBeNull()

      // Enter viewport
      triggerIntersection([{ isIntersecting: true, target: element }])
      expect(result.current.isVisible).toBe(true)

      // Leave viewport
      triggerIntersection([{ isIntersecting: false, target: element }])
      expect(result.current.isVisible).toBe(false)
    })
  })

  describe('Trigger Once Behavior', () => {
    it('sets hasAnimated when element becomes visible with triggerOnce=true', async () => {
      const { result, element } = setupHookWithRef({ triggerOnce: true })

      triggerIntersection([{ isIntersecting: true, target: element }])

      expect(result.current.hasAnimated).toBe(true)
    })

    it('does not reset hasAnimated when leaving viewport with triggerOnce=true', async () => {
      const { result, element } = setupHookWithRef({ triggerOnce: true })

      // Enter viewport
      triggerIntersection([{ isIntersecting: true, target: element }])
      expect(result.current.hasAnimated).toBe(true)

      // Leave viewport
      triggerIntersection([{ isIntersecting: false, target: element }])
      expect(result.current.hasAnimated).toBe(true)
    })

    it('allows repeating animations with triggerOnce=false', async () => {
      const { result, element } = setupHookWithRef({ triggerOnce: false })

      // First intersection
      triggerIntersection([{ isIntersecting: true, target: element }])
      expect(result.current.isVisible).toBe(true)

      // Leave viewport
      triggerIntersection([{ isIntersecting: false, target: element }])
      expect(result.current.isVisible).toBe(false)

      // Second intersection - should trigger again
      triggerIntersection([{ isIntersecting: true, target: element }])
      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Delay Behavior', () => {
    it('applies delay before setting shouldAnimate', async () => {
      const { result, element } = setupHookWithRef({ delay: 500 })

      triggerIntersection([{ isIntersecting: true, target: element }])

      // Should not animate immediately
      expect(result.current.shouldAnimate).toBe(false)

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.shouldAnimate).toBe(true)
    })

    it('cancels delay if element leaves viewport', async () => {
      const { result, element } = setupHookWithRef({ delay: 500, triggerOnce: false })

      // Enter viewport
      triggerIntersection([{ isIntersecting: true, target: element }])
      
      // Leave before delay completes
      act(() => {
        vi.advanceTimersByTime(250)
      })
      triggerIntersection([{ isIntersecting: false, target: element }])
      
      // Complete delay time
      act(() => {
        vi.advanceTimersByTime(250)
      })

      // Should not have animated
      expect(result.current.shouldAnimate).toBe(false)
    })
  })

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion', async () => {
      matchMediaMock.matches = true
      const { result, element } = setupHookWithRef()

      triggerIntersection([{ isIntersecting: true, target: element }])

      // isVisible should be true, but shouldAnimate should be false
      expect(result.current.isVisible).toBe(true)
      expect(result.current.shouldAnimate).toBe(false)
    })

    it('enables animation when reduced motion is disabled', async () => {
      matchMediaMock.matches = false
      const { result, element } = setupHookWithRef()

      triggerIntersection([{ isIntersecting: true, target: element }])

      expect(result.current.shouldAnimate).toBe(true)
    })
  })

  describe('Cleanup', () => {
    it('disconnects observer on unmount', () => {
      const element = document.createElement('div')
      const { result, unmount } = renderHook(() => {
        const hookResult = useScrollAnimation()
        if (!hookResult.ref.current) {
          hookResult.ref.current = element
        }
        return hookResult
      })
      
      unmount()
      
      expect(observerMock.disconnect).toHaveBeenCalled()
    })

    it('clears timeout on unmount', () => {
      const { unmount } = renderHook(() => useScrollAnimation({ delay: 500 }))
      const element = document.createElement('div')
      
      unmount()
      vi.advanceTimersByTime(500)

      // Should not throw or cause issues
      expect(() => vi.runAllTimers()).not.toThrow()
    })
  })

  describe('Options Validation', () => {
    it('handles threshold of 0', () => {
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation({ threshold: 0 })
        if (!hookResult.ref.current) {
          hookResult.ref.current = document.createElement('div')
        }
        return hookResult
      })
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0 })
      )
    })

    it('handles threshold of 1', () => {
      const { result } = renderHook(() => {
        const hookResult = useScrollAnimation({ threshold: 1 })
        if (!hookResult.ref.current) {
          hookResult.ref.current = document.createElement('div')
        }
        return hookResult
      })
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 1 })
      )
    })

    it('handles delay of 0', async () => {
      const { result, element } = setupHookWithRef({ delay: 0 })

      triggerIntersection([{ isIntersecting: true, target: element }])

      // Should animate immediately with no delay
      expect(result.current.shouldAnimate).toBe(true)
    })
  })

  describe('Return Values', () => {
    it('returns all expected properties', () => {
      const { result } = renderHook(() => useScrollAnimation())
      
      expect(result.current).toHaveProperty('ref')
      expect(result.current).toHaveProperty('isVisible')
      expect(result.current).toHaveProperty('hasAnimated')
      expect(result.current).toHaveProperty('shouldAnimate')
    })

    it('returns stable ref across renders', () => {
      const { result, rerender } = renderHook(() => useScrollAnimation())
      
      const firstRef = result.current.ref
      rerender()
      const secondRef = result.current.ref
      
      expect(firstRef).toBe(secondRef)
    })
  })
})
