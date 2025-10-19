import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Convert MDX/Markdown content to safe HTML string for RSS/Atom feeds.
 * Strips MDX-specific syntax and returns sanitized HTML.
 */
export async function mdxToHtml(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
    .use(rehypeSanitize) // Sanitize HTML for security
    .use(rehypeStringify) // Convert to HTML string
    .process(content);

  return String(file);
}
