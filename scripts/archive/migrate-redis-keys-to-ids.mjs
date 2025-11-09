#!/usr/bin/env node

/**
 * Redis Key Migration: Slug-based → ID-based
 * 
 * Migrates existing Redis view count keys from slug-based format to ID-based format
 * Old format: views:post:shipping-developer-portfolio
 * New format: views:post:post-20250910-abc123def456
 * 
 * This enables posts to be renamed without losing view data.
 * 
 * Usage: node scripts/migrate-redis-keys-to-ids.mjs
 */

import { createClient } from "redis";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Try to read REDIS_URL from environment or .env files
let redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  // Try reading from .env.local
  const envLocalPath = path.join(projectRoot, ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf-8");
    const match = envContent.match(/REDIS_URL="?([^"\n]+)"?/);
    if (match) {
      redisUrl = match[1];
      console.log(`📖 Loaded REDIS_URL from .env.local`);
    }
  }
}

if (!redisUrl) {
  console.error("❌ REDIS_URL not found");
  console.error("   Set REDIS_URL env variable or add it to .env.local");
  process.exit(1);
}

/**
 * Get all posts with their IDs and slugs
 */
function getPostData() {
  const posts = [];
  const contentDir = path.join(projectRoot, "src/content/blog");
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const frontmatter = match[1];
    const slug = file.replace(/\.mdx$/, "");

    // Parse YAML-like frontmatter (simple parsing)
    const publishedAt = frontmatter.match(/publishedAt:\s*"?([^"\n]+)"?/)?.[1];
    const id = frontmatter.match(/id:\s*"?([^"\n]+)"?/)?.[1];

    if (publishedAt) {
      posts.push({
        slug,
        id: id || generatePostId(publishedAt, slug),
        publishedAt,
      });
    }
  }

  return posts;
}

/**
 * Generate ID from publishedAt and slug (must match blog.ts logic)
 */
function generatePostId(publishedAt, slug) {
  const input = `${publishedAt}:${slug}`;
  const hash = crypto
    .createHash("sha256")
    .update(input)
    .digest("hex")
    .substring(0, 8);
  const date = publishedAt.replace(/-/g, "");
  return `post-${date}-${hash}`;
}

/**
 * Migrate Redis keys from slug-based to ID-based
 */
async function migrateRedisKeys() {
  const client = createClient({ url: redisUrl });

  client.on("error", (error) => {
    console.error("Redis error:", error);
  });

  try {
    await client.connect();
    console.log("✅ Connected to Redis\n");

    const posts = getPostData();
    console.log(`📋 Found ${posts.length} posts\n`);

    let totalMigrated = 0;
    let totalViewsMigrated = 0;

    for (const { slug, id, publishedAt } of posts) {
      const oldKey = `views:post:${slug}`;
      const newKey = `views:post:${id}`;

      const oldViews = await client.get(oldKey);

      if (oldViews) {
        const viewCount = Number(oldViews);
        console.log(`📝 Post: ${slug}`);
        console.log(`   Generated ID: ${id}`);
        console.log(`   Published: ${publishedAt}`);
        console.log(`   • Found ${viewCount.toLocaleString()} views on old key`);

        // Copy to new key
        await client.set(newKey, viewCount);
        console.log(`   ✅ Migrated to ${newKey}`);

        // Delete old key
        await client.del(oldKey);
        console.log(`   🗑️  Deleted old key: ${oldKey}\n`);

        totalMigrated++;
        totalViewsMigrated += viewCount;
      }
    }

    console.log(`${"=".repeat(60)}`);
    console.log(`✨ Migration complete!`);
    console.log(`   Keys migrated: ${totalMigrated}`);
    console.log(`   Total views migrated: ${totalViewsMigrated.toLocaleString()}`);
    console.log(`${"=".repeat(60)}\n`);

    if (totalMigrated === 0) {
      console.log("ℹ️  No old slug-based keys found. Redis is already up to date!\n");
    }

    await client.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    await client.quit();
    process.exit(1);
  }
}

migrateRedisKeys();
