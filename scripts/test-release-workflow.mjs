#!/usr/bin/env node

/**
 * Test Release Workflow Script
 *
 * This script simulates the release workflow locally to test both
 * the Publish Packages and Upload Release Assets steps.
 *
 * Usage: node scripts/test-release-workflow.mjs [options]
 *
 * Options:
 *   --packages <packages>    Comma-separated list of packages to test (default: @recursica/figma-plugin,@recursica/figma-plugin-test,@recursica/ui-kit-mantine,@recursica/schemas)
 *   --dry-run               Don't actually upload to GitHub (default: true)
 *   --upload                 Actually upload to GitHub (overrides --dry-run)
 *   --help                  Show this help message
 *
 * Examples:
 *   node scripts/test-release-workflow.mjs
 *   node scripts/test-release-workflow.mjs --packages @recursica/figma-plugin
 *   node scripts/test-release-workflow.mjs --upload
 *
 * The script:
 * 1. Creates mock published packages with version 1.0.0
 * 2. Runs the publish step to create zip files (only for packages with publish commands)
 * 3. Runs the upload step (dry-run by default)
 * 4. Validates that zip files exist and are ready for upload
 *
 * Package Types Tested:
 * - Figma Plugins (@recursica/figma-plugin, @recursica/figma-plugin-test): Have publish commands, create zip files
 * - NPM Libraries (@recursica/ui-kit-mantine, @recursica/schemas): No publish commands, handled by Changesets only
 *
 * Requirements:
 * - Packages must be built (dist/ folders must exist for figma plugins)
 * - GitHub CLI (gh) must be authenticated for --upload mode
 * - All publish scripts must be working correctly
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parentDir = path.resolve(__dirname, "..");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    packages: [
      "@recursica/figma-plugin",
      "@recursica/figma-plugin-test",
      "@recursica/ui-kit-mantine",
      "@recursica/schemas",
    ],
    dryRun: true,
    upload: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--packages":
        options.packages = nextArg.split(",").map((pkg) => pkg.trim());
        i++;
        break;
      case "--dry-run":
        options.dryRun = true;
        options.upload = false;
        break;
      case "--upload":
        options.upload = true;
        options.dryRun = false;
        break;
      case "--help":
        showHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith("--")) {
          log(`❌ Unknown option: ${arg}`, "red");
          showHelp();
          process.exit(1);
        }
        break;
    }
  }

  return options;
}

function showHelp() {
  log("Test Release Workflow Script", "bright");
  log("");
  log("Usage: node scripts/test-release-workflow.mjs [options]", "cyan");
  log("");
  log("Options:", "yellow");
  log(
    "  --packages <packages>    Comma-separated list of packages to test",
    "cyan",
  );
  log(
    "                          (default: @recursica/figma-plugin,@recursica/figma-plugin-test,@recursica/ui-kit-mantine,@recursica/schemas)",
    "cyan",
  );
  log(
    "  --dry-run               Don't actually upload to GitHub (default)",
    "cyan",
  );
  log(
    "  --upload                 Actually upload to GitHub (overrides --dry-run)",
    "cyan",
  );
  log("  --help                  Show this help message", "cyan");
  log("");
  log("Examples:", "yellow");
  log("  node scripts/test-release-workflow.mjs", "cyan");
  log(
    "  node scripts/test-release-workflow.mjs --packages @recursica/figma-plugin",
    "cyan",
  );
  log("  node scripts/test-release-workflow.mjs --upload", "cyan");
}

function createMockPublishedPackages(packages) {
  const mockPackages = packages.map((pkg) => ({
    name: pkg,
    version: "1.0.0", // Mock version
  }));

  log(`📦 Created mock published packages:`, "bright");
  mockPackages.forEach((pkg) => {
    log(`  - ${pkg.name}@${pkg.version}`, "cyan");
  });
  log("");

  return JSON.stringify(mockPackages);
}

async function runPublishStep(publishedPackagesJson) {
  log(`🚀 Step 1: Testing Publish Packages`, "bright");
  log("=".repeat(50), "blue");

  try {
    log(`🔧 Running: node scripts/publish.mjs with JSON data`, "blue");

    // Use spawn to avoid shell escaping issues
    const { spawn } = await import("child_process");

    const child = spawn(
      "node",
      ["scripts/publish.mjs", publishedPackagesJson],
      {
        cwd: parentDir,
        stdio: "pipe",
      },
    );

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    await new Promise((resolve, reject) => {
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });

    log(`✅ Publish step completed successfully`, "green");
    log("");

    // Extract PUBLISH_RESULTS from output
    const lines = output.split("\n");
    let publishResultsJson = null;

    for (const line of lines) {
      if (line.startsWith("PUBLISH_RESULTS=")) {
        publishResultsJson = line.substring("PUBLISH_RESULTS=".length);
        // Clean up any color escape codes
        publishResultsJson = publishResultsJson.replace(
          /\u001b\[[0-9;]*m/g, // eslint-disable-line no-control-regex
          "",
        );
        break;
      }
    }

    if (!publishResultsJson) {
      log(`❌ Could not find PUBLISH_RESULTS in output`, "red");
      log(`Output:`, "yellow");
      console.log(output);
      process.exit(1);
    }

    log(`📦 PUBLISH_RESULTS found:`, "green");
    log(publishResultsJson, "cyan");
    log("");

    return publishResultsJson;
  } catch (error) {
    log(`❌ Publish step failed: ${error.message}`, "red");
    log(`Output:`, "yellow");
    console.log(error.stdout || "");
    console.log(error.stderr || "");
    process.exit(1);
  }
}

function runUploadStep(publishResultsJson, options) {
  log(`🚀 Step 2: Testing Upload Release Assets`, "bright");
  log("=".repeat(50), "blue");

  if (options.dryRun) {
    log(`🧪 DRY RUN MODE - No actual uploads will be performed`, "yellow");
    log(
      `📦 Would upload with: node scripts/upload-release-assets.mjs "${publishResultsJson}"`,
      "cyan",
    );
    log("");

    // Parse and display what would be uploaded
    try {
      const publishResults = JSON.parse(publishResultsJson);
      log(`📋 Would upload ${publishResults.length} assets:`, "bright");
      publishResults.forEach((result, index) => {
        log(`  ${index + 1}. ${result.name}@${result.version}`, "cyan");
        log(`     File: ${result.zipPath}`, "cyan");
        log(
          `     Exists: ${fs.existsSync(result.zipPath) ? "✅" : "❌"}`,
          fs.existsSync(result.zipPath) ? "green" : "red",
        );
      });
      log("");
      log(`✅ Upload step simulation completed successfully`, "green");
    } catch (error) {
      log(`❌ Error parsing publish results: ${error.message}`, "red");
      process.exit(1);
    }
  } else {
    log(`⚠️  LIVE MODE - Will actually upload to GitHub!`, "red");
    log(
      `📦 Running: node scripts/upload-release-assets.mjs "${publishResultsJson}"`,
      "blue",
    );

    try {
      const output = execSync(
        `node scripts/upload-release-assets.mjs "${publishResultsJson}"`,
        {
          encoding: "utf8",
          stdio: "inherit",
          cwd: parentDir,
        },
      );

      log(`✅ Upload step completed successfully`, "green");
    } catch (error) {
      log(`❌ Upload step failed: ${error.message}`, "red");
      process.exit(1);
    }
  }
}

async function main() {
  try {
    log(
      `🧪 Starting ${colors.bright}Release Workflow Test${colors.reset}`,
      "bright",
    );
    log("");

    const options = parseArguments();

    log(`📋 Test Configuration:`, "bright");
    log(`   Packages: ${options.packages.join(", ")}`, "cyan");
    log(
      `   Mode: ${options.dryRun ? "DRY RUN" : "LIVE UPLOAD"}`,
      options.dryRun ? "yellow" : "red",
    );
    log("");

    // Step 1: Create mock published packages
    const publishedPackagesJson = createMockPublishedPackages(options.packages);

    // Step 2: Run publish step
    const publishResultsJson = await runPublishStep(publishedPackagesJson);

    // Step 3: Run upload step
    runUploadStep(publishResultsJson, options);

    log("");
    log(
      `🎉 ${colors.bright}Release Workflow Test Completed Successfully!${colors.reset}`,
      "green",
    );

    if (options.dryRun) {
      log(`💡 To test with actual uploads, run with --upload flag`, "yellow");
    }
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main();
