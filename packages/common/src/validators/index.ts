export * from "./validateVariables";
export * from "./validateConfiguration";
export * from "./validateIcons";

// Re-export the ValidationResult interface for convenience
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
