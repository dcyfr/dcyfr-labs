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

  const buildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Drew's Blog</title>
    <link>${site}/blog</link>
    <description>Articles and notes on web development, security, and TypeScript.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
${itemsWithHtml
  .map((p) => {
    const categories = p.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n");
    
    // Add enclosure for featured image if available
    const enclosure = p.image?.url
      ? `      <enclosure url="${site}${p.image.url}" type="image/jpeg" />`
      : "";
    
    return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
      <description><![CDATA[${p.summary}]]></description>
      <content:encoded><![CDATA[${p.htmlContent}]]></content:encoded>
${categories}
${enclosure}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
