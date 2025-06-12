import fs from "fs";
import type {
  JsonContent,
  JsonContentIcons,
  RecursicaConfigOverrides,
  ExportingResult,
} from "./types";
import { loadConfig } from "./utils/loadConfig";
import { runAdapter } from "./adapter/index";
import { ProcessTokens } from "./processTokens";

interface ProcessJsonParams {
  jsonPath: string;
  project: string;
  overrides: RecursicaConfigOverrides | undefined;
}
const icons: Record<string, string> = {};

function readJson({ jsonPath, project, overrides }: ProcessJsonParams) {
  const jsonContent: JsonContent = JSON.parse(
    fs.readFileSync(jsonPath, "utf-8"),
  ) as JsonContent;

  const jsonProjectId = jsonContent.projectId;
  if (!jsonProjectId) {
    throw new Error("project-id is required in the json file");
  }
  if (jsonProjectId.toLowerCase() !== project.toLowerCase()) {
    throw new Error("project-id does not match the project in the config file");
  }

  const processTokens = new ProcessTokens(overrides);

  processTokens.processTokens(jsonContent.tokens);
  for (const theme of Object.keys(jsonContent.themes)) {
    processTokens.processTokens(jsonContent.themes[theme], theme);
  }
  processTokens.processTokens(jsonContent.uiKit);

  return processTokens;
}

/**
 * Main CLI function that can be called programmatically
 * This is the same logic as main.ts but exported as a function
 */
export async function runMain(): Promise<void> {
  try {
    const { bundledJson, srcPath, project, iconsJson, overrides, iconsConfig } =
      loadConfig();

    if (iconsJson) {
      const iconsJsonContent: JsonContentIcons = JSON.parse(
        fs.readFileSync(iconsJson, "utf-8"),
      ) as JsonContentIcons;
      for (const [iconName, iconPath] of Object.entries(iconsJsonContent)) {
        icons[iconName] = iconPath;
      }
    }

    if (!bundledJson) throw new Error("bundledJson not found");
    const processTokens = readJson({
      jsonPath: bundledJson,
      project,
      overrides,
    });

    const files = runAdapter({
      overrides,
      srcPath,
      icons,
      project,
      iconsConfig,
      processTokens,
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
