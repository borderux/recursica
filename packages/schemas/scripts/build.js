/**
 * @fileoverview
 * This script builds the schemas package. It performs the following steps:
 * 1. Cleans the 'dist' directory.
 * 2. Finds all '.json' schema files in the 'src' directory.
 * 3. Generates TypeScript definition files (.d.ts) from the JSON schemas and places them in 'dist/types'.
 * 4. Copies the original JSON schema files to 'dist/schemas'.
 * This process ensures that the output is flat, meaning all generated types and copied schemas
 * reside directly in their respective 'dist' subdirectories, without preserving the source folder structure.
 */

/* eslint-disable no-console */
const { compileFromFile } = require("json-schema-to-typescript");
const { glob } = require("glob");
const fs = require("fs/promises");
const path = require("path");

const CWD = process.cwd();
const SRC_DIR = path.resolve(CWD, "src");
const DIST_DIR = path.resolve(CWD, "dist");
const TYPES_DIR = path.join(DIST_DIR, "types");
const SCHEMAS_DIR = path.join(DIST_DIR, "schemas");

/**
 * Cleans the dist directory by removing it if it exists.
 */
async function cleanDist() {
  console.log("Cleaning 'dist' directory...");
  try {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    console.log("'dist' directory cleaned.");
  } catch (error) {
    // Ignore errors if the directory doesn't exist
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

/**
 * Creates the necessary output directories.
 */
async function createDist() {
  console.log("Creating 'dist' directories...");
  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.mkdir(TYPES_DIR, { recursive: true });
  await fs.mkdir(SCHEMAS_DIR, { recursive: true });
  console.log("'dist' directories created.");
}

/**
 * Generates TypeScript definitions from JSON schemas and copies the original schemas.
 * @param {string[]} jsonFiles - An array of paths to the JSON schema files.
 */
async function processSchemas(jsonFiles) {
  if (jsonFiles.length === 0) {
    console.log("No '.json' files found in 'src'.");
    return;
  }

  console.log(
    `Found ${jsonFiles.length} JSON schema files. Generating types and copying schemas...`,
  );

  const tasks = jsonFiles.map(async (file) => {
    const baseName = path.basename(file, ".json");
    const tsFile = path.join(TYPES_DIR, `${baseName}.d.ts`);
    const schemaFile = path.join(SCHEMAS_DIR, `${baseName}.json`);

    // Generate TS definition
    const ts = await compileFromFile(file, {
      cwd: SRC_DIR,
      bannerComment: "",
    });
    await fs.writeFile(tsFile, ts);
    console.log(`✓ Generated ${path.basename(tsFile)}`);

    // Copy schema file
    await fs.copyFile(file, schemaFile);
    console.log(`✓ Copied ${path.basename(schemaFile)}`);
  });

  await Promise.all(tasks);
}

/**
 * Main build function to orchestrate the build process.
 */
async function build() {
  await cleanDist();
  await createDist();
  const jsonFiles = await glob(`${SRC_DIR}/**/*.json`);
  await processSchemas(jsonFiles);
  console.log("\nBuild completed successfully.");
}

// Execute the build process
build().catch((error) => {
  console.error("\nBuild failed:", error);
  process.exit(1);
});
