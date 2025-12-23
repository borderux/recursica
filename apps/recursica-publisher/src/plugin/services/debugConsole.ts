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
