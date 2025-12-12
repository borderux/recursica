/// <reference types="@figma/plugin-typings" />

interface PendingPrompt {
  resolve: () => void;
  reject: (reason: Error) => void;
  timeout: ReturnType<typeof setTimeout> | null;
}

// Map to store pending prompts by their request ID
const pendingPrompts = new Map<string, PendingPrompt>();

// Generate unique ID for each prompt request
let requestIdCounter = 0;
function generateRequestId(): string {
  return `prompt_${Date.now()}_${++requestIdCounter}`;
}

export interface PluginPromptPayload {
  message: string;
  requestId: string;
  okLabel?: string;
  cancelLabel?: string;
}

export interface PluginPromptResponseData {
  requestId: string;
  action: "ok" | "cancel";
}

/**
 * Plugin prompt utility for prompting the user with OK/Cancel options
 */
export const pluginPrompt = {
  /**
   * Prompt the user with a message and wait for OK or Cancel response
   * @param message - The message to display to the user
   * @param optionsOrTimeout - Optional configuration object or timeout in milliseconds (for backwards compatibility)
   * @param optionsOrTimeout.timeoutMs - Timeout in milliseconds. Defaults to 300000 (5 minutes). Set to -1 for no timeout.
   * @param optionsOrTimeout.okLabel - Custom label for the OK button. Defaults to "OK".
   * @param optionsOrTimeout.cancelLabel - Custom label for the cancel button. Defaults to "Cancel".
   * @returns Promise that resolves on OK, rejects on Cancel or timeout
   */
  prompt: (
    message: string,
    optionsOrTimeout?:
      | {
          timeoutMs?: number;
          okLabel?: string;
          cancelLabel?: string;
        }
      | number,
  ): Promise<void> => {
    // Handle backwards compatibility: if second param is a number, treat it as timeoutMs
    const options =
      typeof optionsOrTimeout === "number"
        ? { timeoutMs: optionsOrTimeout }
        : optionsOrTimeout;

    const timeoutMs = options?.timeoutMs ?? 300000;
    const okLabel = options?.okLabel;
    const cancelLabel = options?.cancelLabel;

    // Generate unique request ID
    const requestId = generateRequestId();

    // Create promise that will be resolved/rejected when response arrives
    return new Promise<void>((resolve, reject) => {
      // Set up timeout only if not -1 (which means no timeout)
      const timeout =
        timeoutMs === -1
          ? null
          : setTimeout(() => {
              pendingPrompts.delete(requestId);
              reject(new Error(`Plugin prompt timeout: ${message}`));
            }, timeoutMs);

      // Store the promise handlers
      pendingPrompts.set(requestId, {
        resolve,
        reject,
        timeout,
      });

      // Send the prompt message to the UI
      figma.ui.postMessage({
        type: "PluginPrompt",
        payload: {
          message,
          requestId,
          ...(okLabel && { okLabel }),
          ...(cancelLabel && { cancelLabel }),
        },
      } as { type: "PluginPrompt"; payload: PluginPromptPayload });
    });
  },

  /**
   * Clear the current prompt from the UI
   */
  clear: () => {
    figma.ui.postMessage({
      type: "PluginPromptClear",
    } as { type: "PluginPromptClear" });
  },

  /**
   * Handle a response from the UI
   * This is called by the pluginPromptResponse service
   * @param data - The response data containing requestId and action
   */
  handleResponse: (data: PluginPromptResponseData) => {
    const { requestId, action } = data;
    const pendingPrompt = pendingPrompts.get(requestId);

    if (!pendingPrompt) {
      console.warn(
        `Received response for unknown prompt request: ${requestId}`,
      );
      return;
    }

    // Clear timeout if it exists
    if (pendingPrompt.timeout) {
      clearTimeout(pendingPrompt.timeout);
    }

    // Remove from pending prompts
    pendingPrompts.delete(requestId);

    // Resolve or reject based on action
    if (action === "ok") {
      pendingPrompt.resolve();
    } else {
      pendingPrompt.reject(new Error("User cancelled"));
    }
  },
};
