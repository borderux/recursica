export * from "./validateVariables.js";
export * from "./validateConfiguration.js";
export * from "./validateIcons.js";

// Re-export the ValidationResult interface for convenience
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
