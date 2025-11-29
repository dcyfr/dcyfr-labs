import { Badge } from "@/components/ui/badge";
import type { Post, PostCategory } from "@/data/posts";

interface PostBadgesProps {
  post: Post;
  size?: "default" | "sm";
  isLatestPost?: boolean;
  isHotPost?: boolean;
  showCategory?: boolean;
}

// Category styles - dimmer/muted colors (secondary emphasis)
const CATEGORY_STYLES: Record<PostCategory, string> = {
  "development": "border-blue-400/40 bg-blue-400/10 text-blue-600/80 dark:text-blue-400/80",
  "security": "border-red-400/40 bg-red-400/10 text-red-600/80 dark:text-red-400/80",
  "career": "border-green-400/40 bg-green-400/10 text-green-600/80 dark:text-green-400/80",
  "ai": "border-purple-400/40 bg-purple-400/10 text-purple-600/80 dark:text-purple-400/80",
  "tutorial": "border-amber-400/40 bg-amber-400/10 text-amber-600/80 dark:text-amber-400/80",
};

const CATEGORY_LABEL: Record<PostCategory, string> = {
  "development": "Development",
  "security": "Security",
  "career": "Career",
  "ai": "AI",
  "tutorial": "Tutorial",
};

/**
 * Display status badges for a blog post (Draft, Archived, Hot, New, etc.)
 * Badges are displayed inline to the right of the title text
 * Note: These badges are NOT links since they're rendered inside clickable cards
 */
export function PostBadges({ 
  post, 
  size = "default",
  isLatestPost,
  isHotPost,
  showCategory = false,
}: PostBadgesProps) {
  const badges = [];

  // Draft badge (development only) - primary color
  if (process.env.NODE_ENV === "development" && post.draft) {
    badges.push(
      <Badge
        key="draft"
        variant="outline"
        className={`border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300 backdrop-blur-sm font-semibold ${size === "sm" ? "text-xs" : ""}`}
      >
        Draft
      </Badge>
    );
  }

  // Archived badge - primary color
  if (post.archived) {
    badges.push(
      <Badge
        key="archived"
        variant="outline"
        className={`border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300 backdrop-blur-sm font-semibold ${size === "sm" ? "text-xs" : ""}`}
      >
        Archived
      </Badge>
    );
  }

  // New badge - for the latest published post (not archived or draft) - primary color
  if (isLatestPost && !post.archived && !post.draft) {
    badges.push(
      <Badge
        key="new"
        variant="outline"
        className={`border-green-500 bg-green-500/20 text-green-700 dark:text-green-300 backdrop-blur-sm font-semibold ${size === "sm" ? "text-xs" : ""}`}
      >
        New
      </Badge>
    );
  }

  // Hot badge - for the post with the most views (not draft or archived) - primary color
  if (isHotPost && !post.archived && !post.draft) {
    badges.push(
      <Badge
        key="hot"
        variant="outline"
        className={`border-red-500 bg-red-500/20 text-red-700 dark:text-red-300 backdrop-blur-sm font-semibold ${size === "sm" ? "text-xs" : ""}`}
      >
        Hot
      </Badge>
    );
  }

  // Category badge
  if (showCategory && post.category) {
    badges.push(
      <Badge
        key="category"
        variant="outline"
        className={`${CATEGORY_STYLES[post.category]} backdrop-blur-sm font-semibold ${size === "sm" ? "text-xs" : ""}`}
      >
        {CATEGORY_LABEL[post.category]}
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return <>{badges}</>;
}
