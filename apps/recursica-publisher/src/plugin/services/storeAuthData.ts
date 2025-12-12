import type { ResponseMessage } from "../types/messages";

export interface StoreAuthDataData {
  accessToken: string;
  selectedRepo?: string;
  hasWriteAccess?: boolean;
}

// Empty - store auth data doesn't return data on success
export type StoreAuthDataResponseData = Record<string, never>;

/**
 * Service for storing authentication data
 */
export async function storeAuthData(
  data: StoreAuthDataData,
): Promise<ResponseMessage> {
  try {
    const accessToken = data.accessToken;
    const selectedRepo = data.selectedRepo;

    if (!accessToken) {
      return {
        type: "storeAuthData",
        success: false,
        error: true,
        message: "Access token is required",
        data: {},
      };
    }

    await figma.clientStorage.setAsync("accessToken", accessToken);
    if (selectedRepo) {
      await figma.clientStorage.setAsync("selectedRepo", selectedRepo);
    }
    if (data.hasWriteAccess !== undefined) {
      await figma.clientStorage.setAsync("hasWriteAccess", data.hasWriteAccess);
    }

    const responseData: StoreAuthDataResponseData = {};

    return {
      type: "storeAuthData",
      success: true,
      error: false,
      message: "Auth data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "storeAuthData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
