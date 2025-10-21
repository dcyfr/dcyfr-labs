#!/usr/bin/env node
/**
 * Test script to validate RSS and Atom feed improvements
 * This script directly calls the feed route handlers to verify:
 * - Full HTML content is included
 * - Author information is present
 * - Categories/tags are included
 * - XML structure is valid
 */

import { GET as getRSS } from "../src/app/rss.xml/route.ts";
import { GET as getAtom } from "../src/app/atom.xml/route.ts";

async function testFeeds() {
  console.log("🧪 Testing RSS and Atom feeds...\n");

  try {
    // Test RSS feed
    console.log("📡 Testing RSS feed (rss.xml)...");
    const rssResponse = await getRSS();
    const rssText = await rssResponse.text();
    
    // Check for key RSS improvements
    const rssChecks = {
      "✓ XML declaration": rssText.includes('<?xml version="1.0"'),
      "✓ RSS 2.0 with namespaces": rssText.includes('xmlns:content') && rssText.includes('xmlns:atom'),
      "✓ Self-referential link": rssText.includes('<atom:link'),
      "✓ Author information": rssText.includes('<author>') || rssText.includes('<managingEditor>'),
      "✓ Generator tag": rssText.includes('<generator>'),
      "✓ Categories/tags": rssText.includes('<category>'),
      "✓ Full content": rssText.includes('<content:encoded>'),
      "✓ HTML in content": rssText.includes('<content:encoded><![CDATA[') && rssText.includes('<p>'),
      "✓ Valid pub dates": rssText.includes('<pubDate>'),
    };

    console.log("\nRSS Feed Checks:");
    Object.entries(rssChecks).forEach(([check, passed]) => {
      console.log(`  ${passed ? "✅" : "❌"} ${check.replace("✓ ", "")}`);
    });

    // Test Atom feed
    console.log("\n📡 Testing Atom feed (atom.xml)...");
    const atomResponse = await getAtom();
    const atomText = await atomResponse.text();

    // Check for key Atom improvements
    const atomChecks = {
      "✓ XML declaration": atomText.includes('<?xml version="1.0"'),
      "✓ Atom namespace": atomText.includes('xmlns="http://www.w3.org/2005/Atom"'),
      "✓ Self link": atomText.includes('rel="self"'),
      "✓ Alternate link": atomText.includes('rel="alternate"'),
      "✓ Author block": atomText.includes('<author>') && atomText.includes('<name>') && atomText.includes('<email>'),
      "✓ Generator tag": atomText.includes('<generator'),
      "✓ Categories": atomText.includes('<category'),
      "✓ Full content": atomText.includes('<content type="html">'),
      "✓ HTML in content": atomText.includes('<content type="html"><![CDATA[') && atomText.includes('<p>'),
      "✓ Published dates": atomText.includes('<published>'),
      "✓ Updated dates": atomText.includes('<updated>'),
    };

    console.log("\nAtom Feed Checks:");
    Object.entries(atomChecks).forEach(([check, passed]) => {
      console.log(`  ${passed ? "✅" : "❌"} ${check.replace("✓ ", "")}`);
    });

    // Summary
    const rssPassCount = Object.values(rssChecks).filter(Boolean).length;
    const atomPassCount = Object.values(atomChecks).filter(Boolean).length;
    const totalChecks = Object.keys(rssChecks).length + Object.keys(atomChecks).length;
    const totalPass = rssPassCount + atomPassCount;

    console.log("\n" + "=".repeat(50));
    console.log(`\n✨ Feed Validation Results: ${totalPass}/${totalChecks} checks passed`);
    
    if (totalPass === totalChecks) {
      console.log("🎉 All checks passed! RSS and Atom feeds are properly enhanced.\n");
      
      // Show sample content length
      const rssContentMatch = rssText.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
      if (rssContentMatch) {
        console.log(`📊 RSS content sample length: ${rssContentMatch[1].slice(0, 100).length}+ characters`);
      }
      
      const atomContentMatch = atomText.match(/<content type="html"><!\[CDATA\[([\s\S]*?)\]\]><\/content>/);
      if (atomContentMatch) {
        console.log(`📊 Atom content sample length: ${atomContentMatch[1].slice(0, 100).length}+ characters`);
      }
    } else {
      console.log("⚠️  Some checks failed. Review the output above.\n");
      process.exit(1);
    }

  } catch (error) {
    console.error("\n❌ Error testing feeds:", error);
    process.exit(1);
  }
}

testFeeds();
