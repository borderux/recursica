import type {
  JsonContentIcons,
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
} from "../types";
import type { RecursicaVariablesSchema } from "@recursica/schemas";
import type { RecursicaConfiguration } from "@recursica/schemas";
import { Tokens } from "./tokens";
import { runAdapter, RunAdapterOutput } from "../adapter";

export interface ProcessJsonParams {
  project: RecursicaConfiguration["project"];
  overrides: RecursicaConfigOverrides | undefined;
}

export interface RunAdapterParams {
  bundledJsonContent: string;
  project: RecursicaConfiguration["project"];
  overrides: RecursicaConfigOverrides | undefined;
  rootPath: string;
  srcPath: string;
  iconsJsonContent?: string;
  iconsConfig?: RecursicaConfigIcons;
}

/**
 * Processes JSON content and creates process instance
 * This is shared logic between CLI and WebWorker
 */
export function processJsonContent(
  jsonFileContent: string,
  { project, overrides }: ProcessJsonParams,
): Tokens {
  const jsonContent: RecursicaVariablesSchema = JSON.parse(jsonFileContent);

  const jsonProjectId = jsonContent.projectId;
  if (!jsonProjectId) {
    throw new Error("project-id is required in the json file");
  }
  if (
    jsonProjectId.toLowerCase() !==
    (typeof project === "string"
      ? project.toLowerCase()
      : project.name?.toLowerCase())
  ) {
    throw new Error("project-id does not match the project in the config file");
  }

  const tokens = new Tokens(overrides);
  tokens.process(jsonContent.tokens);
  for (const theme of Object.keys(jsonContent.themes)) {
    tokens.process(jsonContent.themes[theme], theme);
  }
  tokens.process(jsonContent.uiKit);

  return tokens;
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
  rootPath,
  bundledJsonContent,
  project,
  overrides,
  srcPath,
  iconsJsonContent,
  iconsConfig,
}: RunAdapterParams): RunAdapterOutput {
  let icons: Record<string, string> = {};

  // Process icons if provided
  if (iconsJsonContent) {
    icons = processIcons(iconsJsonContent);
  }

  if (!bundledJsonContent) {
    throw new Error("bundledJson content not found");
  }

  // Process the main JSON content
  const tokens = processJsonContent(bundledJsonContent, {
    project,
    overrides,
  });

  // Run the adapter
  const result = runAdapter({
    rootPath,
    overrides,
    srcPath,
    icons,
    tokens,
    project,
    iconsConfig,
  });

  return result;
}
