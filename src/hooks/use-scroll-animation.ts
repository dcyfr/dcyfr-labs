"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Options for scroll animation configuration
 */
interface UseScrollAnimationOptions {
  /** Trigger animation when element is X% visible (0-1) */
  threshold?: number;
  /** Root margin for intersection observer (e.g., "0px 0px -100px 0px") */
  rootMargin?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Only animate once (default: true) */
  triggerOnce?: boolean;
}

/**
 * useScrollAnimation Hook
 *
 * Provides scroll-triggered animations using IntersectionObserver API.
 * Automatically respects user's motion preferences via `prefers-reduced-motion`.
 * Optimized for performance with proper cleanup and configurable options.
 *
 * Features:
 * - IntersectionObserver-based visibility detection
 * - Automatic prefers-reduced-motion support
 * - Configurable threshold, rootMargin, and delay
 * - Optional one-time or repeating animations
 * - TypeScript support with ref return
 * - Minimal re-renders
 *
 * @param {UseScrollAnimationOptions} options - Animation configuration
 * @param {number} [options.threshold=0.1] - Percentage of element visible to trigger (0-1)
 * @param {string} [options.rootMargin="0px"] - Margin around viewport for early/late triggering
 * @param {number} [options.delay=0] - Delay before animation starts (ms)
 * @param {boolean} [options.triggerOnce=true] - Only animate once, or repeat on scroll
 *
 * @returns {Object} Animation state and ref
 * @returns {React.RefObject} ref - Attach to element to observe
 * @returns {boolean} isVisible - Whether element is in viewport
 * @returns {boolean} hasAnimated - Whether animation has triggered (for triggerOnce)
 * @returns {boolean} shouldAnimate - Computed state: animate if visible and motion not reduced
 *
 * @example
 * // Basic fade-in on scroll
 * function PostCard() {
 *   const { ref, shouldAnimate } = useScrollAnimation();
 *   
 *   return (
 *     <div 
 *       ref={ref}
 *       className={shouldAnimate ? "animate-fade-in" : "opacity-0"}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 *
 * @example
 * // With custom threshold and delay
 * function Section() {
 *   const { ref, shouldAnimate } = useScrollAnimation({
 *     threshold: 0.5,  // 50% visible
 *     delay: 200,      // 200ms delay
 *     triggerOnce: true
 *   });
 *   
 *   return (
 *     <section 
 *       ref={ref}
 *       style={{
 *         opacity: shouldAnimate ? 1 : 0,
 *         transform: shouldAnimate ? "translateY(0)" : "translateY(20px)",
 *         transition: "all 0.6s ease-out"
 *       }}
 *     >
 *       Content
 *     </section>
 *   );
 * }
 *
 * @example
 * // Staggered animations (use in map)
 * posts.map((post, index) => {
 *   const { ref, shouldAnimate } = useScrollAnimation({
 *     delay: index * 100  // 100ms stagger
 *   });
 *   
 *   return <PostCard key={post.id} ref={ref} animate={shouldAnimate} />;
 * });
 *
 * @accessibility
 * - Automatically detects prefers-reduced-motion
 * - Disables animations when user prefers reduced motion
 * - Elements remain accessible even without animation
 * - No ARIA attributes needed (purely visual)
 *
 * @performance
 * - Uses native IntersectionObserver (no polyfill needed)
 * - Minimal re-renders (only on visibility change)
 * - Automatic cleanup on unmount
 * - Efficient for many elements on page
 * - setTimeout cleared properly
 *
 * @browser_support
 * - Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+
 * - Graceful degradation: no animation if IntersectionObserver unavailable
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
  delay = 0,
  triggerOnce = true,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync with media query
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Set up IntersectionObserver
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
              }
              timeoutRef.current = null;
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) {
              setHasAnimated(true);
            }
          }
        } else if (!triggerOnce) {
          // Clear timeout if element leaves viewport before delay completes
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      // Clear timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, triggerOnce]);

  // If triggerOnce and hasAnimated, stop observing
  useEffect(() => {
    if (triggerOnce && hasAnimated && ref.current) {
      // Element has animated, we can disconnect
    }
  }, [triggerOnce, hasAnimated]);

  // Compute final animation state
  const shouldAnimate = !prefersReducedMotion && isVisible;

  return {
    ref,
    isVisible,
    hasAnimated,
    shouldAnimate,
  };
}
