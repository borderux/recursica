import fs from "fs";
import { loadConfig, RecursicaConfig } from "./utils/loadConfig";
import { processAdapter } from "./shared/common";
import { Tokens } from "./shared/Tokens";

export type RecursicaCLIParams = {
  config?: RecursicaConfig;
  transform?: (tokens: Tokens) => Tokens;
  adapter?: (tokens: Tokens) => Tokens;
};
/**
 * Main CLI function that can be called programmatically
 * This is the same logic as main.ts but exported as a function
 */
export async function recursica({ config }: RecursicaCLIParams): Promise<void> {
  try {
    const {
      rootPath,
      bundledJson,
      srcPath,
      project,
      iconsJson,
      overrides,
      iconsConfig,
    } = config ?? loadConfig();

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

    // check if src/recursica folder exists, if not create it
    const outputPath = srcPath + "/recursica";
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    for (const file of files) {
      fs.writeFileSync(file.path, file.content);
    }

    console.log("Theme generated successfully");
  } catch (error) {
    console.error("Error generating theme:", error);
    throw error;
  }
}
