import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { guidelines_header } from "./guidelines_header.js";
import {
  detectAdapterAndUiKit,
  getCleanAdapterName,
  getMissingAdapterErrorMessage,
} from "../common/utils.js";

export const recursica_get_usage: Command = {
  name: "recursica_get_usage",
  description,
  inputSchema: {
    type: "object",
    properties: {
      "ui-kit": {
        type: "string",
        description:
          "Optional filter for a specific UI kit/adapter (e.g. 'mantine' or 'mui'). If omitted, we will attempt to auto-detect the active adapter in the project.",
      },
    },
    additionalProperties: false,
  },
  handler: async (args, { root, allAdapters }) => {
    const explicitUiKit = args?.["ui-kit"] as string | undefined;

    const { targetAdapter, isInstalled } = detectAdapterAndUiKit(
      process.cwd(),
      allAdapters,
      explicitUiKit,
    );

    const target = explicitUiKit
      ? getCleanAdapterName(explicitUiKit)
      : targetAdapter;

    // If explicit UI kit is specified, we override the installation check.
    // Otherwise, we require the adapter to be detected and installed in project dependencies.
    const shouldCheckInstallation = !explicitUiKit;
    if (!target || (shouldCheckInstallation && !isInstalled)) {
      return {
        content: [
          { type: "text", text: getMissingAdapterErrorMessage(process.cwd()) },
        ],
      };
    }

    const matched = allAdapters.find(
      (a) => getCleanAdapterName(a.name) === target,
    );

    if (!matched) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Adapter "${target}" was not found. Active adapters: ${allAdapters
              .map((a) => a.name)
              .join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    let output = guidelines_header.replace("{{root}}", root);

    output += `## ${matched.name.toUpperCase()} Adapter Guidelines\n`;
    output += `*Package Folder: \`packages/${matched.dirName}\`*\n\n`;

    const usageMdPath = path.join(matched.absPath, "USAGE.md");
    const overstylingMdPath = path.join(matched.absPath, "OVERSTYLING.md");

    if (fs.existsSync(usageMdPath)) {
      output += `### Developer & Agent Usage Specification (from USAGE.md)\n\n`;
      output += fs.readFileSync(usageMdPath, "utf-8") + "\n\n";
    } else {
      output += `*No detailed USAGE.md found for this adapter.*\n\n`;
    }

    if (fs.existsSync(overstylingMdPath)) {
      output += `### Over Styling Escape Hatch (from OVERSTYLING.md)\n\n`;
      output += fs.readFileSync(overstylingMdPath, "utf-8") + "\n\n";
    }

    output += `---\n\n`;

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
