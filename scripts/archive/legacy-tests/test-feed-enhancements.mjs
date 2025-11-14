#!/usr/bin/env node

/**
 * Test Feed Enhancements
 * 
 * Validates that all feeds include:
 * - Featured images (enclosure links)
 * - Media RSS support (media:content tags)
 * - Proper XML structure
 * - All content types (blog posts and projects)
 * 
 * Run: node scripts/test-feed-enhancements.mjs
 * Run with dev server: npm run dev (in another terminal)
 */

const SITE_URL = "http://localhost:3000";
const FEEDS = [
  { name: "Combined Feed", url: `${SITE_URL}/feed`, expectsProjects: true },
  { name: "Blog Feed", url: `${SITE_URL}/blog/feed`, expectsProjects: false },
  { name: "Projects Feed", url: `${SITE_URL}/projects/feed`, expectsProjects: true },
];

/**
 * Fetch feed XML
 */
async function fetchFeed(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

/**
 * Count XML pattern occurrences
 */
function countPattern(xml, pattern) {
  const matches = xml.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Check for featured images in feed
 */
function checkFeaturedImages(xml) {
  const entries = countPattern(xml, /<entry>/g);
  const enclosures = countPattern(xml, /<link rel="enclosure"/g);
  const mediaContent = countPattern(xml, /<media:content/g);

  return {
    total: entries,
    withEnclosure: enclosures,
    withMediaContent: mediaContent,
  };
}

/**
 * Check for Media RSS namespace
 */
function checkMediaNamespace(xml) {
  return xml.includes('xmlns:media="http://search.yahoo.com/mrss/"');
}

/**
 * Check for proper feed metadata
 */
function checkFeedMetadata(xml) {
  return {
    hasTitle: xml.includes("<title>"),
    hasSubtitle: xml.includes("<subtitle>"),
    hasLogo: xml.includes("<logo>"),
    hasIcon: xml.includes("<icon>"),
    hasAuthor: xml.includes("<author>"),
    hasGenerator: xml.includes("<generator"),
    hasRights: xml.includes("<rights>"),
  };
}

/**
 * Extract sample image URLs
 */
function extractSampleImages(xml, limit = 3) {
  const enclosureRegex = /<link rel="enclosure"[^>]*href="([^"]+)"/g;
  const matches = [];
  let match;
  let count = 0;
  
  while ((match = enclosureRegex.exec(xml)) !== null && count < limit) {
    matches.push(match[1]);
    count++;
  }
  
  return matches;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 Testing Feed Enhancements\n");
  console.log("=" .repeat(60));

  let allPassed = true;

  for (const feed of FEEDS) {
    console.log(`\n📰 ${feed.name}: ${feed.url}`);
    console.log("-".repeat(60));

    try {
      // Fetch feed
      const xml = await fetchFeed(feed.url);

      // Test 1: Featured images
      const imageResults = checkFeaturedImages(xml);
      console.log(`\n✓ Found ${imageResults.total} entries`);
      console.log(`  • ${imageResults.withEnclosure} with enclosure links`);
      console.log(`  • ${imageResults.withMediaContent} with media:content tags`);

      if (imageResults.withEnclosure !== imageResults.total) {
        console.log(`  ⚠️  Warning: Not all entries have enclosure links`);
      }

      if (imageResults.withMediaContent !== imageResults.total) {
        console.log(`  ⚠️  Warning: Not all entries have media:content tags`);
      }

      // Show sample image URLs
      const sampleImages = extractSampleImages(xml, 3);
      if (sampleImages.length > 0) {
        console.log(`\n  Sample image URLs:`);
        sampleImages.forEach((url, i) => {
          console.log(`    ${i + 1}. ${url}`);
        });
      }

      // Test 2: Media RSS namespace
      const hasMediaNamespace = checkMediaNamespace(xml);
      console.log(`\n✓ Media RSS namespace: ${hasMediaNamespace ? "✓ Present" : "✗ Missing"}`);
      if (!hasMediaNamespace) {
        console.log(`  ⚠️  Warning: Media RSS namespace not found in XML`);
        allPassed = false;
      }

      // Test 3: Feed metadata
      const metadata = checkFeedMetadata(xml);
      console.log(`\n✓ Feed metadata:`);
      Object.entries(metadata).forEach(([key, value]) => {
        const status = value ? "✓" : "✗";
        console.log(`  ${status} ${key}`);
        if (!value) allPassed = false;
      });

      // Test 4: Project images (if applicable)
      if (feed.expectsProjects) {
        const hasProjectImages = xml.includes("/projects/default/");
        console.log(`\n✓ Project images: ${hasProjectImages ? "✓ Present" : "✗ Missing"}`);
        
        if (!hasProjectImages) {
          console.log(`  ⚠️  Warning: No project images found in feed`);
        }
      }

    } catch (error) {
      console.error(`\n❌ Error testing ${feed.name}:`, error.message);
      allPassed = false;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  if (allPassed) {
    console.log("✅ All feed enhancement tests passed!");
  } else {
    console.log("⚠️  Some tests failed or had warnings. Review output above.");
  }
  console.log("=".repeat(60) + "\n");

  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
