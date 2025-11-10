#!/usr/bin/env node

/**
 * Test view and share tracking under normal conditions
 * 
 * Verifies:
 * 1. View tracking increments correctly
 * 2. Share tracking increments correctly
 * 3. Session deduplication works (prevents double counting)
 * 4. Time validation works
 * 5. Redis keys are properly formatted
 * 
 * Usage: node scripts/test-tracking.mjs
 */

import { createClient } from "redis";
import { randomUUID } from "crypto";

// Configuration
const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const REDIS_URL = process.env.REDIS_URL;

// Test data
const TEST_POST_ID = "test-post-" + Date.now();
const SESSION_ID = randomUUID();

// Colors for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, "green");
}

function logError(message) {
  log(`✗ ${message}`, "red");
}

function logInfo(message) {
  log(`ℹ ${message}`, "cyan");
}

function logWarning(message) {
  log(`⚠ ${message}`, "yellow");
}

/**
 * Make a tracking request with proper headers
 */
async function makeRequest(endpoint, data) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return { response, data: result };
}

/**
 * Get value from Redis
 */
async function getRedisValue(key) {
  if (!REDIS_URL) return null;
  
  const client = createClient({ url: REDIS_URL });
  await client.connect();
  
  try {
    const value = await client.get(key);
    return value ? parseInt(value, 10) : 0;
  } finally {
    await client.quit();
  }
}

/**
 * Test view tracking
 */
async function testViewTracking() {
  log("\n" + "=".repeat(60), "bright");
  log("Testing View Tracking", "bright");
  log("=".repeat(60), "bright");

  // Test 1: Normal view tracking
  logInfo("\nTest 1: Track a view with valid timing");
  const viewRequest = {
    postId: TEST_POST_ID,
    sessionId: SESSION_ID,
    timeOnPage: 6000, // 6 seconds (exceeds minimum)
    isVisible: true,
  };

  const { response: viewRes1, data: viewData1 } = await makeRequest(
    "/api/views",
    viewRequest
  );

  if (viewRes1.ok && viewData1.recorded) {
    logSuccess(`View recorded successfully (count: ${viewData1.count})`);
  } else {
    logError(`View not recorded: ${viewData1.error || viewData1.message}`);
  }

  // Test 2: Duplicate view (should be rejected)
  logInfo("\nTest 2: Attempt duplicate view (same session)");
  const { data: viewData2 } = await makeRequest(
    "/api/views",
    viewRequest
  );

  if (!viewData2.recorded && viewData2.message) {
    logSuccess(`Duplicate view correctly rejected: ${viewData2.message}`);
  } else if (viewData2.recorded) {
    logError("Duplicate view was counted (should have been rejected)");
  } else {
    logError(`Unexpected response: ${JSON.stringify(viewData2)}`);
  }

  // Test 3: View with insufficient time (should be rejected)
  logInfo("\nTest 3: Attempt view with insufficient time on page");
  const quickViewRequest = {
    postId: TEST_POST_ID,
    sessionId: randomUUID(), // New session to avoid deduplication
    timeOnPage: 1000, // Only 1 second (below minimum)
    isVisible: true,
  };

  const { response: viewRes3, data: viewData3 } = await makeRequest(
    "/api/views",
    quickViewRequest
  );

  if (!viewRes3.ok && viewData3.error) {
    logSuccess(`Quick view correctly rejected: ${viewData3.error}`);
  } else if (viewData3.recorded) {
    logError("Quick view was counted (should have been rejected)");
  } else {
    logSuccess(`Quick view correctly rejected: ${viewData3.error || "validation failed"}`);
  }

  // Verify Redis
  if (REDIS_URL) {
    logInfo("\nVerifying Redis storage...");
    const redisKey = `views:post:${TEST_POST_ID}`;
    const redisValue = await getRedisValue(redisKey);
    if (redisValue > 0) {
      logSuccess(`Redis key exists with value: ${redisValue}`);
    } else {
      logError(`Redis key not found or has value 0`);
    }
  }

  return viewData1.count;
}

/**
 * Test share tracking
 */
