import { services } from "./services";
import type { PluginMessage, PluginResponse } from "./types/messages";
import type { ServiceName } from "./types/ServiceName";

// Service map - automatically derived from services export
// This ensures any service added to services/index.ts is automatically available
const serviceMap = services;

// Plugin configuration
figma.showUI(__html__, {
  width: 500,
  height: 650,
});

// Message handler - routes messages to services based on type
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log("Received message:", message);

  try {
    const serviceName = message.type as ServiceName;
    const service = serviceMap[serviceName];

    if (!service) {
      console.warn("Unknown message type:", message.type);
      const errorResponse: PluginResponse = {
        type: message.type,
        success: false,
        error: true,
        message: "Unknown message type: " + message.type,
        data: {},
        requestId: message.requestId,
      };
      figma.ui.postMessage(errorResponse);
      return;
    }

    const response = await service(message.data);
    // Include requestId in response so UI can match it to the pending promise
    figma.ui.postMessage({
      ...response,
      requestId: message.requestId,
    });
  } catch (error) {
    console.error("Error handling message:", error);
    const errorResponse: PluginResponse = {
      type: message.type,
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
      requestId: message.requestId,
    };
    figma.ui.postMessage(errorResponse);
  }
};
