"use client";

import * as React from "react";
import { SCROLL_BEHAVIOR } from "@/lib/design-tokens";

/**
 * SmoothScrollToHash Component
 * 
 * Handles smooth scrolling to hash anchors on page load and navigation.
 * Enhances anchor link behavior from external sources with:
 * - Smooth scroll animation with header offset
 * - Highlight animation on target heading
 * - Triggers TOC active state update via custom event
 * 
 * @component
 * @example
 * // Add to layout or page component
 * <SmoothScrollToHash />
 */
export function SmoothScrollToHash() {
  React.useEffect(() => {
    // Scroll to element with animation
    const scrollToElement = (element: HTMLElement) => {
      const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_BEHAVIOR.offset.standard;
      
      window.scrollTo({
        top,
        behavior: SCROLL_BEHAVIOR.behavior.smooth,
      });

      // Add highlight animation to heading
      element.classList.add("animate-highlight");
      setTimeout(() => {
        element.classList.remove("animate-highlight");
      }, 2000);

      // Dispatch custom event to notify TOC of hash navigation
      window.dispatchEvent(new CustomEvent("toc:hash-navigation", {
        detail: { id: element.id }
      }));
    };

    // Handle initial hash on page load
    const handleHashOnLoad = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const elementId = hash.slice(1);
      let element = document.getElementById(elementId);
      
      if (!element) {
        // Element not found immediately, try again after a delay
        // This handles async content loading or hydration delays
        setTimeout(() => {
          element = document.getElementById(elementId);
          if (element) {
            scrollToElement(element);
          }
        }, 300);
        return;
      }

      scrollToElement(element);
    };

    // Handle hash changes during navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const elementId = hash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        scrollToElement(element);
      }
    };

    // Use requestIdleCallback for better performance, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => handleHashOnLoad());
    } else {
      setTimeout(() => handleHashOnLoad(), 100);
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}
