import path from "path";
import fs from "fs";
import { hasThemeOrKitFiles, hasIconsJsonFiles } from "./fileCheck";
import type { RecursicaConfigIcons, RecursicaConfigOverrides } from "../types";
import { RecursicaConfiguration } from "@recursica/schemas";

interface RecursicaConfig {
  rootPath: string;
  iconsJson: string | undefined;
  bundledJson: string | undefined;
  srcPath: string;
  project: RecursicaConfiguration["project"];
  iconsConfig: RecursicaConfigIcons | undefined;
  overrides: RecursicaConfigOverrides | undefined;
}

interface RecursicaConfigContent {
  jsonsPath: string;
  project: RecursicaConfiguration["project"];
  overrides: RecursicaConfigOverrides;
  icons: RecursicaConfigIcons | undefined;
}

/**
 * Loads and validates the configuration from recursicaConfig.json
 *
 * @throws {Error} If the config file is not found or required fields are missing
 * @returns {Object} Configuration object with the following properties:
 *   - jsons: Path to the themes-tokens and ui-kit directories
 *   - srcPath: Path to the source directory
 *   - project: Project name
 */
export function loadConfig(): RecursicaConfig {
  let rootPath = getRootPath();
  const configPath = path.join(rootPath, "recursica.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("Config file not found at: " + configPath);
  }

  const config = JSON.parse(
    fs.readFileSync(configPath, "utf-8"),
  ) as RecursicaConfigContent;

  if (typeof config.project === "object" && config.project?.root) {
    rootPath = path.join(rootPath, config.project.root);
  }

  const bundledJson = hasThemeOrKitFiles(rootPath);
  const iconsJson = hasIconsJsonFiles(rootPath);

  const project = config.project;
  if (!project) {
    throw new Error("project is required in config file");
  }

  return {
    rootPath,
    srcPath: path.join(rootPath, "src"),
    project,
    bundledJson,
    iconsJson,
    overrides: config.overrides,
    iconsConfig: config.icons,
  };
}

export function getRootPath() {
  // recursively search for the package.json file starting from the current working directory
  let currentDir = process.cwd();
  let level = 0;
  while (!fs.existsSync(path.join(currentDir, "recursica.json"))) {
    currentDir = path.join(currentDir, "..");
    level++;
    if (level > 10) {
      throw new Error("Could not find recursica.json");
    }
  }
  return currentDir;
}
