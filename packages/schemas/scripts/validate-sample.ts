#!/usr/bin/env tsx

/**
 * Sample Validation Script
 *
 * This utility script validates the sample Recursica variables JSON file
 * and displays detailed error reports for variable reference violations.
 *
 * It demonstrates the specialized validation rules:
 * - UI Kit variables should NOT reference Tokens collection (only Themes)
 * - Theme variables should ONLY reference Tokens collection (not other Themes)
 *
 * Usage:
 *   npm run validate-sample
 *
 * Output:
 *   - Summary of validation results
 *   - Categorized list of violations
 *   - Detailed error messages with dot notation paths
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { validateVariables } from "../src/validators/validateVariables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const packageRoot = join(__dirname, ".."); // Go up one more level to package root

// Load the sample variables file
const sampleFilePath = join(
  packageRoot,
  "src",
  "test",
  "recursica-bundle.json",
);

const sampleData = JSON.parse(readFileSync(sampleFilePath, "utf-8"));

// eslint-disable-next-line no-console
console.log("Running validateVariables on sample file...\n");
// eslint-disable-next-line no-console
console.log(`Sample file loaded: ${sampleFilePath}`);
// eslint-disable-next-line no-console
console.log(`Sample data keys: ${Object.keys(sampleData).join(", ")}\n`);

const result = validateVariables(sampleData);

// eslint-disable-next-line no-console
console.log(`Validation Result: ${result.isValid ? "PASS" : "FAIL"}\n`);

if (!result.isValid && result.errors) {
  // eslint-disable-next-line no-console
  console.log(`Found ${result.errors.length} validation errors:\n`);

  // Group errors by type for better reporting
  const uiKitTokenViolations = result.errors.filter((error: string) =>
    error.includes("UI Kit variables should not reference Tokens collection"),
  );
  const themeThemeViolations = result.errors.filter((error: string) =>
    error.includes("Theme variables should only reference Tokens collection"),
  );

  // Display summary statistics
  // eslint-disable-next-line no-console
  console.log(`=== SUMMARY ===`);
  // eslint-disable-next-line no-console
  console.log(`UI Kit → Tokens violations: ${uiKitTokenViolations.length}`);
  // eslint-disable-next-line no-console
  console.log(`Theme → Theme violations: ${themeThemeViolations.length}`);
  // eslint-disable-next-line no-console
  console.log(`Total violations: ${result.errors.length}\n`);

  // Display UI Kit violations
  // eslint-disable-next-line no-console
  console.log(
    `=== UI KIT → TOKENS VIOLATIONS (${uiKitTokenViolations.length}) ===`,
  );
  uiKitTokenViolations.forEach((error: string, index: number) => {
    // eslint-disable-next-line no-console
    console.log(`${index + 1}. ${error}`);
  });

  // Display Theme violations
  // eslint-disable-next-line no-console
  console.log(
    `\n=== THEME → THEME VIOLATIONS (${themeThemeViolations.length}) ===`,
  );
  themeThemeViolations.forEach((error: string, index: number) => {
    // eslint-disable-next-line no-console
    console.log(`${index + 1}. ${error}`);
  });
} else {
  // eslint-disable-next-line no-console
  console.log("No validation errors found!");
}
