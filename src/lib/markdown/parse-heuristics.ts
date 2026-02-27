/**
 * Heuristic metadata extraction from README markdown.
 *
 * Used as a fallback when YAML frontmatter is absent or incomplete.
 * Scanning is capped to `maxHeuristicsLines` to keep build time low.
 */

import { REPO_DEFAULTS } from "@/config/repos-config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the first N lines of a string. */
function head(text: string, lines: number): string[] {
  return text.split("\n").slice(0, lines);
}

/** Strip leading `#` characters and trim. */
function stripHeading(line: string): string {
  return line.replace(/^#+\s*/, "").trim();
}

/** Return `true` if `line` is a markdown heading. */
function isHeading(line: string): boolean {
  return /^#{1,6}\s+/.test(line);
}

/** Return `true` if `line` is a markdown list item (-, *, +, or number). */
function isBullet(line: string): boolean {
  return /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line);
}

/** Extract the text portion of a bullet line. */
function bulletText(line: string): string {
  return line.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "").trim();
}

// ---------------------------------------------------------------------------
// Extractors
// ---------------------------------------------------------------------------

/**
 * Find the first non-empty paragraph that isn't a heading, code block,
 * badge line, or HTML comment.
 */
export function extractFirstParagraph(body: string): string | undefined {
  const lines = head(body, REPO_DEFAULTS.maxHeuristicsLines);
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;
    if (isHeading(trimmed)) continue;
    if (trimmed.startsWith("<!--")) continue;
    // Skip badge lines (usually just shields.io image links)
    if (/^\[!\[/.test(trimmed)) continue;
    if (/^!\[/.test(trimmed)) continue;
    // Skip horizontal rules
    if (/^[-*_]{3,}$/.test(trimmed)) continue;

    return trimmed;
  }
  return undefined;
}

/**
 * Extract bullet items from the first "Features", "Highlights", or "What's included"
 * section heading found in the README, up to 6 items.
 */
export function extractHighlights(body: string): string[] {
  const lines = head(body, REPO_DEFAULTS.maxHeuristicsLines);
  const SECTION_PATTERN = /^#{1,3}\s+(features|highlights|what.+included)/i;

  let inSection = false;
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inSection) {
      if (SECTION_PATTERN.test(trimmed)) {
        inSection = true;
      }
      continue;
    }

    // End of section: new heading
    if (isHeading(trimmed) && !SECTION_PATTERN.test(trimmed)) break;

    if (isBullet(trimmed)) {
      const text = bulletText(trimmed);
      if (text) items.push(text);
      if (items.length >= 6) break;
    }
  }

  return items;
}

/**
 * Return `true` when the README has a Features or Highlights section.
 */
export function hasFeaturesList(body: string): boolean {
  const lines = head(body, REPO_DEFAULTS.maxHeuristicsLines);
  return lines.some((l) => /^#{1,3}\s+(features|highlights|what.+included)/i.test(l.trim()));
}
