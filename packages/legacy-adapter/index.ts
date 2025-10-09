// Main exports for the recursica-adapter package
export { runAdapter } from "./adapter";

// Export types that consumers might need
export type {
  Themes,
  ThemeTokens,
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ExportingResult,
  JsonContentIcons,
} from "./types";

// Export utility functions
export { loadConfig } from "./utils/loadConfig";
export {
  isFontFamilyToken,
  isEffectToken,
  isColorOrFloatToken,
  capitalize,
} from "@recursica/common";
export { Tokens } from "./shared/tokens";
export { processJsonContent } from "./shared/common";

// Export the main CLI function for programmatic use
export { runMain } from "./cli";
