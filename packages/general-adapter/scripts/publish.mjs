#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */

import { copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the package directory (parent of scripts directory)
const packageDir = join(__dirname, "..");
const distDir = join(packageDir, "dist");
const webworkerSource = join(distDir, "webworker.js");

// Get the repo root (go up from packages/general-adapter)
const repoRoot = join(packageDir, "..", "..");
const webworkerDestination = join(repoRoot, "general-adapter.js");

console.log("🚀 Publishing general-adapter webworker...");

// Check if source file exists
if (!existsSync(webworkerSource)) {
  console.error(
    '❌ webworker.js not found in dist directory. Run "npm run build" first.',
  );
  process.exit(1);
}

try {
  // Copy the webworker file to repo root
  copyFileSync(webworkerSource, webworkerDestination);
  console.log(
    "✅ Successfully copied webworker.js to repo root as general-adapter.js",
  );
  console.log(`📁 Source: ${webworkerSource}`);
  console.log(`📁 Destination: ${webworkerDestination}`);
} catch (error) {
  console.error("❌ Failed to copy webworker file:", error.message);
  process.exit(1);
}
