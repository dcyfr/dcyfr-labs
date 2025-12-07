/**
 * Blog Feed (Atom 1.0)
 * 
 * Provides a feed of blog posts only.
 * Available at: /blog/feed
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { buildBlogFeed } from "@/lib/feeds";

export const revalidate = 3600; // 1 hour

export async function GET(request: NextRequest) {
  try {
    // Check Accept header for format preference (auto-detection)
    const acceptHeader = request.headers.get("accept") || "";
    const prefersJson = acceptHeader.includes("application/json") || 
                       acceptHeader.includes("application/feed+json");
    
    if (prefersJson) {
      const json = await buildBlogFeed(posts, "json", 20);
      
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/feed+json; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }
    
    const xml = await buildBlogFeed(posts, "atom", 20);
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating blog feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
