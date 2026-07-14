import path from "path";
import fs from "fs";
import { Command } from "../common/types.js";
import { description } from "./description.js";
import { setup_status } from "./setup_status.js";
import { missing_kit_message } from "./missing_kit_message.js";
import {
  detectAdapterAndUiKit,
  getCleanAdapterName,
  getMissingAdapterErrorMessage,
} from "../common/utils.js";

export const recursica_project_setup: Command = {
  name: "recursica_project_setup",
  description,
  inputSchema: {
    type: "object",
    properties: {
      "ui-kit": {
        type: "string",
        description:
          "Optional name of the UI kit (e.g. 'mantine', 'mui') or the full package dependency string from package.json (e.g. '@recursica/mantine-adapter', '@recursica/mui-adapter'). Case-insensitive. If not specified, we will attempt to auto-detect whether a supported adapter or UI kit is already installed based on package.json. DO NOT guess, assume, or auto-select a UI kit on behalf of the developer if auto-detection fails; instead, you must explicitly ask the developer to choose.",
      },
      projectPath: {
        type: "string",
        description:
          "Optional absolute path to check package.json for existing installation. Defaults to the current working directory.",
      },
    },
    additionalProperties: false,
  },
  handler: async (args, { allAdapters }) => {
    const explicitUiKit = args?.["ui-kit"] as string | undefined;
    const startPath = args?.projectPath || process.cwd();

    const { targetAdapter, isInstalled } = detectAdapterAndUiKit(
      startPath,
      allAdapters,
      explicitUiKit,
    );

    // If we resolved or specified a target adapter
    if (targetAdapter) {
      const matched = allAdapters.find(
        (a) => getCleanAdapterName(a.name) === targetAdapter,
      );
      if (!matched) {
        return {
          content: [
            {
              type: "text",
              text: getMissingAdapterErrorMessage(startPath, targetAdapter),
            },
          ],
          isError: true,
        };
      }

      const cleanName = getCleanAdapterName(matched.name);

      // Always run our own check to see if the adapter is installed
      if (isInstalled) {
        // Check for theme files in the project root
        const targetCssPath = path.join(
          startPath,
          "recursica_variables_scoped.css",
        );
        let warnMessage = "";

        if (!fs.existsSync(targetCssPath)) {
          warnMessage =
            "\n\n⚠️ **Warning**: `recursica_variables_scoped.css` is missing from your project root. Please run `npm install` to create it and then incorporate the files into your application.";
        }

        const output =
          setup_status.replace(/\{\{cleanName\}\}/g, cleanName) + warnMessage;
        return {
          content: [{ type: "text", text: output }],
        };
      }

      // If UI kit is detected (or adapter requested) but not yet installed, print the SETUP.md
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

      // Fallback if SETUP.md doesn't exist
      return {
        content: [
          {
            type: "text",
            text: `⚠️ **Warning**: The SETUP.md for adapter "${cleanName}" was not found. Please verify the adapter package.`,
          },
        ],
        isError: true,
      };
    }

    // Auto-detection failed: no supported UI kit or adapter was found in package.json
    const text = missing_kit_message;

    return {
      content: [{ type: "text", text }],
    };
  },
};
