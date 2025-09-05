import { resetAllMetadata } from "./services/resetMetadata";
import { loadPages, exportPage } from "./services/pageExport";
import { importPage } from "./services/pageImport";
import { performQuickCopy } from "./services/quickCopy";
import type { PluginMessage, PluginResponse } from "./types/messages";

// Plugin configuration
figma.showUI(__html__, {
  width: 500,
  height: 500,
});

// Message handler - orchestrates different plugin operations
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log("Received message:", message);

  try {
    switch (message.type) {
      case "reset-metadata": {
        const resetResponse = await resetAllMetadata();
        figma.ui.postMessage(resetResponse);
        break;
      }

      case "load-pages": {
        const pagesResponse = await loadPages();
        figma.ui.postMessage(pagesResponse);
        break;
      }

      case "export-page": {
        const exportResponse = await exportPage(message.pageIndex);
        figma.ui.postMessage(exportResponse);
        break;
      }

      case "import-page": {
        const importResponse = await importPage(message.jsonData);
        figma.ui.postMessage(importResponse);
        break;
      }

      case "quick-copy": {
        const quickCopyResponse = await performQuickCopy();
        figma.ui.postMessage(quickCopyResponse);
        break;
      }

      default: {
        console.warn("Unknown message type:", (message as any).type); // eslint-disable-line @typescript-eslint/no-explicit-any
        const errorResponse: PluginResponse = {
          type: "error",
          success: false,
          error: "Unknown message type: " + (message as any).type, // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        figma.ui.postMessage(errorResponse);
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
    const errorResponse: PluginResponse = {
      type: "error",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
    figma.ui.postMessage(errorResponse);
  }
};
