import { useState, useEffect, useCallback } from "react";

interface Page {
  name: string;
  index: number;
}

export default function PageManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });

  const loadPages = useCallback(async () => {
    setIsLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      parent.postMessage(
        {
          pluginMessage: {
            type: "load-pages",
          },
        },
        "*",
      );

      // Listen for response
      const handleMessage = (event: MessageEvent) => {
        if (event.data.pluginMessage?.type === "pages-loaded") {
          if (event.data.pluginMessage.success) {
            setPages(event.data.pluginMessage.pages || []);
            setStatus({
              type: "success",
              message: `Loaded ${event.data.pluginMessage.pages?.length || 0} pages`,
            });
          } else {
            setStatus({
              type: "error",
              message: event.data.pluginMessage.error || "Failed to load pages",
            });
          }
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (isLoading) {
          setStatus({
            type: "error",
            message: "Load pages operation timed out",
          });
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      }, 10000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to load pages",
      });
      setIsLoading(false);
    }
  }, [isLoading]);

  // Load pages on component mount
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const handleExportPage = async () => {
    if (selectedPageIndex < 0) {
      setStatus({ type: "error", message: "Please select a page to export" });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      parent.postMessage(
        {
          pluginMessage: {
            type: "export-page",
            pageIndex: selectedPageIndex,
          },
        },
        "*",
      );

      // Listen for response
      const handleMessage = (event: MessageEvent) => {
        if (event.data.pluginMessage?.type === "page-export-response") {
          if (event.data.pluginMessage.success) {
            // Download the JSON file
            const blob = new Blob([event.data.pluginMessage.jsonData || ""], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = event.data.pluginMessage.filename || "export.json";
            a.click();
            URL.revokeObjectURL(url);

            setStatus({
              type: "success",
              message: `Successfully exported "${event.data.pluginMessage.pageName}"`,
            });
          } else {
            setStatus({
              type: "error",
              message: event.data.pluginMessage.error || "Export failed",
            });
          }
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (isLoading) {
          setStatus({ type: "error", message: "Export operation timed out" });
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      }, 30000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Export failed",
      });
      setIsLoading(false);
    }
  };

  const handleImportPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/json") {
      setStatus({ type: "error", message: "Please select a valid JSON file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        setIsLoading(true);
        setStatus({ type: "idle", message: "" });

        parent.postMessage(
          {
            pluginMessage: {
              type: "import-page",
              jsonData: jsonData,
            },
          },
          "*",
        );

        // Listen for response
        const handleMessage = (event: MessageEvent) => {
          if (event.data.pluginMessage?.type === "page-import-response") {
            if (event.data.pluginMessage.success) {
              setStatus({
                type: "success",
                message: `Successfully imported "${event.data.pluginMessage.pageName}" with ${event.data.pluginMessage.totalNodes || 0} nodes`,
              });
              // Reload pages to show the new imported page
              loadPages();
            } else {
              setStatus({
                type: "error",
                message: event.data.pluginMessage.error || "Import failed",
              });
            }
            setIsLoading(false);
            window.removeEventListener("message", handleMessage);
          }
        };

        window.addEventListener("message", handleMessage);

        // Timeout after 30 seconds
        setTimeout(() => {
          if (isLoading) {
            setStatus({ type: "error", message: "Import operation timed out" });
            setIsLoading(false);
            window.removeEventListener("message", handleMessage);
          }
        }, 30000);
      } catch {
        setStatus({ type: "error", message: "Invalid JSON file" });
      }
    };
    reader.readAsText(file);
  };

  const handleQuickCopy = async () => {
    setIsLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      parent.postMessage(
        {
          pluginMessage: {
            type: "quick-copy",
          },
        },
        "*",
      );

      // Listen for response
      const handleMessage = (event: MessageEvent) => {
        if (event.data.pluginMessage?.type === "quick-copy-response") {
          if (event.data.pluginMessage.success) {
            setStatus({
              type: "success",
              message: `Successfully copied "${event.data.pluginMessage.pageName}" to "${event.data.pluginMessage.newPageName}" with ${event.data.pluginMessage.totalNodes || 0} nodes`,
            });
            // Reload pages to show the new copied page
            loadPages();
          } else {
            setStatus({
              type: "error",
              message: event.data.pluginMessage.error || "Quick copy failed",
            });
          }
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (isLoading) {
          setStatus({
            type: "error",
            message: "Quick copy operation timed out",
          });
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      }, 30000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Quick copy failed",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Page Management</h1>
      <p>
        Export, import, and copy Figma pages with full structure preservation.
      </p>

      {/* Status Message */}
      {status.type !== "idle" && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: status.type === "success" ? "#e8f5e8" : "#ffebee",
            border: `1px solid ${status.type === "success" ? "#4caf50" : "#f44336"}`,
            borderRadius: "4px",
            color: status.type === "success" ? "#2e7d32" : "#c62828",
          }}
        >
          {status.type === "success" ? "✅" : "❌"} {status.message}
        </div>
      )}

      {/* Export Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Export Page</h3>
        <p>Select a page to export its structure to JSON:</p>
        <select
          value={selectedPageIndex}
          onChange={(e) => setSelectedPageIndex(parseInt(e.target.value))}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          disabled={isLoading}
        >
          <option value={-1}>Select a page...</option>
          {pages.map((page, index) => (
            <option key={index} value={page.index}>
              {page.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleExportPage}
          disabled={isLoading || selectedPageIndex < 0}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Export Selected Page"}
        </button>
      </div>

      {/* Import Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Import Page</h3>
        <p>Upload a JSON file to import a page structure:</p>
        <input
          type="file"
          accept=".json"
          onChange={handleImportPage}
          disabled={isLoading}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>

      {/* Quick Copy Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Quick Copy</h3>
        <p>Copy current page and create side-by-side comparison:</p>
        <button
          onClick={handleQuickCopy}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Quick Copy Current Page"}
        </button>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadPages}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: isLoading ? "#ccc" : "#666",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Loading..." : "Refresh Pages"}
      </button>
    </div>
  );
}
