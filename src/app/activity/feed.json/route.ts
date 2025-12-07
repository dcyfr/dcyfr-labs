/**
 * Activity Feed - JSON Format
 * 
 * JSON Feed 1.1 format for activity timeline.
 * Available at: /activity/feed.json
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { changelog } from "@/data/changelog";
import { buildActivityFeed } from "@/lib/feeds";

export const revalidate = 1800; // 30 minutes (same as Atom feed)

export async function GET() {
  try {
    const json = await buildActivityFeed(posts, projects, changelog, "json", 50);
    
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating activity JSON feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
