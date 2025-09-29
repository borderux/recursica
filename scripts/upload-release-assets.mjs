#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Upload Release Assets Script
 *
 * This script processes published package results (including zip paths)
 * and uploads their corresponding zip files as assets to GitHub releases.
 *
 * Usage: node scripts/upload-release-assets.mjs <publishResultsJson>
 *
 * @param {string} publishResultsJson - JSON string of published package results
 *
 * Input Format (JSON array):
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
 * The script:
 * 1. Gets the latest release tag from git
 * 2. Validates that zip files exist
 * 3. Uploads each zip file to the GitHub release using GitHub CLI
 * 4. Reports success/failure for each upload
 *
 * Requirements:
 * - GitHub CLI (gh) must be installed and authenticated
 * - GH_TOKEN environment variable must be set (or gh auth login)
 * - Zip files must exist at the specified paths
 *
 * Error Handling:
 * - Exits with code 0 if no packages to process (shows info message)
 * - Exits with code 1 for invalid JSON, missing files, or upload failures
 * - Skips missing zip files and continues with others
 */

import { execSync } from "child_process";
import fs from "fs";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getLatestReleaseTag() {
  try {
    const tag = execSync(
      "git describe --tags `git rev-list --tags --max-count=1`",
      {
        encoding: "utf8",
        stdio: "pipe",
      },
    ).trim();
    return tag;
  } catch (error) {
    log("❌ Failed to get latest release tag", "red");
    log(`Error: ${error.message}`, "red");
    process.exit(1);
  }
}

function uploadAssetToRelease(releaseTag, zipPath) {
  try {
    log(`⬆️  Uploading ${zipPath} to release ${releaseTag}`, "blue");

    execSync(`gh release upload "${releaseTag}" "${zipPath}" --clobber`, {
      stdio: "inherit",
    });

    log(`✅ Successfully uploaded ${zipPath}`, "green");
    return true;
  } catch (error) {
    log(`❌ Failed to upload ${zipPath}`, "red");
    log(`Error: ${error.message}`, "red");
    return false;
  }
}

async function processPublishResults(publishResults) {
  log("🎯 Uploading release assets for published packages...", "bright");

  const latestTag = getLatestReleaseTag();
  log(`📋 Latest release tag: ${latestTag}`, "cyan");

  let successCount = 0;
  let totalCount = 0;
  const processedPackages = [];

  for (const result of publishResults) {
    totalCount++;
    log(`🔧 Processing ${result.name}@${result.version}`, "yellow");
    log(`   Zip file: ${result.zipPath}`, "cyan");

    // Check if file exists
    if (!fs.existsSync(result.zipPath)) {
      log(`❌ Zip file does not exist: ${result.zipPath}`, "red");
      continue;
    }

    log(`📦 Found zip file: ${result.zipPath}`, "green");

    // Upload to GitHub release
    const uploadSuccess = uploadAssetToRelease(latestTag, result.zipPath);
    if (uploadSuccess) {
      successCount++;
      processedPackages.push(result.name);
    }
  }

  log(
    `\n📊 Summary: ${successCount}/${totalCount} assets uploaded successfully`,
    "bright",
  );

  // Set GitHub Actions outputs for processed packages
  const figmaPluginProcessed = processedPackages.includes(
    "@recursica/figma-plugin",
  );
  const figmaPluginTestProcessed = processedPackages.includes(
    "@recursica/figma-plugin-test",
  );

  // Extract figma plugin version if it was processed
  let figmaPluginVersion = "";
  if (figmaPluginProcessed) {
    const figmaPluginResult = publishResults.find(
      (result) => result.name === "@recursica/figma-plugin",
    );
    if (figmaPluginResult) {
      figmaPluginVersion = figmaPluginResult.version;
    }
  }

  console.log(`FIGMA_PLUGIN_PROCESSED=${figmaPluginProcessed}`);
  console.log(`FIGMA_PLUGIN_TEST_PROCESSED=${figmaPluginTestProcessed}`);
  console.log(`FIGMA_PLUGIN_VERSION=${figmaPluginVersion}`);

  // Also output to GitHub Actions format
  if (process.env.GITHUB_OUTPUT) {
    const fs = await import("fs");
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `FIGMA_PLUGIN_PROCESSED=${figmaPluginProcessed}\n`,
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `FIGMA_PLUGIN_TEST_PROCESSED=${figmaPluginTestProcessed}\n`,
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `FIGMA_PLUGIN_VERSION=${figmaPluginVersion}\n`,
    );
  }

  if (successCount === 0 && totalCount > 0) {
    log("⚠️  No assets were uploaded successfully", "yellow");
    process.exit(1);
  }
}

async function main() {
  const publishResultsJson = process.argv[2];

  if (!publishResultsJson) {
    log("❌ Error: publishResultsJson argument is required", "red");
    log(
      "Usage: node scripts/upload-release-assets.mjs <publishResultsJson>",
      "yellow",
    );
    process.exit(1);
  }

  try {
    const publishResults = JSON.parse(publishResultsJson);

    if (!Array.isArray(publishResults)) {
      log("❌ Error: publishResultsJson must be a JSON array", "red");
      process.exit(1);
    }

    if (publishResults.length === 0) {
      log("ℹ️  No packages to process", "yellow");
      return;
    }

    log(`📦 Publish results:`, "bright");
    publishResults.forEach((result) => {
      log(`  - ${result.name}@${result.version} -> ${result.zipPath}`, "cyan");
    });
    log("");

    await processPublishResults(publishResults);
  } catch (error) {
    log("❌ Error parsing publishResultsJson", "red");
    log(`Error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
