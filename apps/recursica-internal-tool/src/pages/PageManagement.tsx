import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { GitHubService } from "../services/github/githubService";
import { useNavigate } from "react-router";

export default function PageManagement() {
  const navigate = useNavigate();
  const { isAuthenticated, user, selectedRepo, accessToken } = useAuth();

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
  const [remoteFiles, setRemoteFiles] = useState<string[]>([]);
  const [selectedRemoteFile, setSelectedRemoteFile] = useState<string>("");
  const [isFetchingFiles, setIsFetchingFiles] = useState<boolean>(false);
  const [isImportingRemote, setIsImportingRemote] = useState<boolean>(false);

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

      setStatus({
        type: "success",
        message: `Successfully pushed to GitHub! PR #${result.pr.number}: ${result.pr.html_url}`,
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

  const handleFetchRemoteFiles = async () => {
    if (!selectedRepo) {
      setStatus({ type: "error", message: "No repository selected" });
      return;
    }

    if (!accessToken) {
      setStatus({ type: "error", message: "No access token available" });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsFetchingFiles(true);

    try {
      const githubService = new GitHubService(accessToken);
      const [owner, repo] = selectedRepo.full_name.split("/");

      // Fetch contents of the figma-exports folder
      const contents = await githubService.getRepoContents(
        owner,
        repo,
        "figma-exports",
      );

      if (Array.isArray(contents)) {
        // Filter for JSON files only
        const jsonFiles = contents
          .filter((file: { name: string }) => file.name.endsWith(".json"))
          .map((file: { name: string }) => file.name);

        setRemoteFiles(jsonFiles);
        setStatus({
          type: "success",
          message: `Found ${jsonFiles.length} JSON files in figma-exports folder`,
        });
      } else {
        setStatus({
          type: "error",
          message: "figma-exports folder not found or is not a directory",
        });
      }
    } catch (error) {
      console.error("Error fetching remote files:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch remote files",
      });
    } finally {
      setIsFetchingFiles(false);
    }
  };

  const handleImportRemoteFile = async () => {
    if (!selectedRemoteFile) {
      setStatus({ type: "error", message: "Please select a file to import" });
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

    setStatus({ type: "idle", message: "" });
    setIsImportingRemote(true);

    try {
      const githubService = new GitHubService(accessToken);
      const [owner, repo] = selectedRepo.full_name.split("/");

      // Fetch the specific file content
      const fileContent = await githubService.getRepoContents(
        owner,
        repo,
        `figma-exports/${selectedRemoteFile}`,
      );

      if (typeof fileContent === "object" && "content" in fileContent) {
        // Decode base64 content
        const jsonData = atob(fileContent.content);
        const parsedData = JSON.parse(jsonData);

        await importPage(parsedData);
        setStatus({
          type: "success",
          message: `Successfully imported ${selectedRemoteFile}`,
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to fetch file content",
        });
      }
    } catch (error) {
      console.error("Error importing remote file:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to import remote file",
      });
    } finally {
      setIsImportingRemote(false);
    }
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

      {/* Remote File Import */}
      <div>
        <h4>From Remote Repository</h4>
        <p>
          Fetch and import files from the figma-exports folder in your
          repository:
        </p>

        <button
          onClick={handleFetchRemoteFiles}
          disabled={isFetchingFiles || !selectedRepo}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor:
              isFetchingFiles || !selectedRepo ? "#ccc" : "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              isFetchingFiles || !selectedRepo ? "not-allowed" : "pointer",
          }}
        >
          {isFetchingFiles ? "Fetching files..." : "Fetch Remote Files"}
        </button>

        {remoteFiles.length > 0 && (
          <div>
            <select
              value={selectedRemoteFile}
              onChange={(e) => setSelectedRemoteFile(e.target.value)}
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            >
              <option value="">Select a file...</option>
              {remoteFiles.map((filename) => (
                <option key={filename} value={filename}>
                  {filename}
                </option>
              ))}
            </select>

            <button
              onClick={handleImportRemoteFile}
              disabled={!selectedRemoteFile || isImportingRemote}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor:
                  !selectedRemoteFile || isImportingRemote ? "#ccc" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  !selectedRemoteFile || isImportingRemote
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isImportingRemote
                ? "Importing..."
                : `Import ${selectedRemoteFile}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
