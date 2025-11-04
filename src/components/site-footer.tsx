import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t mt-16 site-footer">
      <div className="mx-auto max-w-5xl px-6 md:px-8 h-16 flex items-center justify-between text-sm">
        <p className="text-muted-foreground flex items-center gap-1">
          &copy; {new Date().getFullYear()} Drew <Logo width={12} height={12} className="opacity-70" />
        </p>
        <div className="flex items-center gap-4">
          <a href="/contact" className="hover:underline underline-offset-4 will-change-auto">
            Contact
          </a>
          <a href="/atom.xml" className="hover:underline underline-offset-4 will-change-auto">
            Feed
          </a>
          <a href="/rss.xml" className="hover:underline underline-offset-4 will-change-auto">
            RSS
          </a>
          <a href="/sitemap.xml" className="hover:underline underline-offset-4 will-change-auto">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
