import { OperationCancelledError } from "../types/errors";

// Track cancelled request IDs
const cancelledRequests = new Set<string>();

/**
 * Mark a request as cancelled
 */
export function markRequestCancelled(requestId: string): void {
  cancelledRequests.add(requestId);
}

/**
 * Check if a request has been cancelled and throw if it has
 */
export function checkCancellation(requestId?: string): void {
  if (requestId && cancelledRequests.has(requestId)) {
    throw new OperationCancelledError(`Operation cancelled: ${requestId}`);
  }
}

/**
 * Clear cancellation status for a request (after completion)
 */
export function clearCancellation(requestId: string): void {
  cancelledRequests.delete(requestId);
}
