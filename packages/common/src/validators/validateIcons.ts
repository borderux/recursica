import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { formatValidationErrors } from "./errorFormatter.js";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Load icons schema at runtime
function loadIconsSchema(): object {
  try {
    const schemaPath = join(
      __dirname,
      "..",
      "..",
      "..",
      "schemas",
      "dist",
      "RecursicaIcons.json",
    );
    const schemaContent = readFileSync(schemaPath, "utf-8");
    const schema = JSON.parse(schemaContent);

    // Remove $schema reference to avoid meta-schema issues
    delete schema.$schema;
    return schema;
  } catch (error) {
    throw new Error(`Failed to load icons schema: ${error}`);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Validates a Recursica icons JSON file
 * @param data - The icons JSON data to validate
 * @returns ValidationResult with validation status and any errors
 */
export function validateIcons(data: unknown): ValidationResult {
  // Initialize AJV with formats support
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false, // Allow unknown formats
  });
  addFormats(ajv);

  const schema = loadIconsSchema();

  try {
    // Compile and validate
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (isValid) {
      return { isValid: true };
    }

    // Format validation errors using the shared formatter
    const errors = formatValidationErrors(validate.errors);

    return {
      isValid: false,
      errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Schema compilation error: ${error}`],
    };
  }
}
