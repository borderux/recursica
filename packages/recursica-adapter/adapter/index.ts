import type {
  Themes,
  ThemeTokens,
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

interface GenerateThemeFileParams {
  overrides: RecursicaConfigOverrides | undefined;
  srcPath: string;
  tokens: ThemeTokens;
  themes: Themes;
  project: string;
  uiKit: ThemeTokens;
  colors: string[];
  icons: Record<string, string>;
  breakpoints: Record<string, string>;
  iconsConfig: RecursicaConfigIcons | undefined;
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
interface RunAdapterOutput {
  recursicaTokens: ExportingResult;
  vanillaExtractThemes: VanillaExtractThemesOutput;
  mantineTheme: GenerateMantineThemeOutput;
  uiKitObject: ExportingResult;
  recursicaObject: ExportingResult;
  colorsType: ExportingResult;
  iconsObject: GenerateIconsOutput | undefined;
}
export function runAdapter({
  overrides,
  srcPath,
  tokens,
  themes,
  project,
  uiKit,
  colors,
  icons,
  breakpoints,
  iconsConfig,
}: GenerateThemeFileParams): RunAdapterOutput {
  const outputPath = srcPath + "/recursica";

  const recursicaTokens = generateRecursicaTokens(tokens, {
    outputPath,
    project,
  });

  const vanillaExtractThemes = generateVanillaExtractThemes(
    tokens,
    themes,
    recursicaTokens.filename,
    {
      outputPath,
      project,
    },
  );

  const mantineTheme = generateMantineTheme({
    mantineThemeOverride: overrides?.mantineTheme,
    tokens,
    breakpoints,
    contractTokens: {
      tokens: vanillaExtractThemes.contractTokens,
      filename: vanillaExtractThemes.themeContract.filename,
    },
    exportingProps: {
      outputPath,
      project,
    },
  });

  const uiKitObject = generateUiKit(
    uiKit,
    {
      recursicaTokensFilename: recursicaTokens.filename,
      themeContractFilename: vanillaExtractThemes.themeContract.filename,
    },
    { outputPath, project },
  );

  const recursicaObject = createRecursicaObject(project, outputPath);

  const colorsType = generateColorsType(colors, outputPath);

  let iconsObject: GenerateIconsOutput | undefined;
  if (icons) {
    iconsObject = generateIcons(icons, srcPath, iconsConfig);
  }

  const fileContents = {
    recursicaTokens,
    vanillaExtractThemes,
    mantineTheme,
    uiKitObject,
    recursicaObject,
    colorsType,
    iconsObject,
  };
  return fileContents;
}
