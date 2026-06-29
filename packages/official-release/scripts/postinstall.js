import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Traverses up from the package folder to find the root of the host project
function findHostProjectRoot(startDir) {
  let current = startDir;
  while (true) {
    const parent = path.dirname(current);
    if (parent === current) {
      break; // Reached filesystem root
    }

    // A valid host project root should contain package.json and NOT be part of node_modules
    if (fs.existsSync(path.join(current, "package.json"))) {
      const pathParts = current.split(path.sep);
      if (!pathParts.includes("node_modules")) {
        return current;
      }
    }
    current = parent;
  }
  return null;
}

function run() {
  try {
    const packageDir = path.resolve(__dirname, "..");
    const hostRoot = process.env.INIT_CWD || findHostProjectRoot(packageDir);

    if (!hostRoot) {
      console.warn(
        "[Recursica] Could not identify host project root. Skipping token files copy.",
      );
      return;
    }

    // Safety check: do not copy if the host is the Recursica monorepo itself
    const hostPkgJsonPath = path.join(hostRoot, "package.json");
    if (fs.existsSync(hostPkgJsonPath)) {
      const hostPkgJson = JSON.parse(fs.readFileSync(hostPkgJsonPath, "utf8"));
      if (
        hostPkgJson.name === "@recursica/recursica" ||
        hostPkgJson.name === "@recursica/mcp"
      ) {
        console.log(
          "[Recursica] Running inside Recursica monorepo workspace. Skipping file copy.",
        );
        return;
      }
    }

    const targetFile = path.join(hostRoot, "recursica_variables_scoped.css");

    // Only copy if the theme file does not exist to avoid overwriting developer customizations
    if (!fs.existsSync(targetFile)) {
      const filesToCopy = [
        "recursica_variables_scoped.css",
        "recursica_brand.json",
        "recursica_tokens.json",
        "recursica_ui-kit.json",
        "recursica.json",
      ];

      console.log(
        `[Recursica] Copying default theme files to project root: ${hostRoot}`,
      );

      for (const file of filesToCopy) {
        const sourcePath = path.join(packageDir, file);
        const targetPath = path.join(hostRoot, file);

        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
        } else {
          console.warn(
            `[Recursica] Warning: Source file ${file} not found in package.`,
          );
        }
      }
      console.log("[Recursica] Default theme files copied successfully.");
    } else {
      console.log(
        "[Recursica] theme files already present in project root. Skipping copy.",
      );
    }
  } catch (error) {
    // Fail silently/gracefully with a warning to ensure the package install itself never fails
    console.warn(
      "[Recursica] Failed to automatically copy default theme files:",
      error.message,
    );
  }
}

run();
