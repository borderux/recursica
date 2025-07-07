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
import { Tokens } from "../shared/Tokens";
import type { RecursicaConfiguration } from "@recursica/schemas";
import { generatePrettierignore } from "./generatePrettierignore";

interface GenerateThemeFileParams {
  overrides: RecursicaConfigOverrides | undefined;
  rootPath: string;
  srcPath: string;
  project: RecursicaConfiguration["project"];
  icons: Record<string, string>;
  iconsConfig: RecursicaConfigIcons | undefined;
  processTokens: Tokens;
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
export interface RunAdapterOutput {
  vanillaExtractThemes: VanillaExtractThemesOutput;
  mantineTheme: GenerateMantineThemeOutput;
  iconsObject: GenerateIconsOutput | undefined;
  recursicaTokens: ExportingResult;
  uiKitObject: ExportingResult;
  recursicaObject: ExportingResult;
  colorsType: ExportingResult;
  spacersType: ExportingResult;
  borderRadiusType: ExportingResult;
  recursicaThemes: ExportingResult;
  prettierignore: ExportingResult;
}
export function runAdapter({
  rootPath,
  overrides,
  srcPath,
  project,
  icons,
  iconsConfig,
  processTokens,
}: GenerateThemeFileParams): ExportingResult[] {
  const outputPath = srcPath + "/recursica";

  const recursicaTokens = generateRecursicaTokens(processTokens.tokens, {
    outputPath,
    project,
  });

  const vanillaExtractThemes = generateVanillaExtractThemes(
    processTokens.tokens,
    processTokens.themes,
    recursicaTokens.filename,
    {
      outputPath,
      project,
    },
  );

  const mantineTheme = generateMantineTheme({
    mantineThemeOverride: overrides?.mantineTheme,
    tokens: processTokens.tokens,
    breakpoints: processTokens.breakpoints,
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
    processTokens.uiKit,
    {
      recursicaTokensFilename: recursicaTokens.filename,
      themeContractFilename: vanillaExtractThemes.themeContract.filename,
    },
    { outputPath, project },
  );

  const recursicaObject = createRecursicaObject(project, outputPath);

  const colorsType = generateColorsType(processTokens.colors, outputPath);
  const spacersType = generateSpacersType(processTokens.spacers, outputPath);
  const borderRadiusType = generateBorderRadiusType(
    processTokens.borderRadius,
    outputPath,
  );

  let iconsObject: GenerateIconsOutput | undefined;
  if (icons) {
    iconsObject = generateIcons(icons, srcPath, iconsConfig);
  }

  const recursicaThemes = generateRecursicaThemes({
    outputPath,
    themes: processTokens.themes,
  });

  const prettierignore = generatePrettierignore();

  const exportingResults: ExportingResult[] = [
    recursicaTokens,
    vanillaExtractThemes.themeContract,
    vanillaExtractThemes.themesFileContent,
    vanillaExtractThemes.typeDefinitions,
    ...vanillaExtractThemes.vanillaExtractThemes,
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

  if (iconsObject) {
    exportingResults.push(iconsObject.iconExports);
    exportingResults.push(iconsObject.iconResourceMap);
    exportingResults.push(...iconsObject.exportedIcons);
  }

  return exportingResults;
}
