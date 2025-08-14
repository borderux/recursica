import Ajv from "ajv";
import { RecursicaVariablesJsonSchema as recursicaVariablesSchema } from "@recursica/schemas";

// Create AJV instance
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

// Compile the schema
const validateRecursicaVariables = ajv.compile(recursicaVariablesSchema);

/**
 * Validates an object against the RecursicaVariables schema
 * @param data - The object to validate
 * @returns An object containing validation result and any errors
 */
export function validate(data: unknown): {
  isValid: boolean;
  errors?: string[];
} {
  const isValid = validateRecursicaVariables(data);

  if (isValid) {
    return { isValid: true };
  }

  const errors =
    validateRecursicaVariables.errors?.map((error) => {
      const path = error.instancePath || "root";
      return `${path}: ${error.message}`;
    }) || [];

  return {
    isValid: false,
    errors,
  };
}

/**
 * Type guard function that checks if an object is valid according to the RecursicaVariables schema
 * @param data - The object to validate
 * @returns True if the object is valid, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidRecursicaVariables(data: unknown): data is any {
  return validateRecursicaVariables(data);
}
