import fs from "fs";
import type { ExportingResult } from "./types";
import { loadConfig } from "./utils/loadConfig";
import { processAdapter } from "./shared/common";

/**
 * Main CLI function that can be called programmatically
 * This is the same logic as main.ts but exported as a function
 */
export async function runMain(): Promise<void> {
  try {
    const {
      rootPath,
      bundledJson,
      srcPath,
      project,
      iconsJson,
      overrides,
      iconsConfig,
    } = loadConfig();

    if (!bundledJson) throw new Error("bundledJson not found");

    // Read file contents
    const bundledJsonContent = fs.readFileSync(bundledJson, "utf-8");
    const iconsJsonContent = iconsJson
      ? fs.readFileSync(iconsJson, "utf-8")
      : undefined;

    // Use shared processing logic
    const files = processAdapter({
      bundledJsonContent,
      project,
      overrides,
      rootPath,
      srcPath,
      iconsJsonContent,
      iconsConfig,
    });

    const {
      recursicaTokens,
      vanillaExtractThemes,
      mantineTheme,
      uiKitObject,
      recursicaObject,
      colorsType,
      iconsObject,
      spacersType,
      borderRadiusType,
      recursicaThemes,
      prettierignore,
    } = files;

    const filesToWrite: ExportingResult[] = [
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

    // check if src/recursica folder exists, if not create it
    const outputPath = srcPath + "/recursica";
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    for (const file of filesToWrite) {
      fs.writeFileSync(file.path, file.content);
    }
    for (const theme of vanillaExtractThemes.vanillaExtractThemes) {
      fs.writeFileSync(theme.path, theme.content);
    }

    if (iconsObject) {
      let iconsOutput = srcPath + "/components/Icons";
      let svgOutput = iconsOutput + "/Svg";
      if (iconsConfig) {
        iconsOutput = srcPath + iconsConfig.output;
        svgOutput = iconsOutput + "/Svg";
      }
      if (!fs.existsSync(iconsOutput)) {
        fs.mkdirSync(iconsOutput);
      }
      if (!fs.existsSync(svgOutput)) {
        fs.mkdirSync(svgOutput);
      } else {
        // remove the whole svgOutput folder and recreate it
        fs.rmSync(svgOutput, { recursive: true, force: true });
        fs.mkdirSync(svgOutput);
      }

      fs.writeFileSync(
        iconsObject.iconExports.path,
        iconsObject.iconExports.content,
      );
      fs.writeFileSync(
        iconsObject.iconResourceMap.path,
        iconsObject.iconResourceMap.content,
      );
      for (const icon of iconsObject.exportedIcons) {
        fs.writeFileSync(icon.path, icon.content);
      }
    }

    console.log("Theme generated successfully");
  } catch (error) {
    console.error("Error generating theme:", error);
    throw error;
  }
}
