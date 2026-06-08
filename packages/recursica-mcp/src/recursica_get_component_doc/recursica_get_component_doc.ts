import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";

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
    let output = `# Component Documentation: \`<${compNameInput}>\`\n\n`;

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

        output += `## 📦 ${adapter.name.toUpperCase()} Adapter Implementation\n`;
        output += `- **Import Path**: \`import { ${matchedFolder} } from "@recursica/${adapter.dirName}";\`\n`;
        output += `- **Local Directory**: \`${compDir}\`\n\n`;

        // 1. Read Implementation Notes Markdown Files
        const mdFiles = fs
          .readdirSync(compDir)
          .filter((f) => f.endsWith(".md") && f.includes("IMPLEMENTATION"));

        if (mdFiles.length > 0) {
          output += `### Implementation notes & usage design rules:\n\n`;
          for (const mdFile of mdFiles) {
            const mdContent = fs.readFileSync(
              path.join(compDir, mdFile),
              "utf-8",
            );
            output += mdContent + "\n\n";
          }
        } else {
          output += `*⚠️ No detailed IMPLEMENTATION_NOTES.md found in the component folder.*\n\n`;
        }

        // 2. Read first 150 lines of .tsx source code to expose exact TypeScript interfaces & props
        const tsxFile = path.join(compDir, `${matchedFolder}.tsx`);
        if (fs.existsSync(tsxFile)) {
          output += `### TypeScript Component Signature & Properties:\n`;
          output += `Here is the TypeScript definition extracted directly from the component source code to view the exact interfaces:\n\n`;

          const codeLines = fs.readFileSync(tsxFile, "utf-8").split("\n");
          const limit = Math.min(codeLines.length, 150);
          const previewCode = codeLines.slice(0, limit).join("\n");

          output += "```tsx\n" + previewCode + "\n";
          if (codeLines.length > 150) {
            output += `// ... [truncated ${codeLines.length - 150} lines of inner rendering logic] ...\n`;
          }
          output += "```\n\n";
        }
        output += `---\n\n`;
      }
    }

    if (!foundDocs) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Component "<${compNameInput}>" was not found in any active adapters (${selectedAdapters
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
