// Main exports for the recursica-adapter package
export { runAdapter } from "./adapter";

// Export types that consumers might need
export type {
  Token,
  Themes,
  ThemeTokens,
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ExportingResult,
  CollectionToken,
  JsonContent,
  JsonContentIcons,
} from "./types";

// Export utility functions
export { loadConfig } from "./utils/loadConfig";
export {
  isFontFamilyToken,
  isEffectToken,
  isColorOrFloatToken,
} from "./utils/helpers";
export { capitalize } from "./utils/capitalize";
export { ProcessTokens } from "./processTokens";

// Export the main CLI function for programmatic use
export { runMain } from "./cli";
