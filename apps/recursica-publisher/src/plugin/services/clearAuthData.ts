/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";

/**
 * Service for clearing authentication data
 */
export async function clearAuthData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    await figma.clientStorage.deleteAsync("accessToken");
    await figma.clientStorage.deleteAsync("selectedRepo");

    return {
      type: "clearAuthData",
      success: true,
      error: false,
      message: "Auth data cleared successfully",
      data: {},
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
