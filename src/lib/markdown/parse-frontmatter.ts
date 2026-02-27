/**
 * Extract YAML frontmatter from a README markdown string.
 *
 * Uses `gray-matter` (already a dcyfr-labs dependency) so parsing is
 * consistent with the rest of the codebase.
 */

import matter from "gray-matter";
import { REPO_DEFAULTS } from "@/config/repos-config";
import type { RepoFrontmatter } from "./types";

/**
 * Parse frontmatter from a raw README markdown string.
 *
 * Returns `{ frontmatter, body }` where `body` is the content
 * with the YAML block stripped. Returns empty frontmatter on failure.
 */
export function parseFrontmatter(raw: string): {
  frontmatter: RepoFrontmatter;
  body: string;
} {
  // Quick bail-out if there's no frontmatter delimiter
  if (!raw.trimStart().startsWith("---")) {
    return { frontmatter: {}, body: raw };
  }

  try {
    const { data, content } = matter(raw);
    const fm = data as Record<string, unknown>;

    const frontmatter: RepoFrontmatter = {};

    if (typeof fm.workShowcase === "boolean") frontmatter.workShowcase = fm.workShowcase;
    if (typeof fm.title === "string") frontmatter.title = fm.title.trim();
    if (typeof fm.description === "string") frontmatter.description = fm.description.trim();
    if (typeof fm.timeline === "string") frontmatter.timeline = fm.timeline.trim();
    if (typeof fm.featured === "boolean") frontmatter.featured = fm.featured;
    if (typeof fm.demo === "string") frontmatter.demo = fm.demo.trim();
    if (typeof fm.docs === "string") frontmatter.docs = fm.docs.trim();

    // status: must be one of the allowed values
    const VALID_STATUSES = ["active", "in-progress", "archived"] as const;
    if (typeof fm.status === "string" && VALID_STATUSES.includes(fm.status as never)) {
      frontmatter.status = fm.status as RepoFrontmatter["status"];
    }

    // category: must be one of the allowed values
    const VALID_CATEGORIES = ["community", "nonprofit", "code", "photography", "startup"] as const;
    if (typeof fm.category === "string" && VALID_CATEGORIES.includes(fm.category as never)) {
      frontmatter.category = fm.category as RepoFrontmatter["category"];
    }

    // Arrays: tech, tags, highlights
    if (Array.isArray(fm.tech)) {
      frontmatter.tech = fm.tech.filter((v): v is string => typeof v === "string");
    }
    if (Array.isArray(fm.tags)) {
      frontmatter.tags = fm.tags.filter((v): v is string => typeof v === "string");
    }
    if (Array.isArray(fm.highlights)) {
      frontmatter.highlights = fm.highlights.filter((v): v is string => typeof v === "string");
    }

    return { frontmatter, body: content };
  } catch {
    return { frontmatter: {}, body: raw };
  }
}

/**
 * Return `true` when the frontmatter opts this repo into the showcase
 * OR when the repo is in the explicit include list (checked upstream).
 */
export function isShowcaseRepo(frontmatter: RepoFrontmatter): boolean {
  return frontmatter.workShowcase === true;
}

/**
 * Apply default values to a frontmatter object.
 */
export function applyDefaults(frontmatter: RepoFrontmatter): Required<
  Pick<RepoFrontmatter, "status" | "category">
> &
  RepoFrontmatter {
  return {
    status: REPO_DEFAULTS.status,
    category: REPO_DEFAULTS.category,
    ...frontmatter,
  };
}
