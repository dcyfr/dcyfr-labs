"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CONTAINER_WIDTHS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { SECONDARY_NAV_LINKS } from "@/lib/nav-links";

/**
 * QuickLinksRibbon - Horizontal scrollable navigation pills
 *
 * Provides quick access to secondary content areas from the homepage hero.
 * Shows only Activity and Bookmarks (primary nav already in hero CTAs).
 * Uses centralized navigation configuration for consistency.
 * 
 * Features:
 * - Horizontal scroll on mobile with touch support
 * - Keyboard navigable
 * - Icons for visual recognition
 * - Design token compliant
 */
export function QuickLinksRibbon({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Quick navigation"
      className={cn(
        "w-full overflow-x-auto scrollbar-hide",
        "-webkit-overflow-scrolling-touch",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 md:gap-3",
          "py-2",
          CONTAINER_WIDTHS.standard,
          "mx-auto"
        )}
      >
        {SECONDARY_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-1.5 md:gap-2",
              "px-3 py-2 md:px-4 md:py-2.5",
              "rounded-full",
              "bg-muted/50 hover:bg-muted",
              "text-muted-foreground hover:text-foreground",
              TYPOGRAPHY.label.small,
              "whitespace-nowrap",
              ANIMATION.transition.theme,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "min-h-11" // Touch target (44px)
            )}
            title={link.description}
          >
            <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{link.shortLabel || link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
