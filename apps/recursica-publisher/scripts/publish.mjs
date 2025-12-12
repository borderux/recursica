#!/usr/bin/env node
/* eslint-disable no-undef */

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

  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    log(`❌ Error: ${config.distDir} directory not found`, "red");
    log(`Expected path: ${distPath}`, "red");
    log("Make sure the build has been completed first", "yellow");
    process.exit(1);
  }

  // Check if dist directory has content
  const distContents = fs.readdirSync(distPath);
  if (distContents.length === 0) {
    log(`❌ Error: ${config.distDir} directory is empty`, "red");
    log("Make sure the build has been completed first", "yellow");
    process.exit(1);
  }

  log(
    `✅ Found ${config.distDir} directory with ${distContents.length} files`,
    "green",
  );
}

function createZipFile(config) {
  const distPath = path.join(parentDir, config.distDir);
  const zipPath = path.join(distPath, config.zipName);

  log(`📦 Creating ${config.description.toLowerCase()} zip file...`, "blue");
  log(`   Source: ${config.distDir}/`, "cyan");
  log(`   Output: ${config.distDir}/${config.zipName}`, "cyan");

  return new Promise((resolve, reject) => {
    // Remove existing zip file if it exists
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
      log(`🗑️  Removed existing zip file`, "yellow");
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
      reject(err);
    });

    archive.pipe(output);

    // Add all files from dist directory (excluding zip files)
    const files = fs.readdirSync(distPath);
    for (const file of files) {
      const filePath = path.join(distPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && !file.endsWith(".zip")) {
        archive.file(filePath, { name: file });
        log(`  📄 Added ${file}`, "cyan");
      }
    }
    log(`📁 Added all files from ${config.distDir}/`, "cyan");

    // Finalize the archive
    archive.finalize();
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

    // Validate that build files exist
    validateBuildFiles(config);
    log("");

    // Create zip file
    createZipFile(config)
      .then((zipPath) => {
        log("");
        log(
          `🎉 ${config.description} plugin zip created successfully!`,
          "green",
        );
        log(`📦 ZIP_PATH=${zipPath}`, "bright");
        console.log(`ZIP_PATH=${zipPath}`);

        // Exit with success
        process.exit(0);
      })
      .catch((error) => {
        log(`❌ Failed to create zip file: ${error.message}`, "red");
        process.exit(1);
      });
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main();
