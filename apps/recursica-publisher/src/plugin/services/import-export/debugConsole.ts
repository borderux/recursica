/// <reference types="@figma/plugin-typings" />

export interface DebugConsoleMessage {
  type: "error" | "warning" | "log";
  message: string;
}

// In-memory log buffer
const logBuffer: DebugConsoleMessage[] = [];

/**
 * Debug console utility for collecting logs in memory
 * Logs are collected and sent only when operations complete
 * Also logs to the browser console for debugging
 */
export const debugConsole = {
  clear: () => {
    console.clear();
    logBuffer.length = 0; // Clear the buffer
  },

  log: (message: string) => {
    console.log(message);
    logBuffer.push({
      type: "log",
      message,
    });
  },

  warning: (message: string) => {
    console.warn(message);
    logBuffer.push({
      type: "warning",
      message,
    });
  },

  error: (message: string) => {
    console.error(message);
    logBuffer.push({
      type: "error",
      message,
    });
  },

  /**
   * Temporary debug logging function for easy cleanup.
   *
   * This function is designed for temporary debug logging that can be easily removed later.
   * The key principle is to keep all temporary debugging logic isolated within the `check`
   * argument, avoiding any additional code changes in the codebase that would need to be
   * manually removed.
   *
   * **How to Use:**
   * Place all temporary state checks, condition evaluations, and debugging logic directly
   * in the `check` argument as a boolean expression. This ensures that when you're done
   * debugging, you can simply remove the entire `tempLog` call without leaving behind
   * any residual code that could cause regressions.
   *
   * **Clean Removal:**
   * By keeping temporary checks in the `check` argument, removing debug code becomes a
   * simple find-and-delete operation with minimal risk of accidentally leaving behind
   * code that affects the application's logic.
   *
   * **Best Practice:**
   * NO additional variables, conditionals, or logic should be added outside the `check`
   * argument. All temporary debugging code should be contained within the boolean
   * expression passed to `check`.
   *
   * @param type - Log type: "log", "warning", or "error"
   * @param prefix - A unique string identifier for this debug session (e.g., "INPUT", "EXPORT", "PARSE").
   *                 This prefix will be prepended to every log line to help identify related logs.
   * @param check - A boolean value representing the result of temporary state checks. Place any
   *                temporary debugging code here that evaluates to true/false. This keeps temporary
   *                code isolated for easy removal. Examples: `node.type === "INSTANCE"`,
   *                `node.children.length > 0 && node.visible === true`
   * @param message - The log message to output
   *
   * @example
   * // Simple check with log type
   * debugConsole.tempLog(
   *   "log",
   *   "INPUT",
   *   node.type === "INSTANCE",
   *   "Found instance node"
   * );
   *
   * @example
   * // Complex check with temporary debugging code - all logic in the check argument
   * debugConsole.tempLog(
   *   "log",
   *   "INPUT",
   *   node.children.length > 0 && node.visible === true,
   *   "Node has visible children"
   * );
   *
   * @example
   * // With warning type
   * debugConsole.tempLog(
   *   "warning",
   *   "INPUT",
   *   node.visible === false,
   *   "Node is hidden"
   * );
   *
   * @example
   * // With error type
   * debugConsole.tempLog("error", "INPUT", node === null, "Node is null");
   *
   * @example
   * // ❌ BAD: Adding temporary variables that need to be removed later
   * // const hasChildren = node.children.length > 0;
   * // const isVisible = node.visible === true;
   * // debugConsole.tempLog("log", "INPUT", hasChildren && isVisible, "Node state");
   *
   * @example
   * // ❌ BAD: Adding temporary conditionals that affect code flow
   * // if (node.type === "INSTANCE") {
   * //   debugConsole.tempLog("log", "INPUT", true, "Found instance");
   * // }
   *
   * @example
   * // ✅ GOOD: All temporary logic in the check argument
   * debugConsole.tempLog(
   *   "log",
   *   "INPUT",
   *   node.type === "INSTANCE",
   *   "Found instance"
   * );
   */
  tempLog: (
    type: "log" | "warning" | "error",
    prefix: string,
    check: boolean,
    message: string,
  ) => {
    const checkResult = check ? "[TRUE]" : "[FALSE]";
    const formattedMessage = `[${prefix}] ${checkResult} ${message}`;

    switch (type) {
      case "warning":
        debugConsole.warning(formattedMessage);
        break;
      case "error":
        debugConsole.error(formattedMessage);
        break;
      case "log":
      default:
        debugConsole.log(formattedMessage);
        break;
    }
  },

  /**
   * Get all collected logs without clearing the buffer
   */
  getLogs: (): DebugConsoleMessage[] => {
    return [...logBuffer];
  },

  /**
   * Get all collected logs and clear the buffer
   */
  flush: (): DebugConsoleMessage[] => {
    const logs = [...logBuffer];
    logBuffer.length = 0;
    return logs;
  },
};