async function testShareTracking() {
  log("\n" + "=".repeat(60), "bright");
  log("Testing Share Tracking", "bright");
  log("=".repeat(60), "bright");

  // Test 1: Normal share tracking
  logInfo("\nTest 1: Track a share with valid timing");
  const shareRequest = {
    postId: TEST_POST_ID,
    sessionId: SESSION_ID,
    timeOnPage: 3000, // 3 seconds (exceeds minimum)
  };

  const { response: shareRes1, data: shareData1 } = await makeRequest(
    "/api/shares",
    shareRequest
  );

  if (shareRes1.ok && shareData1.recorded) {
    logSuccess(`Share recorded successfully (count: ${shareData1.count})`);
  } else {
    logError(`Share not recorded: ${shareData1.error || shareData1.message}`);
  }

  // Test 2: Duplicate share (should be rejected)
  logInfo("\nTest 2: Attempt duplicate share (same session)");
  const { data: shareData2 } = await makeRequest(
    "/api/shares",
    shareRequest
  );

  if (!shareData2.recorded && shareData2.message) {
    logSuccess(`Duplicate share correctly rejected: ${shareData2.message}`);
  } else if (shareData2.recorded) {
    logError("Duplicate share was counted (should have been rejected)");
  } else {
    logError(`Unexpected response: ${JSON.stringify(shareData2)}`);
  }

  // Test 3: Share with insufficient time (should be rejected)
  logInfo("\nTest 3: Attempt share with insufficient time on page");
  const quickShareRequest = {
    postId: TEST_POST_ID,
    sessionId: randomUUID(), // New session to avoid deduplication
    timeOnPage: 500, // Only 0.5 seconds (below minimum)
  };

  const { response: shareRes3, data: shareData3 } = await makeRequest(
    "/api/shares",
    quickShareRequest
  );

  if (!shareRes3.ok && shareData3.error) {
    logSuccess(`Quick share correctly rejected: ${shareData3.error}`);
  } else if (shareData3.recorded) {
    logError("Quick share was counted (should have been rejected)");
  } else {
    logWarning(`Unexpected response: ${JSON.stringify(shareData3)}`);
  }

  // Verify Redis
  if (REDIS_URL) {
    logInfo("\nVerifying Redis storage...");
    const redisKey = `shares:post:${TEST_POST_ID}`;
    const redisValue = await getRedisValue(redisKey);
    if (redisValue > 0) {
      logSuccess(`Redis key exists with value: ${redisValue}`);
    } else {
      logError(`Redis key not found or has value 0`);
    }
  }

  return shareData1.count;
}

/**
 * Test multiple sessions
 */
async function testMultipleSessions() {
  log("\n" + "=".repeat(60), "bright");
  log("Testing Multiple Sessions", "bright");
  log("=".repeat(60), "bright");

  logInfo("\nTracking views and shares from 3 different sessions...");

  const sessions = [randomUUID(), randomUUID(), randomUUID()];
  let viewsRecorded = 0;
  let sharesRecorded = 0;

  for (let i = 0; i < sessions.length; i++) {
    const sessionId = sessions[i];
    logInfo(`\nSession ${i + 1}: ${sessionId.substring(0, 8)}...`);

    // Track view
    const { data: viewData } = await makeRequest("/api/views", {
      postId: TEST_POST_ID,
      sessionId,
      timeOnPage: 6000,
      isVisible: true,
    });

    if (viewData.recorded) {
      viewsRecorded++;
      logSuccess(`  View recorded (total: ${viewData.count})`);
    } else {
      logWarning(`  View not recorded: ${viewData.message || viewData.error}`);
    }

    // Track share
    const { data: shareData } = await makeRequest("/api/shares", {
      postId: TEST_POST_ID,
      sessionId,
      timeOnPage: 3000,
    });

    if (shareData.recorded) {
      sharesRecorded++;
      logSuccess(`  Share recorded (total: ${shareData.count})`);
    } else {
      logWarning(`  Share not recorded: ${shareData.message || shareData.error}`);
    }
  }

  log(`\nSummary:`, "bright");
  log(`  Sessions tested: ${sessions.length}`);
  log(`  Views recorded: ${viewsRecorded}`);
  log(`  Shares recorded: ${sharesRecorded}`);

  if (viewsRecorded === sessions.length && sharesRecorded === sessions.length) {
    logSuccess("All sessions recorded correctly!");
  } else {
    logWarning("Some sessions were not recorded (check rate limits or Redis)");
  }
}

/**
 * Main test runner
 */
async function runTests() {
  log("\n" + "=".repeat(60), "bright");
  log("View and Share Tracking Verification", "bright");
  log("=".repeat(60), "bright");

  logInfo(`Test Post ID: ${TEST_POST_ID}`);
  logInfo(`Session ID: ${SESSION_ID}`);
  logInfo(`Base URL: ${BASE_URL}`);
  logInfo(`Redis: ${REDIS_URL ? "Connected" : "Not configured"}`);

  if (!REDIS_URL) {
    logWarning("\nWarning: REDIS_URL not set. Some tests will be skipped.");
  }

  try {
    // Run tests
    await testViewTracking();
    await testShareTracking();
    await testMultipleSessions();

    // Summary
    log("\n" + "=".repeat(60), "bright");
    log("Test Summary", "bright");
    log("=".repeat(60), "bright");

    if (REDIS_URL) {
      const viewCount = await getRedisValue(`views:post:${TEST_POST_ID}`);
      const shareCount = await getRedisValue(`shares:post:${TEST_POST_ID}`);

      log(`\nFinal Counts:`);
      log(`  Views: ${viewCount}`);
      log(`  Shares: ${shareCount}`);

      logInfo("\nTo verify in Redis:");
      logInfo(`  redis-cli GET "views:post:${TEST_POST_ID}"`);
      logInfo(`  redis-cli GET "shares:post:${TEST_POST_ID}"`);
    }

    log("\n" + "=".repeat(60), "bright");
    logSuccess("All tests completed!");
    log("=".repeat(60) + "\n", "bright");

  } catch (error) {
    logError(`\nTest failed with error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests();
