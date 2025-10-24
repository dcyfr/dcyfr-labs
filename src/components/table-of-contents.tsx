"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/toc";

/**
 * Props for the TableOfContents component
 * @typedef {Object} TableOfContentsProps
 * @property {TocHeading[]} headings - Array of headings (h2/h3) to render in TOC
 */
type TableOfContentsProps = {
  headings: TocHeading[];
};

/**
 * TableOfContents Component
 *
 * A sticky, collapsible table of contents for blog posts that automatically
 * highlights the currently visible heading as the user scrolls.
 *
 * Features:
 * - Fixed position on the right side of the viewport (XL breakpoint and up)
 * - Collapsible with "On this page" header button
 * - Smooth scroll to heading on click
 * - Active state indicator based on IntersectionObserver
 * - Hierarchical indentation for h3 sub-headings
 * - Keyboard and screen reader accessible
 *
 * @component
 * @param {TableOfContentsProps} props - Component props
 * @param {TocHeading[]} props.headings - Array of headings from parsed MDX content
 *
 * @returns {React.ReactElement | null} Navigation element or null if no headings
 *
 * @example
 * // Render TOC for blog post
 * const headings = [
 *   { id: "intro", level: 2, text: "Introduction" },
 *   { id: "setup", level: 2, text: "Setup" },
 *   { id: "setup-step1", level: 3, text: "Step 1" },
 * ];
 * <TableOfContents headings={headings} />
 *
 * @implementation
 * - Uses IntersectionObserver to track which heading is currently visible
 * - rootMargin="-80px 0px -80% 0px" activates heading when near top
 * - Smooth scrolls to heading with 80px offset (accounting for fixed header)
 * - Tracks activeId state for visual indicator
 * - Expandable to save viewport space on XL+ screens
 *
 * @accessibility
 * - nav has aria-label="Table of contents"
 * - Links are actual anchor tags for native browser behavior
 * - Collapse button has aria-expanded attribute
 * - SVG toggle icon has aria-hidden="true"
 * - Keyboard navigation works with Tab/Enter
 *
 * @performance
 * - Only rendered on client (checks typeof window)
 * - Returns null if no headings (prevents empty nav)
 * - Cleanup on unmount prevents memory leaks from observer
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's intersecting and visible
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px", // Activate when heading is near top
        threshold: 1.0,
      }
    );

    // Observe all heading elements
    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  // Don't render if no headings
  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <nav
      className="fixed top-24 right-8 hidden xl:block w-64 max-h-[calc(100vh-8rem)] overflow-y-auto"
      aria-label="Table of contents"
    >
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors"
          aria-expanded={isExpanded}
        >
          <span>On this page</span>
          <svg
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {isExpanded && (
          <ul className="space-y-2 text-sm border-l-2 border-border">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              const isH3 = heading.level === 3;

              return (
                <li
                  key={heading.id}
                  className={cn(isH3 && "ml-4")}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={cn(
                      "block py-1 pl-4 border-l-2 -ml-[2px] transition-colors",
                      isActive
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
