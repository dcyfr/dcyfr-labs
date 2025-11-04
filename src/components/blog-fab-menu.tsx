"use client"

import { useState, useEffect } from "react"
import { FABMenu } from "@/components/fab-menu"
import { TableOfContents } from "@/components/table-of-contents"
import type { TocHeading } from "@/lib/toc"

/**
 * Blog FAB Menu Wrapper
 * 
 * Client component that manages the consolidated FAB menu for blog post pages.
 * Integrates the TableOfContents Sheet with a unified FAB menu that expands on hover.
 * Handles scroll detection for the "back to top" button visibility.
 * 
 * This component replaces the separate BackToTop and TableOfContents FAB buttons
 * with a single consolidated menu that expands to show both options.
 * 
 * @component
 */

interface BlogFABMenuProps {
  /** Array of headings for the table of contents */
  headings: TocHeading[]
}

export function BlogFABMenu({ headings }: BlogFABMenuProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isTOCOpen, setIsTOCOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button after scrolling 400px
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleTOCClick = () => {
    setIsTOCOpen(true)
  }

  return (
    <>
      {/* TableOfContents with hidden FAB (controlled externally) */}
      <TableOfContents
        headings={headings}
        hideFAB={true}
        externalOpen={isTOCOpen}
        onOpenChange={setIsTOCOpen}
      />
      
      {/* Consolidated FAB Menu */}
      <FABMenu
        onTOCClick={handleTOCClick}
        onScrollTop={handleScrollTop}
        showTOC={headings.length > 0}
        showScrollTop={showScrollTop}
      />
    </>
  )
}
