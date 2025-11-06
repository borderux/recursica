/// <reference types="@figma/plugin-typings" />

export type DebugConsoleMessageType = "error" | "warning" | undefined;

export interface DebugConsolePayload {
  type: DebugConsoleMessageType;
  message: string;
}

/**
 * Debug console utility for posting messages to the UI
 */
export const debugConsole = {
  clear: () => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: undefined,
        message: "__CLEAR__",
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
  },

  log: (message: string) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: undefined,
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
  },

  warning: (message: string) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
  },

  error: (message: string) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
  },
};
