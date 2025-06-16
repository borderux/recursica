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

// Export types from shared-interfaces
export type { Token, CollectionToken, JsonContent } from "@recursica/common";

// Export utility functions
export { loadConfig } from "./utils/loadConfig";
export {
  isFontFamilyToken,
  isEffectToken,
  isColorOrFloatToken,
} from "./utils/helpers";
export { capitalize } from "./utils/capitalize";
export { ProcessTokens } from "./shared/processTokens";
export { processJsonContent } from "./shared/common";

// Export the main CLI function for programmatic use
export { runMain } from "./cli";
