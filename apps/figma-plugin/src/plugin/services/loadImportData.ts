import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";

export interface LoadImportDataResponseData {
  importData?: {
    mainFile: {
      id: string;
      name: string;
      size: number;
      data: unknown;
      status: "pending" | "success" | "error";
      error?: string;
    } | null;
    additionalFiles: Array<{
      id: string;
      name: string;
      size: number;
      data: unknown;
      status: "pending" | "success" | "error";
      error?: string;
    }>;
    source?: {
      type: "repo" | "local";
      branch?: string;
      commit?: string;
      owner?: string;
      repo?: string;
    };
    wizardSelections?: {
      dependencies: Array<{
        guid: string;
        name: string;
        useExisting: boolean;
      }>;
      tokensCollection: "new" | "existing";
      themeCollection: "new" | "existing";
      layersCollection: "new" | "existing";
    };
    variableSummary?: {
      tokens: { existing: number; new: number };
      theme: { existing: number; new: number };
      layers: { existing: number; new: number };
    };
  };
}

/**
 * Service for loading import data
 */
export async function loadImportData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    // Load import data from the current file using plugin data instead of global clientStorage
    const IMPORT_DATA_KEY = "RecursicaImportData";
    const importDataJson = figma.root.getPluginData(IMPORT_DATA_KEY);

    let importData;
    if (importDataJson) {
      try {
        importData = JSON.parse(importDataJson);
      } catch (parseError) {
        console.warn(
          "[loadImportData] Failed to parse import data:",
          parseError,
        );
        importData = undefined;
      }
    }

    const responseData: LoadImportDataResponseData = {
      importData: importData,
    };

    return {
      type: "loadImportData",
      success: true,
      error: false,
      message: "Import data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "loadImportData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
