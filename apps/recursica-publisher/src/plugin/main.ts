import { resetAllMetadata } from "./services/resetMetadata";
// Temporarily using new implementation
import { loadPages, exportPage } from "./services/pageExportNew";
import { importPage } from "./services/pageImportNew";
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

      case "load-reference-files": {
        try {
          const files =
            (await figma.clientStorage.getAsync("referenceFiles")) || [];
          figma.ui.postMessage({
            type: "reference-files-loaded",
            success: true,
            files,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: "reference-files-loaded",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load reference files",
          });
        }
        break;
      }

      case "add-reference-file": {
        try {
          const fileKey = figma.fileKey;
          if (!fileKey) {
            // File is not saved - provide helpful error message
            figma.notify(
              "Please save the file first before adding it as a reference. Go to File > Save or press Cmd/Ctrl+S",
              { error: true, timeout: 5000 },
            );
            figma.ui.postMessage({
              type: "reference-file-added",
              success: false,
              error:
                "This file is not saved. Please save the file first (File > Save or Cmd/Ctrl+S) before adding it as a reference.",
            });
            break;
          }

          const fileName = figma.root.name;
          const fileUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(fileName)}`;

          const files =
            (await figma.clientStorage.getAsync("referenceFiles")) || [];

          // Check if file already exists
          const existingIndex = files.findIndex(
            (f: { fileKey: string }) => f.fileKey === fileKey,
          );
          if (existingIndex >= 0) {
            const existingFile = files[existingIndex];
            figma.notify(
              `"${existingFile.fileName}" is already in your reference files list.`,
              { timeout: 3000 },
            );
            figma.ui.postMessage({
              type: "reference-file-added",
              success: false,
              error: "This file is already in your reference files list.",
            });
            break;
          }

          const newFile = {
            fileKey,
            fileName,
            fileUrl,
          };

          files.push(newFile);
          await figma.clientStorage.setAsync("referenceFiles", files);

          figma.notify(`Successfully added "${fileName}" to reference files`, {
            timeout: 3000,
          });
          figma.ui.postMessage({
            type: "reference-file-added",
            success: true,
            file: newFile,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to add reference file";
          figma.notify(errorMessage, { error: true, timeout: 5000 });
          figma.ui.postMessage({
            type: "reference-file-added",
            success: false,
            error: errorMessage,
          });
        }
        break;
      }

      case "add-reference-file-manual": {
        try {
          const { fileKey, fileName, fileUrl } = message;

          if (!fileKey || !fileKey.trim()) {
            figma.notify("File key is required", {
              error: true,
              timeout: 3000,
            });
            figma.ui.postMessage({
              type: "reference-file-added",
              success: false,
              error: "File key is required",
            });
            break;
          }

          const files =
            (await figma.clientStorage.getAsync("referenceFiles")) || [];

          // Check if file already exists
          const existingIndex = files.findIndex(
            (f: { fileKey: string }) => f.fileKey === fileKey,
          );
          if (existingIndex >= 0) {
            const existingFile = files[existingIndex];
            figma.notify(
              `"${existingFile.fileName}" is already in your reference files list.`,
              { timeout: 3000 },
            );
            figma.ui.postMessage({
              type: "reference-file-added",
              success: false,
              error: "This file is already in your reference files list.",
            });
            break;
          }

          const newFile = {
            fileKey: fileKey.trim(),
            fileName: fileName || "Unknown File",
            fileUrl,
          };

          files.push(newFile);
          await figma.clientStorage.setAsync("referenceFiles", files);

          figma.notify(
            `Successfully added "${newFile.fileName}" to reference files`,
            {
              timeout: 3000,
            },
          );
          figma.ui.postMessage({
            type: "reference-file-added",
            success: true,
            file: newFile,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to add reference file";
          figma.notify(errorMessage, { error: true, timeout: 5000 });
          figma.ui.postMessage({
            type: "reference-file-added",
            success: false,
            error: errorMessage,
          });
        }
        break;
      }

      case "remove-reference-file": {
        try {
          const files =
            (await figma.clientStorage.getAsync("referenceFiles")) || [];
          const filtered = files.filter(
            (f: { fileKey: string }) => f.fileKey !== message.fileKey,
          );
          await figma.clientStorage.setAsync("referenceFiles", filtered);
          figma.ui.postMessage({
            type: "reference-file-removed",
            success: true,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: "reference-file-removed",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove reference file",
          });
        }
        break;
      }

      case "open-external-url": {
        try {
          const url = message.url;
          console.log("Opening external URL:", url);

          // Ensure URL is properly formatted
          if (!url || typeof url !== "string") {
            throw new Error("Invalid URL provided");
          }

          // Decode URL if it's encoded (handle %20, etc.)
          const decodedUrl = decodeURIComponent(url);
          console.log("Decoded URL:", decodedUrl);

          await figma.openExternal(decodedUrl);
          console.log("URL opened successfully");

          figma.notify("Opening file in browser...", { timeout: 2000 });
        } catch (error) {
          console.error("Error opening URL:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          figma.notify(`Failed to open URL: ${errorMessage}`, {
            error: true,
            timeout: 5000,
          });
          figma.ui.postMessage({
            type: "error",
            success: false,
            error: `Failed to open URL: ${errorMessage}`,
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
