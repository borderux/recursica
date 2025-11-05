import type { ResponseMessage } from "../types/messages";

/**
 * Service for storing authentication data
 */
export async function storeAuthData(
  data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    const accessToken = data.accessToken as string | undefined;
    const selectedRepo = data.selectedRepo as string | undefined;

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

    return {
      type: "storeAuthData",
      success: true,
      error: false,
      message: "Auth data stored successfully",
      data: {},
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
