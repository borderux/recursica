import { useState, useEffect, useCallback } from "react";
import { usePlugin } from "../context/usePlugin";
import { useAuth } from "../context/useAuth";
import { GitHubService } from "../services/github/githubService";
import { useNavigate } from "react-router";

export default function PageManagement() {
  const { selectedRepo, accessToken } = usePlugin();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
  } | null>(null);

  // Page Management functions
  const loadPages = useCallback(async () => {
    parent.postMessage({ pluginMessage: { type: "load-pages" } }, "*");
  }, []);

  const importPage = useCallback(async (jsonData: string) => {
    parent.postMessage(
      { pluginMessage: { type: "import-page", jsonData } },
      "*",
    );
  }, []);

  // Load pages on component mount
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Listen for page export response
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      switch (pluginMessage.type) {
        case "page-export-response":
          setIsExporting(false);

          if (pluginMessage.success) {
            // Console.log the page data as requested
            setPageData({
              content: pluginMessage.jsonData,
              name: pluginMessage.pageName,
            });

            setStatus({
              type: "success",
              message: "Page data received successfully",
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

  const handlePushToGithub = async () => {
    if (!pageData) {
      setStatus({ type: "error", message: "No page data to push" });
      return;
    }

    if (!selectedRepo) {
      setStatus({ type: "error", message: "No repository selected" });
      return;
    }

    if (!accessToken) {
      setStatus({ type: "error", message: "No access token available" });
      return;
    }

    if (!user) {
      setStatus({ type: "error", message: "User not authenticated" });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsExporting(true);

    try {
      const githubService = new GitHubService(accessToken);

      // Parse the page data
      const pageDataParsed = JSON.parse(pageData.content);

      // Extract owner and repo from full_name (format: "owner/repo")
      const [owner, repo] = selectedRepo.full_name.split("/");

      // Get username from user data
      const username = user.name || user.id;

      // Push to GitHub with branch creation and PR
      const result = await githubService.pushPageToRepoWithBranch(
        owner,
        repo,
        pageDataParsed,
        pageData.name,
        username,
        selectedRepo.default_branch,
      );

      // Check if this is a new PR or existing one by looking at the creation date
      const prCreatedAt = new Date(result.pr.created_at);
      const now = new Date();
      const isNewPR = now.getTime() - prCreatedAt.getTime() < 60000; // Less than 1 minute old

      setStatus({
        type: "success",
        message: `Successfully pushed to GitHub! ${isNewPR ? "PR" : "Existing PR"} #${result.pr.number} ${isNewPR ? "created" : "updated"}: ${result.pr.html_url}`,
      });

      // Clear the page data after successful push
      setPageData(null);
    } catch (error) {
      console.error("Error pushing to GitHub:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to push to GitHub",
      });
    } finally {
      setIsExporting(false);
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

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Page Management</h1>
        <p>Please authenticate to use this feature</p>
        <button onClick={() => navigate("/auth")}>Authenticate</button>
      </div>
    );
  }

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
            disabled={!pageData || isExporting || !selectedRepo}
            onClick={handlePushToGithub}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor:
                !pageData || isExporting || !selectedRepo ? "#ccc" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor:
                !pageData || isExporting || !selectedRepo
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isExporting
              ? "Pushing to GitHub..."
              : `Push ${pageData?.name} to GitHub`}
          </button>
        )}
      </div>

      {/* Import Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Import Page</h3>
        <p>Upload a JSON file to import a page structure:</p>
        <input
          type="file"
          accept=".json"
          onChange={handleImportPage}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>
    </div>
  );
}
