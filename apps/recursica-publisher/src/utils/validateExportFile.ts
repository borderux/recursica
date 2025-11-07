/**
 * Validates that a JSON object is a valid Recursica export file
 * @param jsonData - The parsed JSON object to validate
 * @returns An object with `valid: boolean` and `error?: string` properties
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImport(jsonData: unknown): ValidationResult {
  // Check if it's an object
  if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
    return {
      valid: false,
      error: "Invalid file format: Expected a JSON object",
    };
  }

  const data = jsonData as Record<string, unknown>;

  // Check for required top-level fields
  const requiredFields = [
    "metadata",
    "stringTable",
    "collections",
    "variables",
    "instances",
    "pageData",
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      return {
        valid: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  // Validate metadata structure
  const metadata = data.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {
      valid: false,
      error: "Invalid metadata: Expected an object",
    };
  }

  const metadataObj = metadata as Record<string, unknown>;

  // Check for required metadata fields (only guid and name are required)
  const requiredMetadataFields = ["guid", "name"];

  for (const field of requiredMetadataFields) {
    if (!(field in metadataObj)) {
      return {
        valid: false,
        error: `Missing required metadata field: ${field}`,
      };
    }
  }

  // Validate guid
  const guid = metadataObj.guid;
  if (typeof guid !== "string") {
    return {
      valid: false,
      error: "Invalid guid: Expected a string",
    };
  }

  // Validate name
  const name = metadataObj.name;
  if (typeof name !== "string") {
    return {
      valid: false,
      error: "Invalid name: Expected a string",
    };
  }

  // Validate that stringTable is an object
  if (
    !data.stringTable ||
    typeof data.stringTable !== "object" ||
    Array.isArray(data.stringTable)
  ) {
    return {
      valid: false,
      error: "Invalid stringTable: Expected an object",
    };
  }

  // Validate that collections is an object
  if (
    !data.collections ||
    typeof data.collections !== "object" ||
    Array.isArray(data.collections)
  ) {
    return {
      valid: false,
      error: "Invalid collections: Expected an object",
    };
  }

  // Validate that variables is an object
  if (
    !data.variables ||
    typeof data.variables !== "object" ||
    Array.isArray(data.variables)
  ) {
    return {
      valid: false,
      error: "Invalid variables: Expected an object",
    };
  }

  // Validate that instances is an object
  if (
    !data.instances ||
    typeof data.instances !== "object" ||
    Array.isArray(data.instances)
  ) {
    return {
      valid: false,
      error: "Invalid instances: Expected an object",
    };
  }

  // Validate that pageData is an object
  if (
    !data.pageData ||
    typeof data.pageData !== "object" ||
    Array.isArray(data.pageData)
  ) {
    return {
      valid: false,
      error: "Invalid pageData: Expected an object",
    };
  }

  // All validations passed
  return { valid: true };
}
