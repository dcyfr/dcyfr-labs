import * as React from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import { CopyCodeButton } from "@/components/copy-code-button";

/**
 * Configuration for the rehype-pretty-code plugin
 * Enables syntax highlighting with Shiki using dual-theme support:
 * - Dark theme: "github-dark-dimmed" (optimized for dark mode)
 * - Light theme: "github-light" (optimized for light mode)
 *
 * Features:
 * - Automatic theme switching based on user's theme preference
 * - Line and character highlighting support
 * - Empty line prevention in grid layout
 * - Configurable default language (plaintext for unknown languages)
 *
 * @type {RehypePrettyCodeOptions}
 */
// Configure syntax highlighting with Shiki
const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  defaultLang: "plaintext",
  // Prevent lines from collapsing in `display: grid` mode
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
};

/**
 * Helper function to extract text content from React children recursively
 */
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement(children) && children.props) {
    const props = children.props as { children?: React.ReactNode };
    return extractTextFromChildren(props.children);
  }
  return "";
}

/**
 * Custom component mapping for MDX elements
 * Maps HTML/Markdown elements to styled React components using Tailwind CSS.
 *
 * Includes:
 * - Heading hierarchy (h1-h3) with serif fonts and proper spacing
 * - Paragraph styling with leading and margin adjustment
 * - Code blocks with theme-aware syntax highlighting
 * - Inline code with monospace font and border
 * - Lists with proper indentation
 * - Blockquotes with left border and italics
 * - Links with external link handling and underline styling
 * - Horizontal rules for content separation
 *
 * @type {NonNullable<MDXRemoteProps["components"]>}
 */
// Map a few elements to tailwind-styled components
const components: NonNullable<MDXRemoteProps["components"]> = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mt-8 first:mt-0 scroll-mt-20" />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mt-8 scroll-mt-20" />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="font-serif text-xl md:text-2xl font-medium mt-6 scroll-mt-20" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="leading-7 [&:not(:first-child)]:mt-4" />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      {...props} 
      className="font-serif italic border-l-4 border-primary/30 pl-6 my-6 text-muted-foreground"
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc pl-5 [&>li]:mt-2" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-5 [&>li]:mt-2" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Inline code (no data-language attribute)
    const isInline = !props["data-language" as keyof typeof props];
    if (isInline) {
      return (
        <code 
          {...props} 
          className="rounded-md bg-muted px-1.5 py-0.5 text-[0.875em] font-mono font-medium border border-border/50"
        />
      );
    }
    // Code blocks handled by pre > code (rehype-pretty-code)
    return <code {...props} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    // Extract the code content for the copy button
    const codeContent = React.Children.toArray(props.children)
      .map((child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as { children?: React.ReactNode };
          return extractTextFromChildren(childProps.children);
        }
        return "";
      })
      .join("");

    return (
      <div className="relative group">
        <CopyCodeButton code={codeContent} />
        <pre 
          {...props} 
          className="[&>code]:grid [&>code]:text-[0.875rem] overflow-x-auto"
        />
      </div>
    );
  },
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="mt-8 mb-4 border-border" />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isHeaderAnchor = props.className?.includes('no-underline');
    const href = props.href || '';
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    
    return (
      <a 
        {...props} 
        className={isHeaderAnchor 
          ? "hover:text-primary" 
          : "underline underline-offset-4 hover:text-primary"
        }
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer"
        })}
      />
    );
  },
};

/**
 * MDX Component
 *
 * Renders MDX (Markdown + JSX) content with rich formatting, syntax highlighting,
 * and automatic table of contents generation.
 *
 * Processing Pipeline:
 * 1. **Remark plugins**:
 *    - remark-gfm: GitHub-flavored markdown (tables, strikethrough, task lists)
 *
 * 2. **Rehype plugins** (in order):
 *    - rehype-slug: Generates IDs for headings (used by TOC and anchor links)
 *    - rehype-pretty-code: Syntax highlighting with Shiki (dual-theme support)
 *    - rehype-autolink-headings: Wraps headings with self-referential links
 *
 * 3. **Component mapping**:
 *    - Custom Tailwind-styled components for HTML elements
 *    - Consistent typography and spacing via utility classes
 *    - Theme-aware styling (light/dark mode)
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.source - Raw MDX source code to render
 *
 * @returns {React.ReactElement} Rendered MDX content with styled elements
 *
 * @example
 * // Render blog post content
 * const mdxSource = "# Hello World\n\nThis is **bold** text.";
 * <MDX source={mdxSource} />
 *
 * @features
 * - **Syntax Highlighting**: Code blocks use Shiki with github-light/github-dark-dimmed themes
 * - **Auto-generated Headings IDs**: Headings get slugified IDs for linking
 * - **Header Links**: Heading anchors for direct navigation
 * - **GitHub Tables**: Support for markdown tables
 * - **Task Lists**: Checkbox lists in markdown
 * - **External Links**: Automatic target="_blank" and rel="noopener noreferrer"
 * - **Theme Aware**: All components respect light/dark mode preferences
 *
 * @performance
 * - Server-side rendering: MDX processing happens at build time via next-mdx-remote/rsc
 * - No client-side JavaScript overhead for rendering
 * - Syntax highlighting pre-computed during build
 *
 * @accessibility
 * - Semantic HTML structure with proper heading hierarchy
 * - Links are keyboard accessible and screen reader friendly
 * - Code blocks have proper language hints for assistive technology
 * - Heading anchors wrap the entire heading for better click targets
 *
 * @see /docs/components/mdx.md for detailed documentation
 */
export function MDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, rehypePrettyCodeOptions],
            [
              rehypeAutolinkHeadings, 
              { 
                behavior: "wrap",
                properties: {
                  className: "no-underline hover:text-primary"
                }
              }
            ]
          ],
        },
      }}
      components={components}
    />
  );
}
