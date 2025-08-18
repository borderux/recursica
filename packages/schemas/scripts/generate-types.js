/**
 * @fileoverview
 * This script builds the schemas package. It performs the following steps:
 * 1. Cleans the 'dist' directory.
 * 2. Finds all '.json' schema files in the 'src' directory.
 * 3. Generates TypeScript definition files (.d.ts) from the JSON schemas and places them in 'dist/types'.
 * 4. Copies the original JSON schema files to the root of the 'dist' directory.
 * 5. Creates an 'index.d.ts' barrel file in 'dist/types' to export all generated types.
 * 6. Compiles validators from TypeScript to JavaScript.
 * This process ensures that the output schemas are flat in the 'dist' directory, while types
 * are organized in the 'dist/types' subdirectory and easily importable.
 */

/* eslint-disable no-console */
const { compileFromFile } = require("json-schema-to-typescript");
const { glob } = require("glob");
const fs = require("fs/promises");
const path = require("path");
const { execSync } = require("child_process");

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
 * Compiles validators from TypeScript to JavaScript.
 */
async function compileValidators() {
  console.log("Compiling validators...");

  try {
    // Check if validators directory exists
    const validatorsDir = path.join(SRC_DIR, "validators");
    try {
      await fs.access(validatorsDir);
    } catch {
      console.log(
        "No validators directory found, skipping validator compilation.",
      );
      return;
    }

    // Create lib directory for validators (separate from dist for schemas)
    const libDir = path.join(CWD, "lib");
    await fs.mkdir(libDir, { recursive: true });

    // Compile validators using TypeScript compiler
    execSync("npx tsc --project tsconfig.validators.json", {
      stdio: "inherit",
      cwd: CWD,
    });

    console.log("✓ Compiled validators to lib/");
  } catch (error) {
    console.error("Failed to compile validators:", error.message);
    throw error;
  }
}

/**
 * Creates an index.d.ts file that exports all types from the types directory.
 */
async function createIndexFile() {
  console.log("Creating index file for types...");
  const typeFiles = await glob(`${DIST_DIR}/*.d.ts`);
  const exports = typeFiles
    .map((file) => path.basename(file, ".d.ts"))
    .filter((baseName) => baseName !== "index" && baseName !== "schemas")
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
 * Builds the index.ts file to JavaScript and TypeScript declaration.
 */
async function buildIndexFile() {
  console.log("Building index.ts file...");

  try {
    // Get all JSON schema files to generate dynamic exports
    const jsonFiles = await glob(`${SRC_DIR}/**/*.json`, {
      ignore: [`${SRC_DIR}/test/**`],
    });
    const schemaNames = jsonFiles.map((file) => path.basename(file, ".json"));

    // Generate import statements
    const imports = schemaNames
      .map((name) => `import ${name}Json from "./${name}.json";`)
      .join("\n");

    // Generate export statements
    const exports = schemaNames
      .map((name) => `export const ${name}JsonSchema = ${name}Json;`)
      .join("\n");

    // Create the index.js file
    const jsContent = `${BANNER_COMMENT}

${imports}

// Export the schema JSON values
${exports}
`;

    await fs.writeFile(path.join(DIST_DIR, "index.js"), jsContent);

    // Generate type exports
    const typeExports = schemaNames
      .map((name) => `export * from "./${name}";`)
      .join("\n");

    // Generate JSON schema exports
    const jsonExports = schemaNames
      .map((name) => `export const ${name}JsonSchema: any;`)
      .join("\n");

    // Create a declaration file that exports the schemas dynamically
    const declarationContent = `${BANNER_COMMENT}

${typeExports}

// Export the schema JSON values with different names to avoid conflicts
${jsonExports}
`;

    await fs.writeFile(path.join(DIST_DIR, "index.d.ts"), declarationContent);
    console.log("✓ Generated index.d.ts and index.js");
  } catch (error) {
    console.error("Failed to build index.ts:", error.message);
  }
}

/**
 * Main build function to orchestrate the build process.
 */
async function build() {
  await cleanDist();
  await createDist();
  const jsonFiles = await glob(`${SRC_DIR}/**/*.json`, {
    ignore: [`${SRC_DIR}/test/**`],
  });
  await processSchemas(jsonFiles);
  await compileValidators();
  await createIndexFile();
  await buildIndexFile();
  console.log("\nBuild completed successfully.");
}

// Execute the build process
build().catch((error) => {
  console.error("\nBuild failed:", error);
  process.exit(1);
});
