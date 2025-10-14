import { recursica, RecursicaColors } from "@recursica/official-release";

export function getRecursicaColor(color: RecursicaColors) {
  if (!color) return undefined;

  // Check if color is a key in RecursicaTokens
  if (color in recursica.tokens) {
    return recursica.tokens[color as keyof typeof recursica.tokens];
  }

  // Check if color is a key in RecursicaUiKit
  if (color in recursica.uiKit) {
    return recursica.uiKit[color as keyof typeof recursica.uiKit];
  }

  // Check if color is a key in any theme
  for (const themeGroup of Object.values(recursica.themes)) {
    for (const theme of Object.values(themeGroup)) {
      if (color in theme) {
        return theme[color as keyof typeof theme];
      }
    }
  }

  return "currentColor";
}
