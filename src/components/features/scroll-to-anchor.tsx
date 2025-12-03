"use client";

/**
 * Scroll to Anchor Component
 *
 * Handles automatic scrolling to anchor links (#section-id) when:
 * - Page loads with a hash in the URL
 * - User clicks an internal anchor link
 * - Hash changes via client-side navigation
 *
 * Supports smooth scrolling with offset for fixed headers.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface ScrollToAnchorProps {
  /**
   * Offset from top in pixels to account for fixed headers
   * @default 80
   */
  offset?: number;
}

/**
 * Client component that enables smooth scrolling to anchor links
 *
 * Place this component in your layout or page to enable anchor link functionality.
 *
 * @example
 * ```tsx
 * <PageLayout>
 *   <ScrollToAnchor offset={100} />
 *   {children}
 * </PageLayout>
 * ```
 */
export function ScrollToAnchor({ offset = 80 }: ScrollToAnchorProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Function to get dynamic header height
    const getHeaderHeight = (): number => {
      const header = document.querySelector('.site-header');
      if (header) {
        return header.getBoundingClientRect().height;
      }
      return offset; // Fallback to provided offset
    };

    // Function to handle scrolling to an element
    const scrollToElement = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        // Use dynamic header height plus small buffer for visual comfort
        const headerHeight = getHeaderHeight();
        const scrollOffset = headerHeight + 16; // 16px buffer for breathing room

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    // Handle initial page load with hash
    const hash = window.location.hash.slice(1); // Remove the #
    if (hash) {
      // Wait for page to be fully loaded and animations to complete
      const scrollWhenReady = () => {
        // Use requestAnimationFrame to ensure we scroll after layout is stable
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const element = document.getElementById(hash);
            if (element) {
              scrollToElement(hash);
            }
          });
        });
      };

      // Wait for load event and allow time for animations to complete
      if (document.readyState === 'complete') {
        // Page already loaded, wait for animations (typical fade-in is 300-500ms)
        setTimeout(scrollWhenReady, 600);
      } else {
        // Wait for load event, then wait for animations
        window.addEventListener('load', () => {
          setTimeout(scrollWhenReady, 600);
        }, { once: true });
      }
    }

    // Handle hash changes (e.g., clicking anchor links)
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash) {
        scrollToElement(newHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname, offset]);

  // This component doesn't render anything
  return null;
}
