import type { ResponseMessage } from "../plugin/types/messages";
import { ServiceName } from "../plugin/types/ServiceName";

interface PendingCall {
  resolve: (value: ResponseMessage) => void;
  reject: (reason: Error) => void;
}

interface ErrorWithResponse extends Error {
  response?: ResponseMessage;
}

// Map to store pending calls by their request ID
const pendingCalls = new Map<string, PendingCall>();

// Generate unique ID for each request
let requestIdCounter = 0;
function generateRequestId(): string {
  return `req_${Date.now()}_${++requestIdCounter}`;
}

// Global message handler that routes responses to pending promises
let messageHandlerInitialized = false;

function initializeMessageHandler(): void {
  if (messageHandlerInitialized) {
    return;
  }

  window.addEventListener("message", (event: MessageEvent) => {
    const { pluginMessage } = event.data;
    if (!pluginMessage) return;

    // Check if this is a response to a pending call
    const requestId = pluginMessage.requestId;
    if (requestId && pendingCalls.has(requestId)) {
      const pendingCall = pendingCalls.get(requestId)!;
      pendingCalls.delete(requestId);

      // Convert the response to our ResponseMessage format
      const response: ResponseMessage = {
        type: pluginMessage.type,
        success: pluginMessage.success ?? false,
        error: pluginMessage.error ?? false,
        message: pluginMessage.message ?? "",
        data: pluginMessage.data ?? {},
      };

      if (response.error) {
        console.error(
          `Plugin response: ${pluginMessage.type}`,
          pluginMessage.message,
        );
        // Create error with response data attached so we can extract debug logs
        const error: ErrorWithResponse = new Error(
          response.message || "Plugin request failed",
        );
        error.response = response;
        pendingCall.reject(error);
      } else {
        console.log(
          `Plugin response: ${pluginMessage.type}`,
          pluginMessage.data,
        );
        pendingCall.resolve(response);
      }
    }
  });

  messageHandlerInitialized = true;
}

export interface CallPluginResult {
  promise: Promise<ResponseMessage>;
  cancel: (errorOnCancel?: boolean) => void;
}

/**
 * Call a plugin service and wait for the response
 * @param serviceName - The name of the service (from ServiceName enum)
 * @param data - The payload data to send to the service
 * @returns Object with a promise and a cancel function
 */
export function callPlugin(
  serviceName: ServiceName,
  data: Record<string, unknown> = {},
): CallPluginResult {
  // Initialize the message handler on first call
  initializeMessageHandler();

  // Generate unique request ID
  const requestId = generateRequestId();

  let pendingCall: PendingCall | null = null;

  // Create promise that will be resolved/rejected when response arrives
  const promise = new Promise<ResponseMessage>((resolve, reject) => {
    // Store the promise handlers
    pendingCall = {
      resolve,
      reject,
    };

    pendingCalls.set(requestId, pendingCall);

    // Send the message to the plugin
    // Note: We use parent.postMessage() here because this function runs in the UI iframe.
    // figma.ui.postMessage() is only available in the plugin sandbox (main.ts), not in the UI.
    console.log(`Plugin request: ${serviceName}`, data);
    parent.postMessage(
      {
        pluginMessage: {
          type: serviceName,
          data,
          requestId,
        },
      },
      "*",
    );
  });

  // Cancel function
  const cancel = (errorOnCancel?: boolean): void => {
    if (pendingCalls.has(requestId)) {
      const call = pendingCalls.get(requestId)!;
      pendingCalls.delete(requestId);

      // Send cancellation message to plugin
      parent.postMessage(
        {
          pluginMessage: {
            type: "cancelRequest",
            data: {
              requestId,
            },
            requestId,
          },
        },
        "*",
      );

      if (errorOnCancel) {
        call.reject(new Error(`Service call cancelled: ${serviceName}`));
      }
      // If errorOnCancel is false/undefined, we just remove the call
      // and don't resolve or reject the promise (it will be abandoned)
    }
  };

  return { promise, cancel };
}
