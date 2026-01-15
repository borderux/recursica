/**
 * Error thrown when an operation is cancelled
 */
export class OperationCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperationCancelledError";
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((Error as any).captureStackTrace) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Error as any).captureStackTrace(this, OperationCancelledError);
    }
  }
}
