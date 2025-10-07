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

    // check if src/recursica folder exists, if not create it
    const outputPath = rootPath || "./";
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    // Create necessary directories for icon files
    if (iconsJsonContent) {
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
    }

    // Write all files from the array
    for (const file of files) {
      fs.writeFileSync(file.path, file.content);
    }

    console.log("Theme generated successfully");
  } catch (error) {
    console.error("Error generating theme:", error);
    throw error;
  }
}
