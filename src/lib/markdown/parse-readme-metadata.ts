/**
 * Main README metadata parser.
 *
 * Combines YAML frontmatter parsing with heuristic fallbacks to produce
 * a `ParsedReadmeMetadata` object for a repository's README content.
 */

import { parseFrontmatter } from "./parse-frontmatter";
import {
  extractFirstParagraph,
  extractHighlights,
  hasFeaturesList,
} from "./parse-heuristics";
import type { ParsedReadmeMetadata } from "./types";

/**
 * Parse a README markdown string into structured metadata.
 *
 * @param raw - Raw README content (may be empty string for repos without README)
 * @returns Parsed metadata with both frontmatter fields and heuristic extractions
 */
export function parseReadmeMetadata(raw: string): ParsedReadmeMetadata {
  const { frontmatter, body } = parseFrontmatter(raw);

  return {
    frontmatter,
    bodyWithoutFrontmatter: body,
    firstParagraph: extractFirstParagraph(body),
    hasFeaturesList: hasFeaturesList(body),
    extractedHighlights: extractHighlights(body),
  };
}
