import type { Post } from "@/data/posts";
import { getMultiplePostViews } from "@/lib/views";

export interface PostBadgeMetadata {
  latestSlug: string | null;
  hottestSlug: string | null;
}

/**
 * Calculate which posts should receive "New" and "Hot" badges
 * - Latest: Most recent published post (not archived, not draft)
 * - Hottest: Post with most views (not archived, not draft)
 */
export async function getPostBadgeMetadata(posts: Post[]): Promise<PostBadgeMetadata> {
  // Find latest post (most recent, not archived, not draft)
  const latestPost = [...posts]
    .filter(p => !p.archived && !p.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))[0];
  
  // Get view counts for all non-archived, non-draft posts
  const eligiblePosts = posts.filter(p => !p.archived && !p.draft);
  const viewMap = await getMultiplePostViews(eligiblePosts.map(p => p.slug));
  
  // Find the post with the most views
  let hottestSlug: string | null = null;
  let maxViews = 0;
  viewMap.forEach((views, slug) => {
    if (views > maxViews) {
      maxViews = views;
      hottestSlug = slug;
    }
  });
  
  return {
    latestSlug: latestPost?.slug ?? null,
    hottestSlug: maxViews > 0 ? hottestSlug : null,
  };
}
