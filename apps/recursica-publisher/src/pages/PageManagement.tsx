import { useState, useEffect, useCallback } from "react";

export default function PageManagement() {
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);
  const [pages, setPages] = useState<{ name: string; index: number }[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [pageData, setPageData] = useState<{
    content: string;
    name: string;
    filename: string;
  } | null>(null);

  const importPage = useCallback(async (jsonData: string) => {
    parent.postMessage(
      { pluginMessage: { type: "import-page", jsonData } },
      "*",
    );
  }, []);

  // Load pages on component mount
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-pages" } }, "*");
  }, []);

  // Listen for page export response
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      switch (pluginMessage.type) {
        case "page-export-response":
          setIsExporting(false);

          if (pluginMessage.success) {
            setPageData({
              content: pluginMessage.jsonData,
              name: pluginMessage.pageName,
              filename:
                pluginMessage.filename ||
                `${pluginMessage.pageName}_export.json`,
            });

            setStatus({
              type: "success",
              message:
                "Page data exported successfully. Click 'Download JSON' to save.",
            });
          } else {
            setStatus({
              type: "error",
              message: pluginMessage.error || "Export failed",
            });
          }
          break;

        case "page-import-response":
          if (pluginMessage.success) {
            console.log("Page imported successfully:", pluginMessage.pageName);
            // Reload pages after import
            setStatus({
              type: "success",
              message: "Page imported successfully",
            });
          } else {
            setStatus({
              type: "error",
              message: pluginMessage.error || "Failed to import page",
            });
          }
          break;

        case "pages-loaded":
          if (pluginMessage.success) {
            setPages(pluginMessage.pages || []);
          } else {
            setStatus({
              type: "error",
              message: pluginMessage.error || "Failed to load pages",
            });
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleExportPage = async () => {
    if (selectedPageIndex < 0) {
      setStatus({ type: "error", message: "Please select a page to export" });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsExporting(true);

    parent.postMessage(
      {
        pluginMessage: { type: "export-page", pageIndex: selectedPageIndex },
      },
      "*",
    );
  };

  const handleDownloadJSON = () => {
    if (!pageData) {
      setStatus({ type: "error", message: "No page data to download" });
      return;
    }

    try {
      // Create a blob from the JSON string
      const blob = new Blob([pageData.content], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = pageData.filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message: `Successfully downloaded ${pageData.filename}`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to download file",
      });
    }
  };

  const handleImportLocalFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith(".json")) {
        setStatus({
          type: "error",
          message: "Please select a JSON file",
        });
        return;
      }

      try {
        const text = await file.text();
        const parsedData = JSON.parse(text);
        await importPage(parsedData);
        setStatus({
          type: "success",
          message: `Successfully imported ${file.name}`,
        });
      } catch (error) {
        console.error("Error importing file:", error);
        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to import file. Please check the file format.",
        });
      }

      // Reset input so same file can be selected again
      event.target.value = "";
    },
    [importPage],
  );

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
          disabled={selectedPageIndex < 0 || isExporting}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isExporting ? "#ccc" : "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isExporting ? "not-allowed" : "pointer",
          }}
        >
          Get page data
        </button>
        {pageData && (
          <button
            onClick={handleDownloadJSON}
            disabled={!pageData || isExporting}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              backgroundColor: !pageData || isExporting ? "#ccc" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: !pageData || isExporting ? "not-allowed" : "pointer",
            }}
          >
            {isExporting ? "Exporting..." : `Download ${pageData.filename}`}
          </button>
        )}
      </div>

      {/* Local File Import */}
      <div style={{ marginTop: "20px" }}>
        <h3>Import Page</h3>
        <p>Import a JSON file from your local filesystem:</p>
        <input
          type="file"
          accept=".json"
          onChange={handleImportLocalFile}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
}
