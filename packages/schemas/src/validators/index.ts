export * from "./validateConfiguration";
export * from "./validateIcons";
export * from "./validateVariables";
export * from "./errorFormatter";

// Re-export the ValidationResult interface for convenience
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
