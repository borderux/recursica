#!/usr/bin/env node
/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */

/**
 * Build script for the Figma plugin test version
 *
 * This script:
 * 1. Validates required test environment variables
 * 2. Maps test variables to production variable names
 * 3. Builds dependencies and the main plugin in test mode
 * 4. Copies the built files to the test app's dist directory
 *
 * Required environment variables:
 * - VITE_RECURSICA_API_TEST: Test API URL
 * - VITE_PLUGIN_PHRASE_TEST: Test plugin security phrase
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testAppDir = path.resolve(__dirname, "..");
const mainPluginDir = path.resolve(testAppDir, "../figma-plugin");

console.log("🔧 Building test version of Figma plugin...");

try {
  // Verify main plugin directory exists
  if (!fs.existsSync(mainPluginDir)) {
    throw new Error(`Main plugin directory not found: ${mainPluginDir}`);
  }

  // Check for test environment variables and warn if missing
  const testVars = {
    VITE_RECURSICA_API_TEST: "Test API URL",
    VITE_PLUGIN_PHRASE_TEST: "Test plugin security phrase",
  };

  let usingTestVars = true;
  for (const [varName, description] of Object.entries(testVars)) {
    if (!process.env[varName]) {
      console.warn(
        `⚠️  ${varName} not set (${description}) - using production values`,
      );
      usingTestVars = false;
    }
  }

  // Map environment variables (test variables take precedence if available)
  if (usingTestVars) {
    process.env.VITE_RECURSICA_API_URL = process.env.VITE_RECURSICA_API_TEST;
    process.env.VITE_RECURSICA_UI_URL = process.env.VITE_RECURSICA_API_TEST;
    process.env.VITE_PLUGIN_PHRASE = process.env.VITE_PLUGIN_PHRASE_TEST;
    console.log("✅ Using test environment variables");
  } else {
    console.log(
      "⚠️  Using production environment variables (test vars not set)",
    );
  }

  // Always show version banner for test builds
  process.env.VITE_SHOW_VERSION_BANNER = "true";

  // Build main plugin in test mode (Turborepo will handle dependencies automatically)
  console.log("🏗️  Building main plugin in test mode...");
  execSync("npm run build:test", {
    cwd: mainPluginDir,
    encoding: "utf8",
    env: process.env,
  });

  // Copy built files to test app
  const testDistDir = path.join(testAppDir, "dist");
  const mainDistDir = path.join(mainPluginDir, "dist-test");

  if (!fs.existsSync(testDistDir)) {
    fs.mkdirSync(testDistDir, { recursive: true });
  }

  if (fs.existsSync(mainDistDir)) {
    console.log("📋 Copying built files...");
    const files = fs.readdirSync(mainDistDir);

    for (const file of files) {
      const sourceFile = path.join(mainDistDir, file);
      const targetFile = path.join(testDistDir, file);

      if (fs.statSync(sourceFile).isDirectory()) {
        fs.cpSync(sourceFile, targetFile, { recursive: true });
      } else {
        fs.copyFileSync(sourceFile, targetFile);
      }
    }
  }

  console.log("🎉 Test build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
