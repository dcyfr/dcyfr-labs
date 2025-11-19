"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * Options for section navigation configuration
 */
interface UseSectionNavigationOptions {
  /** Selector for section elements (default: "section[data-section]") */
  sectionSelector?: string;
  /** Scroll behavior (default: "smooth") */
  scrollBehavior?: ScrollBehavior;
  /** Offset from top in pixels (e.g., for fixed headers) */
  scrollOffset?: number;
  /** Disable keyboard navigation */
  disabled?: boolean;
}

/**
 * useSectionNavigation Hook
 *
 * Enables keyboard navigation (PageUp/PageDown) to smoothly scroll between sections.
 * Automatically detects sections and handles smooth scrolling with configurable offsets.
 *
 * Features:
 * - PageUp/PageDown keyboard shortcuts
 * - Smooth scroll transitions between sections
 * - Respects prefers-reduced-motion
 * - Automatic section detection
 * - Configurable scroll offset for fixed headers
 * - TypeScript support
 *
 * @param {UseSectionNavigationOptions} options - Navigation configuration
 * @param {string} [options.sectionSelector="section[data-section]"] - CSS selector for sections
 * @param {ScrollBehavior} [options.scrollBehavior="smooth"] - "smooth" or "auto"
 * @param {number} [options.scrollOffset=80] - Offset from top in pixels
 * @param {boolean} [options.disabled=false] - Disable keyboard navigation
 *
 * @example
 * // In a page component
 * function HomePage() {
 *   useSectionNavigation();
 *   
 *   return (
 *     <>
 *       <section data-section>Hero</section>
 *       <section data-section>Features</section>
 *       <section data-section>Projects</section>
 *     </>
 *   );
 * }
 *
 * @example
 * // With custom offset for fixed header
 * function BlogPost() {
 *   useSectionNavigation({ scrollOffset: 100 });
 *   
 *   return (
 *     <>
 *       <section data-section>Content</section>
 *       <section data-section>Comments</section>
 *     </>
 *   );
 * }
 */
export function useSectionNavigation({
  sectionSelector = "section[data-section]",
  scrollBehavior = "smooth",
  scrollOffset = 80,
  disabled = false,
}: UseSectionNavigationOptions = {}) {
  const prefersReducedMotionRef = useRef(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /**
   * Get all sections on the page
   */
  const getSections = useCallback(() => {
    return Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));
  }, [sectionSelector]);

  /**
   * Find the current section based on scroll position
   */
  const getCurrentSectionIndex = useCallback(() => {
    const sections = getSections();
    if (sections.length === 0) return 0;
    
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Use middle of viewport

    // Find which section the middle of viewport is in
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && scrollPosition >= section.offsetTop) {
        return i;
      }
    }

    return 0;
  }, [getSections]);

  /**
   * Scroll to a specific section
   */
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = getSections();
      const section = sections[index];

      if (!section) return;

      const targetY = section.offsetTop - scrollOffset;
      const behavior = prefersReducedMotionRef.current ? "auto" : scrollBehavior;

      window.scrollTo({
        top: targetY,
        behavior,
      });
    },
    [getSections, scrollBehavior, scrollOffset]
  );

  /**
   * Navigate to next section
   */
  const navigateToNextSection = useCallback(() => {
    const currentIndex = getCurrentSectionIndex();
    const sections = getSections();
    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);

    if (nextIndex !== currentIndex) {
      scrollToSection(nextIndex);
    }
  }, [getCurrentSectionIndex, getSections, scrollToSection]);

  /**
   * Navigate to previous section
   */
  const navigateToPreviousSection = useCallback(() => {
    const currentIndex = getCurrentSectionIndex();
    const prevIndex = Math.max(currentIndex - 1, 0);

    if (prevIndex !== currentIndex) {
      scrollToSection(prevIndex);
    }
  }, [getCurrentSectionIndex, scrollToSection]);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ignore if modifier keys are pressed (user might be zooming, etc.)
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      switch (event.key) {
        case "PageDown":
          event.preventDefault();
          navigateToNextSection();
          break;
        case "PageUp":
          event.preventDefault();
          navigateToPreviousSection();
          break;
      }
    },
    [navigateToNextSection, navigateToPreviousSection]
  );

  // Set up keyboard listener
  useEffect(() => {
    if (disabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, handleKeyDown]);

  return {
    navigateToNextSection,
    navigateToPreviousSection,
    scrollToSection,
    getSections,
  };
}
