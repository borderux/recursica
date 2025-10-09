import type {
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ExportingResult,
} from "../types";
import {
  generateVanillaExtractThemes,
  VanillaExtractThemesOutput,
} from "./generateVanillaExtractThemes";
import { generateRecursicaTokens } from "./generateRecursicaTokens";
import { generateUiKit } from "./generateUiKit";
import {
  generateMantineTheme,
  GenerateMantineThemeOutput,
} from "./generateMantineTheme";
import { createRecursicaObject } from "./generateRecursicaObject";
import { generateColorsType } from "./generateColorTypes";
import { generateIcons, GenerateIconsOutput } from "./generateIcons";
import { generateSpacersType } from "./generateSpacersType";
import { generateBorderRadiusType } from "./generateBorderRadiusType";
import { generateRecursicaThemes } from "./generateRecursicaThemes";
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
 * Generates Mantine theme files including:
 * - Generic theme file with base theme and createColorToken function
 * - Individual theme files for each theme variant
 * - CSS variables file
 * - Type declarations for theme colors
 * - Index file exporting all themes
 *
 * @param srcPath - Path to the source directory for type declarations
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
  const outputPath = srcPath + "/recursica";

  const recursicaTokens = generateRecursicaTokens(tokens.tokens, {
    outputPath,
    project,
  });

  const vanillaExtractThemes = generateVanillaExtractThemes(
    tokens.tokens,
    tokens.themes,
    recursicaTokens.filename,
    {
      outputPath,
      project,
    },
  );

  const mantineTheme = generateMantineTheme({
    mantineThemeOverride: overrides?.mantineTheme,
    tokens,
    contractTokens: {
      tokens: vanillaExtractThemes.contractTokens,
      filename: vanillaExtractThemes.themeContract.filename,
    },
    exportingProps: {
      outputPath,
      project,
      rootPath,
    },
  });

  const uiKitObject = generateUiKit(
    tokens.uiKit,
    {
      recursicaTokensFilename: recursicaTokens.filename,
      themeContractFilename: vanillaExtractThemes.themeContract.filename,
    },
    { outputPath, project },
  );

  const recursicaObject = createRecursicaObject(project, outputPath);

  const colorsType = generateColorsType(tokens.colors, outputPath);
  const spacersType = generateSpacersType(tokens.spacers, outputPath);
  const borderRadiusType = generateBorderRadiusType(
    tokens.borderRadius,
    outputPath,
  );

  const recursicaThemes = generateRecursicaThemes({
    outputPath,
    themes: tokens.themes,
  });

  const prettierignore = generatePrettierignore();

  const files: ExportingResult[] = [
    recursicaTokens,
    vanillaExtractThemes.availableThemes,
    vanillaExtractThemes.themeContract,
    vanillaExtractThemes.themesFileContent,
    vanillaExtractThemes.typeDefinitions,
    mantineTheme.mantineTheme,
    mantineTheme.postCss,
    uiKitObject,
    recursicaObject,
    colorsType,
    spacersType,
    borderRadiusType,
    recursicaThemes,
    prettierignore,
  ];

  // Add vanilla extract theme files
  files.push(...vanillaExtractThemes.vanillaExtractThemes);

  // Add icon files if icons are provided
  if (icons) {
    const iconsObject = generateIcons(icons, srcPath, iconsConfig);
    files.push(iconsObject.iconExports);
    files.push(iconsObject.iconResourceMap);
    files.push(...iconsObject.exportedIcons);
  }

  return files;
}
