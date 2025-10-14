import { resetAllMetadata } from "./services/resetMetadata";
import { loadPages, exportPage } from "./services/pageExport";
import { importPage } from "./services/pageImport";
import { performQuickCopy } from "./services/quickCopy";
import {
  loadThemeSettings,
  updateThemeSettings,
} from "./services/themeSettings";
import type { PluginMessage, PluginResponse } from "./types/messages";

// Plugin configuration
figma.showUI(__html__, {
  width: 500,
  height: 500,
});

// Load initial theme settings when plugin starts
loadThemeSettings().then((response) => {
  figma.ui.postMessage(response);
});

// Message handler - orchestrates different plugin operations
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log("Received message:", message);
  figma.clientStorage.keysAsync().then((keys) => {
    console.log("Keys:", keys);
  });

  try {
    switch (message.type) {
      case "get-current-user": {
        figma.ui.postMessage({
          type: "current-user",
          payload: figma.currentUser?.id,
        });
        break;
      }

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

      case "load-theme-settings": {
        const themeSettingsResponse = await loadThemeSettings();
        figma.ui.postMessage(themeSettingsResponse);
        break;
      }

      case "update-theme-settings": {
        const updateResponse = await updateThemeSettings(
          message.fileType,
          message.themeName,
        );
        figma.ui.postMessage(updateResponse);
        break;
      }

      case "store-auth-data": {
        try {
          await figma.clientStorage.setAsync(
            "accessToken",
            message.accessToken,
          );
          await figma.clientStorage.setAsync("platform", message.platform);
          figma.ui.postMessage({
            type: "auth-data-stored",
            success: true,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: "auth-data-stored",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to store auth data",
          });
        }
        break;
      }

      case "load-auth-data": {
        try {
          const accessToken = await figma.clientStorage.getAsync("accessToken");
          const platform = await figma.clientStorage.getAsync("platform");
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: true,
            accessToken: accessToken || undefined,
            platform: platform || undefined,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load auth data",
          });
        }
        break;
      }

      case "clear-auth-data": {
        try {
          await figma.clientStorage.deleteAsync("accessToken");
          await figma.clientStorage.deleteAsync("platform");
          figma.ui.postMessage({
            type: "auth-data-cleared",
            success: true,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: "auth-data-cleared",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to clear auth data",
          });
        }
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
