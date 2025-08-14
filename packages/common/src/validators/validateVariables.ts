import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { formatValidationErrors } from "./errorFormatter.js";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Type definitions for variable data structure
interface VariableReference {
  collection: string;
  name: string;
}

interface VariableData {
  collection: string;
  mode: string;
  name: string;
  type: string;
  value: string | number | VariableReference;
}

interface VariablesData {
  projectId: string;
  pluginVersion: string;
  tokens: Record<string, VariableData>;
  themes: Record<string, Record<string, VariableData>>;
  uiKit: Record<string, VariableData>;
}

// Load variables schema at runtime
function loadVariablesSchema(): object {
  try {
    const schemaPath = join(
      __dirname,
      "..",
      "..",
      "..",
      "schemas",
      "dist",
      "RecursicaVariables.json",
    );
    const schemaContent = readFileSync(schemaPath, "utf-8");
    const schema = JSON.parse(schemaContent);

    // Remove $schema reference to avoid meta-schema issues
    delete schema.$schema;
    return schema;
  } catch (error) {
    throw new Error(`Failed to load variables schema: ${error}`);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Checks if a value is a variable reference (has collection and name properties)
 */
function isVariableReference(value: unknown): value is VariableReference {
  return (
    typeof value === "object" &&
    value !== null &&
    "collection" in value &&
    "name" in value &&
    typeof (value as VariableReference).collection === "string" &&
    typeof (value as VariableReference).name === "string"
  );
}

/**
 * Validates variable reference relationships
 * - UI Kit should not reference Tokens (only Themes)
 * - Themes should only reference Tokens (not other Themes)
 */
function validateVariableReferences(data: VariablesData): string[] {
  const errors: string[] = [];

  // Get all token names for reference checking
  const tokenNames = new Set<string>();
  if (data.tokens) {
    Object.keys(data.tokens).forEach((tokenKey) => {
      const token = data.tokens[tokenKey];
      if (token && token.name) {
        tokenNames.add(token.name);
      }
    });
  }

  // Get all theme names for reference checking
  const themeNames = new Set<string>();
  if (data.themes) {
    Object.keys(data.themes).forEach((themeKey) => {
      const theme = data.themes[themeKey];
      if (theme && typeof theme === "object") {
        Object.keys(theme).forEach((themeVarKey) => {
          const themeVar = theme[themeVarKey];
          if (themeVar && themeVar.name) {
            themeNames.add(themeVar.name);
          }
        });
      }
    });
  }

  // Check UI Kit references - should not reference Tokens
  if (data.uiKit) {
    Object.keys(data.uiKit).forEach((uiKitKey) => {
      const uiKitVar = data.uiKit[uiKitKey];
      if (uiKitVar && isVariableReference(uiKitVar.value)) {
        const ref = uiKitVar.value;
        if (ref.collection === "Tokens") {
          errors.push(
            `uiKit.${uiKitKey}: UI Kit variables should not reference Tokens collection, found reference to "${ref.name}"`,
          );
        }
      }
    });
  }

  // Check Themes references - should only reference Tokens
  if (data.themes) {
    Object.keys(data.themes).forEach((themeKey) => {
      const theme = data.themes[themeKey];
      if (theme && typeof theme === "object") {
        Object.keys(theme).forEach((themeVarKey) => {
          const themeVar = theme[themeVarKey];
          if (themeVar && isVariableReference(themeVar.value)) {
            const ref = themeVar.value;
            if (ref.collection === "Themes") {
              errors.push(
                `themes.${themeKey}.${themeVarKey}: Theme variables should only reference Tokens collection, found reference to "${ref.name}" in Themes collection`,
              );
            }
          }
        });
      }
    });
  }

  return errors;
}

/**
 * Validates a Recursica variables JSON file
 * @param data - The variables JSON data to validate
 * @returns ValidationResult with validation status and any errors
 */
export function validateVariables(data: unknown): ValidationResult {
  // Initialize AJV with formats support
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false, // Allow unknown formats
  });
  addFormats(ajv);

  const schema = loadVariablesSchema();

  try {
    // Compile and validate
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      // Format validation errors using the shared formatter
      const schemaErrors = formatValidationErrors(validate.errors);
      return {
        isValid: false,
        errors: schemaErrors,
      };
    }

    // If schema validation passes, check variable reference relationships
    const referenceErrors = validateVariableReferences(data as VariablesData);

    if (referenceErrors.length > 0) {
      return {
        isValid: false,
        errors: referenceErrors,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Schema compilation error: ${error}`],
    };
  }
}
