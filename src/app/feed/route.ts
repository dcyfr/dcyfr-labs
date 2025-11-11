/**
 * Unified Site Feed (Atom 1.0)
 * 
 * Provides a combined feed of blog posts and projects.
 * Available at: /feed
 * 
 * @see src/lib/feeds.ts for feed generation logic
 */

import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { buildCombinedFeed } from "@/lib/feeds";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const xml = await buildCombinedFeed(posts, projects, "atom", 20);
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating combined feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
