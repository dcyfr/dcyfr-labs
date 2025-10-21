import * as React from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Map a few elements to tailwind-styled components
const components: NonNullable<MDXRemoteProps["components"]> = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="text-3xl md:text-4xl font-semibold tracking-tight mt-8 first:mt-0 scroll-mt-20" />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="text-2xl md:text-3xl font-semibold tracking-tight mt-8 scroll-mt-20" />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-xl md:text-2xl font-medium mt-6 scroll-mt-20" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="leading-7 [&:not(:first-child)]:mt-4" />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc pl-5 [&>li]:mt-2" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-5 [&>li]:mt-2" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className="rounded bg-muted py-0.5 text-sm" />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="overflow-x-auto rounded bg-muted mt-4 p-4 text-sm" />
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
