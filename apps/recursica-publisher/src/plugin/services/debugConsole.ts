/// <reference types="@figma/plugin-typings" />

export type DebugConsoleMessageType = "error" | "warning" | undefined;

export interface DebugConsolePayload {
  type: DebugConsoleMessageType;
  message: string;
}

/**
 * Yields control to the event loop to allow UI updates to process
 * This ensures debug console messages appear in real-time
 */
async function yieldToEventLoop(): Promise<void> {
  // Use setTimeout with 0 delay to yield to the event loop
  // This allows the UI to process queued messages
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Debug console utility for posting messages to the UI
 * Messages are sent and then control is yielded to allow real-time updates
 * Also logs to the browser console for debugging
 */
export const debugConsole = {
  clear: async () => {
    console.clear();
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: undefined,
        message: "__CLEAR__",
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
    await yieldToEventLoop();
  },

  log: async (message: string) => {
    console.log(message);
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: undefined,
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
    await yieldToEventLoop();
  },

  warning: async (message: string) => {
    console.warn(message);
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
    await yieldToEventLoop();
  },

  error: async (message: string) => {
    console.error(message);
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message,
      },
    } as { type: "DebugConsole"; payload: DebugConsolePayload });
    await yieldToEventLoop();
  },
};
