#!/usr/bin/env node

/**
 * Test script to verify Vite environment variable priority
 *
 * This script tests whether external environment variables override .env file values
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const testDir = "/tmp/vite-env-test";
const testFile = path.join(testDir, "test-env.js");

console.log("🧪 Testing Vite Environment Variable Priority\n");

// Clean up any existing test directory
try {
  execSync(`rm -rf ${testDir}`, { stdio: "ignore" });
} catch (e) {
  // Ignore errors
}

// Create test directory
fs.mkdirSync(testDir, { recursive: true });

// Create a test .env file with specific values
const envContent = `# Test .env file
VITE_TEST_VAR=from_dot_env_file
VITE_ANOTHER_VAR=also_from_dot_env
VITE_OVERRIDE_VAR=should_be_overridden
`;

fs.writeFileSync(path.join(testDir, ".env"), envContent);

// Create a test .env.local file
const envLocalContent = `# Test .env.local file
VITE_LOCAL_VAR=from_dot_env_local
VITE_OVERRIDE_VAR=should_be_overridden_by_local
`;

fs.writeFileSync(path.join(testDir, ".env.local"), envLocalContent);

// Create a test .env.production file
const envProdContent = `# Test .env.production file
VITE_PROD_VAR=from_dot_env_production
VITE_OVERRIDE_VAR=should_be_overridden_by_production
`;

fs.writeFileSync(path.join(testDir, ".env.production"), envProdContent);

// Create a simple test file that logs environment variables
const testJsContent = `
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  console.log('\\n🔍 Vite Environment Variables:');
  console.log('Mode:', mode);
  console.log('VITE_TEST_VAR:', process.env.VITE_TEST_VAR);
  console.log('VITE_ANOTHER_VAR:', process.env.VITE_ANOTHER_VAR);
  console.log('VITE_LOCAL_VAR:', process.env.VITE_LOCAL_VAR);
  console.log('VITE_PROD_VAR:', process.env.VITE_PROD_VAR);
  console.log('VITE_OVERRIDE_VAR:', process.env.VITE_OVERRIDE_VAR);
  console.log('VITE_EXTERNAL_VAR:', process.env.VITE_EXTERNAL_VAR);
  console.log('VITE_EXTERNAL_OVERRIDE:', process.env.VITE_EXTERNAL_OVERRIDE);
  
  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [
      {
        name: 'env-logger',
        configResolved(config) {
          console.log('\\n🔍 Config Resolved Environment Variables:');
          console.log('Mode:', config.mode);
          console.log('VITE_TEST_VAR:', process.env.VITE_TEST_VAR);
          console.log('VITE_ANOTHER_VAR:', process.env.VITE_ANOTHER_VAR);
          console.log('VITE_LOCAL_VAR:', process.env.VITE_LOCAL_VAR);
          console.log('VITE_PROD_VAR:', process.env.VITE_PROD_VAR);
          console.log('VITE_OVERRIDE_VAR:', process.env.VITE_OVERRIDE_VAR);
          console.log('VITE_EXTERNAL_VAR:', process.env.VITE_EXTERNAL_VAR);
          console.log('VITE_EXTERNAL_OVERRIDE:', process.env.VITE_EXTERNAL_OVERRIDE);
        }
      }
    ]
  };
});
`;

fs.writeFileSync(path.join(testDir, "vite.config.js"), testJsContent);

// Create a simple HTML file for Vite to build
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Vite Env Test</title>
</head>
<body>
  <h1>Environment Variable Test</h1>
  <script>
    console.log('Browser Environment Variables:');
    console.log('VITE_TEST_VAR:', import.meta.env.VITE_TEST_VAR);
    console.log('VITE_ANOTHER_VAR:', import.meta.env.VITE_ANOTHER_VAR);
    console.log('VITE_LOCAL_VAR:', import.meta.env.VITE_LOCAL_VAR);
    console.log('VITE_PROD_VAR:', import.meta.env.VITE_PROD_VAR);
    console.log('VITE_OVERRIDE_VAR:', import.meta.env.VITE_OVERRIDE_VAR);
    console.log('VITE_EXTERNAL_VAR:', import.meta.env.VITE_EXTERNAL_VAR);
    console.log('VITE_EXTERNAL_OVERRIDE:', import.meta.env.VITE_EXTERNAL_OVERRIDE);
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(testDir, "index.html"), htmlContent);

// Create package.json
const packageJson = {
  name: "vite-env-test",
  version: "1.0.0",
  type: "module",
  devDependencies: {
    vite: "^6.0.0",
  },
};

fs.writeFileSync(
  path.join(testDir, "package.json"),
  JSON.stringify(packageJson, null, 2),
);

console.log("📁 Created test files:");
console.log("  .env:", envContent.trim());
console.log("  .env.local:", envLocalContent.trim());
console.log("  .env.production:", envProdContent.trim());
console.log("");

// Test 1: Default mode (should load .env and .env.local)
console.log("🧪 Test 1: Default mode (no external env vars)");
try {
  const result = execSync("cd /tmp/vite-env-test && npx vite build", {
    stdio: "pipe",
    encoding: "utf8",
  });
  console.log("Build output:", result);
} catch (error) {
  console.log("Build output:", error.stdout);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: Default mode with external environment variables
console.log("🧪 Test 2: Default mode WITH external env vars");
try {
  const result = execSync(
    "cd /tmp/vite-env-test && VITE_EXTERNAL_VAR=from_external_env VITE_EXTERNAL_OVERRIDE=external_overrides_all npx vite build",
    {
      stdio: "pipe",
      encoding: "utf8",
    },
  );
  console.log("Build output:", result);
} catch (error) {
  console.log("Build output:", error.stdout);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 3: Production mode (should load .env, .env.local, .env.production)
console.log("🧪 Test 3: Production mode (no external env vars)");
try {
  const result = execSync(
    "cd /tmp/vite-env-test && npx vite build --mode production",
    {
      stdio: "pipe",
      encoding: "utf8",
    },
  );
  console.log("Build output:", result);
} catch (error) {
  console.log("Build output:", error.stdout);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 4: Production mode with external environment variables
console.log("🧪 Test 4: Production mode WITH external env vars");
try {
  const result = execSync(
    "cd /tmp/vite-env-test && VITE_EXTERNAL_VAR=from_external_env VITE_EXTERNAL_OVERRIDE=external_overrides_all npx vite build --mode production",
    {
      stdio: "pipe",
      encoding: "utf8",
    },
  );
  console.log("Build output:", result);
} catch (error) {
  console.log("Build output:", error.stdout);
}

console.log("\n" + "=".repeat(50) + "\n");

// Clean up
try {
  execSync(`rm -rf ${testDir}`, { stdio: "ignore" });
} catch (e) {
  // Ignore errors
}

console.log(
  "✅ Test completed! Check the output above to see Vite environment variable priority.",
);
