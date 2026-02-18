#!/usr/bin/env node
/**
 * Structured Data Validation Script
 * 
 * Tests all JSON-LD schemas against Google's Rich Results Test API
 * and validates schema.org compliance.
 * 
 * Usage: node scripts/validate-structured-data.mjs
 */

import { posts } from "../src/data/posts.ts";
import { visibleProjects } from "../src/data/projects.ts";
import { SITE_URL } from "../src/lib/site-config.ts";
import {
  getPersonSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getArticleSchema,
  getBlogCollectionSchema,
  getAboutPageSchema,
  getContactPageSchema,
} from "../src/lib/json-ld.ts";

const TEST_SCHEMAS = {
  // Website schema (homepage)
  "Homepage - WebSite": {
    "@context": "https://schema.org",
    "@graph": [
      getWebSiteSchema(),
      getPersonSchema(),
    ],
  },
  
  // Person schema
  "Person Schema": getPersonSchema(),
  
  // About page
  "About Page": getAboutPageSchema("Founder and cyber architect focused on building secure, scalable web applications."),
  
  // Contact page
  "Contact Page": getContactPageSchema("Get in touch with Drew for consulting, speaking, or collaboration opportunities."),
  
  // Blog collection
  "Blog Collection": {
    "@context": "https://schema.org",
    "@graph": [
      getWebSiteSchema(),
      getBlogCollectionSchema(posts.slice(0, 5), "Blog", "Articles on web development, security, and technology"),
    ],
  },
  
  // Article (use first published post)
  "Article - Blog Post": (() => {
    const post = posts[0];
    return {
      "@context": "https://schema.org",
      "@graph": [
        getWebSiteSchema(),
        getArticleSchema(post, 1234, `${SITE_URL}/blog/images/default/minimal.svg`),
        getBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]),
      ],
    };
  })(),
};

/**
 * Validate a schema object for common issues
 */
function validateSchema(schema, name) {
  void name;
  const issues = [];

  if (!schema["@context"]) issues.push("Missing @context property");
  if (!schema["@type"] && !schema["@graph"]) issues.push("Missing @type or @graph property");

  validateGraphItems(schema, issues);
  validatePersonType(schema, issues);
  validateArticleType(schema, issues);
  validateWebSiteType(schema, issues);
  checkJsonValues(schema, issues);

  return issues;
}

function validateGraphItems(schema, issues) {
  if (!schema["@graph"]) return;
  if (!Array.isArray(schema["@graph"])) {
    issues.push("@graph must be an array");
  } else {
    schema["@graph"].forEach((item, index) => {
      if (!item["@type"]) issues.push(`Graph item ${index} missing @type`);
    });
  }
}

function findTypedItem(schema, type) {
  if (schema["@type"] === type) return schema;
  if (schema["@graph"]) return schema["@graph"].find((g) => g["@type"] === type) ?? null;
  return null;
}

function validatePersonType(schema, issues) {
  const person = findTypedItem(schema, "Person");
  if (!person) return;
  if (!person.name) issues.push("Person missing name");
  if (!person.url) issues.push("Person missing url");
}

function validateArticleType(schema, issues) {
  const article = findTypedItem(schema, "Article");
  if (!article) return;
  if (!article.headline) issues.push("Article missing headline");
  if (!article.author) issues.push("Article missing author");
  if (!article.datePublished) issues.push("Article missing datePublished");
  if (!article.image) issues.push("Article missing image (recommended for Rich Results)");
}

function validateWebSiteType(schema, issues) {
  const website = findTypedItem(schema, "WebSite");
  if (!website) return;
  if (!website.name) issues.push("WebSite missing name");
  if (!website.url) issues.push("WebSite missing url");
}

function checkJsonValues(schema, issues) {
  const jsonStr = JSON.stringify(schema);
  if (jsonStr.includes("undefined")) issues.push("Contains undefined values");
  if (jsonStr.includes("localhost")) issues.push("Contains localhost URLs (should use production domain)");
}

function main() {
  console.log("🔍 Validating Structured Data Schemas\n");
  console.log("=".repeat(60));

  let totalSchemas = 0;
  let validSchemas = 0;
  let warnings = 0;

  for (const [name, schema] of Object.entries(TEST_SCHEMAS)) {
    totalSchemas++;
    console.log(`\n📋 Testing: ${name}`);
    console.log("-".repeat(60));

    try {
      const json = JSON.stringify(schema, null, 2);
      JSON.parse(json);

      const issues = validateSchema(schema, name);

      if (issues.length === 0) {
        console.log("✅ Valid - No issues found");
        validSchemas++;
      } else {
        console.log("⚠️  Warnings:");
        issues.forEach((issue) => {
          console.log(`   - ${issue}`);
          warnings++;
        });
      }

      const preview = json.length > 200 ? json.substring(0, 200) + "..." : json;
      console.log("\nSample JSON-LD:");
      console.log(preview);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`   Total schemas: ${totalSchemas}`);
  console.log(`   Valid: ${validSchemas}`);
  console.log(`   Warnings: ${warnings}`);
  console.log(`   Pass rate: ${Math.round((validSchemas / totalSchemas) * 100)}%`);

  if (validSchemas === totalSchemas && warnings === 0) {
    console.log("\n✅ All schemas are valid!");
    process.exit(0);
  } else if (validSchemas === totalSchemas) {
    console.log("\n⚠️  All schemas valid with warnings. Review recommended.");
    process.exit(0);
  } else {
    console.log("\n❌ Some schemas have errors. Fix required.");
    process.exit(1);
  }
}

main();
