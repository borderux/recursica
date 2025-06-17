/**
 * @fileoverview
 * This script builds the schemas package. It performs the following steps:
 * 1. Cleans the 'dist' directory.
 * 2. Finds all '.json' schema files in the 'src' directory.
 * 3. Generates TypeScript definition files (.d.ts) from the JSON schemas and places them in 'dist/types'.
 * 4. Copies the original JSON schema files to the root of the 'dist' directory.
 * 5. Creates an 'index.d.ts' barrel file in 'dist/types' to export all generated types.
 * This process ensures that the output schemas are flat in the 'dist' directory, while types
 * are organized in the 'dist/types' subdirectory and easily importable.
 */

/* eslint-disable no-console */
const { compileFromFile } = require("json-schema-to-typescript");
const { glob } = require("glob");
const fs = require("fs/promises");
const path = require("path");

const BANNER_COMMENT = `/**
 * WARNING: This file is auto-generated from a JSON schema. Do not edit directly.
 */`;

const CWD = process.cwd();
const SRC_DIR = path.resolve(CWD, "src");
const DIST_DIR = path.resolve(CWD, "dist");

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
  console.log("Creating 'dist' directory...");
  await fs.mkdir(DIST_DIR, { recursive: true });
  console.log("'dist' directory created.");
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
    const tsFile = path.join(DIST_DIR, `${baseName}.d.ts`);
    const schemaFile = path.join(DIST_DIR, `${baseName}.json`);

    // Generate TS definition
    const ts = await compileFromFile(file, {
      cwd: SRC_DIR,
      bannerComment: BANNER_COMMENT,
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
 * Creates an index.d.ts file that exports all types from the types directory.
 */
async function createIndexFile() {
  console.log("Creating index file for types...");
  const typeFiles = await glob(`${DIST_DIR}/*.d.ts`);
  const exports = typeFiles
    .map((file) => path.basename(file, ".d.ts"))
    .filter((baseName) => baseName !== "index")
    .map((baseName) => `export * from "./${baseName}";`)
    .join("\n");

  if (exports) {
    const indexFile = path.join(DIST_DIR, "index.d.ts");
    const content = `${BANNER_COMMENT}\n\n${exports}\n`;
    await fs.writeFile(indexFile, content);
    console.log("✓ Generated index.d.ts");
  } else {
    console.log("No types found to export in index.d.ts.");
  }
}

/**
 * Main build function to orchestrate the build process.
 */
async function build() {
  await cleanDist();
  await createDist();
  const jsonFiles = await glob(`${SRC_DIR}/**/*.json`);
  await processSchemas(jsonFiles);
  await createIndexFile();
  console.log("\nBuild completed successfully.");
}

// Execute the build process
build().catch((error) => {
  console.error("\nBuild failed:", error);
  process.exit(1);
});
