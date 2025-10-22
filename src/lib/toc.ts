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
 * Extract headings from MDX content for table of contents
 * Matches h2 and h3 headings (## and ###)
 */
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 2 for ##, 3 for ###
    const text = match[2].trim();
    const id = generateSlug(text);
    
    headings.push({ id, text, level });
  }
  
  return headings;
}
