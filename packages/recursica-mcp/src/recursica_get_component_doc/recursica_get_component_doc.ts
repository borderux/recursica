import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { getKnowledgeComponentsDir } from "../common/utils.js";

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
          "Optional filter for a specific adapter (e.g. 'mantine' or 'mui'). If omitted, searches across all active adapters.",
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

        output += `## 📦 ${adapter.name.toUpperCase()} Adapter Integration\n\n`;
        output += `### 📥 Import Path\n`;
        output +=
          "```typescript\n" +
          `import { ${matchedFolder} } from "@recursica/${adapter.dirName}";` +
          "\n```\n\n";

        // Read Implementation Notes Markdown Files
        const mdFiles = fs
          .readdirSync(compDir)
          .filter((f) => f.endsWith(".md") && f.includes("IMPLEMENTATION"));

        if (mdFiles.length > 0) {
          output += `### 📝 Implementation Notes & Usage Design Rules\n\n`;
          for (const mdFile of mdFiles) {
            try {
              const mdContent = fs.readFileSync(
                path.join(compDir, mdFile),
                "utf-8",
              );
              output += mdContent + "\n\n";
            } catch (e: any) {
              // Ignore individual read errors
            }
          }
        }

        output += `### 💻 Example Usage\n`;
        output +=
          "```tsx\n" +
          `import React from 'react';\nimport { ${matchedFolder} } from "@recursica/${adapter.dirName}";\n\nexport default function Example() {\n  return (\n    <${matchedFolder}>\n      {/* Add component children and properties here */}\n    </${matchedFolder}>\n  );\n}` +
          "\n```\n\n";
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
