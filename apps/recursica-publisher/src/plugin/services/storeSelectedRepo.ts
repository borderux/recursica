import type { ResponseMessage } from "../types/messages";

/**
 * Service for storing selected repository
 */
export async function storeSelectedRepo(
  data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    const selectedRepo = data.selectedRepo as string | undefined;

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

    return {
      type: "storeSelectedRepo",
      success: true,
      error: false,
      message: "Selected repo stored successfully",
      data: {},
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
