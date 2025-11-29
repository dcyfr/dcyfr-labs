/**
 * Site Changelog Data
 *
 * Manual entries for significant site updates, features, and milestones.
 * These appear in the activity feed alongside blog posts and projects.
 */

export type ChangelogType = "feature" | "improvement" | "fix" | "milestone";

export interface ChangelogEntry {
  /** Unique identifier */
  id: string;
  /** Entry type for styling */
  type: ChangelogType;
  /** Short title */
  title: string;
  /** Optional longer description */
  description?: string;
  /** ISO date string */
  date: string;
  /** Optional link to related page/commit */
  href?: string;
  /** Whether to show in activity feed */
  visible?: boolean;
}

/**
 * Changelog entries - add new entries at the top
 */
export const changelog: ChangelogEntry[] = [
  {
    id: "activity-feed-launch",
    type: "feature",
    title: "Launched Universal Activity Timeline",
    description: "New social media-inspired activity feed with filtering, time grouping, and multiple display variants.",
    date: "2025-11-29",
    href: "/activity",
    visible: true,
  },
  {
    id: "github-heatmap",
    type: "feature",
    title: "Added GitHub Contribution Heatmap",
    description: "Visual display of GitHub activity on the portfolio page.",
    date: "2025-11-15",
    href: "/about#github-activity",
    visible: true,
  },
  {
    id: "dark-mode",
    type: "feature",
    title: "Dark Mode Support",
    description: "System-aware dark mode with manual toggle option.",
    date: "2025-10-01",
    visible: true,
  },
  {
    id: "blog-launch",
    type: "milestone",
    title: "Blog Section Launched",
    description: "Technical blog with MDX support, syntax highlighting, and reading time estimates.",
    date: "2025-09-15",
    href: "/blog",
    visible: true,
  },
  {
    id: "site-launch",
    type: "milestone",
    title: "Site Launch",
    description: "DCYFR Labs portfolio site goes live.",
    date: "2025-08-01",
    href: "/",
    visible: true,
  },
];

export const visibleChangelog = changelog.filter((entry) => entry.visible !== false);
