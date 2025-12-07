import type { Metadata } from "next";
import { headers } from "next/headers";
import { createPageMetadata, getJsonLdScriptProps } from "@/lib/metadata";
import { SITE_URL, AUTHOR_NAME } from "@/lib/site-config";
import { CONTAINER_WIDTHS, CONTAINER_PADDING, CONTAINER_VERTICAL_PADDING } from "@/lib/design-tokens";
import { PageHero } from "@/components/layouts/page-hero";
import { ActivityPageClient } from "./activity-client";

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

  // Fetch activities from API
  // Use internal URL to avoid network overhead
  // In development, use localhost. In production, use VERCEL_URL or SITE_URL
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : SITE_URL;
  
  let allActivities: any[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(`${baseUrl}/api/activity?limit=100`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (response.ok) {
      const data = await response.json();
      allActivities = data.activities || [];
    } else {
      error = `Failed to fetch activities: ${response.status}`;
      console.error("[Activity Page]", error);
    }
  } catch (err) {
    error = "Failed to connect to activity API";
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
