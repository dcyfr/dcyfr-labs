#!/usr/bin/env node

/**
 * Test script for Table of Contents extraction
 */

/**
 * Generates a slug from heading text (same logic as rehype-slug)
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extract headings from MDX content for table of contents
 */
function extractHeadings(content) {
  const headings = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateSlug(text);
    
    headings.push({ id, text, level });
  }
  
  return headings;
}

const testContent = `
# Main Title (H1 - should be ignored)

## First Section
Some content here.

### Subsection A
More content.

### Subsection B
Even more content.

## Second Section
Another section.

### Nested Item
Under second.

## Third Section
Final section.
`;

console.log("Testing TOC extraction...\n");

const headings = extractHeadings(testContent);

console.log("Extracted headings:");
console.log(JSON.stringify(headings, null, 2));

console.log(`\nTotal headings: ${headings.length}`);
console.log(`Expected: 6 (3 H2s, 3 H3s)`);
console.log(`Test ${headings.length === 6 ? "✅ PASSED" : "❌ FAILED"}`);

// Verify structure
const h2Count = headings.filter(h => h.level === 2).length;
const h3Count = headings.filter(h => h.level === 3).length;

console.log(`\nH2 count: ${h2Count} (expected 3)`);
console.log(`H3 count: ${h3Count} (expected 3)`);
console.log(`Structure test ${h2Count === 3 && h3Count === 3 ? "✅ PASSED" : "❌ FAILED"}`);
