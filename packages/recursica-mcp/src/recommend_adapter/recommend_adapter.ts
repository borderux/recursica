import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";

// Helper to extract major version number
function getMajorVersion(semverStr: string): number | null {
  const clean = semverStr.replace(/^[~^>=<]+/g, "").trim();
  const match = clean.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Custom recommendation logic for a single UI Kit and optional version
function getRecommendationForKit(
  uiKit: string,
  versionStr?: string,
): {
  name: string;
  version: string;
  recommendedAdapter?: string;
  notes?: string;
  isSupported: boolean;
} {
  const nameLower = uiKit.toLowerCase();

  if (nameLower.includes("mantine")) {
    const ver = versionStr || "latest";
    const major = versionStr ? getMajorVersion(versionStr) : null;
    let notes = "";

    if (major !== null && major < 8) {
      notes = `⚠️ Note: You are running Mantine v${major}. Our Mantine adapter requires Mantine 8.0.0 or higher. We highly recommend upgrading to Mantine 8.`;
    } else {
      notes = `✅ Fully compatible with @recursica/mantine-adapter!`;
    }

    return {
      name: "Mantine",
      version: ver,
      recommendedAdapter: "mantine",
      notes,
      isSupported: true,
    };
  }

  if (
    nameLower.includes("mui") ||
    nameLower.includes("material") ||
    nameLower.includes("google")
  ) {
    const ver = versionStr || "latest";
    return {
      name: "Material UI (MUI)",
      version: ver,
      recommendedAdapter: "mui",
      notes: `✅ Fully compatible with @recursica/mui-adapter!`,
      isSupported: true,
    };
  }

  // Unsupported kits
  let kitName = uiKit;
  if (nameLower.includes("ant")) kitName = "Ant Design";
  else if (nameLower.includes("chakra")) kitName = "Chakra UI";
  else if (nameLower.includes("radix")) kitName = "Radix UI";
  else if (nameLower.includes("tailwind")) kitName = "Shadcn UI (Tailwind)";
  else if (nameLower.includes("bootstrap")) kitName = "Bootstrap";

  return {
    name: kitName,
    version: versionStr || "unknown",
    isSupported: false,
  };
}

export const recommend_adapter: Command = {
  name: "recommend_adapter",
  description:
    "Detect installed UI kits in the project or recommend based on a specified UI kit and version name.",
  inputSchema: {
    type: "object",
    properties: {
      uiKit: {
        type: "string",
        description:
          "Optional name of the UI kit (e.g. 'Mantine', 'MUI', 'Antd') to get a direct recommendation without analyzing files.",
      },
      version: {
        type: "string",
        description:
          "Optional version of the UI kit (e.g. '8.0.0', 'v7', '5.15') if specifying uiKit.",
      },
      projectPath: {
        type: "string",
        description:
          "Optional absolute path to start searching for package.json. Defaults to the current working directory.",
      },
    },
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const startPath = args?.projectPath || process.cwd();
    const explicitKit = args?.uiKit as string | undefined;
    const explicitVer = args?.version as string | undefined;

    let output = `# Recursica Adapter Recommendation\n\n`;

    // 1. If explicit UI kit is provided, make recommendation directly!
    if (explicitKit) {
      output += `Received Direct Query:\n`;
      output += `- Specified UI Kit: **\`${explicitKit}\`**\n`;
      output += `- Specified Version: **\`${explicitVer || "latest"}\`**\n\n`;

      const rec = getRecommendationForKit(explicitKit, explicitVer);
      if (rec.isSupported) {
        output += `## 🚀 Recommended Adapter Found\n\n`;
        output += `### 📦 ${rec.name}\n`;
        output += `- **Recommendation**: Install and integrate **\`@recursica/${rec.recommendedAdapter}-adapter\`**\n`;
        output += `- **Status**: ${rec.notes}\n`;
        output += `- **Setup Guide**: Run tool \`get_adapter_setup\` with \`adapter: "${rec.recommendedAdapter}"\` to view detailed installation and integration steps.\n`;
      } else {
        output += `## ⚠️ Unsupported UI Kit Specified\n\n`;
        output += `Currently, Recursica does not support an official adapter for **${rec.name}**.\n\n`;
        output += `Please submit a new adapter request on our GitHub repository: **https://github.com/borderux/recursica/issues**\n`;
      }

      return {
        content: [{ type: "text", text: output }],
      };
    }

    // 2. Otherwise, walk up the folders to find and scan package.json files
    let currentDir = path.resolve(startPath);
    let analyzedPkgs: string[] = [];
    const detectedKits: Array<{
      name: string;
      version: string;
      recommendedAdapter?: string;
      notes?: string;
    }> = [];
    const missingKits: string[] = [];

    while (currentDir) {
      const pkgPath = path.join(currentDir, "package.json");
      if (fs.existsSync(pkgPath)) {
        analyzedPkgs.push(pkgPath);

        let pkg: any;
        try {
          pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        } catch (e) {
          // Ignore JSON parse errors and keep climbing
        }

        if (pkg) {
          const allDeps = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {}),
          };

          // Scan dependencies
          if (allDeps["@mantine/core"]) {
            const ver = allDeps["@mantine/core"];
            detectedKits.push(getRecommendationForKit("mantine", ver));
          }

          if (
            allDeps["@mui/material"] ||
            allDeps["@mui/core"] ||
            allDeps["@material-ui/core"]
          ) {
            const ver =
              allDeps["@mui/material"] ||
              allDeps["@mui/core"] ||
              allDeps["@material-ui/core"];
            detectedKits.push(getRecommendationForKit("mui", ver));
          }

          // Scan other UI kits
          const otherUIKits = [
            { name: "Ant Design", pkg: "antd" },
            { name: "Chakra UI", pkg: "@chakra-ui/react" },
            { name: "Radix UI", pkg: "@radix-ui/react-primitive" },
            { name: "Shadcn UI (Tailwind)", pkg: "tailwindcss" },
            { name: "Bootstrap", pkg: "bootstrap" },
          ];

          for (const kit of otherUIKits) {
            if (allDeps[kit.pkg]) {
              missingKits.push(kit.name);
            }
          }

          // IF WE FOUND A KIT, WE TERMINATE CLIMBING!
          if (detectedKits.length > 0 || missingKits.length > 0) {
            break;
          }
        }
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached root directory
      }
      currentDir = parentDir;
    }

    if (analyzedPkgs.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Could not find any package.json walking up to filesystem root from: ${startPath}. Please ensure your project is initialized correctly or specify a valid projectPath or explicit uiKit.`,
          },
        ],
        isError: true,
      };
    }

    output += `Analyzed Files (closest to root): \n`;
    for (const pkg of analyzedPkgs) {
      output += `- \`${pkg}\`\n`;
    }
    output += `\n`;

    // Generate output markdown
    if (detectedKits.length > 0) {
      output += `## 🚀 Recommended Adapters Found\n\n`;
      for (const kit of detectedKits) {
        output += `### 📦 ${kit.name} (Detected version: \`${kit.version}\`)\n`;
        output += `- **Recommendation**: Install and integrate **\`@recursica/${kit.recommendedAdapter}-adapter\`**\n`;
        output += `- **Status**: ${kit.notes}\n`;
        output += `- **Setup Guide**: Run tool \`get_adapter_setup\` with \`adapter: "${kit.recommendedAdapter}"\` to view detailed installation and integration steps.\n\n`;
      }
    }

    if (missingKits.length > 0) {
      output += `## ⚠️ Unsupported UI Kits Detected\n`;
      output += `We noticed you are using: ${missingKits.join(", ")}.\n\n`;
      output += `Currently, Recursica does not support an official adapter for these UI kits. However, we are actively expanding our support!\n`;
      output += `Please submit a new adapter request on our GitHub repository: **https://github.com/borderux/recursica/issues**\n\n`;
    }

    if (detectedKits.length === 0 && missingKits.length === 0) {
      output += `## 🔍 No Standard UI Kits Detected\n`;
      output += `We walked up to the filesystem root but did not detect any known UI libraries (like Mantine or MUI) in any package.json dependencies.\n\n`;
      output += `To integrate Recursica, we recommend selecting one of our officially supported design-system-adapted libraries:\n\n`;
      output += `1. **Mantine 8** (via \`@recursica/mantine-adapter\`)\n`;
      output += `2. **MUI 7** (via \`@recursica/mui-adapter\`)\n\n`;
      output += `Once you choose a kit, you can run \`get_adapter_setup\` with \`adapter: "mantine"\` or \`adapter: "mui"\` for the setup guide.\n`;
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
