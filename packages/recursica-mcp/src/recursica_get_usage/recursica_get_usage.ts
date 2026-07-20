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

    const llmsTxtPath = path.join(matched.absPath, "llms.txt");
    const usageMdPath = path.join(matched.absPath, "USAGE.md");

    if (fs.existsSync(llmsTxtPath)) {
      output += `### High-Level Summary (from llms.txt)\n\n`;
      output += fs.readFileSync(llmsTxtPath, "utf-8") + "\n\n";
    }

    if (fs.existsSync(usageMdPath)) {
      output += `### Developer & Agent Usage Specification (from USAGE.md)\n\n`;
      let usageContent = fs.readFileSync(usageMdPath, "utf-8");

      // Strip out the Setup and Integration section (leaving only component importing, tokens, overstyled, and CSS changes management)
      usageContent = usageContent.replace(
        /## 1\. Setup and Integration[\s\S]*?(?=## 2\.|$)/i,
        "",
      );

      output += usageContent + "\n\n";
    } else {
      output += `*No detailed USAGE.md found for this adapter.*\n\n`;
    }
    output += `---\n\n`;

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
