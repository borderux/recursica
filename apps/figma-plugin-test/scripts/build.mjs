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

  // Use Turbo to build dependencies first, then the main plugin in test mode
  console.log("🏗️  Building dependencies and test version using Turbo...");
  console.log("📋 Environment variables being passed to build:");
  console.log(
    `  VITE_RECURSICA_API_URL: ${process.env.VITE_RECURSICA_API_URL}`,
  );
  console.log(`  VITE_RECURSICA_UI_URL: ${process.env.VITE_RECURSICA_UI_URL}`);
  console.log(`  VITE_PLUGIN_PHRASE: ${process.env.VITE_PLUGIN_PHRASE}`);
  console.log(
    `  VITE_SHOW_VERSION_BANNER: ${process.env.VITE_SHOW_VERSION_BANNER}`,
  );

  try {
    // First, build all dependencies using Turbo
    console.log("📦 Building dependencies with Turbo...");
    const turboResult = execSync(
      "npx turbo run build --filter=@recursica/ui-kit-mantine --filter=@recursica/common --filter=@recursica/schemas",
      {
        cwd: path.resolve(mainPluginDir, "../.."), // Go to repo root
        encoding: "utf8",
        env: {
          ...process.env,
          VITE_RECURSICA_API_URL: process.env.VITE_RECURSICA_API_URL,
          VITE_RECURSICA_UI_URL: process.env.VITE_RECURSICA_UI_URL,
          VITE_PLUGIN_PHRASE: process.env.VITE_PLUGIN_PHRASE,
          VITE_SHOW_VERSION_BANNER: process.env.VITE_SHOW_VERSION_BANNER,
        },
      },
    );
    console.log("✅ Dependencies built successfully:");
    console.log(turboResult);

    // Then build the main plugin in test mode
    console.log("🏗️  Building main plugin in test mode...");
    const buildResult = execSync("npm run build:test", {
      cwd: mainPluginDir,
      encoding: "utf8",
      env: {
        ...process.env,
        VITE_RECURSICA_API_URL: process.env.VITE_RECURSICA_API_URL,
        VITE_RECURSICA_UI_URL: process.env.VITE_RECURSICA_UI_URL,
        VITE_PLUGIN_PHRASE: process.env.VITE_PLUGIN_PHRASE,
        VITE_SHOW_VERSION_BANNER: process.env.VITE_SHOW_VERSION_BANNER,
      },
    });
    console.log("✅ Main plugin build:test output:");
    console.log(buildResult);
  } catch (error) {
    console.error("❌ Build failed:");
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
