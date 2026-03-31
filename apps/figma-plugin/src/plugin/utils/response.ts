import type { ResponseMessage } from "../types/messages";
import type { ServiceName } from "../types/ServiceName";

/**
 * Create a success response message
 */
export function retSuccess(
  type: ServiceName,
  data: Record<string, unknown> = {},
): ResponseMessage {
  return {
    type,
    success: true,
    error: false,
    message: "",
    data,
  };
}

/**
 * Create an error response message
 */
export function retError(
  type: ServiceName,
  error: Error | string,
  data: Record<string, unknown> = {},
): ResponseMessage {
  const errorMessage = error instanceof Error ? error.message : error;
  return {
    type,
    success: false,
    error: true,
    message: errorMessage,
    data,
  };
}
