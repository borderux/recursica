/* eslint-disable no-console */
const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const ajv = new Ajv();
const srcDir = path.resolve(__dirname, "../src");

// Find all files ending with .json in the src directory and its subdirectories
const schemaFiles = glob.sync(`${srcDir}/**/*.json`);
let hasErrors = false;

if (schemaFiles.length === 0) {
  console.log("No schema files found to validate in src (e.g., *.json).");
  process.exit(0);
}

console.log(`Found ${schemaFiles.length} schema files to validate.`);

for (const file of schemaFiles) {
  try {
    const schema = JSON.parse(fs.readFileSync(file, "utf-8"));
    const valid = ajv.validateSchema(schema, true); // `true` will log errors to console via ajv
    if (!valid) {
      console.error(
        `Validation failed for ${path.relative(process.cwd(), file)}:`,
      );
      console.error(ajv.errorsText(ajv.errors));
      hasErrors = true;
    } else {
      console.log(
        `✅ ${path.relative(process.cwd(), file)} is a valid schema.`,
      );
    }
  } catch (e) {
    console.error(
      `Error processing ${path.relative(process.cwd(), file)}:`,
      e.message,
    );
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error("\nSchema validation failed.");
  process.exit(1);
} else {
  console.log("\nAll schemas are valid.");
}
