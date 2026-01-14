/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { getComponentName } from "../utils/getComponentName";
import { PLUGIN_DATA_KEY } from "./getComponentMetadata";
import type { NoData } from "./getCurrentUser";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PageInfo {
  index: number;
  name: string;
  cleanedName: string;
  hasMetadata: boolean;
}

export interface GetAllPagesResponseData {
  pages: PageInfo[];
}

/**
 * Service for getting all pages with their names, indices, and metadata status
 */
export async function getAllPages(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    // Load all pages
    await figma.loadAllPagesAsync();
    const rootChildren = figma.root.children;

    const pages: PageInfo[] = [];

    for (let i = 0; i < rootChildren.length; i++) {
      const node = rootChildren[i];

      // Type check: ensure this is a PAGE node
      if (node.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${node.name} (type: ${node.type})`,
        );
        continue;
      }

      const page = node;
      const pluginData = page.getPluginData(PLUGIN_DATA_KEY);
      const hasMetadata = !!pluginData && pluginData.trim() !== "";
      const cleanedName = getComponentName(page.name);

      pages.push({
        index: i,
        name: page.name,
        cleanedName,
        hasMetadata,
      });
    }

    const responseData: GetAllPagesResponseData = {
      pages,
    };

    return retSuccess("getAllPages", responseData as any);
  } catch (error) {
    console.error("Error getting all pages:", error);
    return retError(
      "getAllPages",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
