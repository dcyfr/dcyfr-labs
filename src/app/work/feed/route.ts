/**
 * Work Feed (Atom 1.0)
 * 
 * Provides a feed of all work items (projects, creative works).
 * Available at: /work/feed
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { buildProjectsFeed } from "@/lib/feeds";

// Make this route dynamic to allow content negotiation via Accept header
export const dynamic = "force-dynamic";

// Lower update frequency for work feed (6 hours)
export const revalidate = 21600;

export async function GET(request: NextRequest) {
  try {
    // Check Accept header for format preference (auto-detection)
    const acceptHeader = request.headers.get("accept") || "";
    const prefersJson = acceptHeader.includes("application/json") || 
                       acceptHeader.includes("application/feed+json");
    
    if (prefersJson) {
      const json = await buildProjectsFeed(projects, "json", 20, "/work");
      
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/feed+json; charset=utf-8",
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      });
    }
    
    // Use the projects feed builder with /work path
    const xml = await buildProjectsFeed(projects, "atom", 20, "/work");
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating work feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
