import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";

// Helper to traverse up to root to find package.json
function findPackageJson(startDir: string): string | null {
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

export const get_adapter_setup: Command = {
  name: "get_adapter_setup",
  description:
    "Retrieve step-by-step installation and integration setup guides for a Recursica adapter, or verify if it is already installed.",
  inputSchema: {
    type: "object",
    properties: {
      adapter: {
        type: "string",
        description:
          "Name of the adapter (e.g. 'mantine', 'mui') or the full package dependency string from package.json (e.g. '@recursica/mantine-adapter', '@recursica/mui-adapter'). Case-insensitive.",
      },
      projectPath: {
        type: "string",
        description:
          "Optional absolute path to check package.json for existing installation. Defaults to the current working directory.",
      },
    },
    required: ["adapter"],
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const adapterName = args?.adapter as string;
    const startPath = args?.projectPath || process.cwd();

    // Clean common package prefixes/suffixes (e.g. '@recursica/mantine-adapter' -> 'mantine')
    const cleanName = adapterName
      .toLowerCase()
      .replace(/^@recursica\//g, "")
      .replace(/-adapter$/g, "")
      .trim();

    const matched = allAdapters.find((a) => a.name.toLowerCase() === cleanName);

    if (!matched) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Adapter "${adapterName}" was not found. Active adapters: ${allAdapters
              .map((a) => a.name)
              .join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    // 1. Walk up to verify if the adapter package is already installed
    let isAlreadyInstalled = false;
    let pkgPath = findPackageJson(startPath);
    if (pkgPath) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {}),
        };
        // Match both raw names and fully namespaced package names (e.g. "@recursica/mantine-adapter")
        const expectedPackageName = `@recursica/${cleanName}-adapter`;
        if (allDeps[expectedPackageName] || allDeps[`${cleanName}-adapter`]) {
          isAlreadyInstalled = true;
        }
      } catch (e) {
        // Ignore parse errors and assume not installed
      }
    }

    // 2. If it is already installed, report success and next steps!
    if (isAlreadyInstalled) {
      let output = `# Recursica Adapter Setup Status\n\n`;
      output += `✅ **Status**: **\`@recursica/${cleanName}-adapter\`** is already successfully installed in your project dependencies (\`${pkgPath}\`)! 🎉\n\n`;
      output += `### 🚀 Recommended Next Steps:\n\n`;
      output += `1. **CSS Integration**: Ensure that you have imported the design system variables CSS (\`recursica_variables_scoped.css\`) in your application root file (e.g. \`main.tsx\` or \`App.tsx\`).\n`;
      output += `2. **Integration Spacing Guidelines**: Call the tool **\`get_general_guidelines\`** with \`adapter: "${cleanName}"\` to review standard layout spacing variables and agnostic coding principles.\n`;
      output += `3. **Explore Ready-to-use Primitives**: Call the tool **\`list_components\`** with \`adapter: "${cleanName}"\` to see all premium, adapter-wrapped React components ready to build your layout.\n`;

      return {
        content: [{ type: "text", text: output }],
      };
    }

    // 3. Otherwise, serve the full setup instructions from SETUP.md
    const setupMdPath = path.join(matched.absPath, "SETUP.md");

    if (fs.existsSync(setupMdPath)) {
      try {
        const content = fs.readFileSync(setupMdPath, "utf-8");
        return {
          content: [{ type: "text", text: content }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Found SETUP.md for ${matched.name} but failed to read it: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    // Fallback if SETUP.md does not exist
    let output = `⚠️ **Warning**: The dedicated \`SETUP.md\` specification is missing from the **${matched.name.toUpperCase()}** adapter package! Falling back to README extraction.\n\n`;
    output += `# ${matched.name.toUpperCase()} Adapter Setup Guide\n\n`;
    output += `*Package Folder: \`packages/${matched.dirName}\`*\n\n`;

    const readmePath = path.join(matched.absPath, "README.md");
    const usagePath = path.join(matched.absPath, "USAGE.md");

    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, "utf-8");
      // Extract Peer Dependencies section if available
      const peerMatch = readmeContent.match(
        /## Peer Dependencies[\s\S]*?(?=##|$)/i,
      );
      if (peerMatch) {
        output += peerMatch[0] + "\n";
      }
    }

    if (fs.existsSync(usagePath)) {
      const usageContent = fs.readFileSync(usagePath, "utf-8");
      // Extract Setup and Integration section if available
      const setupMatch = usageContent.match(
        /## 1\. Setup and Integration[\s\S]*?(?=##|$)/i,
      );
      if (setupMatch) {
        output += setupMatch[0] + "\n";
      }
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
