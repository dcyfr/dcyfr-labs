#!/usr/bin/env node

/**
 * Populate Local Dev Cache
 *
 * Populates Redis cache in local development by calling the populate-cache API.
 * This is useful when you want to test GitHub Activity/Credly components locally.
 *
 * Usage:
 *   npm run populate:cache
 *   # or directly:
 *   node scripts/populate-local-cache.mjs
 */

async function populateLocalCache() {
  const port = process.env.PORT || 3000;
  const url = `http://localhost:${port}/api/dev/populate-cache`;

  console.log('🔄 Populating local dev cache...');
  console.log(`📡 Calling: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Failed to populate cache: ${response.status} ${response.statusText}`);
      console.error(text);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Cache populated successfully!');
    console.log(data);

    console.log('\n📊 Cache Status:');
    console.log(`  - GitHub contributions: ${data.github ? '✅' : '❌'}`);
    console.log(`  - Credly badges: ${data.credly ? '✅' : '❌'}`);

    if (data.details) {
      console.log('\n📝 Details:');
      if (data.details.github) {
        console.log(`  GitHub: ${data.details.github.message || 'No details'}`);
        if (data.details.github.key) {
          console.log(`    Key: ${data.details.github.key}`);
        }
      }
      if (data.details.credly) {
        console.log(`  Credly: ${data.details.credly.message || 'No details'}`);
        if (data.details.credly.keys) {
          console.log(`    Keys: ${data.details.credly.keys.length} variants cached`);
        }
      }
    }

    if (data.message && !data.success) {
      console.warn(`\n⚠️  Warning: ${data.message}`);
    }
  } catch (error) {
    console.error('❌ Error populating cache:', error);
    console.error('\n💡 Make sure:');
    console.error(`  1. Dev server is running: npm run dev`);
    console.error(`  2. Server is listening on port ${port}`);
    console.error(`  3. Redis credentials are configured in .env.local`);
    process.exit(1);
  }
}

populateLocalCache();
