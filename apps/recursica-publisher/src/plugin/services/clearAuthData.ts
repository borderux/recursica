/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";

// Empty - clear auth data doesn't return data on success
export type ClearAuthDataResponseData = Record<string, never>;

/**
 * Service for clearing authentication data
 */
export async function clearAuthData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    await figma.clientStorage.deleteAsync("accessToken");
    await figma.clientStorage.deleteAsync("selectedRepo");
    await figma.clientStorage.deleteAsync("hasWriteAccess");

    const responseData: ClearAuthDataResponseData = {};

    return {
      type: "clearAuthData",
      success: true,
      error: false,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "clearAuthData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
