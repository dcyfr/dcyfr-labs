"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * BackToTop Component - Floating Action Button
 * 
 * Scroll-to-top button that appears after scrolling down on blog post pages.
 * Part of the unified FAB (Floating Action Button) system.
 * 
 * Visibility:
 * - Only shown on individual blog post pages (/blog/[slug])
 * - Hidden on homepage, /blog list, /projects, and other pages
 * - Appears after 400px scroll threshold
 * 
 * Design System:
 * - Size: 56px (h-14 w-14) - Standard FAB size
 * - Position: bottom-24 right-4 (96px from bottom, 16px from right)
 * - Z-index: 40 (below modals, above content)
 * - Animation: Framer Motion scale + opacity
 * - Scroll threshold: 400px
 * - Touch target: Meets 44px minimum (56px exceeds)
 * - Footer clearance: 96px keeps FAB above 64px footer + margin
 * 
 * @component
 * @returns {React.ReactElement} Floating action button or null
 */
export function BackToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Only show on individual blog post pages
  const isOnBlogPost = pathname?.startsWith("/blog/") && pathname !== "/blog";

  useEffect(() => {
    if (!isOnBlogPost) {
      setShow(false);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling 400px (about 1.5 viewports)
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOnBlogPost]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
