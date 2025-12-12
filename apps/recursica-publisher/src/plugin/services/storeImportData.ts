import type { ResponseMessage } from "../types/messages";

export interface StoreImportDataData {
  importData: {
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

// Empty - store import data doesn't return data on success
export type StoreImportDataResponseData = Record<string, never>;

/**
 * Service for storing import data
 */
export async function storeImportData(
  data: StoreImportDataData,
): Promise<ResponseMessage> {
  try {
    await figma.clientStorage.setAsync("importData", data.importData);

    const responseData: StoreImportDataResponseData = {};

    return {
      type: "storeImportData",
      success: true,
      error: false,
      message: "Import data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "storeImportData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
