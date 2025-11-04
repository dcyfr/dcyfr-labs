import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import DevToolsDropdown from "@/components/dev-tools-dropdown";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b site-header">
      <div className="mx-auto max-w-5xl px-3 sm:px-6 md:px-8 h-14 md:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-serif text-base sm:text-lg md:text-xl font-semibold tracking-tight touch-target shrink-0">
          <Logo width={20} height={20} className="sm:w-6 sm:h-6" />
          <span className="whitespace-nowrap">Drew&apos;s Lab</span>
        </Link>
  <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-3 md:gap-6 text-sm">
          <Link 
            href="/about" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-1.5 sm:px-2"
            prefetch={false}
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-1.5 sm:px-2"
            prefetch={false}
          >
            Blog
          </Link>
          <Link 
            href="/projects" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-1.5 sm:px-2"
            prefetch={false}
          >
            Projects
          </Link>
          <ThemeToggle />
          {process.env.NODE_ENV === "development" && <DevToolsDropdown />}
          {/* Environment badge - show only when NOT production (server-rendered) - hide on mobile */}
          {process.env.NODE_ENV !== "production" && (
            <Badge
              variant={
                process.env.NODE_ENV === "development"
                  ? "destructive"
                  : "secondary"
              }
              className="hidden lg:inline-flex"
            >
              {process.env.NODE_ENV ?? "unknown"}
            </Badge>
          )}
        </nav>
      </div>
    </header>
  );
}
