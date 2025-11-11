import Link from "next/link";
import { Card } from "@/components/ui/card";
import { socialLinks } from "@/data/socials";
import {
  Github,
  Linkedin,
  Heart,
  Users,
  BookOpen,
  Home,
  Mail,
  Calendar,
  Award,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

/**
 * Social Links Grid Component
 * 
 * Displays social media and professional profile links in a grid layout.
 * Handles both internal links (homepage, contact) and external links (social platforms).
 * 
 * Features:
 * - Responsive grid (1 col mobile, 2 cols desktop)
 * - Platform-specific icons
 * - Hover effects with border/icon color transitions
 * - Internal link optimization (Next.js Link component)
 * - External link indicators
 * 
 * @example
 * ```tsx
 * <SocialLinksGrid />
 * ```
 */
export function SocialLinksGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {socialLinks.map((social) => {
        // Map platform to icon component
        const IconComponent =
          social.platform === "homepage"
            ? Home
            : social.platform === "email"
              ? Mail
              : social.platform === "calendar"
                ? Calendar
                : social.platform === "linkedin"
                  ? Linkedin
                  : social.platform === "github"
                    ? Github
                    : social.platform === "github-sponsor"
                      ? Heart
                      : social.platform === "peerlist"
                        ? Users
                        : social.platform === "goodreads"
                          ? BookOpen
                          : social.platform === "credly"
                            ? Award
                            : social.platform === "orcid"
                              ? GraduationCap
                              : ExternalLink;

        // Determine if this is an internal link
        const isInternalLink =
          social.url.startsWith("/") ||
          (social.url.includes("cyberdrew.dev") &&
            (social.url.endsWith("/") || social.url.endsWith("/contact")));

        // Get the internal path for homepage and contact
        const internalPath =
          social.platform === "homepage"
            ? "/"
            : social.platform === "email"
              ? "/contact"
              : social.url;

        // Render internal links with Link component
        if (
          isInternalLink &&
          (social.platform === "homepage" || social.platform === "email")
        ) {
          return (
            <Link key={social.platform} href={internalPath} className="group">
              <Card className="p-4 h-full transition-colors hover:border-primary">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <IconComponent
                      className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {social.label}
                    </p>
                    {social.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {social.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        }

        // Render external links with <a> tag
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="p-4 h-full transition-colors hover:border-primary">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <IconComponent
                    className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {social.label}
                  </p>
                  {social.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {social.description}
                    </p>
                  )}
                </div>
                <ExternalLink
                  className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
            </Card>
          </a>
        );
      })}
    </div>
  );
}
