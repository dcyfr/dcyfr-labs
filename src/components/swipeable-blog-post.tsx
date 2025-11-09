"use client";

import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * SwipeableBlogPost Component
 * 
 * Enables native app-like swipe navigation for blog posts on mobile devices.
 * Swipe left to go to next post, swipe right to go to previous post.
 * 
 * Features:
 * - Touch-based swipe detection (50px minimum swipe distance)
 * - Visual indicators (chevrons) showing available navigation
 * - Smooth page transitions using Next.js router
 * - Mobile-only (hidden on desktop with md:hidden)
 * - Prevents scroll interference
 * - Visual feedback during swipe with animated indicators
 * - Respects user preference for reduced motion
 * 
 * @param props.prevSlug - Slug of the previous blog post (optional)
 * @param props.nextSlug - Slug of the next blog post (optional)
 * @param props.prevTitle - Title of the previous post for accessibility (optional)
 * @param props.nextTitle - Title of the next post for accessibility (optional)
 * @param props.children - Blog post content to wrap
 * 
 * @example
 * ```tsx
 * <SwipeableBlogPost
 *   prevSlug="previous-post-slug"
 *   nextSlug="next-post-slug"
 *   prevTitle="Previous Post Title"
 *   nextTitle="Next Post Title"
 * >
 *   <article>{postContent}</article>
 * </SwipeableBlogPost>
 * ```
 */
interface SwipeableBlogPostProps {
  prevSlug?: string;
  nextSlug?: string;
  prevTitle?: string;
  nextTitle?: string;
  children: React.ReactNode;
}

export function SwipeableBlogPost({ 
  prevSlug, 
  nextSlug,
  prevTitle,
  nextTitle,
  children 
}: SwipeableBlogPostProps) {
  const router = useRouter();
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextSlug) {
        router.push(`/blog/${nextSlug}`);
      }
      setIsSwiping(false);
      setSwipeDirection(null);
    },
    onSwipedRight: () => {
      if (prevSlug) {
        router.push(`/blog/${prevSlug}`);
      }
      setIsSwiping(false);
      setSwipeDirection(null);
    },
    onSwiping: (eventData) => {
      // Show visual feedback while swiping
      if (Math.abs(eventData.deltaX) > 20) {
        setIsSwiping(true);
        setSwipeDirection(eventData.deltaX < 0 ? "left" : "right");
      }
    },
    onTouchEndOrOnMouseUp: () => {
      // Reset visual feedback when swipe ends
      setIsSwiping(false);
      setSwipeDirection(null);
    },
    trackMouse: false, // Only touch gestures, not mouse drag
    trackTouch: true,
    delta: 50, // Minimum 50px swipe distance to trigger navigation
    preventScrollOnSwipe: false, // Allow vertical scrolling during horizontal swipe
    touchEventOptions: { passive: true }, // Better scroll performance
  });
  
  // Don't render swipe indicators if user prefers reduced motion
  const showIndicators = !prefersReducedMotion;
  
  return (
    <div {...handlers} className="relative">
      {children}
      
      {/* Visual indicators - only on mobile, only when posts exist */}
      {showIndicators && prevSlug && (
        <div 
          className={cn(
            "fixed left-4 top-1/2 -translate-y-1/2 md:hidden",
            "pointer-events-none z-30",
            "transition-all duration-200 ease-out",
            isSwiping && swipeDirection === "right" 
              ? "opacity-100 scale-125" 
              : "opacity-30 scale-100"
          )}
          aria-hidden="true"
        >
          <div className="rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-lg border">
            <ChevronLeft className="h-6 w-6 text-muted-foreground" />
          </div>
          {/* Optional: Show prev post title on hover/swipe */}
          {prevTitle && isSwiping && swipeDirection === "right" && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border max-w-[200px] truncate">
                {prevTitle}
              </div>
            </div>
          )}
        </div>
      )}
      
      {showIndicators && nextSlug && (
        <div 
          className={cn(
            "fixed right-4 top-1/2 -translate-y-1/2 md:hidden",
            "pointer-events-none z-30",
            "transition-all duration-200 ease-out",
            isSwiping && swipeDirection === "left"
              ? "opacity-100 scale-125"
              : "opacity-30 scale-100"
          )}
          aria-hidden="true"
        >
          <div className="rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-lg border">
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </div>
          {/* Optional: Show next post title on hover/swipe */}
          {nextTitle && isSwiping && swipeDirection === "left" && (
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border max-w-[200px] truncate">
                {nextTitle}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Accessibility: Screen reader announcement for swipe functionality */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {prevSlug && "Swipe right to go to previous post. "}
        {nextSlug && "Swipe left to go to next post."}
      </div>
    </div>
  );
}
