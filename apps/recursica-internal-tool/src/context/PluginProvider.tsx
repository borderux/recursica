import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  PluginContext,
  type ThemeSettings,
  type PageInfo,
} from "./PluginContext";
import {
  type GitHubRepo,
  GitHubService,
} from "../services/github/githubService";
import { useAuth } from "./useAuth";

interface PageExportData {
  pageData: unknown;
  metadata: {
    exportedAt: string;
    figmaVersion: string;
    originalPageName: string;
    totalNodes: number;
    pluginVersion: string;
  };
}

interface PluginProviderProps {
  children: React.ReactNode;
}

export function PluginProvider({ children }: PluginProviderProps) {
  const { accessToken } = useAuth();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    fileType: "",
    themeName: "",
  });
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState({
    themeSettings: true,
    pages: false,
    operations: false,
    github: false,
  });
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

  // Message handler - centralized message processing
  useLayoutEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      console.log("New message from plugin sandbox:", pluginMessage);

      switch (pluginMessage.type) {
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
            setLoading((prev) => ({ ...prev, pages: false }));
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
  }, [loadThemeSettings]);

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

  // GitHub Integration functions
  const pushPageToGitHub = useCallback(
    async (pageIndex: number) => {
      if (!selectedRepo || !accessToken) {
        setError("No repository selected or not authenticated");
        return;
      }

      setLoading((prev) => ({ ...prev, github: true }));

      try {
        // First, get the page data from the plugin
        const pageData = await new Promise<PageExportData>(
          (resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
              const { pluginMessage } = event.data;
              if (pluginMessage?.type === "page-export-response") {
                window.removeEventListener("message", handleMessage);
                if (pluginMessage.success) {
                  resolve(JSON.parse(pluginMessage.jsonData));
                } else {
                  reject(new Error(pluginMessage.error));
                }
              }
            };

            window.addEventListener("message", handleMessage);
            parent.postMessage(
              { pluginMessage: { type: "export-page", pageIndex } },
              "*",
            );

            // Timeout after 30 seconds
            setTimeout(() => {
              window.removeEventListener("message", handleMessage);
              reject(new Error("Timeout waiting for page data"));
            }, 30000);
          },
        );

        // Push to GitHub
        const githubService = new GitHubService(accessToken);
        const [owner, repo] = selectedRepo.full_name.split("/");
        const pageName = pages[pageIndex]?.name || `page-${pageIndex}`;

        await githubService.pushPageToRepo(
          owner,
          repo,
          pageData.pageData,
          pageName,
        );

        setLoading((prev) => ({ ...prev, github: false }));
      } catch (err) {
        console.error("Error pushing to GitHub:", err);
        setError(
          err instanceof Error ? err.message : "Failed to push to GitHub",
        );
        setLoading((prev) => ({ ...prev, github: false }));
      }
    },
    [selectedRepo, accessToken, pages],
  );

  // Error handling
  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const contextValue = {
    themeSettings,
    updateThemeSettings,
    loadThemeSettings,
    pages,
    loadPages,
    exportPage,
    importPage,
    quickCopy,
    selectedRepo,
    setSelectedRepo,
    pushPageToGitHub,
    resetMetadata,
    loading,
    error,
    clearError,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
}
