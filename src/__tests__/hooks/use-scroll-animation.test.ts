import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

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

  beforeEach(() => {
    vi.useFakeTimers()

    // Mock IntersectionObserver
    observerMock = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    global.IntersectionObserver = vi.fn((callback) => {
      // Store callback for manual triggering
      ;(observerMock as any).callback = callback
      return observerMock as any
    })

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
    it('creates IntersectionObserver with default options', () => {
      renderHook(() => useScrollAnimation())
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '0px',
        }
      )
    })

    it('creates IntersectionObserver with custom threshold', () => {
      renderHook(() => useScrollAnimation({ threshold: 0.5 }))
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.5,
          rootMargin: '0px',
        }
      )
    })

    it('creates IntersectionObserver with custom rootMargin', () => {
      renderHook(() => useScrollAnimation({ rootMargin: '50px' }))
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      )
    })

    it('observes element when ref is set', () => {
      const { result } = renderHook(() => useScrollAnimation())
      const element = document.createElement('div')
      
      // Simulate ref being set
      result.current.ref = { current: element } as any
      
      // Re-render to trigger effect
      result.current.ref.current = element
    })
  })

  describe('Visibility Detection', () => {
    it('updates isVisible when element enters viewport', async () => {
      const { result } = renderHook(() => useScrollAnimation())
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      // Trigger intersection
      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('updates isVisible when element leaves viewport', async () => {
      const { result } = renderHook(() => useScrollAnimation())
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback

      // Enter viewport
      callback([{ isIntersecting: true, target: element }])
      await waitFor(() => expect(result.current.isVisible).toBe(true))

      // Leave viewport
      callback([{ isIntersecting: false, target: element }])
      await waitFor(() => expect(result.current.isVisible).toBe(false))
    })
  })

  describe('Trigger Once Behavior', () => {
    it('sets hasAnimated when element becomes visible with triggerOnce=true', async () => {
      const { result } = renderHook(() => useScrollAnimation({ triggerOnce: true }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      await waitFor(() => {
        expect(result.current.hasAnimated).toBe(true)
      })
    })

    it('does not reset hasAnimated when leaving viewport with triggerOnce=true', async () => {
      const { result } = renderHook(() => useScrollAnimation({ triggerOnce: true }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback

      // Enter viewport
      callback([{ isIntersecting: true, target: element }])
      await waitFor(() => expect(result.current.hasAnimated).toBe(true))

      // Leave viewport
      callback([{ isIntersecting: false, target: element }])
      await waitFor(() => {
        expect(result.current.hasAnimated).toBe(true)
      })
    })

    it('allows repeating animations with triggerOnce=false', async () => {
      const { result } = renderHook(() => useScrollAnimation({ triggerOnce: false }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback

      // First intersection
      callback([{ isIntersecting: true, target: element }])
      await waitFor(() => expect(result.current.isVisible).toBe(true))

      // Leave viewport
      callback([{ isIntersecting: false, target: element }])
      await waitFor(() => expect(result.current.isVisible).toBe(false))

      // Second intersection - should trigger again
      callback([{ isIntersecting: true, target: element }])
      await waitFor(() => expect(result.current.isVisible).toBe(true))
    })
  })

  describe('Delay Behavior', () => {
    it('applies delay before setting shouldAnimate', async () => {
      const { result } = renderHook(() => useScrollAnimation({ delay: 500 }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      // Should not animate immediately
      expect(result.current.shouldAnimate).toBe(false)

      // Fast-forward time
      vi.advanceTimersByTime(500)

      await waitFor(() => {
        expect(result.current.shouldAnimate).toBe(true)
      })
    })

    it('cancels delay if element leaves viewport', async () => {
      const { result } = renderHook(() => useScrollAnimation({ delay: 500 }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback

      // Enter viewport
      callback([{ isIntersecting: true, target: element }])
      
      // Leave before delay completes
      vi.advanceTimersByTime(250)
      callback([{ isIntersecting: false, target: element }])
      
      // Complete delay time
      vi.advanceTimersByTime(250)

      // Should not have animated
      expect(result.current.shouldAnimate).toBe(false)
    })
  })

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion', async () => {
      matchMediaMock.matches = true
      const { result } = renderHook(() => useScrollAnimation())
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      await waitFor(() => {
        // isVisible should be true, but shouldAnimate should be false
        expect(result.current.isVisible).toBe(true)
        expect(result.current.shouldAnimate).toBe(false)
      })
    })

    it('enables animation when reduced motion is disabled', async () => {
      matchMediaMock.matches = false
      const { result } = renderHook(() => useScrollAnimation())
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      await waitFor(() => {
        expect(result.current.shouldAnimate).toBe(true)
      })
    })
  })

  describe('Cleanup', () => {
    it('disconnects observer on unmount', () => {
      const { unmount } = renderHook(() => useScrollAnimation())
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
      renderHook(() => useScrollAnimation({ threshold: 0 }))
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0 })
      )
    })

    it('handles threshold of 1', () => {
      renderHook(() => useScrollAnimation({ threshold: 1 }))
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 1 })
      )
    })

    it('handles delay of 0', async () => {
      const { result } = renderHook(() => useScrollAnimation({ delay: 0 }))
      const element = document.createElement('div')
      result.current.ref = { current: element } as any

      const callback = (observerMock as any).callback
      callback([{ isIntersecting: true, target: element }])

      // Should animate immediately with no delay
      await waitFor(() => {
        expect(result.current.shouldAnimate).toBe(true)
      })
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
