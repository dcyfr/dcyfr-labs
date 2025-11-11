import { NextResponse } from "next/server";
import { posts } from "@/data/posts";
import { visibleProjects } from "@/data/projects";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { SITE_URL } from "@/lib/site-config";

// Define static page configurations
const pageConfig = {
  "/": { changeFrequency: "weekly", priority: 1.0 },
  "/about": { changeFrequency: "yearly", priority: 0.5 },
  "/blog": { changeFrequency: "weekly", priority: 0.8 },
  "/projects": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "yearly", priority: 0.6 },
} as const;

function getStaticPages(): string[] {
  const appDir = join(process.cwd(), "src/app");
  const pages: string[] = [];

  function scanDirectory(dir: string, route: string = ""): void {
    try {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (item.startsWith(".") || item === "api" || item.startsWith("[")) {
            continue;
          }
          
          // Check if this directory has a page.tsx
          const pagePath = join(fullPath, "page.tsx");
          try {
            statSync(pagePath);
            // This directory has a page
            const routePath = route + "/" + item;
            pages.push(routePath);
          } catch {
            // No page.tsx in this directory
          }
          
          // Recursively scan subdirectories
          scanDirectory(fullPath, route + "/" + item);
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  // Add home page
  pages.push("/");
  
  // Scan for other pages
  scanDirectory(appDir);
  
  return pages;
}

function generateSitemapXML(): string {
  const base = SITE_URL;
  const now = new Date().toISOString();
  
  // Get all static pages dynamically
  const staticPages = getStaticPages();
  
  // Generate sitemap entries for static pages
  const pageEntries = staticPages.map((page) => {
    const config = pageConfig[page as keyof typeof pageConfig] || {
      changeFrequency: "monthly",
      priority: 0.5,
    };
    
    return `  <url>
    <loc>${base}${page === "/" ? "" : page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${config.changeFrequency}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
  });
  
  // Generate sitemap entries for blog posts
  const blogPostEntries = posts.map((post) => {
    const lastMod = new Date(post.updatedAt ?? post.publishedAt).toISOString();
    return `  <url>
    <loc>${base}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });
  
  // Generate sitemap entries for project detail pages
  const projectEntries = visibleProjects.map((project) => {
    return `  <url>
    <loc>${base}/projects/${project.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });
  
  // Generate sitemap entries for feed URLs
  const feedEntries = [
    {
      url: `${base}/feed`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${base}/blog/feed`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${base}/projects/feed`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ].map((feed) => {
    return `  <url>
    <loc>${feed.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${feed.changeFrequency}</changefreq>
    <priority>${feed.priority}</priority>
  </url>`;
  });
  
  const allEntries = [...pageEntries, ...blogPostEntries, ...projectEntries, ...feedEntries];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.join('\n')}
</urlset>`;
}

export async function GET() {
  const sitemap = generateSitemapXML();
  
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
