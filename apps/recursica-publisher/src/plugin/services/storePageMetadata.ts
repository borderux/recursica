/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import type { ComponentMetadata } from "./getComponentMetadata";
import { PLUGIN_DATA_KEY } from "./getComponentMetadata";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface StorePageMetadataData {
  pageIndex: number;
  metadata: ComponentMetadata;
}

export type StorePageMetadataResponseData = Record<string, never>;

/**
 * Service for storing metadata to a specific page by index
 */
export async function storePageMetadata(
  data: StorePageMetadataData,
): Promise<ResponseMessage> {
  try {
    const { pageIndex, metadata } = data;

    // Load all pages
    await figma.loadAllPagesAsync();
    const rootChildren = figma.root.children;

    if (pageIndex < 0 || pageIndex >= rootChildren.length) {
      return retError(
        "storePageMetadata",
        `Invalid page index: ${pageIndex}. Valid range: 0-${rootChildren.length - 1}`,
      );
    }

    const node = rootChildren[pageIndex];

    // Type check: ensure this is a PAGE node
    if (node.type !== "PAGE") {
      return retError(
        "storePageMetadata",
        `Node at index ${pageIndex} is not a PAGE node (type: ${node.type})`,
      );
    }

    const page = node;

    // Store the metadata
    page.setPluginData(PLUGIN_DATA_KEY, JSON.stringify(metadata));

    const responseData: StorePageMetadataResponseData = {};

    return retSuccess("storePageMetadata", responseData as any);
  } catch (error) {
    console.error("Error storing page metadata:", error);
    return retError(
      "storePageMetadata",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
