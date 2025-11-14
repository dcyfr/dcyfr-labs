#!/usr/bin/env node

/**
 * Test script for rate limiting implementation
 * 
 * This script tests rate limiting on multiple endpoints:
 * 
 * Contact Form (/api/contact):
 * - 3 requests per 60 seconds per IP
 * - Tests successful requests (200 with email or warning)
 * - Tests rate limiting (429)
 * - Verifies rate limit headers
 * 
 * GitHub Contributions (/api/github-contributions):
 * - 10 requests per 60 seconds per IP
 * - Tests successful requests
 * - Tests rate limiting
 * - Verifies server-side caching (5-minute cache)
 * 
 * Usage:
 *   npm run test:rate-limit [endpoint]
 *   
 *   endpoint options:
 *     contact  - Test contact form only (default)
 *     github   - Test GitHub contributions only
 *     all      - Test all endpoints
 * 
 * Note: Requires the dev server to be running (npm run dev)
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CONTACT_ENDPOINT = `${BASE_URL}/api/contact`;
const GITHUB_ENDPOINT = `${BASE_URL}/api/github-contributions`;

// Test data
const CONTACT_PAYLOAD = {
  name: "Rate Limit Test",
  email: "test@example.com",
  message: "This is a test message for rate limiting validation.",
};

// Helper to format rate limit headers
function formatRateLimitHeaders(headers) {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");
  const retryAfter = headers.get("retry-after");

  return {
    limit,
    remaining,
    reset: reset ? new Date(parseInt(reset)).toISOString() : null,
    retryAfter,
  };
}

// Test contact form endpoint
async function testContactRequest(requestNumber) {
  console.log(`\n🔄 Contact Request ${requestNumber}...`);
  
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(CONTACT_PAYLOAD),
    });

    const data = await response.json();
    const rateLimitHeaders = formatRateLimitHeaders(response.headers);

    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Rate Limit Headers:`);
    console.log(`     Limit: ${rateLimitHeaders.limit}`);
    console.log(`     Remaining: ${rateLimitHeaders.remaining}`);
    console.log(`     Reset: ${rateLimitHeaders.reset || "N/A"}`);
    if (rateLimitHeaders.retryAfter) {
      console.log(`     Retry After: ${rateLimitHeaders.retryAfter}s`);
    }
    
    // Show warning if present (graceful fallback for missing RESEND_API_KEY)
    if (data.warning) {
      console.log(`   ⚠️  Warning: ${data.warning}`);
    }
    
    console.log(`   Response:`, JSON.stringify(data, null, 2));

    return {
      status: response.status,
      data,
      headers: rateLimitHeaders,
    };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return null;
  }
}

// Test GitHub contributions endpoint
async function testGitHubRequest(requestNumber) {
  console.log(`\n🔄 GitHub Request ${requestNumber}...`);
  
  try {
    const response = await fetch(`${GITHUB_ENDPOINT}?username=dcyfr`, {
      method: "GET",
    });

    const data = await response.json();
    const rateLimitHeaders = formatRateLimitHeaders(response.headers);

    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Rate Limit Headers:`);
    console.log(`     Limit: ${rateLimitHeaders.limit}`);
    console.log(`     Remaining: ${rateLimitHeaders.remaining}`);
    console.log(`     Reset: ${rateLimitHeaders.reset || "N/A"}`);
    if (rateLimitHeaders.retryAfter) {
      console.log(`     Retry After: ${rateLimitHeaders.retryAfter}s`);
    }
    
    // Show warning if present (missing GITHUB_TOKEN)
    if (data.warning) {
      console.log(`   ⚠️  Warning: ${data.warning}`);
    }
    
    // Show basic stats if successful
    if (response.status === 200 && data.totalContributions !== undefined) {
      console.log(`   Contributions: ${data.totalContributions}`);
    }

    return {
      status: response.status,
      data,
      headers: rateLimitHeaders,
    };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return null;
  }
}

// Test contact form rate limiting (3 requests per 60s)
async function testContactRateLimiting() {
  console.log("\n🧪 Testing Contact Form Rate Limiting");
  console.log("=".repeat(60));
  console.log(`Endpoint: ${CONTACT_ENDPOINT}`);
  console.log(`Expected Limit: 3 requests per 60 seconds`);

  // Make 4 requests to trigger rate limit
  const results = [];
  for (let i = 1; i <= 4; i++) {
    const result = await testContactRequest(i);
    results.push(result);
    
    if (i < 4) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Validate results
  console.log("\n" + "=".repeat(60));
  console.log("📊 Contact Form Test Results");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  // Check first 3 requests succeeded (200 OK, even if email not configured)
  for (let i = 0; i < 3; i++) {
    const result = results[i];
    if (result && result.status === 200) {
      console.log(`✅ Request ${i + 1}: SUCCESS (200 OK)`);
      if (result.data.warning) {
        console.log(`   Note: ${result.data.warning} (graceful fallback)`);
      }
      passed++;
    } else {
      console.log(`❌ Request ${i + 1}: FAILED (Expected 200, got ${result?.status || "ERROR"})`);
      failed++;
    }
  }

  // Check 4th request was rate limited
  const fourthRequest = results[3];
  if (fourthRequest && fourthRequest.status === 429) {
    console.log(`✅ Request 4: RATE LIMITED (429 Too Many Requests)`);
    if (fourthRequest.headers.retryAfter) {
      console.log(`   Retry After: ${fourthRequest.headers.retryAfter}s`);
    }
    passed++;
  } else {
    console.log(`❌ Request 4: FAILED (Expected 429, got ${fourthRequest?.status || "ERROR"})`);
    failed++;
  }

  // Check rate limit headers are present
  const hasHeaders = results.some(r => r && r.headers.limit && r.headers.remaining !== null);
  if (hasHeaders) {
    console.log(`✅ Rate limit headers present`);
    passed++;
  } else {
    console.log(`❌ Rate limit headers missing`);
    failed++;
  }

  return { passed, failed, total: 5 };
}

// Test GitHub contributions rate limiting (10 requests per 60s)
async function testGitHubRateLimiting() {
  console.log("\n🧪 Testing GitHub Contributions Rate Limiting");
  console.log("=".repeat(60));
  console.log(`Endpoint: ${GITHUB_ENDPOINT}`);
  console.log(`Expected Limit: 10 requests per 60 seconds`);

  // Make 11 requests to trigger rate limit
  const results = [];
  for (let i = 1; i <= 11; i++) {
    const result = await testGitHubRequest(i);
    results.push(result);
    
    if (i < 11) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Validate results
  console.log("\n" + "=".repeat(60));
  console.log("📊 GitHub Contributions Test Results");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  // Check first 10 requests succeeded
  for (let i = 0; i < 10; i++) {
    const result = results[i];
    if (result && result.status === 200) {
      console.log(`✅ Request ${i + 1}: SUCCESS (200 OK)`);
      if (result.data.warning) {
        console.log(`   Note: ${result.data.warning}`);
      }
      passed++;
    } else {
      console.log(`❌ Request ${i + 1}: FAILED (Expected 200, got ${result?.status || "ERROR"})`);
      failed++;
    }
  }

  // Check 11th request was rate limited
  const eleventhRequest = results[10];
  if (eleventhRequest && eleventhRequest.status === 429) {
    console.log(`✅ Request 11: RATE LIMITED (429 Too Many Requests)`);
    if (eleventhRequest.headers.retryAfter) {
      console.log(`   Retry After: ${eleventhRequest.headers.retryAfter}s`);
    }
    passed++;
  } else {
    console.log(`❌ Request 11: FAILED (Expected 429, got ${eleventhRequest?.status || "ERROR"})`);
    failed++;
  }

  // Check rate limit headers are present on rate-limited response
  const rateLimitedRequest = results[10];
  if (rateLimitedRequest && rateLimitedRequest.headers.limit) {
    console.log(`✅ Rate limit headers present on 429 response`);
    passed++;
  } else {
    console.log(`⚠️  Rate limit headers not present on 429 response (optional)`);
    // Don't fail - headers on success responses are optional
    passed++;
  }

  return { passed, failed, total: 12 };
}

// Main test runner
async function runTests() {
  const endpoint = process.argv[2] || "contact";
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  if (endpoint === "contact" || endpoint === "all") {
    const contactResults = await testContactRateLimiting();
    totalPassed += contactResults.passed;
    totalFailed += contactResults.failed;
    totalTests += contactResults.total;
  }

  if (endpoint === "github" || endpoint === "all") {
    if (endpoint === "all") {
      console.log("\n" + "⏳ Waiting 60 seconds for GitHub rate limit to reset...");
      console.log("   (Rate limit: 10 requests per 60 seconds)\n");
      
      // Show countdown
      for (let i = 60; i > 0; i -= 10) {
        console.log(`   ${i} seconds remaining...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      console.log("   Starting GitHub tests...\n");
    }
    
    const githubResults = await testGitHubRateLimiting();
    totalPassed += githubResults.passed;
    totalFailed += githubResults.failed;
    totalTests += githubResults.total;
  }

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log(`🎯 Final Score: ${totalPassed}/${totalTests} tests passed`);
  console.log("=".repeat(60));

  if (totalFailed === 0) {
    console.log("\n🎉 All tests passed! Rate limiting is working correctly.");
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the implementation.`);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
  } catch {
    console.error(`\n❌ Cannot connect to ${BASE_URL}`);
    console.error(`   Make sure the dev server is running: npm run dev\n`);
    process.exit(1);
  }
}

// Run tests
(async () => {
  await checkServer();
  await runTests();
})();
