/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { getComponentName } from "../utils/getComponentName";
import type { ComponentMetadata } from "./getComponentMetadata";
import { PLUGIN_DATA_KEY } from "./getComponentMetadata";

import type { NoData } from "./getCurrentUser";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GetAllComponentsResponseData {
  components: ComponentMetadata[];
}

/**
 * Service for getting component metadata from all pages
 * Returns an array of component metadata, with empty entries for pages without metadata
 */
export async function getAllComponents(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    // Load all pages
    await figma.loadAllPagesAsync();
    const rootChildren = figma.root.children;

    // Traverse all pages and collect component metadata
    // Filter to only process PAGE nodes (defensive check)
    const components: ComponentMetadata[] = [];

    for (const node of rootChildren) {
      // Type check: ensure this is a PAGE node
      if (node.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${node.name} (type: ${node.type})`,
        );
        continue;
      }

      const page = node;
      // Get plugin data from the page node
      const pluginData = page.getPluginData(PLUGIN_DATA_KEY);

      if (!pluginData) {
        // No metadata found, return empty entry with cleaned page name
        const cleanedName = getComponentName(page.name);
        const emptyMetadata: ComponentMetadata = {
          _ver: 1,
          id: "",
          name: cleanedName,
          version: 0,
          publishDate: "",
          history: {},
        };
        components.push(emptyMetadata);
      } else {
        // Parse the plugin data
        try {
          const metadata: ComponentMetadata = JSON.parse(pluginData);
          components.push(metadata);
        } catch (parseError) {
          // If parsing fails, still include empty entry with cleaned page name
          console.warn(
            `Failed to parse metadata for page "${page.name}":`,
            parseError,
          );
          const cleanedName = getComponentName(page.name);
          const emptyMetadata: ComponentMetadata = {
            _ver: 1,
            id: "",
            name: cleanedName,
            version: 0,
            publishDate: "",
            history: {},
          };
          components.push(emptyMetadata);
        }
      }
    }

    const responseData: GetAllComponentsResponseData = {
      components,
    };

    return retSuccess("getAllComponents", responseData as any);
  } catch (error) {
    console.error("Error getting all components:", error);
    return retError(
      "getAllComponents",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
