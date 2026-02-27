/**
 * TypeScript types for README-extracted project metadata.
 */

import type { ProjectCategory, ProjectStatus } from "@/data/projects";

/**
 * Schema for YAML frontmatter declared inside a repository README.
 *
 * @example
 * ```yaml
 * ---
 * workShowcase: true
 * title: "My Library"
 * description: "A short description."
 * status: active
 * category: code
 * tech: ["TypeScript", "Node.js"]
 * tags: ["open-source", "typescript"]
 * featured: false
 * highlights:
 *   - "Feature one"
 *   - "Feature two"
 * demo: "https://demo.example.com"
 * docs: "https://docs.example.com"
 * ---
 * ```
 */
export interface RepoFrontmatter {
  /** Set to `true` to include this repo in the showcase. Required. */
  workShowcase?: boolean;
  /** Override the repo name as the project title */
  title?: string;
  /** Override the GitHub description */
  description?: string;
  /** Project lifecycle status */
  status?: ProjectStatus;
  /** Project category for filtering */
  category?: ProjectCategory;
  /** Technology stack */
  tech?: string[];
  /** Extra tags / topics */
  tags?: string[];
  /** Whether to pin this project at the top */
  featured?: boolean;
  /** Short highlight bullets */
  highlights?: string[];
  /** Live demo URL */
  demo?: string;
  /** Documentation URL */
  docs?: string;
  /** Timeline string, e.g. "2024 → Present" */
  timeline?: string;
}

/**
 * Combined metadata that can come from either frontmatter or heuristics.
 * All fields are optional since sources are unreliable.
 */
export interface ParsedReadmeMetadata {
  frontmatter: RepoFrontmatter;
  /** First non-heading paragraph, used as fallback description */
  firstParagraph?: string;
  /** Whether the README contains a "Features" / "Highlights" section */
  hasFeaturesList?: boolean;
  /** Items extracted from a Features / Highlights list */
  extractedHighlights?: string[];
  /** Body content with frontmatter stripped */
  bodyWithoutFrontmatter: string;
}
