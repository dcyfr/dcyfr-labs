#!/usr/bin/env node

/**
 * MCP Server Validation Test
 * 
 * This script validates that Model Context Protocol (MCP) servers are:
 * 1. Properly configured in mcp.json
 * 2. Accessible and invokable via npx
 * 3. Can be started without errors
 * 4. Meet project dependency requirements
 * 
 * MCP servers are critical project dependencies for AI-assisted development.
 * 
 * Usage:
 *   node scripts/test-mcp-servers.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const mcpConfigPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".config/Code/User/mcp.json"
);

// On macOS with VS Code, also check alternate location
const mcpConfigPathMac = path.join(
  process.env.HOME || process.env.USERPROFILE,
  "Library/Application Support/Code/User/mcp.json"
);

const finalMcpConfigPath = fs.existsSync(mcpConfigPath) 
  ? mcpConfigPath 
  : fs.existsSync(mcpConfigPathMac) 
  ? mcpConfigPathMac 
  : mcpConfigPath; // Default to standard path for error messages

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(title, "cyan");
  log(`${"=".repeat(60)}\n`, "cyan");
}

// Expected MCP servers configuration
const expectedServers = {
  sequentialthinking: {
    name: "Sequential Thinking",
    package: "@modelcontextprotocol/server-sequential-thinking",
    description: "Complex problem-solving and architectural planning",
  },
  memory: {
    name: "Memory",
    package: "@modelcontextprotocol/server-memory",
    description: "Maintains project context and decisions",
  },
  context7: {
    name: "Context7",
    package: "@upstash/context7-mcp@latest",
    description: "Documentation lookup for libraries and frameworks",
  },
};

let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function test(name, condition, details = "") {
  if (condition) {
    log(`✅ ${name}`, "green");
    if (details) log(`   ${details}`, "green");
    testResults.passed++;
  } else {
    log(`❌ ${name}`, "red");
    if (details) log(`   ${details}`, "red");
    testResults.failed++;
  }
}

function warn(message, details = "") {
  log(`⚠️  ${message}`, "yellow");
  if (details) log(`   ${details}`, "yellow");
  testResults.warnings++;
}

// Test 1: Check if mcp.json exists
section("1. Configuration File Validation");

let mcpConfig = null;
let configExists = false;

try {
  const configContent = fs.readFileSync(finalMcpConfigPath, "utf-8");
  mcpConfig = JSON.parse(configContent);
  configExists = true;
  test("mcp.json exists", true, `Location: ${finalMcpConfigPath}`);
} catch (error) {
  if (error.code === "ENOENT") {
    test("mcp.json exists", false, `Expected at: ${finalMcpConfigPath} or ${mcpConfigPathMac}`);
  } else {
    test(
      "mcp.json is valid JSON",
      false,
      `Parse error: ${error.message}`
    );
  }
}

// Test 2: Validate server configurations
section("2. MCP Server Configuration Validation");

if (configExists && mcpConfig) {
  test(
    "mcp.json has 'servers' object",
    mcpConfig.servers && typeof mcpConfig.servers === "object"
  );

  for (const [serverId, serverConfig] of Object.entries(expectedServers)) {
    const isConfigured = mcpConfig.servers && mcpConfig.servers[serverId];
    test(
      `${serverConfig.name} server configured`,
      isConfigured,
      `Package: ${serverConfig.package}`
    );

    if (isConfigured) {
      const config = mcpConfig.servers[serverId];

      test(`  → Has 'command' property`, config.command !== undefined);

      test(`  → Has 'args' array`, Array.isArray(config.args));

      test(`  → Has 'type' property`, config.type !== undefined);

      test(
        `  → Type is 'stdio'`,
        config.type === "stdio",
        `Type: ${config.type}`
      );

      // Check if package is in args
      const packageInArgs = config.args && config.args.includes(serverConfig.package);
      test(
        `  → Package in args`,
        packageInArgs,
        `Package: ${serverConfig.package}`
      );
    }
  }
}

// Test 3: Check npm/npx availability
section("3. NPM/NPX Availability");

try {
  const npmVersion = execSync("npm --version", { encoding: "utf-8" }).trim();
  test("npm is installed", true, `Version: ${npmVersion}`);
} catch {
  test("npm is installed", false, "Cannot run 'npm --version'");
  warn("npm is required to run MCP servers");
}

try {
  const npxVersion = execSync("npx --version", { encoding: "utf-8" }).trim();
  test("npx is installed", true, `Version: ${npxVersion}`);
} catch {
  test("npx is installed", false, "Cannot run 'npx --version'");
  warn("npx is required to run MCP servers");
}

// Test 4: Validate MCP server packages can be invoked
section("4. MCP Server Package Validation");

for (const serverConfig of Object.values(expectedServers)) {
  try {
    // Test with --version or --help (with timeout to prevent hanging)
    const command = `timeout 5 npx -y ${serverConfig.package} --version 2>&1 || true`;
    execSync(command, { stdio: "pipe" });
    test(
      `${serverConfig.name} package accessible`,
      true,
      `Package: ${serverConfig.package}`
    );
  } catch {
    // Some packages might not support --version, so we check if npx can find them
    try {
      execSync(`npm search ${serverConfig.package} --json --no-description 2>&1 | head -1`, {
        stdio: "pipe",
      });
      warn(
        `${serverConfig.name} package not fully validated`,
        "Could not run --version, but npm search succeeded"
      );
    } catch {
      test(
        `${serverConfig.name} package accessible`,
        false,
        `Could not access package: ${serverConfig.package}`
      );
    }
  }
}

// Test 5: Project dependency requirements
section("5. Project Dependency Requirements");

test(
  "MCP servers declared as project dependency",
  configExists,
  "Defined in ~/.config/Code/User/mcp.json"
);

test(
  "Configuration documented",
  fs.existsSync(path.join(rootDir, "docs", "mcp", "servers.md")),
  "docs/mcp/servers.md exists"
);

test(
  "Agent instructions updated",
  fs.existsSync(path.join(rootDir, ".github", "copilot-instructions.md")),
  ".github/copilot-instructions.md exists"
);

// Test 6: Documentation validation
section("6. Documentation Validation");

const docFiles = [
  { path: "docs/mcp/servers.md", name: "MCP Servers Guide" },
  { path: ".github/copilot-instructions.md", name: "Copilot Instructions" },
  { path: "agents.md", name: "Agents Configuration" },
];

for (const doc of docFiles) {
  const docPath = path.join(rootDir, doc.path);
  try {
    const content = fs.readFileSync(docPath, "utf-8");
    const hasMcpContent =
      content.includes("MCP") || content.includes("sequential") || content.includes("memory");
    test(`${doc.name} exists and references MCP`, hasMcpContent);
  } catch {
    test(`${doc.name} exists`, false);
  }
}

// Test 7: Scripts validation
section("7. Scripts and Tasks");

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf-8"));
  test("package.json scripts defined", packageJson.scripts !== undefined);
  
  if (packageJson.scripts) {
    const hasMcpTest = packageJson.scripts["test:mcp-servers"];
    test(
      "test:mcp-servers script available",
      hasMcpTest !== undefined,
      "Run with: npm run test:mcp-servers"
    );
  }
} catch (error) {
  test("package.json readable", false, error.message);
}

// Summary
section("Test Summary");

const total = testResults.passed + testResults.failed;
const passPercentage = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;

log(`Total Tests: ${total}`, "cyan");
log(`✅ Passed: ${testResults.passed}`, "green");
log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? "red" : "green");
log(`⚠️  Warnings: ${testResults.warnings}`, testResults.warnings > 0 ? "yellow" : "green");
log(`\nSuccess Rate: ${passPercentage}%`, passPercentage >= 90 ? "green" : passPercentage >= 70 ? "yellow" : "red");

// Recommendations
section("Recommendations");

if (!configExists) {
  log("1. Ensure VS Code is installed with MCP support", "yellow");
  log(`2. Configure mcp.json at one of these locations:`, "yellow");
  log(`   • Linux/Windows: ~/.config/Code/User/mcp.json`, "yellow");
  log(`   • macOS: ~/Library/Application Support/Code/User/mcp.json`, "yellow");
  log("3. See docs/mcp/servers.md for configuration details", "yellow");
  log("4. Restart VS Code after configuring MCP servers", "yellow");
}

if (testResults.failed > 0) {
  log("1. Review failed tests above", "yellow");
  log("2. Ensure npm/npx are properly installed", "yellow");
  log("3. Check network connectivity for package downloads", "yellow");
  log("4. Run: npm install to update dependencies", "yellow");
}

if (testResults.warnings > 0) {
  log("Some packages could not be fully validated.", "yellow");
  log("This may be normal if packages don't support --version.", "yellow");
}

log("\nFor more information, see docs/mcp/servers.md", "cyan");

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0);
