import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";

export const get_general_guidelines: Command = {
  name: "get_general_guidelines",
  description:
    "Retrieve high-level architectural, styling, setup, and layout integration guidelines for Recursica.",
  inputSchema: {
    type: "object",
    properties: {
      adapter: {
        type: "string",
        description:
          "Optional filter for a specific adapter (e.g. 'mantine' or 'mui'). If omitted, returns guidelines for all detected adapters.",
      },
    },
    additionalProperties: false,
  },
  handler: async (args, { root, allAdapters }) => {
    const filterAdapter = args?.adapter as string | undefined;
    let selectedAdapters = allAdapters;

    if (filterAdapter) {
      selectedAdapters = allAdapters.filter(
        (a) => a.name.toLowerCase() === filterAdapter.toLowerCase(),
      );
    }

    if (selectedAdapters.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Adapter "${filterAdapter}" was not found. Active adapters: ${allAdapters
              .map((a) => a.name)
              .join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    let output = `# Recursica Design System Integration Guidelines\n\n`;
    output += `Monorepo Root Location: \`${root}\`\n\n`;

    for (const adapter of selectedAdapters) {
      output += `## ${adapter.name.toUpperCase()} Adapter Guidelines\n`;
      output += `*Package Folder: \`packages/${adapter.dirName}\`*\n\n`;

      const llmsTxtPath = path.join(adapter.absPath, "llms.txt");
      const usageMdPath = path.join(adapter.absPath, "USAGE.md");

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
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
