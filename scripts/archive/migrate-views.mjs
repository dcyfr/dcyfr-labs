#!/usr/bin/env node

/**
 * Migrate Redis view counts from old post slugs to new slugs
 * This script handles blog post renames where views were tracked under old slugs
 * 
 * Usage: node scripts/migrate-views.mjs
 * 
 * The script reads from posts data to find previousSlugs mappings,
 * then migrates Redis keys from old slugs to canonical slugs.
 */

import { createClient } from "redis";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const CONTENT_DIR = path.join(projectRoot, "src/content/blog");
const VIEW_KEY_PREFIX = "views:post:";

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
 * Read all blog posts and extract slug + previousSlugs mapping
 */
function readPostMappings() {
  const mappings = []; // Array of { canonicalSlug, previousSlugs }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content, {
      engines: {
        yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
      },
    });

    const canonicalSlug = file.replace(/\.mdx$/, "");
    const previousSlugs = data.previousSlugs || [];

    if (previousSlugs.length > 0) {
      mappings.push({
        canonicalSlug,
        previousSlugs,
      });
    }
  }

  return mappings;
}

/**
 * Migrate view counts from old slugs to new slugs in Redis
 */
async function migrateViews() {
  const client = createClient({ url: redisUrl });

  client.on("error", (error) => {
    console.error("Redis error:", error);
  });

  try {
    await client.connect();
    console.log("✅ Connected to Redis");

    const mappings = readPostMappings();
    console.log(`\n📋 Found ${mappings.length} post(s) with previous slugs\n`);

    let totalMigrated = 0;
    let totalViews = 0;

    for (const { canonicalSlug, previousSlugs } of mappings) {
      console.log(`\n📝 Post: ${canonicalSlug}`);
      console.log(`   Previous slugs: ${previousSlugs.join(", ")}`);

      const canonicalKey = `${VIEW_KEY_PREFIX}${canonicalSlug}`;
      const currentCanonicalViews = await client.get(canonicalKey);
      const currentCanonicalCount = currentCanonicalViews
        ? Number(currentCanonicalViews)
        : 0;

      console.log(
        `   Current views on new slug: ${currentCanonicalCount.toLocaleString()}`
      );

      for (const oldSlug of previousSlugs) {
        const oldKey = `${VIEW_KEY_PREFIX}${oldSlug}`;
        const oldViews = await client.get(oldKey);
        const oldCount = oldViews ? Number(oldViews) : 0;

        if (oldCount > 0) {
          console.log(
            `   • Found ${oldCount.toLocaleString()} views on old slug: "${oldSlug}"`
          );

          // Add old views to canonical slug
          const newTotal = currentCanonicalCount + oldCount;
          await client.set(canonicalKey, newTotal);
          console.log(
            `     ✅ Migrated to "${canonicalSlug}" (new total: ${newTotal.toLocaleString()})`
          );

          // Delete old key
          await client.del(oldKey);
          console.log(`     🗑️  Deleted old key: ${oldKey}`);

          totalMigrated++;
          totalViews += oldCount;
        } else {
          console.log(
            `   • No views on old slug: "${oldSlug}" (skipped)`
          );
        }
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`✨ Migration complete!`);
    console.log(`   Slugs migrated: ${totalMigrated}`);
    console.log(`   Total views recovered: ${totalViews.toLocaleString()}`);
    console.log(`${"=".repeat(60)}\n`);

    await client.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    await client.quit();
    process.exit(1);
  }
}

migrateViews();
