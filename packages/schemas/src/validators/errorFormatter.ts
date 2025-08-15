import type { ErrorObject } from "ajv";

/**
 * Formats AJV validation errors into plain text messages with location information
 * @param errors - Array of AJV error objects
 * @returns Array of formatted error strings
 */
export function formatValidationErrors(
  errors: ErrorObject[] | null | undefined,
): string[] {
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map((error) => {
    // Get the location path
    const path = error.instancePath || "root";

    // Get the error message
    const message = error.message || "Unknown validation error";

    // Format the path to be more readable
    const formattedPath = formatPath(path);

    // Create a clean error message
    return `${formattedPath}: ${message}`;
  });
}

/**
 * Formats a JSON path into a more readable format using dot notation
 * @param path - The JSON path from AJV (e.g., "/tokens/color/primary")
 * @returns Formatted path string using dot notation
 */
function formatPath(path: string): string {
  if (path === "root") {
    return "root level";
  }

  // Remove leading slash and split by slashes
  const parts = path.startsWith("/")
    ? path.slice(1).split("/")
    : path.split("/");

  // Format each part to be more readable
  const formattedParts = parts.map((part, index) => {
    // If it's a numeric index (array), format it nicely
    if (/^\d+$/.test(part)) {
      return `[${parseInt(part)}]`;
    }

    // If it's the first part, just return it as is
    if (index === 0) {
      return part;
    }

    // For nested properties, use dot notation
    return part;
  });

  return formattedParts.join(".");
}
