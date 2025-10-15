import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  PluginContext,
  type ThemeSettings,
  type PageInfo,
} from "./PluginContext";
import { type GitHubRepo } from "../services/github/githubService";

interface PluginProviderProps {
  children: React.ReactNode;
}

export function PluginProvider({ children }: PluginProviderProps) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    fileType: "",
    themeName: "",
  });
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
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

  // Page Management functions
  const loadPages = useCallback(async () => {
    setLoading((prev) => ({ ...prev, pages: true }));
    parent.postMessage({ pluginMessage: { type: "load-pages" } }, "*");
  }, []);

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

        case "auth-data-loaded":
          if (pluginMessage.success) {
            setAccessToken(pluginMessage.accessToken || null);
            setSelectedRepo(pluginMessage.selectedRepo || null);
            setLoading((prev) => ({ ...prev, github: false }));
          } else {
            setError(pluginMessage.error || "Failed to load auth data");
            setLoading((prev) => ({ ...prev, github: false }));
          }
          break;

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

        case "pages-loaded":
          if (pluginMessage.success) {
            setPages(pluginMessage.pages || []);
            setLoading((prev) => ({
              ...prev,
              pages: false,
            }));
          } else {
            setError(pluginMessage.error || "Failed to load pages");
            setLoading((prev) => ({ ...prev, pages: false }));
          }
          break;

        case "page-export-response":
          if (pluginMessage.success) {
            console.log("Page exported successfully:", pluginMessage.filename);
            setLoading((prev) => ({ ...prev, operations: false }));
          } else {
            setError(pluginMessage.error || "Failed to export page");
            setLoading((prev) => ({ ...prev, operations: false }));
          }
          break;

        case "page-import-response":
          if (pluginMessage.success) {
            console.log("Page imported successfully:", pluginMessage.pageName);
            setLoading((prev) => ({ ...prev, operations: false }));
            // Reload pages after import
            loadPages();
          } else {
            setError(pluginMessage.error || "Failed to import page");
            setLoading((prev) => ({ ...prev, operations: false }));
          }
          break;

        case "quick-copy-response":
          if (pluginMessage.success) {
            console.log("Quick copy completed:", pluginMessage.newPageName);
            setLoading((prev) => ({ ...prev, operations: false }));
            // Reload pages after quick copy
            loadPages();
          } else {
            setError(pluginMessage.error || "Failed to perform quick copy");
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
  }, [loadPages, loadThemeSettings]);

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

  const exportPage = useCallback(async (pageIndex: number) => {
    setLoading((prev) => ({ ...prev, operations: true }));
    parent.postMessage(
      { pluginMessage: { type: "export-page", pageIndex } },
      "*",
    );
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const importPage = useCallback(async (jsonData: any) => {
    setLoading((prev) => ({ ...prev, operations: true }));
    parent.postMessage(
      { pluginMessage: { type: "import-page", jsonData } },
      "*",
    );
  }, []);

  const quickCopy = useCallback(async () => {
    setLoading((prev) => ({ ...prev, operations: true }));
    parent.postMessage({ pluginMessage: { type: "quick-copy" } }, "*");
  }, []);

  // Reset Metadata function
  const resetMetadata = useCallback(async () => {
    setLoading((prev) => ({ ...prev, operations: true }));
    parent.postMessage({ pluginMessage: { type: "reset-metadata" } }, "*");
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const saveAccessToken = useCallback((accessToken: string) => {
    // Save to storage
    parent.postMessage(
      {
        pluginMessage: {
          type: "store-auth-data",
          accessToken,
        },
        pluginId: "*",
      },
      "*",
    );
    setAccessToken(accessToken);
  }, []);

  const deleteAccessToken = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: "delete-auth-data" } }, "*");
    setAccessToken(null);
  }, []);

  const saveSelectedRepo = useCallback(
    (repo: GitHubRepo) => {
      setSelectedRepo(repo);
      parent.postMessage(
        {
          pluginMessage: {
            type: "store-auth-data",
            selectedRepo: repo,
            accessToken,
          },
        },
        "*",
      );
    },
    [accessToken],
  );

  const contextValue = {
    themeSettings,
    updateThemeSettings,
    loadThemeSettings,
    pages,
    loadPages,
    exportPage,
    importPage,
    quickCopy,
    accessToken,
    saveAccessToken,
    deleteAccessToken,
    selectedRepo,
    saveSelectedRepo,
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
