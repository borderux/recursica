import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
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
 * Scans the packages directory to find all active UI adapters, or falls back to resolving
 * them dynamically via node_modules if running outside the monorepo context.
 *
 * NOTE: This package is likely to be retired soon; the `knownAdapters` list below is
 * hardcoded and will need revisiting if a new adapter is added before that happens.
 */
export function getActiveAdapters(root: string): AdapterInfo[] {
  const adapters: AdapterInfo[] = [];

  // 1. Monorepo scanning (only in explicit development environment, production is the default)
  const isDev =
    process.env.NODE_ENV === "development" ||
    (fs.existsSync(path.join(root, "packages")) &&
      (() => {
        try {
          const pkgJsonPath = path.join(root, "package.json");
          if (fs.existsSync(pkgJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
            return pkg.name === "@recursica/recursica";
          }
        } catch {
          // Ignore
        }
        return false;
      })());

  if (isDev) {
    const packagesDir = path.join(root, "packages");
    if (fs.existsSync(packagesDir)) {
      const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
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
    }
  }

  // 2. Dynamic package resolution (installed context / production)
  if (adapters.length === 0) {
    const require = createRequire(import.meta.url);
    const knownAdapters = ["adapter-mui-v7", "adapter-mantine-v8"];

    for (const adapterDir of knownAdapters) {
      try {
        const pkgJsonPath = require.resolve(
          `@recursica/${adapterDir}/package.json`,
          {
            paths: [process.cwd(), root],
          },
        );
        const pkgDir = path.dirname(pkgJsonPath);
        // Derive the bare UI-kit name (e.g. "mantine") by stripping the
        // "adapter-" prefix and trailing "-vN" major-version suffix.
        const name = adapterDir.replace(/^adapter-/, "").replace(/-v\d+$/, "");
        adapters.push({
          name,
          dirName: adapterDir,
          absPath: pkgDir,
        });
      } catch (e) {
        // Module not installed/resolved, skip
      }
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

/**
 * Helper to traverse up to root to find package.json
 */
export function findPackageJson(startDir: string): string | null {
  let currentDir = path.resolve(startDir);
  while (currentDir) {
    const pkgPath = path.join(currentDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      return pkgPath;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break; // Reached root directory
    }
    currentDir = parentDir;
  }
  return null;
}

export interface DetectionResult {
  dependencies: Record<string, string>;
  targetAdapter: string | null;
  isInstalled: boolean;
}

/**
 * Shared logic to clean adapter name formats
 */
export function getCleanAdapterName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^@recursica\//g, "")
    .replace(/^adapter-/g, "") // new naming, e.g. "adapter-mantine-v8"
    .replace(/-adapter$/g, "") // old naming, e.g. "mantine-adapter"
    .replace(/-v\d+$/g, "") // trailing major-version suffix, e.g. "-v8"
    .trim();
}

/**
 * Shared utility to detect UI Kit and Adapter based on package.json
 */
export function detectAdapterAndUiKit(
  startPath: string,
  allAdapters: AdapterInfo[],
  explicitUiKit?: string,
): DetectionResult {
  let pkgPath = findPackageJson(startPath);
  let dependencies: Record<string, string> = {};
  if (pkgPath) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      dependencies = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };
    } catch (e) {
      // Ignore parse errors
    }
  }

  const isAdapterInstalled = (cleanName: string) => {
    // Package names no longer follow a uniform "<kit>-adapter" pattern (e.g.
    // "@recursica/adapter-mantine-v8"), so look up the real dirName from the
    // known adapters list instead of reconstructing it from cleanName.
    const dirName = allAdapters.find(
      (a) => getCleanAdapterName(a.name) === cleanName,
    )?.dirName;
    const expectedPackageName = dirName
      ? `@recursica/${dirName}`
      : `@recursica/${cleanName}-adapter`;
    return !!(
      dependencies[expectedPackageName] ||
      (dirName && dependencies[dirName])
    );
  };

  const isUiKitInstalled = (cleanName: string) => {
    if (cleanName === "mantine") {
      return !!dependencies["@mantine/core"];
    }
    if (cleanName === "mui") {
      return !!(
        dependencies["@mui/material"] ||
        dependencies["@mui/core"] ||
        dependencies["@material-ui/core"]
      );
    }
    return false;
  };

  let targetAdapter: string | null = null;

  if (explicitUiKit) {
    targetAdapter = getCleanAdapterName(explicitUiKit);
  } else {
    // Auto-detection mode:
    // A. Check if any supported Recursica adapter package is installed first
    for (const adapter of allAdapters) {
      const clean = getCleanAdapterName(adapter.name);
      if (isAdapterInstalled(clean)) {
        targetAdapter = clean;
        break;
      }
    }
    // B. If not, check if any supported underlying UI kit is installed
    if (!targetAdapter) {
      for (const adapter of allAdapters) {
        const clean = getCleanAdapterName(adapter.name);
        if (isUiKitInstalled(clean)) {
          targetAdapter = clean;
          break;
        }
      }
    }
  }

  const isInstalled = targetAdapter ? isAdapterInstalled(targetAdapter) : false;

  return {
    dependencies,
    targetAdapter,
    isInstalled,
  };
}

/**
 * Resolves the absolute path to the `@recursica/knowledge` components directory.
 * Throws an error if the package cannot be resolved.
 */
export function getKnowledgeComponentsDir(): string {
  try {
    const require = createRequire(import.meta.url);
    const pkgJsonPath = require.resolve("@recursica/knowledge/package.json");
    return path.join(path.dirname(pkgJsonPath), "docs", "components");
  } catch (error: any) {
    throw new Error(
      `Failed to resolve @recursica/knowledge package path: ${error?.message || error}`,
    );
  }
}

/**
 * Extracts the bold introductory description from DOCS.md content.
 */
export function extractBriefDescription(content: string): string {
  let cleanContent = content;
  if (content.startsWith("---")) {
    const nextSeparator = content.indexOf("---", 3);
    if (nextSeparator !== -1) {
      cleanContent = content.substring(nextSeparator + 3);
    }
  }

  const lines = cleanContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return trimmed.slice(2, -2).trim();
    }
  }

  // Fallback: first non-empty line that isn't a header or list item
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith("<") &&
      !trimmed.startsWith(">")
    ) {
      return trimmed;
    }
  }

  return "";
}

/**
 * Generates a standardized, generic error message when an active Recursica adapter cannot be found.
 */
export function getMissingAdapterErrorMessage(
  cwd: string,
  specifiedAdapter?: string,
): string {
  const targetDesc = specifiedAdapter
    ? `The specified adapter "${specifiedAdapter}" is not installed or active in your project`
    : `No active Recursica adapter (such as '@recursica/adapter-mui-v7' or '@recursica/adapter-mantine-v8') was detected as installed in your project`;

  return `❌ Error: ${targetDesc}.

*We searched in your current working directory: \`${cwd}\` but could not find a valid \`package.json\` with Recursica dependencies.*

### How to fix:
1. If this is a new project, run the tool **\`recursica_project_setup\`** to configure and install the correct adapter.
2. If the adapter is already installed, ensure your MCP client's configuration sets the working directory (\`cwd\`) to your project root. For example:
\`\`\`json
"recursica-mcp": {
  "command": "npx",
  "args": ["recursica-mcp"],
  "cwd": "/path/to/your/project"
}
\`\`\``;
}
