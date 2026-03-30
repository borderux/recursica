import type { DebugConsoleMessage } from "../plugin/services/import-export/debugConsole";

/**
 * Format debug console logs for clipboard copying
 */
export function formatLogsForClipboard(
  debugLogs: DebugConsoleMessage[] | undefined,
): string {
  if (!debugLogs || debugLogs.length === 0) {
    return "";
  }

  return debugLogs
    .map((msg) => {
      const prefix =
        msg.type === "error"
          ? "[ERROR]"
          : msg.type === "warning"
            ? "[WARN]"
            : "[LOG]";
      return `${prefix} ${msg.message}`;
    })
    .join("\n");
}
