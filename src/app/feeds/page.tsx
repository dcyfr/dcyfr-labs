/**
 * Feed Discovery Hub
 * 
 * Central page for discovering and subscribing to all available feeds.
 * Lists available feeds with descriptions, update frequencies, and format options.
 */

import { Metadata } from "next";
import { PageLayout } from "@/components/layouts";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_TITLE } from "@/lib/site-config";
import { SPACING, TYPOGRAPHY } from "@/lib/design-tokens";
import { Rss, Activity, FileText, Briefcase } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Subscribe to Feeds",
  description: "Subscribe to RSS/Atom feeds for blog posts, projects, activity updates, and more. Stay up to date with the latest content.",
  path: "/feeds",
});

interface FeedInfo {
  id: string;
  title: string;
  description: string;
  url: string;
  updateFrequency: string;
  icon: React.ComponentType<{ className?: string }>;
  formats: Array<{
    label: string;
    url: string;
    type: string;
  }>;
}

const feeds: FeedInfo[] = [
  {
    id: "activity",
    title: "Activity Feed",
    description: "Complete timeline of all content: blog posts, projects, and site updates. The most comprehensive feed available.",
    url: "/activity/feed",
    updateFrequency: "Updated every 30 minutes",
    icon: Activity,
    formats: [
      { label: "Atom", url: "/activity/feed", type: "application/atom+xml" },
      { label: "JSON Feed", url: "/activity/feed.json", type: "application/feed+json" },
    ],
  },
  {
    id: "blog",
    title: "Blog Feed",
    description: "Latest blog posts covering web development, security, TypeScript, and tech insights.",
    url: "/blog/feed",
    updateFrequency: "Updated hourly",
    icon: FileText,
    formats: [
      { label: "Atom", url: "/blog/feed", type: "application/atom+xml" },
      { label: "JSON Feed", url: "/blog/feed.json", type: "application/feed+json" },
    ],
  },
  {
    id: "work",
    title: "Work Feed",
    description: "Portfolio projects, open-source contributions, and creative works.",
    url: "/work/feed",
    updateFrequency: "Updated every 6 hours",
    icon: Briefcase,
    formats: [
      { label: "Atom", url: "/work/feed", type: "application/atom+xml" },
      { label: "JSON Feed", url: "/work/feed.json", type: "application/feed+json" },
    ],
  },
  {
    id: "unified",
    title: "Legacy Unified Feed",
    description: "Combined blog posts and projects feed. Redirects to Activity Feed (kept for backward compatibility).",
    url: "/feed",
    updateFrequency: "Redirects to Activity Feed",
    icon: Rss,
    formats: [
      { label: "Atom", url: "/feed", type: "application/atom+xml" },
    ],
  },
];

export default function FeedsPage() {
  return (
    <PageLayout>
      <div className={`space-y-${SPACING.section}`}>
        {/* Header */}
        <div className={`space-y-${SPACING.content}`}>
          <h1 className={TYPOGRAPHY.h1.standard}>Subscribe to Feeds</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay up to date with the latest content from {SITE_TITLE}. Choose from our various feeds based on your interests
            and preferred update frequency.
          </p>
        </div>

        {/* What are feeds? */}
        <div className="prose dark:prose-invert max-w-2xl">
          <h2 className={TYPOGRAPHY.h2.standard}>What are RSS/Atom feeds?</h2>
          <p className="text-muted-foreground">
            Feeds allow you to subscribe to content updates without visiting the website. Use a feed reader like{" "}
            <a href="https://feedly.com" target="_blank" rel="noopener noreferrer" className="underline">
              Feedly
            </a>
            ,{" "}
            <a href="https://www.inoreader.com" target="_blank" rel="noopener noreferrer" className="underline">
              Inoreader
            </a>
            , or{" "}
            <a href="https://netnewswire.com" target="_blank" rel="noopener noreferrer" className="underline">
              NetNewsWire
            </a>{" "}
            to aggregate updates from multiple sources in one place.
          </p>
        </div>

        {/* Feed List */}
        <div className={`grid gap-${SPACING.content} mt-8`}>
          {feeds.map((feed) => {
            const Icon = feed.icon;
            return (
              <div
                key={feed.id}
                className="border rounded-lg p-8 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-md bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`flex-1 space-y-${SPACING.compact}`}>
                    <div>
                      <h3 className={TYPOGRAPHY.h3.standard}>{feed.title}</h3>
                      <p className="text-muted-foreground">{feed.description}</p>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {feed.updateFrequency}
                    </div>

                    {/* Format Links */}
                    <div className={`flex flex-wrap gap-${SPACING.compact} pt-2`}>
                      {feed.formats.map((format) => (
                        <a
                          key={format.label}
                          href={`${SITE_URL}${format.url}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                          type={format.type}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Rss className="h-4 w-4" />
                          Subscribe via {format.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className={`prose dark:prose-invert max-w-2xl mt-12 pt-8 border-t`}>
          <h2 className={TYPOGRAPHY.h2.standard}>Format Options</h2>
          <dl className={`space-y-${SPACING.content}`}>
            <div>
              <dt className="font-semibold">Atom</dt>
              <dd className="text-muted-foreground ml-0">
                Industry-standard XML feed format with excellent reader support. Recommended for most users.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">JSON Feed</dt>
              <dd className="text-muted-foreground ml-0">
                Modern JSON-based format that&apos;s easier to parse for developers building custom integrations.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PageLayout>
  );
}
