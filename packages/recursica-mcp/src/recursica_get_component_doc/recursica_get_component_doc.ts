import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import {
  getKnowledgeComponentsDir,
  detectAdapterAndUiKit,
  getCleanAdapterName,
} from "../common/utils.js";
import { getUnsupportedComponentMessage } from "./unsupported_component_message.js";

export const recursica_get_component_doc: Command = {
  name: "recursica_get_component_doc",
  description,
  inputSchema: {
    type: "object",
    properties: {
      componentName: {
        type: "string",
        description:
          "Name of the component (e.g. 'Accordion', 'Button', 'Stack', 'TextField'). Case-insensitive.",
      },
      adapter: {
        type: "string",
        description:
          "Optional filter for a specific adapter (e.g. 'mantine' or 'mui'). If omitted, auto-detects the active adapter in the user's project.",
      },
    },
    required: ["componentName"],
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const compNameInput = args?.componentName as string;
    const filterAdapter = args?.adapter as string | undefined;
    let selectedAdapters = allAdapters;

    if (filterAdapter) {
      selectedAdapters = allAdapters.filter(
        (a) => a.name.toLowerCase() === filterAdapter.toLowerCase(),
      );
      if (selectedAdapters.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error: The specified adapter "${filterAdapter}" is not installed or active in your project.\n\nPlease run the tool **\`recursica_project_setup\`** to configure your project, install the design system adapter, and set up variables correctly.`,
            },
          ],
          isError: true,
        };
      }
    } else {
      // Auto-detect the active adapter in the project
      const { targetAdapter, isInstalled } = detectAdapterAndUiKit(
        process.cwd(),
        allAdapters,
      );

      if (!targetAdapter || !isInstalled) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error: No active Recursica adapter (e.g. '@recursica/mui-adapter' or '@recursica/mantine-adapter') was detected as installed in your project.\n\nPlease run the tool **\`recursica_project_setup\`** to configure your project, install the design system adapter, and set up variables correctly.`,
            },
          ],
          isError: true,
        };
      }

      selectedAdapters = allAdapters.filter(
        (a) => getCleanAdapterName(a.name) === targetAdapter,
      );
    }

    // Validate that all selected adapters have USAGE.md for the component
    for (const adapter of selectedAdapters) {
      const componentsDir = path.join(adapter.absPath, "src", "components");
      let hasUsage = false;
      if (fs.existsSync(componentsDir)) {
        const folders = fs.readdirSync(componentsDir);
        const matchedFolder = folders.find(
          (f) => f.toLowerCase() === compNameInput.toLowerCase(),
        );
        if (matchedFolder) {
          const usageFilePath = path.join(
            componentsDir,
            matchedFolder,
            "USAGE.md",
          );
          if (fs.existsSync(usageFilePath)) {
            hasUsage = true;
          }
        }
      }

      if (!hasUsage) {
        return {
          content: [
            {
              type: "text",
              text: getUnsupportedComponentMessage(compNameInput, adapter.name),
            },
          ],
          isError: true,
        };
      }
    }

    let foundDocs = false;
    let output = `# Component Documentation: \`${compNameInput}\`\n\n`;

    // 1. Resolve and read the general design specification from @recursica/knowledge
    try {
      const knowledgeDir = getKnowledgeComponentsDir();
      if (fs.existsSync(knowledgeDir)) {
        const folders = fs.readdirSync(knowledgeDir);
        const matchedFolder = folders.find(
          (f) => f.toLowerCase() === compNameInput.toLowerCase(),
        );

        if (matchedFolder) {
          foundDocs = true;
          const filePath = path.join(knowledgeDir, matchedFolder, "DOCS.md");
          if (fs.existsSync(filePath)) {
            try {
              let fileContent = fs.readFileSync(filePath, "utf-8");
              if (fileContent.startsWith("---")) {
                const nextSeparator = fileContent.indexOf("---", 3);
                if (nextSeparator !== -1) {
                  fileContent = fileContent.substring(nextSeparator + 3).trim();
                }
              }
              output += `## 🎨 Design Specification & Guidelines\n\n${fileContent}\n\n---\n\n`;
            } catch (e: any) {
              // Ignore individual read errors
            }
          }
        }
      }
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Internal Error: ${e.message}`,
          },
        ],
        isError: true,
      };
    }

    // 2. Read adapter-specific implementation details
    for (const adapter of selectedAdapters) {
      const componentsDir = path.join(adapter.absPath, "src", "components");
      if (!fs.existsSync(componentsDir)) continue;

      // Perform case-insensitive directory search
      const folders = fs.readdirSync(componentsDir);
      const matchedFolder = folders.find(
        (f) => f.toLowerCase() === compNameInput.toLowerCase(),
      );

      if (matchedFolder) {
        foundDocs = true;
        const compDir = path.join(componentsDir, matchedFolder);

        // Read and append USAGE.md if it exists, otherwise fall back to generic instructions
        const usageFilePath = path.join(compDir, "USAGE.md");
        if (fs.existsSync(usageFilePath)) {
          try {
            const usageContent = fs.readFileSync(usageFilePath, "utf-8");
            output += `## 📦 ${adapter.name.toUpperCase()} Adapter Integration\n\n`;
            output += usageContent + "\n\n";
          } catch (e: any) {
            // Ignore read errors
          }
        } else {
          output += `## 📦 ${adapter.name.toUpperCase()} Adapter Integration\n\n`;
          output += `### 📥 Import Path\n`;
          output +=
            "```typescript\n" +
            `import { ${matchedFolder} } from "@recursica/${adapter.dirName}";` +
            "\n```\n\n";
          output += `### 💻 Example Usage\n`;
          output +=
            "```tsx\n" +
            `import React from 'react';\nimport { ${matchedFolder} } from "@recursica/${adapter.dirName}";\n\nexport default function Example() {\n  return (\n    <${matchedFolder}>\n      {/* Add component children and properties here */}\n    </${matchedFolder}>\n  );\n}` +
            "\n```\n\n";
        }

        output += `- *Tip for AI: You can easily inspect the exact TypeScript properties and definitions inside your project's \`node_modules/@recursica/${adapter.dirName}\` directory as needed.*\n\n`;
        output += `---\n\n`;
      }
    }

    if (!foundDocs) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Component "${compNameInput}" was not found in the design specifications or active adapters (${selectedAdapters
              .map((a) => a.name)
              .join(", ")}).`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
