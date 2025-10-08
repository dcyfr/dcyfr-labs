import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600; // 1 hour

export async function GET() {
  const site = SITE_URL;
  const items = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const updated = items[0]?.updatedAt ?? items[0]?.publishedAt ?? new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Drew's Blog</title>
  <link href="${site}/atom.xml" rel="self" />
  <link href="${site}/blog" />
  <updated>${updated}</updated>
  <id>${site}/</id>
  ${items
    .map(
      (p) => `
  <entry>
    <title><![CDATA[${p.title}]]></title>
    <link href="${site}/blog/${p.slug}" />
    <id>${site}/blog/${p.slug}</id>
  <updated>${p.updatedAt ?? p.publishedAt}</updated>
  <summary type="html"><![CDATA[${p.summary}]]></summary>
  </entry>`
    )
    .join("")}
</feed>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
