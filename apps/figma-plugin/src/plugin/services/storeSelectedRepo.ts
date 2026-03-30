import type { ResponseMessage } from "../types/messages";

export interface StoreSelectedRepoData {
  selectedRepo: string;
}

// Empty - store selected repo doesn't return data on success
export type StoreSelectedRepoResponseData = Record<string, never>;

/**
 * Service for storing selected repository
 */
export async function storeSelectedRepo(
  data: StoreSelectedRepoData,
): Promise<ResponseMessage> {
  try {
    const selectedRepo = data.selectedRepo;

    if (!selectedRepo) {
      return {
        type: "storeSelectedRepo",
        success: false,
        error: true,
        message: "Selected repo is required",
        data: {},
      };
    }

    await figma.clientStorage.setAsync("selectedRepo", selectedRepo);

    const responseData: StoreSelectedRepoResponseData = {};

    return {
      type: "storeSelectedRepo",
      success: true,
      error: false,
      message: "Selected repo stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "storeSelectedRepo",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
