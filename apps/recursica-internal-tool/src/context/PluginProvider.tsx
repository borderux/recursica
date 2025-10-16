import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { PluginContext, type ThemeSettings } from "./PluginContext";

interface PluginProviderProps {
  children: React.ReactNode;
}

export function PluginProvider({ children }: PluginProviderProps) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    fileType: "",
    themeName: "",
  });
  const [loading, setLoading] = useState({
    themeSettings: true,
    pages: false,
    operations: false,
    github: false,
    currentUser: false,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  console.log("themeSettings", themeSettings);

  // Theme Settings functions
  const loadThemeSettings = useCallback(async () => {
    setLoading((prev) => ({ ...prev, themeSettings: true }));
    parent.postMessage({ pluginMessage: { type: "load-theme-settings" } }, "*");
  }, []);

  const loadCurrentUser = useCallback(async () => {
    setLoading((prev) => ({ ...prev, currentUser: true }));
    parent.postMessage({ pluginMessage: { type: "get-current-user" } }, "*");
  }, []);

  const loadAuthData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, github: true }));
    parent.postMessage({ pluginMessage: { type: "load-auth-data" } }, "*");
  }, []);

  // Message handler - centralized message processing
  useLayoutEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      console.log("New message from plugin sandbox:", pluginMessage);

      switch (pluginMessage.type) {
        case "current-user": {
          setUserId(pluginMessage.payload || null);
          setLoading((prev) => ({ ...prev, currentUser: false }));
          break;
        }

        case "theme-settings-loaded":
          if (pluginMessage.success) {
            setThemeSettings({
              fileType: pluginMessage.fileType || "",
              themeName: pluginMessage.themeName || "",
            });
            setLoading((prev) => ({ ...prev, themeSettings: false }));
          } else {
            setError(pluginMessage.error || "Failed to load theme settings");
            setLoading((prev) => ({ ...prev, themeSettings: false }));
          }
          break;

        case "theme-settings-updated":
          if (pluginMessage.success) {
            console.log(
              "Theme settings updated successfully:",
              pluginMessage.message,
            );
            setLoading((prev) => ({ ...prev, operations: false }));
            // Reload theme settings to get the updated values
            loadThemeSettings();
          } else {
            setError(pluginMessage.error || "Failed to update theme settings");
            setLoading((prev) => ({ ...prev, operations: false }));
          }
          break;

        case "reset-metadata-response":
          if (pluginMessage.success) {
            console.log("Metadata reset successfully");
            setLoading((prev) => ({ ...prev, operations: false }));
          } else {
            setError(pluginMessage.error || "Failed to reset metadata");
            setLoading((prev) => ({ ...prev, operations: false }));
          }
          break;

        case "error":
          setError(pluginMessage.error || "An unknown error occurred");
          setLoading((prev) => ({ ...prev, operations: false }));
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [loadThemeSettings]);

  const updateThemeSettings = useCallback(
    async (fileType: string, themeName: string) => {
      setLoading((prev) => ({ ...prev, operations: true }));
      parent.postMessage(
        {
          pluginMessage: {
            type: "update-theme-settings",
            fileType,
            themeName,
          },
        },
        "*",
      );
    },
    [],
  );

  // Load initial data
  useEffect(() => {
    loadThemeSettings();
    loadAuthData();
    loadCurrentUser();
  }, [loadThemeSettings, loadCurrentUser, loadAuthData]);

  // Reset Metadata function
  const resetMetadata = useCallback(async () => {
    setLoading((prev) => ({ ...prev, operations: true }));
    parent.postMessage({ pluginMessage: { type: "reset-metadata" } }, "*");
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const contextValue = {
    themeSettings,
    updateThemeSettings,
    loadThemeSettings,
    resetMetadata,
    loading,
    error,
    userId,
    clearError,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
}
