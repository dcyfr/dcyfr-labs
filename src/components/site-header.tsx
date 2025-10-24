import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b site-header">
      <div className="mx-auto max-w-5xl px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold tracking-tight font-serif flex items-center align-middle gap-4">
          <Logo width={24} height={24} />
          <span className="hidden md:block">Drew's Lab</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm">
          <Link 
            href="/about" 
            className="hover:underline underline-offset-4 will-change-auto"
            prefetch={false}
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className="hover:underline underline-offset-4 will-change-auto"
            prefetch={false}
          >
            Blog
          </Link>
          <Link 
            href="/projects" 
            className="hover:underline underline-offset-4 will-change-auto"
            prefetch={false}
          >
            Projects
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
