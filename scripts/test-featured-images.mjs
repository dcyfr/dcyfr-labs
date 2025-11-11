#!/usr/bin/env node
/**
 * Test script to verify featured images are properly loaded
 */

import { getAllPosts } from "../src/lib/blog.ts";

console.log("🔍 Testing Featured Image Implementation\n");
console.log("=" .repeat(60));

const posts = getAllPosts();

console.log(`\nFound ${posts.length} total posts\n`);

// Check each post for image configuration
posts.forEach((post, index) => {
  console.log(`\n${index + 1}. ${post.title}`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Draft: ${post.draft || false}`);
  console.log(`   Archived: ${post.archived || false}`);
  
  if (post.image) {
    console.log(`   ✅ Has featured image:`);
    console.log(`      URL: ${post.image.url}`);
    console.log(`      Alt: ${post.image.alt}`);
    if (post.image.caption) {
      console.log(`      Caption: ${post.image.caption}`);
    }
    if (post.image.width && post.image.height) {
      console.log(`      Dimensions: ${post.image.width}x${post.image.height}`);
    }
  } else {
    console.log(`   ⚠️  No featured image (will use default)`);
  }
});

console.log("\n" + "=".repeat(60));

// Summary
const postsWithImages = posts.filter(p => p.image);
const postsWithoutImages = posts.filter(p => !p.image);

console.log("\n📊 Summary:");
console.log(`   Total posts: ${posts.length}`);
console.log(`   With custom images: ${postsWithImages.length}`);
console.log(`   Without custom images (using defaults): ${postsWithoutImages.length}`);

if (postsWithoutImages.length > 0) {
  console.log("\n⚠️  Posts without custom images:");
  postsWithoutImages.forEach(p => {
    console.log(`   - ${p.slug} (${p.draft ? 'draft' : p.archived ? 'archived' : 'published'})`);
  });
}

console.log("\n✅ Test complete!\n");
