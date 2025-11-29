/**
 * Activity Feed Type System
 *
 * Unified types for the universal activity timeline, inspired by modern
 * social media feeds. Supports multiple content sources with a consistent
 * interface for rendering and filtering.
 *
 * @see /docs/features/activity-feed.md (TODO: create documentation)
 */

// ============================================================================
// ACTIVITY SOURCES & VERBS
// ============================================================================

/**
 * Sources that can generate activity items
 */
export type ActivitySource =
  | "blog" // Blog posts
  | "project" // Portfolio projects
  | "github" // GitHub commits/releases (future)
  | "changelog" // Site updates (future)
  | "milestone"; // Achievements (future)

/**
 * Action verbs describing what happened
 */
export type ActivityVerb =
  | "published" // New blog post
  | "updated" // Content update
  | "launched" // New project
  | "released" // Version release
  | "committed" // Code commit
  | "achieved"; // Milestone reached

/**
 * Display variants for different contexts
 */
export type ActivityVariant =
  | "compact" // Homepage widget: icon + title + time
  | "standard" // Activity page: full card with description
  | "timeline" // Vertical connected timeline with line
  | "minimal"; // Sidebar: text-only list

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

/**
 * Unified activity item that can represent any content type
 */
export interface ActivityItem {
  /** Unique identifier for React keys */
  id: string;

  /** Content source for filtering and styling */
  source: ActivitySource;

  /** Action verb for display text */
  verb: ActivityVerb;

  /** Main title/headline */
  title: string;

  /** Optional description/summary */
  description?: string;

  /** When the activity occurred */
  timestamp: Date;

  /** Link to the full content */
  href: string;

  /** Rich metadata for enhanced display */
  meta?: ActivityMeta;
}

/**
 * Optional metadata for enhanced activity display
 */
export interface ActivityMeta {
  /** Content tags for display */
  tags?: string[];

  /** Category (project category or post category) */
  category?: string;

  /** Featured image */
  image?: {
    url: string;
    alt: string;
  };

  /** Engagement stats (future) */
  stats?: {
    views?: number;
    stars?: number;
    comments?: number;
  };

  /** For GitHub activities */
  commits?: number;
  version?: string;

  /** Reading time for blog posts */
  readingTime?: string;

  /** Project status */
  status?: "active" | "in-progress" | "archived";
}

// ============================================================================
// TIME GROUPING
// ============================================================================

/**
 * Time-based grouping for social media style display
 */
export type TimeGroup =
  | "today"
  | "yesterday"
  | "this-week"
  | "this-month"
  | "older";

/**
 * Activity item with computed group for display
 */
export interface GroupedActivityItem extends ActivityItem {
  /** Computed time group for section headers */
  timeGroup: TimeGroup;
}

// ============================================================================
// FILTER OPTIONS
// ============================================================================

/**
 * Filter state for the activity feed
 */
export interface ActivityFilters {
  /** Filter by content source */
  sources?: ActivitySource[];

  /** Filter by time range */
  timeRange?: "today" | "week" | "month" | "year" | "all";

  /** Search query */
  query?: string;
}

/**
 * Props for the main ActivityFeed component
 */
export interface ActivityFeedProps {
  /** Activity items to display */
  items: ActivityItem[];

  /** Display variant */
  variant?: ActivityVariant;

  /** Maximum items to show (for truncated views) */
  limit?: number;

  /** Whether to show time group headers */
  showGroups?: boolean;

  /** Whether to show the filter bar */
  showFilters?: boolean;

  /** Loading state */
  isLoading?: boolean;

  /** Link to full activity page (for "View all" button) */
  viewAllHref?: string;

  /** CSS class overrides */
  className?: string;
}

// ============================================================================
// STYLING MAPS
// ============================================================================

/**
 * Color schemes for each activity source
 * Uses Tailwind classes for badge/icon styling
 */
export const ACTIVITY_SOURCE_COLORS: Record<
  ActivitySource,
  { badge: string; icon: string; border: string }
> = {
  blog: {
    badge: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: "text-blue-500",
    border: "border-l-blue-500",
  },
  project: {
    badge:
      "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: "text-purple-500",
    border: "border-l-purple-500",
  },
  github: {
    badge:
      "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
    icon: "text-green-500",
    border: "border-l-green-500",
  },
  changelog: {
    badge:
      "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: "text-amber-500",
    border: "border-l-amber-500",
  },
  milestone: {
    badge:
      "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    icon: "text-rose-500",
    border: "border-l-rose-500",
  },
} as const;

/**
 * Human-readable labels for sources
 */
export const ACTIVITY_SOURCE_LABELS: Record<ActivitySource, string> = {
  blog: "Post",
  project: "Project",
  github: "Code",
  changelog: "Update",
  milestone: "Milestone",
} as const;

/**
 * Human-readable labels for verbs
 */
export const ACTIVITY_VERB_LABELS: Record<ActivityVerb, string> = {
  published: "Published",
  updated: "Updated",
  launched: "Launched",
  released: "Released",
  committed: "Committed",
  achieved: "Achieved",
} as const;
