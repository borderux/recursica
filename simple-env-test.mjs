#!/usr/bin/env node

/**
 * Simple test to verify Vite environment variable priority
 */

import { execSync } from "child_process";
import fs from "fs";

const testDir = "/tmp/simple-vite-test";

console.log("🧪 Simple Vite Environment Variable Priority Test\n");

// Clean up
try {
  execSync(`rm -rf ${testDir}`, { stdio: "ignore" });
} catch (e) {}

// Create test directory
fs.mkdirSync(testDir, { recursive: true });

// Create .env file with a test value
fs.writeFileSync(`${testDir}/.env`, "VITE_TEST_VAR=from_dot_env_file\n");

// Create a simple HTML file
fs.writeFileSync(
  `${testDir}/index.html`,
  `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <script>
    console.log('VITE_TEST_VAR from browser:', import.meta.env.VITE_TEST_VAR);
  </script>
</body>
</html>`,
);

// Create package.json
fs.writeFileSync(
  `${testDir}/package.json`,
  JSON.stringify(
    {
      name: "test",
      type: "module",
      devDependencies: { vite: "^6.0.0" },
    },
    null,
    2,
  ),
);

console.log("📁 Created test files:");
console.log("  .env: VITE_TEST_VAR=from_dot_env_file");
console.log("");

// Test 1: Without external env var
console.log("🧪 Test 1: No external environment variable");
try {
  const result = execSync("cd /tmp/simple-vite-test && npx vite build", {
    stdio: "pipe",
    encoding: "utf8",
  });
  console.log("✅ Build successful");
  // Check the built file for the value
  const builtHtml = fs.readFileSync(`${testDir}/dist/index.html`, "utf8");
  if (builtHtml.includes("from_dot_env_file")) {
    console.log(
      '✅ Found "from_dot_env_file" in built HTML - .env file value was used',
    );
  } else {
    console.log('❌ Did not find "from_dot_env_file" in built HTML');
  }
} catch (error) {
  console.log("❌ Build failed:", error.message);
}

console.log("");

// Test 2: With external env var
console.log("🧪 Test 2: WITH external environment variable");
try {
  const result = execSync(
    "cd /tmp/simple-vite-test && VITE_TEST_VAR=from_external_env npx vite build",
    {
      stdio: "pipe",
      encoding: "utf8",
    },
  );
  console.log("✅ Build successful");
  // Check the built file for the value
  const builtHtml = fs.readFileSync(`${testDir}/dist/index.html`, "utf8");
  if (builtHtml.includes("from_external_env")) {
    console.log(
      '✅ Found "from_external_env" in built HTML - external env var overrode .env file',
    );
  } else if (builtHtml.includes("from_dot_env_file")) {
    console.log(
      '❌ Found "from_dot_env_file" in built HTML - .env file was NOT overridden',
    );
  } else {
    console.log("❌ Neither value found in built HTML");
  }
} catch (error) {
  console.log("❌ Build failed:", error.message);
}

console.log("");

// Clean up
try {
  execSync(`rm -rf ${testDir}`, { stdio: "ignore" });
} catch (e) {}

console.log("✅ Test completed!");
