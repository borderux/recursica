#!/usr/bin/env node

/**
 * Publish Script for Figma Plugin Test
 *
 * This script creates a zip file for the test version of the figma plugin.
 *
 * Usage: node scripts/publish.mjs
 *
 * Output:
 * - Creates recursica-figma-plugin.zip in the dist/ folder
 * - Outputs ZIP_PATH=<path> for use by parent scripts
 * - Exits with code 0 on success, code 1 on failure
 *
 * Requirements:
 * - dist/ folder must exist with built files
 * - manifest.json must exist in dist/ folder
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

function validateBuildFiles() {
  const distPath = path.join(parentDir, "dist");

  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    log(`❌ Error: dist directory not found`, "red");
    log(`Expected path: ${distPath}`, "red");
    log("Make sure the build has been completed first", "yellow");
    process.exit(1);
  }

  // Check if dist directory has content
  const distContents = fs.readdirSync(distPath);
  if (distContents.length === 0) {
    log(`❌ Error: dist directory is empty`, "red");
    log("Make sure the build has been completed first", "yellow");
    process.exit(1);
  }

  log(`✅ Found dist directory with ${distContents.length} files`, "green");
}

function createZipFile() {
  const distPath = path.join(parentDir, "dist");
  const zipPath = path.join(distPath, "recursica-figma-plugin.zip");

  log(`📦 Creating test zip file...`, "blue");
  log(`   Source: dist/`, "cyan");
  log(`   Output: dist/recursica-figma-plugin.zip`, "cyan");

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
    log(`📁 Added all files from dist/`, "cyan");

    // Finalize the archive
    archive.finalize();
  });
}

function main() {
  try {
    log(
      `🚀 Starting ${colors.bright}Figma Plugin Test Publish${colors.reset}`,
      "bright",
    );
    log(`📋 Mode: Test`, "cyan");
    log(`📁 Dist Directory: dist`, "cyan");
    log(`📦 Zip Name: recursica-figma-plugin.zip`, "cyan");
    log("");

    // Validate that build files exist
    validateBuildFiles();
    log("");

    // Create zip file
    createZipFile()
      .then((zipPath) => {
        log("");
        log(`🎉 Test plugin zip created successfully!`, "green");
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
