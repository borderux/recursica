import type { ResponseMessage } from "../types/messages";

/**
 * Service for getting the current Figma user
 */
export async function getCurrentUser(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    return {
      type: "getCurrentUser",
      success: true,
      error: false,
      message: "Current user retrieved successfully",
      data: {
        userId: figma.currentUser?.id || null,
      },
    };
  } catch (error) {
    return {
      type: "getCurrentUser",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
