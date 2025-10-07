import type { ExportingResult } from "../types";

import { generateTokensCss } from "./generateTokensCss";
import { generateThemeCss } from "./generateThemeCss";
import { generateUiKitCss } from "./generateUiKitCss";
import { generateRecursicaObject } from "./generateRecursicaObject";
import { generateRecursicaTypes } from "./generateRecursicaTypes";
import { Tokens } from "../shared/tokens";
import { generatePrettierignore } from "./generatePrettierignore";

interface GenerateThemeFileParams {
  rootPath: string;
  tokens: Tokens;
}

/**
 * Generates CSS-based design system files including:
 * - recursica-tokens.css: Base token variables
 * - Individual theme CSS files (e.g., light.css, dark.css)
 * - recursica.css: UI Kit variables that reference tokens and themes
 *
 * @param srcPath - Path to the source directory for CSS files
 * @param tokens - Base theme tokens
 * @param themes - Theme variants
 * @param project - Project name
 */
export type RunAdapterOutput = ExportingResult[];

export function runAdapter({
  rootPath,
  tokens,
}: GenerateThemeFileParams): RunAdapterOutput {
  const outputPath = rootPath;

  const tokensCss = generateTokensCss(tokens, outputPath);

  const themeCssFiles = generateThemeCss(tokens, outputPath);

  const uiKitCss = generateUiKitCss(tokens, outputPath);

  const recursicaObject = generateRecursicaObject(tokens, outputPath);

  const recursicaTypes = generateRecursicaTypes(tokens, outputPath);

  const prettierignore = generatePrettierignore();

  const files: ExportingResult[] = [
    tokensCss,
    uiKitCss,
    recursicaObject,
    recursicaTypes,
    prettierignore,
  ];

  // Add theme CSS files
  files.push(...themeCssFiles);

  return files;
}
