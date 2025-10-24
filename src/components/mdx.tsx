import * as React from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";

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
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre 
      {...props} 
      className="group relative [&>code]:grid [&>code]:text-[0.875rem]"
    />
  ),
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
