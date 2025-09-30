import type {
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ExportingResult,
} from "../types";

import { generateTokensCss } from "./generateTokensCss";
import { generateThemeCss } from "./generateThemeCss";
import { generateUiKitCss } from "./generateUiKitCss";
import { generateRecursicaObject } from "./generateRecursicaObject";
import { generateRecursicaTypes } from "./generateRecursicaTypes";
import { generateIcons, GenerateIconsOutput } from "./generateIcons";
import { Tokens } from "../shared/tokens";
import type { RecursicaConfiguration } from "@recursica/schemas";
import { generatePrettierignore } from "./generatePrettierignore";

interface GenerateThemeFileParams {
  overrides: RecursicaConfigOverrides | undefined;
  rootPath: string;
  srcPath: string;
  project: RecursicaConfiguration["project"];
  icons: Record<string, string>;
  iconsConfig: RecursicaConfigIcons | undefined;
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
  overrides,
  srcPath,
  project,
  icons,
  iconsConfig,
  tokens,
}: GenerateThemeFileParams): RunAdapterOutput {
  const outputPath = rootPath;

  const tokensCss = generateTokensCss(tokens.tokens, {
    outputPath,
    project,
  });

  const themeCssFiles = generateThemeCss(tokens.themes, {
    outputPath,
    project,
  });

  const uiKitCss = generateUiKitCss(tokens.uiKit, tokens.themes, {
    outputPath,
    project,
  });

  const recursicaObject = generateRecursicaObject(
    tokens.tokens,
    tokens.uiKit,
    tokens.themes,
    {
      outputPath,
      project,
    },
  );

  const recursicaTypes = generateRecursicaTypes(
    tokens.tokens,
    tokens.uiKit,
    tokens.themes,
    {
      outputPath,
      project,
    },
  );

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

  // Add icon files if icons are provided
  if (icons && Object.keys(icons).length > 0) {
    const iconsObject = generateIcons(icons, srcPath, iconsConfig);
    files.push(iconsObject.iconExports);
    files.push(iconsObject.iconResourceMap);
    files.push(...iconsObject.exportedIcons);
  }

  return files;
}
