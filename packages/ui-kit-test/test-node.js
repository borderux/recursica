#!/usr/bin/env node

/**
 * Node.js test script for ui-kit-test package
 * This tests the factory system and basic functionality
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 Testing UI Kit Test Package...\n");

const distPath = path.join(__dirname, "dist");
const requiredFiles = [
  "ui-kit-test.js",
  "ui-kit-test.cjs",
  "ui-kit-test.css",
  "index.d.ts",
];

console.log("📁 Checking built files...");
requiredFiles.forEach((file) => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

// Test 2: Check package.json
console.log("\n📦 Checking package.json...");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  console.log(`✅ Package name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Main: ${packageJson.main}`);
  console.log(`✅ Module: ${packageJson.module}`);
  console.log(`✅ Types: ${packageJson.types}`);
} catch (error) {
  console.log("❌ Error reading package.json:", error.message);
}

// Test 3: Check TypeScript definitions
console.log("\n🔍 Checking TypeScript definitions...");
try {
  const indexDts = fs.readFileSync(path.join(distPath, "index.d.ts"), "utf8");
  const hasButton = indexDts.includes("Button");
  const hasFactory = indexDts.includes("RecursicaFactory");
  const hasInitialize = indexDts.includes("initializeRecursica");

  console.log(`✅ Button export: ${hasButton ? "Found" : "Missing"}`);
  console.log(`✅ Factory export: ${hasFactory ? "Found" : "Missing"}`);
  console.log(`✅ Initialize export: ${hasInitialize ? "Found" : "Missing"}`);
} catch (error) {
  console.log("❌ Error reading TypeScript definitions:", error.message);
}

// Test 4: Check CSS output
console.log("\n🎨 Checking CSS output...");
try {
  const css = fs.readFileSync(path.join(distPath, "ui-kit-test.css"), "utf8");
  const hasSalmonColor = css.includes("--color-salmon-600");
  const hasButtonClass = css.includes(".ui-kit-test-button");
  const hasHoverState = css.includes(":hover");

  console.log(
    `✅ Salmon color variable: ${hasSalmonColor ? "Found" : "Missing"}`,
  );
  console.log(`✅ Button class: ${hasButtonClass ? "Found" : "Missing"}`);
  console.log(`✅ Hover states: ${hasHoverState ? "Found" : "Missing"}`);
} catch (error) {
  console.log("❌ Error reading CSS:", error.message);
}

// Test 5: Check source files
console.log("\n📝 Checking source files...");
const sourceFiles = [
  "src/index.ts",
  "src/factory/recursica-factory.ts",
  "src/components/Button/Button.tsx",
  "src/components/Button/Button.css.ts",
  "src/recursica.js",
  "src/recursica.d.ts",
];

sourceFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

// Test 6: Check example files
console.log("\n📚 Checking example files...");
const exampleFiles = [
  "src/example/ExampleUsage.tsx",
  "test.html",
  "test-react.html",
  "README.md",
];

exampleFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

console.log("\n🎉 Test completed!");
console.log("\n📋 Next steps:");
console.log("1. Open test.html in your browser to see the visual test");
console.log("2. Open test-react.html to test React integration");
console.log('3. Run "npm run dev" to start development mode');
console.log("4. Use the package in your own projects!");
