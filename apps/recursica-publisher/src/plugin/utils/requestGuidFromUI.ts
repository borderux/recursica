/// <reference types="@figma/plugin-typings" />

/**
 * Requests a GUID from the UI (which has access to crypto.randomUUID())
 * The UI will generate the GUID and send it back via postMessage
 *
 * This uses a promise-based approach where:
 * 1. Plugin sends GenerateGuidRequest to UI
 * 2. UI generates GUID and sends GenerateGuidResponse back
 * 3. Plugin's main message handler routes the response to the waiting promise
 *
 * @returns Promise that resolves with a UUID v4 string
 */
let guidRequestIdCounter = 0;
const pendingGuidRequests = new Map<
  string,
  { resolve: (guid: string) => void; reject: (error: Error) => void }
>();

/**
 * Initialize GUID request handler in the plugin's main message handler
 * This should be called from main.ts to handle GenerateGuidResponse messages
 */
export function handleGuidResponse(message: {
  type: string;
  requestId?: string;
  guid?: string;
  error?: boolean;
  message?: string;
}): void {
  if (message.type !== "GenerateGuidResponse" || !message.requestId) {
    return;
  }

  const pendingRequest = pendingGuidRequests.get(message.requestId);
  if (!pendingRequest) {
    return; // No pending request for this ID
  }

  pendingGuidRequests.delete(message.requestId);

  if (message.error || !message.guid) {
    pendingRequest.reject(
      new Error(message.message || "Failed to generate GUID from UI"),
    );
  } else {
    pendingRequest.resolve(message.guid);
  }
}

export function requestGuidFromUI(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a unique request ID for this GUID request
    const requestId = `guid_${Date.now()}_${++guidRequestIdCounter}`;

    // Store the promise handlers
    pendingGuidRequests.set(requestId, { resolve, reject });

    // Send request to UI
    figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId,
    });

    // Set a timeout to avoid hanging forever
    setTimeout(() => {
      if (pendingGuidRequests.has(requestId)) {
        pendingGuidRequests.delete(requestId);
        reject(new Error("Timeout waiting for GUID from UI"));
      }
    }, 5000); // 5 second timeout
  });
}
