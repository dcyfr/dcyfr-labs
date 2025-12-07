/**
 * Activity Feed (Atom 1.0)
 * 
 * Comprehensive feed combining blog posts, projects, and changelog updates.
 * Available at: /activity/feed
 * 
 * Updates more frequently than other feeds (30 min revalidation) since
 * activity content changes more dynamically.
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { changelog } from "@/data/changelog";
import { buildActivityFeed } from "@/lib/feeds";

// Higher update frequency for activity feed (30 minutes)
export const revalidate = 1800;

export async function GET(request: NextRequest) {
  try {
    // Check Accept header for format preference (auto-detection)
    const acceptHeader = request.headers.get("accept") || "";
    const prefersJson = acceptHeader.includes("application/json") || 
                       acceptHeader.includes("application/feed+json");
    
    if (prefersJson) {
      // Serve JSON Feed format
      const json = await buildActivityFeed(posts, projects, changelog, "json", 50);
      
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/feed+json; charset=utf-8",
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      });
    }
    
    // Default to Atom format
    const xml = await buildActivityFeed(posts, projects, changelog, "atom", 50);
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating activity feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
