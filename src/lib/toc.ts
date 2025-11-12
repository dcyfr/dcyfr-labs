/**
 * Extract table of contents from MDX content
 */

export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

/**
 * Generates a slug from heading text (same logic as rehype-slug)
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Strips markdown formatting from text
 * Removes: bold (**text**), italic (*text*), code (`text`), links ([text](url))
 */
function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')  // **bold**
    .replace(/\*(.+?)\*/g, '$1')      // *italic*
    .replace(/__(.+?)__/g, '$1')      // __bold__
    .replace(/_(.+?)_/g, '$1')        // _italic_
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Remove links [text](url)
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[(.+?)\]\(.+?\)/g, '$1')
    // Remove strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    .trim();
}

/**
 * Extract headings from MDX content for table of contents
 * Matches h2 and h3 headings (## and ###)
 */
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 2 for ##, 3 for ###
    const rawText = match[2].trim();
    const text = stripMarkdown(rawText); // Strip markdown formatting for display
    const id = generateSlug(rawText); // Use raw text for ID to match rehype-slug
    
    headings.push({ id, text, level });
  }
  
  return headings;
}
