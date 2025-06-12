import type {
  JsonContent,
  JsonContentIcons,
  RecursicaConfigOverrides,
} from "./types";
import { runAdapter } from "./adapter";
import { ProcessTokens } from "./processTokens";

const icons: Record<string, string> = {};

interface ProcessJsonParams {
  project: string;
  overrides: RecursicaConfigOverrides | undefined;
}
function readJson(
  jsonFileContent: string,
  { project, overrides }: ProcessJsonParams,
) {
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
// 1. Listen for a message from the main application thread
// You can use self.addEventListener or the shorter self.onmessage
self.onmessage = (event) => {
  // Run the script
  const params = event.data;

  try {
    const { bundledJson, srcPath, project, iconsJson, overrides, iconsConfig } =
      params;

    if (iconsJson) {
      const iconsJsonContent: JsonContentIcons = JSON.parse(
        params.iconsJson,
      ) as JsonContentIcons;
      for (const [iconName, iconPath] of Object.entries(iconsJsonContent)) {
        icons[iconName] = iconPath;
      }
    }

    if (!bundledJson) throw new Error("bundledJson not found");
    const processTokens = readJson(params.bundledJson, {
      project,
      overrides,
    });

    const files = runAdapter({
      overrides,
      srcPath,
      icons,
      processTokens,
      project,
      iconsConfig,
    });
    // 3. Send the response back to the main thread
    console.log("...Worker sending response back:", files);
    self.postMessage(files);
  } catch (error) {
    console.error("Error generating theme:", error);
  }
};
