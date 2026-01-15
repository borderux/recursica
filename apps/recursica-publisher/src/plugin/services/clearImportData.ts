/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";

// Empty - clear import data doesn't return data on success
export type ClearImportDataResponseData = Record<string, never>;

/**
 * Service for clearing import data
 */
export async function clearImportData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    // Clear import data from the current file using plugin data instead of global clientStorage
    const IMPORT_DATA_KEY = "RecursicaImportData";
    figma.root.setPluginData(IMPORT_DATA_KEY, "");

    const responseData: ClearImportDataResponseData = {};

    return {
      type: "clearImportData",
      success: true,
      error: false,
      message: "Import data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "clearImportData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
