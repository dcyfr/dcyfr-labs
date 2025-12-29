"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/features";
import { MobileNav } from "@/components/navigation";
import { SearchButton } from "@/components/search";
import { DevToolsDropdown } from "@/components/common";
import { cn } from "@/lib/utils";
import { CONTAINER_WIDTHS, ANIMATION, TOUCH_TARGET } from "@/lib/design-tokens";
import {
  NAVIGATION,
  BLOG_NAV,
  WORK_NAV,
  isNavItemActive,
  getAriaCurrent,
} from "@/lib/navigation";
import { useDropdown } from "@/hooks/use-dropdown";
import { useLogoClick } from "@/hooks/use-navigation";

/**
 * Site Header Component
 *
 * Main navigation header with responsive design and accessibility
 *
 * Features:
 * - Desktop: Horizontal nav with dropdowns for Blog and Work
 * - Mobile: Hamburger menu
 * - Sticky positioning with backdrop blur
 * - Keyboard navigation support
 * - SEO-optimized structure
 * - Hides border until scroll (blends with hero sections)
 */
export function SiteHeader() {
  const pathname = usePathname();
  const blogDropdown = useDropdown();
  const workDropdown = useDropdown();
  const handleLogoClick = useLogoClick();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate threshold based on header height + top margin
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let threshold = isMobile ? 56 : 64; // Base header height (h-14 = 56px, md:h-16 = 64px)

      // Add top margin (now applied to all pages)
      if (isMobile) {
        threshold += 32; // mt-8 = 2rem = 32px
      } else if (isTablet) {
        threshold += 48; // md:mt-12 = 3rem = 48px
      } else {
        threshold += 64; // lg:mt-16 = 4rem = 64px
      }

      const scrolled = window.scrollY > threshold;
      setHasScrolled(scrolled);
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* eslint-disable react-hooks/refs -- dropdown.ref/isOpen/toggle are hook return values, not ref.current access */
  return (
    <header
      className={cn(
        "sticky top-0 z-40 site-header transition-colors mt-8 md:mt-12 lg:mt-16",
        ANIMATION.duration.fast,
        hasScrolled
          ? "backdrop-blur supports-backdrop-filter:bg-background/60 border-b"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto",
          CONTAINER_WIDTHS.dashboard,
          "px-4",
          "sm:px-8",
          "md:px-8",
          "h-14",
          "md:h-16",
          "flex",
          "items-center",
          "gap-2",
          "lg:relative"
        )}
      >
        {/* Logo - always visible */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className={cn(
            "touch-target",
            "shrink-0",
            "-ml-2",
            "flex",
            "items-center",
            "lg:mr-auto"
          )}
          aria-label="DCYFR Labs Home"
        >
          <Image
            src="/images/dcyfr-avatar.svg"
            alt="DCYFR Labs Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            priority
          />
        </Link>

        {/* Desktop Navigation - hidden on mobile, visible md and up */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center justify-center gap-1 sm:gap-3 md:gap-4 text-sm h-full lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
        >
          {/* Direct links (About, Sponsors, Contact) */}
          {NAVIGATION.header
            .filter((item) => !["Blog", "Our Work"].includes(item.label))
            .filter((item) => item.href !== "/") // Exclude home (handled by logo)
            .map((item) => {
              const isActive = isNavItemActive(item, pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center h-full px-1.5 sm:px-2 hover:underline underline-offset-4 will-change-auto touch-target",
                    ANIMATION.transition.base,
                    isActive && "text-primary font-medium"
                  )}
                  aria-current={getAriaCurrent(
                    item.href,
                    pathname,
                    item.exactMatch
                  )}
                  aria-label={item.description}
                  prefetch={item.prefetch}
                >
                  {item.label}
                </Link>
              );
            })}

          {/* Blog dropdown */}
          <div ref={blogDropdown.ref} className="relative">
            <button
              {...blogDropdown.triggerProps}
              className={cn(
                "flex items-center justify-center h-full gap-1 px-1.5 sm:px-2 hover:underline underline-offset-4 will-change-auto touch-target",
                ANIMATION.transition.base,
                pathname.startsWith("/blog") && "text-primary font-medium"
              )}
              aria-label="Blog menu"
              aria-expanded={blogDropdown.isOpen}
              aria-haspopup="menu"
            >
              Blog
              <ChevronDown
                className={cn(
                  "h-4 w-4",
                  ANIMATION.transition.fast,
                  blogDropdown.isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            {blogDropdown.isOpen && (
              <div
                {...blogDropdown.contentProps}
                className="absolute top-full left-0 mt-2 w-52 rounded-lg border bg-card p-1.5 shadow-xl z-50"
                role="menu"
              >
                {BLOG_NAV.map((item) => {
                  const isActive = isNavItemActive(item, pathname);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2.5 text-sm rounded-md",
                        ANIMATION.transition.base,
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive && "bg-accent/50 font-medium"
                      )}
                      onClick={blogDropdown.close}
                      role="menuitem"
                      aria-label={item.description}
                      prefetch={false}
                    >
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Our Work dropdown */}
          <div ref={workDropdown.ref} className="relative">
            <button
              {...workDropdown.triggerProps}
              className={cn(
                "flex items-center justify-center h-full gap-1 px-1.5 sm:px-2 hover:underline underline-offset-4 will-change-auto touch-target",
                ANIMATION.transition.base,
                pathname.startsWith("/work") && "text-primary font-medium"
              )}
              aria-label="Our Work menu"
              aria-expanded={workDropdown.isOpen}
              aria-haspopup="menu"
            >
              Our Work
              <ChevronDown
                className={cn(
                  "h-4 w-4",
                  ANIMATION.transition.fast,
                  workDropdown.isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            {workDropdown.isOpen && (
              <div
                {...workDropdown.contentProps}
                className="absolute top-full left-0 mt-2 w-52 rounded-lg border bg-card p-1.5 shadow-xl z-50"
                role="menu"
              >
                {WORK_NAV.map((item, index) => {
                  const isActive = isNavItemActive(item, pathname);

                  return (
                    <div key={item.href}>
                      {/* Separator before Services 
                      {index === WORK_NAV.length - 1 && (
                        <div className="my-1.5 border-t" role="separator" />
                      )} */}
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-3 py-2.5 text-sm rounded-md",
                          ANIMATION.transition.base,
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive && "bg-accent/50 font-medium"
                        )}
                        onClick={workDropdown.close}
                        role="menuitem"
                        aria-label={item.description}
                        prefetch={false}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Icon Links - visible md and up */}
        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <SearchButton variant="default" />
          <ThemeToggle />
          {process.env.NODE_ENV === "development" && <DevToolsDropdown />}
        </div>

        {/* Mobile Navigation - visible on mobile, hidden md and up */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <SearchButton variant="default" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
  /* eslint-enable react-hooks/refs */
}
