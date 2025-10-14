import { useState, useEffect } from "react";
import { usePlugin } from "../context/usePlugin";
import { useAuth } from "../context/useAuth";
import { RepoSelection } from "./RepoSelection";

export default function PageManagement() {
  const {
    pages,
    loadPages,
    exportPage,
    importPage,
    quickCopy,
    selectedRepo,
    setSelectedRepo,
    pushPageToGitHub,
    loading,
    error,
    clearError,
  } = usePlugin();

  const { isAuthenticated } = useAuth();

  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });

  // Load pages on component mount
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const handleExportPage = async () => {
    if (selectedPageIndex < 0) {
      setStatus({ type: "error", message: "Please select a page to export" });
      return;
    }

    setStatus({ type: "idle", message: "" });

    try {
      if (isAuthenticated && selectedRepo) {
        // Push to GitHub
        await pushPageToGitHub(selectedPageIndex);
        setStatus({
          type: "success",
          message: `Page pushed to GitHub repository: ${selectedRepo.full_name}`,
        });
      } else {
        // Fallback to local export
        await exportPage(selectedPageIndex);
        setStatus({
          type: "success",
          message: "Page exported successfully! Check your downloads.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Export failed",
      });
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
        setStatus({ type: "idle", message: "" });

        await importPage(jsonData);
        setStatus({
          type: "success",
          message: "Page imported successfully!",
        });
      } catch {
        setStatus({ type: "error", message: "Invalid JSON file" });
      }
    };
    reader.readAsText(file);
  };

  const handleQuickCopy = async () => {
    setStatus({ type: "idle", message: "" });

    try {
      await quickCopy();
      setStatus({
        type: "success",
        message: "Page copied successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Quick copy failed",
      });
    }
  };

  return (
    <div>
      <h1>Page Management</h1>
      <p>
        Export, import, and copy Figma pages with full structure preservation.
      </p>

      {/* GitHub Integration Section */}
      {isAuthenticated && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <h3>GitHub Integration</h3>
          {selectedRepo ? (
            <div>
              <p>
                Selected repository: <strong>{selectedRepo.full_name}</strong>
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Pages will be pushed to: <code>figma-exports/</code> folder
              </p>
              <button
                onClick={() => setSelectedRepo(null)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Change Repository
              </button>
            </div>
          ) : (
            <RepoSelection onRepoSelected={setSelectedRepo} />
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            border: "1px solid #ffcdd2",
          }}
        >
          <p>{error}</p>
          <button
            onClick={clearError}
            style={{
              marginTop: "5px",
              padding: "5px 10px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

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
          disabled={loading.operations || loading.pages}
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
          disabled={
            loading.operations ||
            loading.pages ||
            loading.github ||
            selectedPageIndex < 0
          }
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor:
              loading.operations || loading.github ? "#ccc" : "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              loading.operations || loading.github ? "not-allowed" : "pointer",
          }}
        >
          {loading.operations || loading.github
            ? "Processing..."
            : isAuthenticated && selectedRepo
              ? "Push to GitHub"
              : "Export Selected Page"}
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
          disabled={loading.operations}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>

      {/* Quick Copy Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Quick Copy</h3>
        <p>Copy current page and create side-by-side comparison:</p>
        <button
          onClick={handleQuickCopy}
          disabled={loading.operations}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading.operations ? "#ccc" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading.operations ? "not-allowed" : "pointer",
          }}
        >
          {loading.operations ? "Processing..." : "Quick Copy Current Page"}
        </button>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadPages}
        disabled={loading.pages}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: loading.pages ? "#ccc" : "#666",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading.pages ? "not-allowed" : "pointer",
        }}
      >
        {loading.pages ? "Loading..." : "Refresh Pages"}
      </button>
    </div>
  );
}
