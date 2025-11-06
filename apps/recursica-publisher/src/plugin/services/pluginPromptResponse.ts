import type { ResponseMessage } from "../types/messages";
import { pluginPrompt } from "../utils/pluginPrompt";

export interface PluginPromptResponseData {
  requestId: string;
  action: "ok" | "cancel";
}

// Empty - plugin prompt response doesn't return data on success
export type PluginPromptResponseResponseData = Record<string, never>;

/**
 * Service for handling plugin prompt responses from the UI
 */
export async function pluginPromptResponse(
  data: PluginPromptResponseData,
): Promise<ResponseMessage> {
  try {
    const requestId = data.requestId;
    const action = data.action;

    if (!requestId || !action) {
      return {
        type: "pluginPromptResponse",
        success: false,
        error: true,
        message: "Request ID and action are required",
        data: {},
      };
    }

    // Handle the response using the utility
    pluginPrompt.handleResponse({ requestId, action });

    const responseData: PluginPromptResponseResponseData = {};

    return {
      type: "pluginPromptResponse",
      success: true,
      error: false,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
    };
  } catch (error) {
    return {
      type: "pluginPromptResponse",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
