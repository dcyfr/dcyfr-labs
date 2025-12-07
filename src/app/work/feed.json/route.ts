/**
 * Work Feed - JSON Format
 * 
 * JSON Feed 1.1 format for portfolio projects.
 * Available at: /work/feed.json
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { buildProjectsFeed } from "@/lib/feeds";

export const revalidate = 21600; // 6 hours (same as Atom feed)

export async function GET() {
  try {
    const json = await buildProjectsFeed(projects, "json", 20, "/work");
    
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating work JSON feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
