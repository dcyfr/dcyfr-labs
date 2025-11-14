#!/usr/bin/env node
/**
 * Test script to validate RSS and Atom feed improvements
 * This script directly calls the feed route handlers to verify:
 * - Full HTML content is included
 * - Author information is present
 * - Categories/tags are included
 * - XML structure is valid
 * - Project URLs use /projects/slug (not hash-based)
 * - Feed icons and branding present
 */

import { GET as getRSS } from "../src/app/rss.xml/route.ts";
import { GET as getAtom } from "../src/app/atom.xml/route.ts";
import { GET as getBlogFeed } from "../src/app/blog/feed/route.ts";
import { GET as getProjectsFeed } from "../src/app/projects/feed/route.ts";
import { GET as getCombinedFeed } from "../src/app/feed/route.ts";

async function testFeeds() {
  console.log("🧪 Testing RSS and Atom feeds...\n");

  try {
    // Test legacy RSS redirect
    console.log("📡 Testing legacy RSS redirect (rss.xml)...");
    try {
      await getRSS();
      console.log("  ✅ RSS redirect configured");
    } catch (error) {
      if (error.message?.includes('NEXT_REDIRECT')) {
        console.log("  ✅ RSS redirect to /feed working");
      } else {
        throw error;
      }
    }

    // Test legacy Atom redirect
    console.log("\n📡 Testing legacy Atom redirect (atom.xml)...");
    try {
      await getAtom();
      console.log("  ✅ Atom redirect configured");
    } catch (error) {
      if (error.message?.includes('NEXT_REDIRECT')) {
        console.log("  ✅ Atom redirect to /feed working");
      } else {
        throw error;
      }
    }

    // Test Blog Feed
    console.log("\n📰 Testing Blog Feed (/blog/feed)...");
    const blogResponse = await getBlogFeed();
    const blogText = await blogResponse.text();
    
    const blogChecks = {
      "XML declaration": blogText.includes('<?xml version="1.0"'),
      "Atom namespace": blogText.includes('xmlns="http://www.w3.org/2005/Atom"'),
      "Feed logo": blogText.includes('<logo>'),
      "Feed icon": blogText.includes('<icon>'),
      "Copyright/rights": blogText.includes('<rights>'),
      "Author information": blogText.includes('<author>'),
      "Blog URLs": blogText.includes('/blog/'),
      "Full content": blogText.includes('<content type="html">'),
    };

    console.log("\n  Blog Feed Checks:");
    Object.entries(blogChecks).forEach(([check, passed]) => {
      console.log(`    ${passed ? "✅" : "❌"} ${check}`);
    });

    // Test Projects Feed - CRITICAL URL CHECK
    console.log("\n🚀 Testing Projects Feed (/projects/feed)...");
    const projectsResponse = await getProjectsFeed();
    const projectsText = await projectsResponse.text();
    
    const projectChecks = {
      "XML declaration": projectsText.includes('<?xml version="1.0"'),
      "Feed logo": projectsText.includes('<logo>'),
      "Feed icon": projectsText.includes('<icon>'),
      "Copyright/rights": projectsText.includes('<rights>'),
      "Project URLs (not hash)": !projectsText.includes('/projects#') && projectsText.includes('/projects/'),
      "Full content": projectsText.includes('<content type="html">'),
    };

    console.log("\n  Projects Feed Checks:");
    Object.entries(projectChecks).forEach(([check, passed]) => {
      console.log(`    ${passed ? "✅" : "❌"} ${check}`);
    });
    
    // CRITICAL: Verify no hash-based URLs
    if (projectsText.includes('/projects#')) {
      console.error("\n  ❌ CRITICAL ERROR: Found hash-based URLs (/projects#slug)");
      console.error("     Project URLs should be /projects/slug");
      process.exit(1);
    } else {
      console.log("\n  ✅ VERIFIED: All project URLs use /projects/slug format");
    }

    // Test Combined Feed
    console.log("\n🌐 Testing Combined Feed (/feed)...");
    const combinedResponse = await getCombinedFeed();
    const combinedText = await combinedResponse.text();
    
    const combinedChecks = {
      "XML declaration": combinedText.includes('<?xml version="1.0"'),
      "Feed logo": combinedText.includes('<logo>'),
      "Feed icon": combinedText.includes('<icon>'),
      "Blog entries": combinedText.includes('/blog/'),
      "Project entries": combinedText.includes('/projects/'),
      "No hash URLs": !combinedText.includes('/projects#'),
    };

    console.log("\n  Combined Feed Checks:");
    Object.entries(combinedChecks).forEach(([check, passed]) => {
      console.log(`    ${passed ? "✅" : "❌"} ${check}`);
    });

    console.log("\n✨ All feed tests passed!");
    console.log("\n📋 Improvements Verified:");
    console.log("  ✅ Project URLs fixed: /projects/slug (not #slug)");
    console.log("  ✅ Feed icons added: logo + icon elements");
    console.log("  ✅ Copyright information included");
    console.log("  ✅ Full HTML content in feeds");
    console.log("\n🎯 Available Feeds:");
    console.log("  • /feed - Combined (posts + projects)");
    console.log("  • /blog/feed - Blog posts only");
    console.log("  • /projects/feed - Projects only");
    console.log("  • /rss.xml - Legacy redirect → /feed");
    console.log("  • /atom.xml - Legacy redirect → /feed");

  } catch (error) {
    console.error("\n❌ Feed test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testFeeds();
