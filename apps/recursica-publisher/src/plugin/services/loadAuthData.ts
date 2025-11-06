import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";

export interface LoadAuthDataResponseData {
  accessToken?: string;
  selectedRepo?: string;
}

/**
 * Service for loading authentication data
 */
export async function loadAuthData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    const accessToken = await figma.clientStorage.getAsync("accessToken");
    const selectedRepo = await figma.clientStorage.getAsync("selectedRepo");

    const responseData: LoadAuthDataResponseData = {
      accessToken: accessToken || undefined,
      selectedRepo: selectedRepo || undefined,
    };

    return {
      type: "loadAuthData",
      success: true,
      error: false,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
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
