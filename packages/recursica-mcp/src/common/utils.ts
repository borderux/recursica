import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { AdapterInfo } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically resolves the absolute path to the Recursica repository root.
 */
export function getRecursicaRoot(): string {
  if (process.env.RECURSICA_PATH) {
    return path.resolve(process.env.RECURSICA_PATH);
  }

  // Walk up from current script folder to find monorepo root package.json
  let currentDir = __dirname;
  while (currentDir && currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        if (pkg.name === "@recursica/recursica") {
          return currentDir;
        }
      } catch (e) {
        // Ignore JSON parse errors and continue walking up
      }
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback to active workspace path for development
  return "/Users/mattmassey/work/recursica";
}

/**
 * Scans the packages directory to find all active UI adapters.
 */
export function getActiveAdapters(root: string): AdapterInfo[] {
  const packagesDir = path.join(root, "packages");
  if (!fs.existsSync(packagesDir)) {
    return [];
  }

  const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
  const adapters: AdapterInfo[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith("-adapter")) {
      const name = entry.name.substring(
        0,
        entry.name.length - "-adapter".length,
      );
      adapters.push({
        name,
        dirName: entry.name,
        absPath: path.join(packagesDir, entry.name),
      });
    }
  }

  return adapters;
}

/**
 * Extracts the first relevant paragraph from a Markdown file to use as a description.
 */
export function extractFirstParagraph(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Ignore markdown headers, rules, empty lines, and agent directives
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("---") &&
      !trimmed.startsWith("<") &&
      !trimmed.startsWith(">")
    ) {
      return trimmed;
    }
  }
  return "";
}
