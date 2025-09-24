#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testAppDir = path.resolve(__dirname, "..");
const mainPluginDir = path.resolve(testAppDir, "../figma-plugin");

console.log("🔧 Building test version of Figma plugin...");
console.log(`📁 Main plugin directory: ${mainPluginDir}`);
console.log(`📁 Test app directory: ${testAppDir}`);

try {
  // Verify main plugin directory exists
  if (!fs.existsSync(mainPluginDir)) {
    throw new Error(`Main plugin directory not found: ${mainPluginDir}`);
  }

  // Change to main plugin directory and build test version
  console.log("🏗️  Building test version in main plugin...");
  execSync("npm run build:test", {
    cwd: mainPluginDir,
    stdio: "inherit",
  });

  // Create dist directory in test app if it doesn't exist
  const testDistDir = path.join(testAppDir, "dist");
  if (!fs.existsSync(testDistDir)) {
    fs.mkdirSync(testDistDir, { recursive: true });
    console.log("✅ Created dist directory in test app");
  }

  // Copy built files from main plugin to test app
  const mainDistDir = path.join(mainPluginDir, "dist-test");
  if (fs.existsSync(mainDistDir)) {
    console.log("📋 Copying built files to test app...");

    // Copy all files from main plugin dist to test app dist
    const files = fs.readdirSync(mainDistDir);
    for (const file of files) {
      const sourceFile = path.join(mainDistDir, file);
      const targetFile = path.join(testDistDir, file);

      if (fs.statSync(sourceFile).isDirectory()) {
        // Copy directory recursively
        fs.cpSync(sourceFile, targetFile, { recursive: true });
      } else {
        // Copy file
        fs.copyFileSync(sourceFile, targetFile);
      }
      console.log(`  ✅ Copied: ${file}`);
    }
  }

  console.log("🎉 Test build completed successfully!");
  console.log(
    "📦 Package @recursica/figma-plugin-test is ready for publishing",
  );
} catch (error) {
  console.error("❌ Error building test package:", error.message);
  process.exit(1);
}
