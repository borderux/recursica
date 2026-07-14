import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { components_directory_header } from "./components_directory_header.js";
import {
  getKnowledgeComponentsDir,
  extractBriefDescription,
  getMissingAdapterErrorMessage,
} from "../common/utils.js";

export const recursica_list_components: Command = {
  name: "recursica_list_components",
  description,
  inputSchema: {
    type: "object",
    properties: {
      adapter: {
        type: "string",
        description:
          "Optional filter for a specific adapter (e.g. 'mantine' or 'mui'). If provided, verifies compatibility and imports for this adapter.",
      },
    },
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const filterAdapter = args?.adapter as string | undefined;

    // Clean target adapter name if provided
    let matchedAdapter: any = null;
    if (filterAdapter) {
      const cleanName = filterAdapter
        .toLowerCase()
        .replace(/^@recursica\//g, "")
        .replace(/-adapter$/g, "")
        .trim();
      matchedAdapter = allAdapters.find(
        (a) => a.name.toLowerCase() === cleanName,
      );

      if (!matchedAdapter) {
        return {
          content: [
            {
              type: "text",
              text: getMissingAdapterErrorMessage(process.cwd(), filterAdapter),
            },
          ],
          isError: true,
        };
      }
    }

    let componentsDir: string;
    try {
      componentsDir = getKnowledgeComponentsDir();
    } catch (e: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Internal Error: ${e.message}.\n\n*Please ensure that the "cwd" parameter of your MCP client's configuration is set to your active project root so that packages can be resolved correctly.*`,
          },
        ],
        isError: true,
      };
    }

    if (!fs.existsSync(componentsDir)) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Internal Error: The components directory could not be resolved at: ${componentsDir}.\n\n*Please ensure that the "cwd" parameter of your MCP client's configuration is set to your active project root directory (which has Recursica dependencies installed).*`,
          },
        ],
        isError: true,
      };
    }

    const componentDirs = fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((ent) => ent.isDirectory());

    if (componentDirs.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `⚠️ No components documented inside ${componentsDir} yet.`,
          },
        ],
      };
    }

    let output = components_directory_header + "\n";

    if (matchedAdapter) {
      output += `## 📦 Active Adapter: **\`@recursica/${matchedAdapter.dirName}\`**\n`;
    }
    output += `*To get detailed design specifications, guidelines, and exact TypeScript properties for any component below, run tool **\`recursica_get_component_doc\`** with \`componentName: "[Component]"\`.*\n\n`;

    output += `---\n\n`;

    for (const dir of componentDirs) {
      const filePath = path.join(componentsDir, dir.name, "DOCS.md");
      if (!fs.existsSync(filePath)) {
        output += `- **${dir.name}**\n`;
        continue;
      }

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const briefDesc = extractBriefDescription(fileContent);
        if (briefDesc) {
          output += `- **${dir.name}**: ${briefDesc}\n`;
        } else {
          output += `- **${dir.name}**\n`;
        }
      } catch (e: any) {
        output += `- **${dir.name}**\n`;
      }
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
