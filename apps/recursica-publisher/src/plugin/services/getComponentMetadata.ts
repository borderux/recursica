/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { getComponentName } from "../utils/getComponentName";
import type { NoData } from "./getCurrentUser";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ComponentMetadata {
  _ver: number; // Revision number, must be 1 or greater
  id: string; // GUID
  name: string;
  version: number;
  publishDate: string; // ISO date string
  history: Record<string, unknown>; // Object to be described later
  description?: string; // Optional description
  url?: string; // Optional URL
}

export const PLUGIN_DATA_KEY = "RecursicaPublishedMetadata";
export const INIT_METADATA_KEY = "RecursicaPublishInitialized";

export interface GetComponentMetadataResponseData {
  componentMetadata: ComponentMetadata;
  currentPageIndex: number;
}

/**
 * Service for getting component metadata from the current page
 */
export async function getComponentMetadata(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    // Get the current page
    const currentPage = figma.currentPage;

    // Load all pages to find the current page index
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    const currentPageIndex = pages.findIndex(
      (page) => page.id === currentPage.id,
    );

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

      const responseData: GetComponentMetadataResponseData = {
        componentMetadata: emptyMetadata,
        currentPageIndex,
      };

      return retSuccess("getComponentMetadata", responseData as any);
    }

    // Parse the plugin data
    const metadata: ComponentMetadata = JSON.parse(pluginData);

    const responseData: GetComponentMetadataResponseData = {
      componentMetadata: metadata,
      currentPageIndex,
    };

    return retSuccess("getComponentMetadata", responseData as any);
  } catch (error) {
    console.error("Error getting component metadata:", error);
    return retError(
      "getComponentMetadata",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
