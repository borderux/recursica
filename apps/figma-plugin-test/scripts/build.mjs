#!/usr/bin/env node
/* eslint-disable turbo/no-undeclared-env-vars */
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

  // Map test environment variables to VITE_ variables
  process.env.VITE_RECURSICA_API_URL =
    process.env.VITE_RECURSICA_API_URL || process.env.RECURSICA_API_TEST;
  process.env.VITE_RECURSICA_UI_URL =
    process.env.VITE_RECURSICA_UI_URL || process.env.RECURSICA_API_TEST;
  process.env.VITE_PLUGIN_PHRASE =
    process.env.VITE_PLUGIN_PHRASE || process.env.PLUGIN_PHRASE_TEST;
  process.env.VITE_SHOW_VERSION_BANNER = "true";

  console.log("🏗️  Building test version of Figma plugin...");
  console.log("📋 Environment variables being passed to build:");
  console.log(
    `  VITE_RECURSICA_API_URL: ${process.env.VITE_RECURSICA_API_URL}`,
  );
  console.log(`  VITE_RECURSICA_UI_URL: ${process.env.VITE_RECURSICA_UI_URL}`);
  console.log(`  VITE_PLUGIN_PHRASE: ${process.env.VITE_PLUGIN_PHRASE}`);
  console.log(
    `  VITE_SHOW_VERSION_BANNER: ${process.env.VITE_SHOW_VERSION_BANNER}`,
  );

  // Debug: Print all environment variables that start with VITE_ or RECURSICA_ or PLUGIN_
  console.log("\n🔍 DEBUG: All relevant environment variables:");
  const relevantEnvVars = Object.keys(process.env)
    .filter(
      (key) =>
        key.startsWith("VITE_") ||
        key.startsWith("RECURSICA_") ||
        key.startsWith("PLUGIN_"),
    )
    .sort();

  relevantEnvVars.forEach((key) => {
    const value = process.env[key];
    // Mask sensitive values
    const displayValue =
      key.includes("PHRASE") || key.includes("TOKEN") || key.includes("SECRET")
        ? value
          ? `${value.substring(0, 4)}...`
          : "undefined"
        : value;
    console.log(`  ${key}: ${displayValue}`);
  });

  // Debug: Print all environment variables (for complete debugging)
  console.log("\n🔍 DEBUG: All environment variables:");
  Object.keys(process.env)
    .sort()
    .forEach((key) => {
      const value = process.env[key];
      // Mask sensitive values
      const displayValue =
        key.includes("PHRASE") ||
        key.includes("TOKEN") ||
        key.includes("SECRET") ||
        key.includes("PASSWORD")
          ? value
            ? `${value.substring(0, 4)}...`
            : "undefined"
          : value;
      console.log(`  ${key}: ${displayValue}`);
    });

  // Build dependencies first
  console.log("🏗️  Building dependencies first...");
  try {
    const depsResult = execSync(
      "npx turbo run build --filter=@recursica/ui-kit-mantine --filter=@recursica/common --filter=@recursica/schemas",
      {
        encoding: "utf8",
        env: {
          ...process.env,
          VITE_RECURSICA_API_URL: process.env.VITE_RECURSICA_API_URL,
          VITE_RECURSICA_UI_URL: process.env.VITE_RECURSICA_UI_URL,
          VITE_PLUGIN_PHRASE: process.env.VITE_PLUGIN_PHRASE,
          VITE_SHOW_VERSION_BANNER: process.env.VITE_SHOW_VERSION_BANNER,
          RECURSICA_API_TEST: process.env.RECURSICA_API_TEST,
          PLUGIN_PHRASE_TEST: process.env.PLUGIN_PHRASE_TEST,
        },
      },
    );
    console.log("✅ Dependencies built successfully:");
    console.log(depsResult);
  } catch (error) {
    console.error("❌ Dependencies build failed:");
    console.error("Error message:", error.message);
    console.error("Error output:", error.output);
    console.error("Error stderr:", error.stderr);
    console.error("Error stdout:", error.stdout);
    console.error("Full error object:", error);
    throw error;
  }

  // Build the main plugin in test mode
  console.log("🏗️  Building main plugin in test mode...");
  try {
    const buildResult = execSync("npm run build:test", {
      cwd: mainPluginDir,
      encoding: "utf8",
      env: {
        ...process.env,
        VITE_RECURSICA_API_URL: process.env.VITE_RECURSICA_API_URL,
        VITE_RECURSICA_UI_URL: process.env.VITE_RECURSICA_UI_URL,
        VITE_PLUGIN_PHRASE: process.env.VITE_PLUGIN_PHRASE,
        VITE_SHOW_VERSION_BANNER: process.env.VITE_SHOW_VERSION_BANNER,
        RECURSICA_API_TEST: process.env.RECURSICA_API_TEST,
        PLUGIN_PHRASE_TEST: process.env.PLUGIN_PHRASE_TEST,
      },
    });
    console.log("✅ Main plugin test build completed:");
    console.log(buildResult);
  } catch (error) {
    console.error("❌ Main plugin test build failed:");
    console.error("Error message:", error.message);
    console.error("Error output:", error.output);
    console.error("Error stderr:", error.stderr);
    console.error("Error stdout:", error.stdout);
    console.error("Full error object:", error);
    throw error;
  }

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
