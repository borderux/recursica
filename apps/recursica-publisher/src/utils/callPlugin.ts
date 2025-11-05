import type { ResponseMessage } from "../plugin/types/messages";
import { ServiceName } from "../plugin/types/ServiceName";

interface PendingCall {
  resolve: (value: ResponseMessage) => void;
  reject: (reason: Error) => void;
  timeout: ReturnType<typeof setTimeout> | null;
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
      if (pendingCall.timeout) {
        clearTimeout(pendingCall.timeout);
      }
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
        pendingCall.reject(
          new Error(response.message || "Plugin request failed"),
        );
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

/**
 * Call a plugin service and wait for the response
 * @param serviceName - The name of the service (from ServiceName enum)
 * @param data - The payload data to send to the service
 * @param timeoutMs - Timeout in milliseconds. Defaults to 30000 (30 seconds). Set to -1 for no timeout.
 * @returns Promise that resolves with the ResponseMessage
 */
export async function callPlugin(
  serviceName: ServiceName,
  data: Record<string, unknown> = {},
  timeoutMs: number = 30000,
): Promise<ResponseMessage> {
  // Initialize the message handler on first call
  initializeMessageHandler();

  // Generate unique request ID
  const requestId = generateRequestId();

  // Create promise that will be resolved/rejected when response arrives
  return new Promise<ResponseMessage>((resolve, reject) => {
    // Set up timeout only if not -1 (which means no timeout)
    const timeout =
      timeoutMs === -1
        ? null
        : setTimeout(() => {
            pendingCalls.delete(requestId);
            reject(new Error(`Plugin request timeout: ${serviceName}`));
          }, timeoutMs);

    // Store the promise handlers
    pendingCalls.set(requestId, {
      resolve,
      reject,
      timeout,
    });

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
}
