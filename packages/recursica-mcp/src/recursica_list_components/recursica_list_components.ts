import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { components_directory_header } from "./components_directory_header.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
              text: `❌ Adapter "${filterAdapter}" was not found. Active adapters: ${allAdapters
                .map((a) => a.name)
                .join(", ")}`,
            },
          ],
          isError: true,
        };
      }
    }

    const componentsDir = path.join(__dirname, "components");

    if (!fs.existsSync(componentsDir)) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Internal Error: The static components directory could not be resolved at: ${componentsDir}. Please ensure the build completed successfully.`,
          },
        ],
        isError: true,
      };
    }

    const mdFiles = fs
      .readdirSync(componentsDir)
      .filter((f) => f.endsWith(".md"));

    if (mdFiles.length === 0) {
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
      output += `*To get detailed TypeScript interfaces and properties for any component below, run tool **\`recursica_get_component_doc\`** with \`componentName: "[Component]"\`.*\n\n`;
    }

    output += `---\n\n`;

    for (const file of mdFiles) {
      const filePath = path.join(componentsDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        output += fileContent + "\n\n---\n\n";
      } catch (e: any) {
        // Ignore read errors for individual files in production and continue
      }
    }

    return {
      content: [{ type: "text", text: output }],
    };
  },
};
