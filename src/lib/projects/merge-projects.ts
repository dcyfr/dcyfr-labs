/**
 * Merge static and automated projects with deduplication and sorting.
 *
 * Deduplication key: `slug`. Static projects take priority over automated ones.
 * Sorting: featured first, then by publishedAt descending.
 */

import type { Project } from "@/data/projects";

/**
 * Merge static + automated projects.
 *
 * - Static projects always win on slug collision.
 * - Featured projects sort before non-featured.
 * - Within the same featured bucket, sort by `publishedAt` descending (newest first).
 */
export function mergeProjects(
  staticProjects: readonly Project[],
  automatedProjects: Project[],
): Project[] {
  const staticSlugs = new Set(staticProjects.map((p) => p.slug));

  // Only include automated projects whose slug doesn't conflict with a static one
  const dedupedAutomated = automatedProjects.filter((p) => !staticSlugs.has(p.slug));

  const merged = [...staticProjects, ...dedupedAutomated];

  return merged.sort((a, b) => {
    // Featured before non-featured
    if ((a.featured ?? false) !== (b.featured ?? false)) {
      return (b.featured ?? false) ? 1 : -1;
    }
    // Newest first
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}
