import type { ResponseMessage } from "../types/messages";

/**
 * Service for loading authentication data
 */
export async function loadAuthData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    const accessToken = await figma.clientStorage.getAsync("accessToken");
    const selectedRepo = await figma.clientStorage.getAsync("selectedRepo");

    return {
      type: "loadAuthData",
      success: true,
      error: false,
      message: "Auth data loaded successfully",
      data: {
        accessToken: accessToken || undefined,
        selectedRepo: selectedRepo || undefined,
      },
    };
  } catch (error) {
    return {
      type: "loadAuthData",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
