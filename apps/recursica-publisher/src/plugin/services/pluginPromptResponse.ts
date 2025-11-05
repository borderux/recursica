import type { ResponseMessage } from "../types/messages";
import { pluginPrompt } from "../utils/pluginPrompt";

/**
 * Service for handling plugin prompt responses from the UI
 */
export async function pluginPromptResponse(
  data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    const requestId = data.requestId as string | undefined;
    const action = data.action as "ok" | "cancel" | undefined;

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

    return {
      type: "pluginPromptResponse",
      success: true,
      error: false,
      message: "Prompt response handled successfully",
      data: {},
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
