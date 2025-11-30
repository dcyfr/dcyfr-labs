"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/toc";
import { trackToCClick } from "@/lib/analytics";

interface PostTableOfContentsProps {
  headings: TocHeading[];
  slug?: string;
}

/**
 * Post Table of Contents Section
 * 
 * Displays hierarchical navigation for post headings with active state tracking.
 */
export function PostTableOfContents({ headings, slug }: PostTableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 1.0,
      }
    );

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, heading: TocHeading) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    if (slug) {
      trackToCClick(slug, heading.text, heading.level);
    }

    window.history.pushState(null, "", `#${id}`);
  };

  if (headings.length === 0) return null;

  return (
    <div>
      <h2 className="font-semibold mb-3 text-sm">On this page</h2>
      <nav aria-label="Table of contents">
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const isH3 = heading.level === 3;

            return (
              <li key={heading.id} className={cn(isH3 && "ml-4")}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id, heading)}
                  className={cn(
                    "block py-1 transition-colors hover:text-foreground",
                    isActive
                      ? "text-foreground font-medium border-l-2 border-primary pl-3 -ml-0.5"
                      : "text-muted-foreground hover:underline"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
