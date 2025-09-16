import type {
  ThemeSettingsLoadedResponse,
  ThemeSettingsUpdatedResponse,
} from "../types/messages";

// Plugin workspace and keys for theme settings
const PLUGIN_WORKSPACE = "recursica";
const FILE_TYPE_KEY = "file-type";
const THEME_NAME_KEY = "theme-name";

/**
 * Load theme settings from collections using getPluginSharedData
 */
export async function loadThemeSettings(): Promise<ThemeSettingsLoadedResponse> {
  try {
    let fileType = "";
    let themeName = "";

    // Get all variable collections
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();

    if (collections.length > 0) {
      // Use the first collection to get the shared plugin data
      const firstCollection = collections[0];

      // Get file type from collection metadata
      fileType =
        firstCollection.getSharedPluginData(PLUGIN_WORKSPACE, FILE_TYPE_KEY) ||
        "";

      // Get theme name from collection metadata
      themeName =
        firstCollection.getSharedPluginData(PLUGIN_WORKSPACE, THEME_NAME_KEY) ||
        "";
    }

    return {
      type: "theme-settings-loaded",
      success: true,
      fileType,
      themeName,
    };
  } catch (error) {
    console.error("Error loading theme settings:", error);
    return {
      type: "theme-settings-loaded",
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load theme settings",
    };
  }
}

/**
 * Update theme settings in collections using setSharedPluginData
 */
export async function updateThemeSettings(
  fileType: string,
  themeName: string,
): Promise<ThemeSettingsUpdatedResponse> {
  try {
    // Validate input
    if (!fileType) {
      return {
        type: "theme-settings-updated",
        success: false,
        error: "File type is required",
      };
    }

    if (fileType === "themes" && !themeName) {
      return {
        type: "theme-settings-updated",
        success: false,
        error: "Theme name is required when file type is 'themes'",
      };
    }

    // Get all variable collections
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();

    if (collections.length === 0) {
      return {
        type: "theme-settings-updated",
        success: false,
        error:
          "No variable collections found. Please create a variable collection first.",
      };
    }

    // Update all collections with the new settings
    collections.forEach((collection) => {
      // Set file type metadata
      collection.setSharedPluginData(PLUGIN_WORKSPACE, FILE_TYPE_KEY, fileType);

      // Set theme name metadata (only for theme collections)
      if (fileType === "themes") {
        collection.setSharedPluginData(
          PLUGIN_WORKSPACE,
          THEME_NAME_KEY,
          themeName,
        );
      } else {
        // Clear theme name for non-theme collections
        collection.setSharedPluginData(PLUGIN_WORKSPACE, THEME_NAME_KEY, "");
      }
    });

    // Show success notification
    figma.notify(
      `Theme settings updated: File type set to "${fileType}"${fileType === "themes" ? `, Theme name set to "${themeName}"` : ""}`,
    );

    return {
      type: "theme-settings-updated",
      success: true,
      message: "Theme settings updated successfully",
    };
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return {
      type: "theme-settings-updated",
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update theme settings",
    };
  }
}
