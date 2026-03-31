import type { ResponseMessage } from "../types/messages";

// Services that don't require data (empty object)
// Using Record<string, never> to represent an empty object type
export type NoData = Record<string, never>;

export interface GetCurrentUserResponseData {
  userId: string | null;
}

/**
 * Service for getting the current Figma user
 */
export async function getCurrentUser(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    const responseData: GetCurrentUserResponseData = {
      userId: figma.currentUser?.id || null,
    };
    return {
      type: "getCurrentUser",
      success: true,
      error: false,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
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
