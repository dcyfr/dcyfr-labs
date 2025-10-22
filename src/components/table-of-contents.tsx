"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/toc";

type TableOfContentsProps = {
  headings: TocHeading[];
};

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
