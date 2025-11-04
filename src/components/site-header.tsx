import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import DevToolsDropdown from "@/components/dev-tools-dropdown";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b site-header">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-serif text-lg md:text-xl font-semibold tracking-tight touch-target">
          <Logo width={24} height={24} />
          <span>Drew&apos;s Lab</span>
        </Link>
  <nav aria-label="Main navigation" className="flex items-center gap-3 md:gap-6 text-sm">
          <Link 
            href="/about" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-2"
            prefetch={false}
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-2"
            prefetch={false}
          >
            Blog
          </Link>
          <Link 
            href="/projects" 
            className="hover:underline underline-offset-4 will-change-auto touch-target px-2"
            prefetch={false}
          >
            Projects
          </Link>
          <ThemeToggle />
          {process.env.NODE_ENV === "development" && <DevToolsDropdown />}
          {/* Environment badge - show only when NOT production (server-rendered) */}
          {process.env.NODE_ENV !== "production" && (
            <Badge
              variant={
                process.env.NODE_ENV === "development"
                  ? "destructive"
                  : "secondary"
              }
            >
              {process.env.NODE_ENV ?? "unknown"}
            </Badge>
          )}
        </nav>
      </div>
    </header>
  );
}
