import fs from "fs";
import path from "path";

/**
 * Checks if a given directory contains files with either theme-tokens or ui-kit suffix
 * @param directoryPath - The path to check for files
 * @returns FileCheckResult - Object containing boolean result and array of matching files with full paths
 */
export function hasThemeOrKitFiles(directoryPath: string): string | undefined {
  try {
    const files = fs.readdirSync(directoryPath);

    const matchingFiles = files.find((file) => {
      const fileName = file.toLowerCase();
      return fileName === "recursica-bundle.json";
    });

    return matchingFiles;
  } catch (error) {
    console.error(`Error checking directory ${directoryPath}:`, error);
    return undefined;
  }
}

export function hasIconsJsonFiles(directoryPath: string): string | undefined {
  try {
    const files = fs.readdirSync(directoryPath);

    const matchingFiles = files
      .filter((file) => {
        const fileName = file.toLowerCase();
        return fileName === "recursica-icons.json";
      })
      .map((file) => path.join(directoryPath, file));

    return matchingFiles.length > 0 ? matchingFiles[0] : undefined;
  } catch (error) {
    console.error(`Error checking directory ${directoryPath}:`, error);
    return undefined;
  }
}
