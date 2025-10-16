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
  height: 650,
});

// Load initial theme settings when plugin starts
loadThemeSettings().then((response) => {
  figma.ui.postMessage(response);
});

// Message handler - orchestrates different plugin operations
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log("Received message:", message);

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
        await figma.clientStorage.setAsync("accessToken", message.accessToken);
        if (message.selectedRepo) {
          await figma.clientStorage.setAsync(
            "selectedRepo",
            message.selectedRepo,
          );
        }
        figma.ui.postMessage({
          type: "auth-data-stored",
          success: true,
        });
        break;
      }

      case "load-auth-data": {
        try {
          const accessToken = await figma.clientStorage.getAsync("accessToken");
          const selectedRepo =
            await figma.clientStorage.getAsync("selectedRepo");
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: true,
            accessToken: accessToken || undefined,
            selectedRepo: selectedRepo || undefined,
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
        await figma.clientStorage.deleteAsync("accessToken");
        await figma.clientStorage.deleteAsync("selectedRepo");
        figma.ui.postMessage({
          type: "auth-data-cleared",
          success: true,
        });
        break;
      }

      case "store-selected-repo": {
        await figma.clientStorage.setAsync(
          "selectedRepo",
          message.selectedRepo,
        );
        figma.ui.postMessage({
          type: "selected-repo-stored",
          success: true,
        });
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
