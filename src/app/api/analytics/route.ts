import { NextResponse } from "next/server";
import { getMultiplePostViews, getMultiplePostViews24h } from "@/lib/views";
import { posts } from "@/data/posts";
import { createClient } from "redis";

// Only allow in development
const isDev = process.env.NODE_ENV === "development";

const redisUrl = process.env.REDIS_URL;

async function getRedisClient() {
  if (!redisUrl) return null;

  try {
    const client = createClient({ url: redisUrl });
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  } catch {
    return null;
  }
}

export async function GET() {
  // Only allow in development
  if (!isDev) {
    return NextResponse.json(
      { error: "Analytics only available in development" },
      { status: 403 }
    );
  }

  try {
    // Get view counts for all posts using their stable post IDs
    const postIds = posts.map((p) => p.id);
    const viewMap = await getMultiplePostViews(postIds);
    const views24hMap = await getMultiplePostViews24h(postIds);

    // Combine with post data
    const postsWithViews = posts
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        publishedAt: post.publishedAt,
        tags: post.tags,
        archived: post.archived ?? false,
        draft: post.draft ?? false,
        views: viewMap.get(post.id) || 0,
        views24h: views24hMap.get(post.id) || 0,
        readingTime: post.readingTime,
      }))
      .sort((a, b) => b.views - a.views);

    // Calculate statistics
    const totalViews = postsWithViews.reduce((sum, post) => sum + post.views, 0);
    const totalViews24h = postsWithViews.reduce((sum, post) => sum + post.views24h, 0);
    const averageViews =
      postsWithViews.length > 0 ? totalViews / postsWithViews.length : 0;
    const averageViews24h =
      postsWithViews.length > 0 ? totalViews24h / postsWithViews.length : 0;
    const topPost = postsWithViews[0];
    
    // Get top posts in last 24 hours
    const topPost24h = [...postsWithViews].sort((a, b) => b.views24h - a.views24h)[0];
    
    const trendingPosts = postsWithViews.slice(0, 5);
    
    // Get trending data from Redis if available
    let trendingFromRedis = null;
    const redis = await getRedisClient();
    if (redis) {
      try {
        const trendingData = await redis.get("blog:trending");
        if (trendingData) {
          trendingFromRedis = JSON.parse(trendingData);
        }
        await redis.quit();
      } catch (error) {
        console.error("Failed to fetch trending data:", error);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalPosts: postsWithViews.length,
        totalViews,
        totalViews24h,
        averageViews: Math.round(averageViews),
        averageViews24h: Math.round(averageViews24h),
        topPost: topPost
          ? {
              slug: topPost.slug,
              title: topPost.title,
              views: topPost.views,
              views24h: topPost.views24h,
            }
          : null,
        topPost24h: topPost24h
          ? {
              slug: topPost24h.slug,
              title: topPost24h.title,
              views: topPost24h.views,
              views24h: topPost24h.views24h,
            }
          : null,
      },
      posts: postsWithViews,
      trending: trendingFromRedis || trendingPosts,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
