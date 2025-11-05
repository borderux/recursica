/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { getComponentName } from "../utils/getComponentName";

export interface ComponentMetadata {
  _ver: number; // Revision number, must be 1 or greater
  id: string; // GUID
  name: string;
  version: number;
  publishDate: string; // ISO date string
  history: Record<string, unknown>; // Object to be described later
}

const PLUGIN_DATA_KEY = "RecursicaPublishedMetadata";

/**
 * Service for getting component metadata from the current page
 */
export async function getComponentMetadata(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    // Get the current page
    const currentPage = figma.currentPage;

    // Get plugin data from the page node
    const pluginData = currentPage.getPluginData(PLUGIN_DATA_KEY);

    if (!pluginData) {
      // No metadata found, return empty object with cleaned page name
      const cleanedName = getComponentName(currentPage.name);
      const emptyMetadata: ComponentMetadata = {
        _ver: 1,
        id: "",
        name: cleanedName,
        version: 0,
        publishDate: "",
        history: {},
      };

      return retSuccess("getComponentMetadata", {
        componentMetadata: emptyMetadata,
      });
    }

    // Parse the plugin data
    const metadata: ComponentMetadata = JSON.parse(pluginData);

    return retSuccess("getComponentMetadata", {
      componentMetadata: metadata,
    });
  } catch (error) {
    console.error("Error getting component metadata:", error);
    return retError(
      "getComponentMetadata",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
