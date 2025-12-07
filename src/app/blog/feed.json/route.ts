/**
 * Blog Feed - JSON Format
 * 
 * JSON Feed 1.1 format for blog posts.
 * Available at: /blog/feed.json
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { buildBlogFeed } from "@/lib/feeds";

export const revalidate = 3600; // 1 hour (same as Atom feed)

export async function GET() {
  try {
    const json = await buildBlogFeed(posts, "json", 20);
    
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating blog JSON feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
