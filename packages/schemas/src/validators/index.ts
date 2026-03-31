export * from "./validateConfigurationV1";
export * from "./validateConfigurationV2";
export * from "./validateIcons";
export * from "./validateVariables";
export * from "./errorFormatter";

// Re-export the ValidationResult interface for convenience
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
