#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Publish Script for Release Workflow
 *
 * This script takes the published packages from Changesets and runs
 * turbo publish with the correct filters to create zip files for
 * figma plugins and other packages that have publish commands.
 *
 * Usage: node scripts/publish.mjs <publishedPackagesJson>
 *
 * @param {string} publishedPackagesJson - JSON string of published packages from Changesets
 *
 * Input Format (JSON array):
 * [
 *   {
 *     "name": "@recursica/figma-plugin",
 *     "version": "1.2.3"
 *   },
 *   {
 *     "name": "@recursica/figma-plugin-test",
 *     "version": "1.2.3"
 *   }
 * ]
 *
 * Output Format (JSON array):
 * [
 *   {
 *     "name": "@recursica/figma-plugin",
 *     "version": "1.2.3",
 *     "zipPath": "/path/to/recursica-figma-plugin.zip"
 *   },
 *   {
 *     "name": "@recursica/figma-plugin-test",
 *     "version": "1.2.3",
 *     "zipPath": "/path/to/recursica-figma-plugin-test.zip"
 *   }
 * ]
 *
 * The script outputs PUBLISH_RESULTS as a GitHub Actions output variable
 * containing the JSON array of publish results.
 *
 * Error Handling:
 * - Exits with code 0 if no packages to publish (shows info message)
 * - Exits with code 1 for invalid JSON or other errors
 * - Skips packages that fail to publish (logs warning)
 */

import { execSync } from "child_process";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTurboPublish(packageName) {
  try {
    log(`🔧 Running: npx turbo run publish --filter=${packageName}`, "blue");

    const output = execSync(`npx turbo run publish --filter="${packageName}"`, {
      encoding: "utf8",
      stdio: "pipe",
    });

    // Also log the output to console for visibility
    console.log(output);

    return output;
  } catch (error) {
    log(`❌ Failed to run turbo publish for ${packageName}`, "red");
    log(`Error: ${error.message}`, "red");
    return null;
  }
}

function extractZipPath(publishOutput) {
  if (!publishOutput) return null;

  const lines = publishOutput.split("\n");
  for (const line of lines) {
    if (line.includes("ZIP_PATH=")) {
      const zipPath = line.split("ZIP_PATH=")[1]?.trim();
      // Clean up any color escape codes
      return zipPath.replace(/\u001b\[[0-9;]*m/g, ""); // eslint-disable-line no-control-regex
    }
  }
  return null;
}

function processPublishedPackages(publishedPackages) {
  log("🎯 Publishing packages...", "bright");

  const publishResults = [];

  for (const pkg of publishedPackages) {
    log(`🔧 Processing package: ${pkg.name}@${pkg.version}`, "yellow");

    // Run turbo publish for this package
    const publishOutput = runTurboPublish(pkg.name);
    if (!publishOutput) {
      log(`ℹ️  Skipping ${pkg.name} due to publish failure`, "yellow");
      continue;
    }

    // Extract zip path from output
    const zipPath = extractZipPath(publishOutput);
    if (!zipPath) {
      log(`ℹ️  No zip file found for ${pkg.name}`, "yellow");
      continue;
    }

    log(`📦 Found zip file: ${zipPath}`, "green");

    // Store comprehensive information about the published package
    publishResults.push({
      name: pkg.name,
      version: pkg.version,
      zipPath: zipPath,
    });
  }

  // Output comprehensive results for the next step
  if (publishResults.length > 0) {
    log(
      `\n📊 Summary: ${publishResults.length} packages published with zip files`,
      "bright",
    );
    log("📦 PUBLISH_RESULTS:", "bright");
    publishResults.forEach((result, index) => {
      log(
        `  ${index + 1}. ${result.name}@${result.version} -> ${result.zipPath}`,
        "cyan",
      );
    });

    // Set GitHub Actions output with comprehensive information
    console.log(`PUBLISH_RESULTS=${JSON.stringify(publishResults)}`);
    console.log(`HAS_PACKAGES_TO_PUBLISH=true`);
  } else {
    log("⚠️  No packages were published with zip files", "yellow");
    console.log("PUBLISH_RESULTS=[]");
    console.log(`HAS_PACKAGES_TO_PUBLISH=false`);
  }
}

function main() {
  const publishedPackagesJson = process.argv[2];

  log(`ARGS: "${publishedPackagesJson}"`, "cyan");

  if (!publishedPackagesJson) {
    log("❌ Error: publishedPackagesJson argument is required", "red");
    log("Usage: node scripts/publish.mjs <publishedPackagesJson>", "yellow");
    process.exit(1);
  }

  try {
    const publishedPackages = JSON.parse(publishedPackagesJson);

    if (!Array.isArray(publishedPackages)) {
      log("❌ Error: publishedPackagesJson must be a JSON array", "red");
      process.exit(1);
    }

    if (publishedPackages.length === 0) {
      log("ℹ️  No packages to process", "yellow");
      console.log("ZIP_PATHS=[]");
      process.exit(0);
    }

    log(`📦 Published packages:`, "bright");
    publishedPackages.forEach((pkg) => {
      log(`  - ${pkg.name}@${pkg.version}`, "cyan");
    });
    log("");

    processPublishedPackages(publishedPackages);
  } catch (error) {
    log("❌ Error parsing publishedPackagesJson", "red");
    log(`Error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main();
