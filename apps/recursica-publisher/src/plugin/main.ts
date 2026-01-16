import { services } from "./services";
import type { PluginMessage, PluginResponse } from "./types/messages";
import type { ServiceName } from "./types/ServiceName";
import { handleGuidResponse } from "./utils/requestGuidFromUI";
import {
  markRequestCancelled,
  checkCancellation,
  clearCancellation,
} from "./utils/cancellation";
import { debugConsole } from "./services/import-export/debugConsole";

// Service map - automatically derived from services export
// This ensures any service added to services/index.ts is automatically available
const serviceMap = services;

// Plugin configuration
figma.showUI(__html__, {
  width: 400,
  height: 400,
});

// Message handler - routes messages to services based on type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
figma.ui.onmessage = async (message: PluginMessage | any) => {
  console.log("Received message:", message);

  // Handle cancellation messages
  if (message.type === "cancelRequest") {
    const requestId = message.data?.requestId;
    if (requestId) {
      markRequestCancelled(requestId);
      console.log(`Request cancelled: ${requestId}`);
    }
    return;
  }

  // Handle GUID response messages (from UI to plugin)
  if (message.type === "GenerateGuidResponse") {
    handleGuidResponse(message);
    return;
  }

  // At this point, message should be a PluginMessage
  const pluginMessage = message as PluginMessage;

  try {
    const serviceName = pluginMessage.type as ServiceName;
    const service = serviceMap[serviceName];

    if (!service) {
      console.warn("Unknown message type:", pluginMessage.type);
      const errorResponse: PluginResponse = {
        type: pluginMessage.type,
        success: false,
        error: true,
        message: "Unknown message type: " + pluginMessage.type,
        data: {},
        requestId: pluginMessage.requestId,
      };
      figma.ui.postMessage(errorResponse);
      return;
    }

    // Check for cancellation before processing
    if (pluginMessage.requestId) {
      checkCancellation(pluginMessage.requestId);
    }

    // Service functions have different signatures, so we need to handle them specially
    // Most services: (data: Record<string, unknown>) => Promise<PluginResponse>
    // exportPage: (data, processedPages?, isRecursive?, discoveredPages?, requestId?) => Promise<PluginResponse>
    // importPage: (data, requestId?) => Promise<PluginResponse>
    type ServiceFunction = (
      data: Record<string, unknown>,
      ...args: unknown[]
    ) => Promise<PluginResponse>;

    let response: PluginResponse;
    if (serviceName === "exportPage" && pluginMessage.requestId) {
      // exportPage has signature: (data, processedPages?, isRecursive?, discoveredPages?, requestId?)
      // We need to pass defaults for the middle parameters
      const exportPageService = service as ServiceFunction;
      response = await exportPageService(
        pluginMessage.data,
        new Set(),
        false,
        new Set(),
        pluginMessage.requestId,
      );
    } else if (serviceName === "importPage" && pluginMessage.requestId) {
      // importPage has signature: (data, requestId?)
      const importPageService = service as ServiceFunction;
      response = await importPageService(
        pluginMessage.data,
        pluginMessage.requestId,
      );
    } else {
      // Standard service signature: (data) => Promise<PluginResponse>
      const standardService = service as ServiceFunction;
      response = await standardService(pluginMessage.data);
    }

    // Include debug logs in response if available
    const debugLogs = debugConsole.getLogs();
    if (debugLogs.length > 0) {
      response.data = {
        ...response.data,
        debugLogs,
      };
    }

    // Include requestId in response so UI can match it to the pending promise
    figma.ui.postMessage({
      ...response,
      requestId: pluginMessage.requestId,
    });

    // Clean up cancelled request tracking after successful completion
    if (pluginMessage.requestId) {
      clearCancellation(pluginMessage.requestId);
    }
  } catch (error) {
    console.error("Error handling message:", error);

    const errorResponse: PluginResponse = {
      type: pluginMessage.type,
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
      requestId: pluginMessage.requestId,
    };

    // Include debug logs in error response if available
    const debugLogs = debugConsole.getLogs();
    if (debugLogs.length > 0) {
      errorResponse.data.debugLogs = debugLogs;
    }

    figma.ui.postMessage(errorResponse);

    // Clean up cancelled request tracking
    if (pluginMessage.requestId) {
      clearCancellation(pluginMessage.requestId);
    }
  }
};
