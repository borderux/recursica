#!/usr/bin/env node

/**
 * Publish Script for Figma Plugin
 *
 * This script creates a zip file for the figma plugin based on the specified mode.
 * It handles both production and test builds.
 *
 * Usage: node scripts/publish.mjs [mode]
 *
 * @param {string} mode - The build mode: 'production' or 'test' (default: 'production')
 *
 * Output:
 * - Creates recursica-figma-plugin.zip in the dist/ folder
 * - Outputs ZIP_PATH=<path> for use by parent scripts
 * - Exits with code 0 on success, code 1 on failure
 *
 * Requirements:
 * - dist/ folder must exist with built files
 * - manifest.production.json must exist for production mode
 * - Node.js archiver package must be available
 *
 * Error Handling:
 * - Validates that dist folder exists
 * - Validates that required files exist
 * - Creates zip file with proper error handling
 * - Outputs clean ZIP_PATH without color codes
 */

import fs from "fs";
import path from "path";
import archiver from "archiver";
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
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getMode() {
  const mode = process.argv[2] || "production";

  if (mode !== "production" && mode !== "test") {
    log(
      `❌ Error: Invalid mode '${mode}'. Must be 'production' or 'test'`,
      "red",
    );
    log("Usage: node scripts/publish.mjs [production|test]", "yellow");
    process.exit(1);
  }

  return mode;
}

function getBuildConfig(mode) {
  const configs = {
    production: {
      distDir: "dist",
      zipName: "recursica-publisher-plugin.zip",
      description: "Production",
    },
    test: {
      distDir: "dist-test",
      zipName: "recursica-publisher-plugin-test.zip",
      description: "Test",
    },
  };

  return configs[mode];
}

function validateBuildFiles(config) {
  const distPath = path.join(parentDir, config.distDir);
  let hasErrors = false;

  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    log(`⚠️  Warning: ${config.distDir} directory not found`, "yellow");
    log(`Expected path: ${distPath}`, "yellow");
    log("Make sure the build has been completed first", "yellow");
    hasErrors = true;
    return hasErrors;
  }

  // Check if dist directory has content
  try {
    const distContents = fs.readdirSync(distPath);
    if (distContents.length === 0) {
      log(`⚠️  Warning: ${config.distDir} directory is empty`, "yellow");
      log("Make sure the build has been completed first", "yellow");
      hasErrors = true;
    } else {
      log(
        `✅ Found ${config.distDir} directory with ${distContents.length} files`,
        "green",
      );
    }
  } catch (error) {
    log(
      `⚠️  Warning: Error reading ${config.distDir} directory: ${error.message}`,
      "yellow",
    );
    hasErrors = true;
  }

  return hasErrors;
}

function createZipFile(config) {
  const distPath = path.join(parentDir, config.distDir);
  const zipPath = path.join(distPath, config.zipName);

  log(`📦 Creating ${config.description.toLowerCase()} zip file...`, "blue");
  log(`   Source: ${config.distDir}/`, "cyan");
  log(`   Output: ${config.distDir}/${config.zipName}`, "cyan");

  return new Promise((resolve, reject) => {
    try {
      // Remove existing zip file if it exists
      if (fs.existsSync(zipPath)) {
        try {
          fs.unlinkSync(zipPath);
          log(`🗑️  Removed existing zip file`, "yellow");
        } catch (unlinkError) {
          log(
            `⚠️  Warning: Could not remove existing zip file: ${unlinkError.message}`,
            "yellow",
          );
          // Continue anyway
        }
      }

      // Create zip file
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      output.on("close", () => {
        const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        log(`✅ Zip file created successfully`, "green");
        log(`   Size: ${sizeInMB} MB`, "cyan");
        log(`   Path: ${zipPath}`, "cyan");
        resolve(zipPath);
      });

      archive.on("error", (err) => {
        log(`❌ Error creating zip file: ${err.message}`, "red");
        log(`   Error details: ${err.stack || err}`, "red");
        reject(err);
      });

      output.on("error", (err) => {
        log(`❌ Error writing zip file: ${err.message}`, "red");
        log(`   Error details: ${err.stack || err}`, "red");
        reject(err);
      });

      archive.pipe(output);

      // Add manifest.json at zip root (required for Figma plugin; not in dist/)
      const manifestPath = path.join(parentDir, "manifest.json");
      if (fs.existsSync(manifestPath)) {
        archive.file(manifestPath, { name: "manifest.json" });
        log(`  📄 Added manifest.json`, "cyan");
      } else {
        log(`⚠️  Warning: manifest.json not found at ${manifestPath}`, "yellow");
      }

      // Add dist contents under dist/ so manifest paths (./dist/...) resolve
      try {
        const files = fs.readdirSync(distPath);
        let filesAdded = 0;

        for (const file of files) {
          try {
            const filePath = path.join(distPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isFile() && !file.endsWith(".zip")) {
              archive.file(filePath, { name: path.join("dist", file) });
              log(`  📄 Added dist/${file}`, "cyan");
              filesAdded++;
            }
          } catch (fileError) {
            log(
              `⚠️  Warning: Could not add file ${file}: ${fileError.message}`,
              "yellow",
            );
          }
        }

        if (filesAdded > 0) {
          log(`📁 Added ${filesAdded} file(s) under dist/`, "cyan");
        }
      } catch (readError) {
        log(
          `⚠️  Warning: Error reading directory: ${readError.message}`,
          "yellow",
        );
      }

      // Finalize the archive
      archive.finalize();
    } catch (error) {
      log(`❌ Unexpected error in createZipFile: ${error.message}`, "red");
      log(`   Error details: ${error.stack || error}`, "red");
      reject(error);
    }
  });
}

function main() {
  try {
    log(
      `🚀 Starting ${colors.bright}Figma Plugin Publish${colors.reset}`,
      "bright",
    );

    const mode = getMode();
    const config = getBuildConfig(mode);

    log(`📋 Mode: ${config.description}`, "cyan");
    log(`📁 Dist Directory: ${config.distDir}`, "cyan");
    log(`📦 Zip Name: ${config.zipName}`, "cyan");
    log("");

    // Validate that build files exist (warnings only, don't exit)
    const hasValidationErrors = validateBuildFiles(config);
    if (hasValidationErrors) {
      log("", "yellow");
      log(
        "⚠️  Validation errors detected, but continuing with publish...",
        "yellow",
      );
      log("", "yellow");
    } else {
      log("");
    }

    // Create zip file
    createZipFile(config)
      .then((zipPath) => {
        log("");
        if (hasValidationErrors) {
          log(
            `⚠️  ${config.description} plugin zip created with warnings`,
            "yellow",
          );
        } else {
          log(
            `🎉 ${config.description} plugin zip created successfully!`,
            "green",
          );
        }
        log(`📦 ZIP_PATH=${zipPath}`, "bright");
        console.log(`ZIP_PATH=${zipPath}`);

        // Exit with success (even if there were warnings)
        process.exit(0);
      })
      .catch((error) => {
        log(`❌ Failed to create zip file: ${error.message}`, "red");
        log(`   Error details: ${error.stack || error}`, "red");
        process.exit(1);
      });
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, "red");
    log(`   Error details: ${error.stack || error}`, "red");
    // Still try to continue if possible
    log("⚠️  Attempting to continue despite error...", "yellow");
    process.exit(1);
  }
}

// Run the script
main();
