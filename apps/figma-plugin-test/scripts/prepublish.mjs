#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Prepublish Script for Test Figma Plugin
 *
 * This script runs automatically when the test figma plugin is published via Changesets.
 * It ensures the plugin is built with test environment variables after the version
 * number has been bumped by Changesets.
 *
 * Environment Variable Mapping:
 * - Maps RECURSICA_API_TEST to VITE_RECURSICA_API_URL (test API URL)
 * - Maps RECURSICA_API_TEST to VITE_RECURSICA_UI_URL (test UI URL)
 * - Maps PLUGIN_PHRASE_TEST to VITE_PLUGIN_PHRASE (test plugin phrase)
 * - Sets VITE_SHOW_VERSION_BANNER to "true" to show version banner in test builds
 *
 * This allows the test plugin to use different environment variables than the main plugin
 * while still using the same build process.
 */

import { execSync } from "child_process";

console.log("🧪 Building TEST plugin...");

// Set test environment variables for the test plugin
process.env.VITE_RECURSICA_API_URL =
  process.env.VITE_RECURSICA_API_URL || process.env.RECURSICA_API_TEST;
process.env.VITE_RECURSICA_UI_URL =
  process.env.VITE_RECURSICA_UI_URL || process.env.RECURSICA_API_TEST;
process.env.VITE_PLUGIN_PHRASE =
  process.env.VITE_PLUGIN_PHRASE || process.env.PLUGIN_PHRASE_TEST;
process.env.VITE_SHOW_VERSION_BANNER = "true";

console.log("📋 Environment variables:");
console.log(`  VITE_RECURSICA_API_URL: ${process.env.VITE_RECURSICA_API_URL}`);
console.log(`  VITE_RECURSICA_UI_URL: ${process.env.VITE_RECURSICA_UI_URL}`);
console.log(`  VITE_PLUGIN_PHRASE: ${process.env.VITE_PLUGIN_PHRASE}`);
console.log(
  `  VITE_SHOW_VERSION_BANNER: ${process.env.VITE_SHOW_VERSION_BANNER}`,
);

// Always build test version for the test plugin
// Pass the environment variables to the build process
try {
  const result = execSync("npm run build", {
    encoding: "utf8",
    env: {
      ...process.env,
      VITE_RECURSICA_API_URL: process.env.VITE_RECURSICA_API_URL,
      VITE_RECURSICA_UI_URL: process.env.VITE_RECURSICA_UI_URL,
      VITE_PLUGIN_PHRASE: process.env.VITE_PLUGIN_PHRASE,
      VITE_SHOW_VERSION_BANNER: process.env.VITE_SHOW_VERSION_BANNER,
    },
  });
  console.log("✅ Test plugin build output:");
  console.log(result);
} catch (error) {
  console.error("❌ Test plugin build failed:");
  console.error("Error message:", error.message);
  console.error("Error output:", error.output);
  console.error("Error stderr:", error.stderr);
  console.error("Error stdout:", error.stdout);
  console.error("Full error object:", error);
  throw error;
}

console.log("✅ Test plugin build completed successfully!");
