import type {
  JsonContentIcons,
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
} from "../types";
import type { JsonContent } from "@repo/shared-interfaces";
import { ProcessTokens } from "./processTokens";
import { runAdapter } from "../adapter";

export interface ProcessJsonParams {
  project: string;
  overrides: RecursicaConfigOverrides | undefined;
}

export interface RunAdapterParams {
  bundledJsonContent: string;
  project: string;
  overrides: RecursicaConfigOverrides | undefined;
  srcPath: string;
  iconsJsonContent?: string;
  iconsConfig?: RecursicaConfigIcons;
}

/**
 * Processes JSON content and creates ProcessTokens instance
 * This is shared logic between CLI and WebWorker
 */
export function processJsonContent(
  jsonFileContent: string,
  { project, overrides }: ProcessJsonParams,
): ProcessTokens {
  const jsonContent: JsonContent = JSON.parse(jsonFileContent) as JsonContent;

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
 * Processes icons JSON content and returns icons object
 * This is shared logic between CLI and WebWorker
 */
export function processIcons(iconsJsonContent: string): Record<string, string> {
  const icons: Record<string, string> = {};
  const iconsJsonParsed: JsonContentIcons = JSON.parse(
    iconsJsonContent,
  ) as JsonContentIcons;

  for (const [iconName, iconPath] of Object.entries(iconsJsonParsed)) {
    icons[iconName] = iconPath;
  }

  return icons;
}

/**
 * Core adapter processing logic shared between CLI and WebWorker
 * This function handles the main processing workflow
 */
export function processAdapter({
  bundledJsonContent,
  project,
  overrides,
  srcPath,
  iconsJsonContent,
  iconsConfig,
}: RunAdapterParams) {
  let icons: Record<string, string> = {};

  // Process icons if provided
  if (iconsJsonContent) {
    icons = processIcons(iconsJsonContent);
  }

  if (!bundledJsonContent) {
    throw new Error("bundledJson content not found");
  }

  // Process the main JSON content
  const processTokens = processJsonContent(bundledJsonContent, {
    project,
    overrides,
  });

  // Run the adapter
  const files = runAdapter({
    overrides,
    srcPath,
    icons,
    processTokens,
    project,
    iconsConfig,
  });

  return files;
}
