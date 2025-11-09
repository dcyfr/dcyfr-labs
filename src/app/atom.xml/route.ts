import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { SITE_URL, AUTHOR_NAME, AUTHOR_EMAIL } from "@/lib/site-config";
import { mdxToHtml } from "@/lib/mdx-to-html";

export const revalidate = 3600; // 1 hour

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const site = SITE_URL;
  const items = [...posts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 20); // Limit to 20 most recent posts

  // Convert all post bodies to HTML
  const itemsWithHtml = await Promise.all(
    items.map(async (post) => ({
      ...post,
      htmlContent: await mdxToHtml(post.body),
    }))
  );

  const updated = items[0]?.updatedAt ?? items[0]?.publishedAt ?? new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Drew's Blog</title>
  <subtitle>Articles and notes on web development, security, and TypeScript.</subtitle>
  <link href="${site}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${site}/blog" rel="alternate" type="text/html" />
  <updated>${updated}</updated>
  <id>${site}/</id>
  <author>
    <name>${AUTHOR_NAME}</name>
    <email>${AUTHOR_EMAIL}</email>
  </author>
  <generator uri="https://nextjs.org/">Next.js</generator>
${itemsWithHtml
  .map((p) => {
    const categories = p.tags
      .map((tag) => `    <category term="${escapeXml(tag)}" label="${escapeXml(tag)}" />`)
      .join("\n");
    const published = p.publishedAt;
    const updated = p.updatedAt ?? p.publishedAt;
    
    // Add link element for featured image if available
    const imageLink = p.image?.url
      ? `    <link rel="enclosure" type="image/jpeg" href="${site}${p.image.url}" />`
      : "";
    
    return `  <entry>
    <title type="text">${escapeXml(p.title)}</title>
    <link href="${site}/blog/${p.slug}" rel="alternate" type="text/html" />
${imageLink}
    <id>${site}/blog/${p.slug}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <author>
      <name>${AUTHOR_NAME}</name>
      <email>${AUTHOR_EMAIL}</email>
    </author>
    <summary type="html"><![CDATA[${p.summary}]]></summary>
    <content type="html"><![CDATA[${p.htmlContent}]]></content>
${categories}
  </entry>`;
  })
  .join("\n")}
</feed>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
