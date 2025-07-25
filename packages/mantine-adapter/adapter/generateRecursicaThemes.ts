import type { ExportingResult, Themes } from "../types";
import { capitalize } from "@recursica/common";

interface GenerateRecursicaThemesParams {
  outputPath: string;
  themes: Themes;
}

/**
 * Generates the RecursicaThemes.ts file that contains the THEMES constant
 * based on the theme dictionary
 */
export function generateRecursicaThemes({
  outputPath,
  themes,
}: GenerateRecursicaThemesParams): ExportingResult {
  const themeDef: Record<string, Record<string, string>> = {};

  // Build themeDef object similar to generateVanillaExtractThemes
  for (const [rawThemeName, currentTheme] of Object.entries(themes)) {
    for (const [key] of Object.entries(currentTheme)) {
      const currentThemeName = capitalize(rawThemeName);
      const themeKey = key.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
      );
      themeDef[currentThemeName] ??= {};
      themeDef[currentThemeName][themeKey] = currentThemeName;
    }
  }

  const content = `/* prettier-ignore */
/* eslint-disable */
/* tslint:disable */
/*
Auto-generated by Recursica.
Do NOT edit these files directly

For more information about Recursica, go to https://recursica.com
*/

// Auto-generated THEMES constant from ThemeType
export const THEMES = {
${Object.entries(themeDef)
  .map(([key]) => `  ${key}: '${key}'`)
  .join(",\n")}
} as const;
`;

  return {
    content,
    path: outputPath + "/RecursicaThemes.ts",
    filename: "RecursicaThemes.ts",
  };
}
