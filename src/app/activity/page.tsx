import type { Metadata } from "next";
import { headers } from "next/headers";
import { createPageMetadata, getJsonLdScriptProps } from "@/lib/metadata";
import { SITE_URL, AUTHOR_NAME } from "@/lib/site-config";
import { CONTAINER_WIDTHS, CONTAINER_PADDING, CONTAINER_VERTICAL_PADDING } from "@/lib/design-tokens";
import { PageHero } from "@/components/layouts/page-hero";
import { ActivityPageClient } from "./activity-client";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { changelog } from "@/data/changelog";
import {
  transformPosts,
  transformProjects,
  transformChangelog,
  aggregateActivities,
} from "@/lib/activity/sources";
import {
  transformPostsWithViews,
  transformTrendingPosts,
  transformMilestones,
  transformHighEngagementPosts,
  transformCommentMilestones,
  transformGitHubActivity,
} from "@/lib/activity/sources.server";
import type { ActivityItem } from "@/lib/activity/types";

const pageTitle = "Activity";
const pageDescription =
  "Real-time timeline of blog posts, project updates, trending content, milestones, and GitHub activity.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/activity",
});

// Enable ISR for activity page - revalidate every 5 minutes
export const revalidate = 300;

export default async function ActivityPage() {
  // Get nonce from proxy for CSP
  const nonce = (await headers()).get("x-nonce") || "";

  // Fetch activities directly (no HTTP request needed in server component)
  let allActivities: ActivityItem[] = [];
  let error: string | null = null;

  try {
    // Gather activity from all sources in parallel (same as API route)
    const activities: ActivityItem[] = [];
    
    await Promise.all([
      // Blog posts with views
      transformPostsWithViews(posts)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Blog posts fetch failed:", err)),
      
      // Projects
      Promise.resolve(transformProjects([...projects]))
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Projects fetch failed:", err)),
      
      // Changelog
      Promise.resolve(transformChangelog(changelog))
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Changelog fetch failed:", err)),
      
      // Trending posts
      transformTrendingPosts(posts, 10)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Trending posts fetch failed:", err)),
      
      // Milestones
      transformMilestones(posts, 20)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Milestones fetch failed:", err)),
      
      // High engagement posts
      transformHighEngagementPosts(posts, 5, 10)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] High engagement posts fetch failed:", err)),
      
      // Comment milestones
      transformCommentMilestones(posts, 10)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] Comment milestones fetch failed:", err)),
      
      // GitHub activity
      transformGitHubActivity("dcyfr", ["dcyfr-labs"], 15)
        .then((items) => activities.push(...items))
        .catch((err) => console.error("[Activity Page] GitHub activity fetch failed:", err)),
    ]);

    // Aggregate and sort (limit to 100 for page)
    allActivities = aggregateActivities(activities, { limit: 100 });
  } catch (err) {
    error = "Failed to load activities";
    console.error("[Activity Page]", err);
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/activity`,
    url: `${SITE_URL}/activity`,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    inLanguage: "en-US",
  };

  // Serialize activities for client component
  const serializedActivities = allActivities.map((activity) => ({
    ...activity,
    timestamp:
      typeof activity.timestamp === "string"
        ? activity.timestamp
        : activity.timestamp?.toISOString?.() || new Date().toISOString(),
  }));

  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />

      {/* Header */}
      <div id="activity-header">
        <PageHero
          title={pageTitle}
          description={pageDescription}
          variant="homepage"
        />
      </div>

      <div
        className={`container ${CONTAINER_WIDTHS.standard} mx-auto ${CONTAINER_PADDING} pb-8`}
      >

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-8">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Activities may be temporarily unavailable. Please try again later.
            </p>
          </div>
        )}

        {/* Activity Feed */}
        <div id="activity-feed">
          <ActivityPageClient activities={serializedActivities} />
        </div>
      </div>
    </>
  );
}
