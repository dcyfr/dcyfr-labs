import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t mt-16 site-footer">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 md:py-0 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-sm">
        <p className="text-muted-foreground flex items-center gap-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} Drew <Logo width={12} height={12} className="opacity-70" />
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a href="/contact" className="hover:underline underline-offset-4 will-change-auto whitespace-nowrap">
            Contact
          </a>
          <a href="/atom.xml" className="hover:underline underline-offset-4 will-change-auto whitespace-nowrap">
            Feed
          </a>
          <a href="/rss.xml" className="hover:underline underline-offset-4 will-change-auto whitespace-nowrap">
            RSS
          </a>
          <a href="/sitemap.xml" className="hover:underline underline-offset-4 will-change-auto whitespace-nowrap">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
