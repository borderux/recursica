import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";
import PluginPrompt from "../components/PluginPrompt";
import { callPlugin } from "../utils/callPlugin";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";
import { useAuth } from "../context/useAuth";
import { GitHubService } from "../services/github/githubService";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface PublishedFile {
  name: string;
  jsonContent: string;
  filename: string;
}

type PublishingStatus =
  | "exporting"
  | "uploading"
  | "creating-pr"
  | "complete"
  | "error";

export default function Publishing() {
  const [searchParams] = useSearchParams();
  const [publishedFiles, setPublishedFiles] = useState<PublishedFile[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishingStatus, setPublishingStatus] =
    useState<PublishingStatus>("exporting");
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const { accessToken } = useAuth();

  // Flatten the recursive ExportPageResponseData structure into a flat array
  const flattenPublishedPages = useCallback(
    (pageData: ExportPageResponseData): PublishedFile[] => {
      const files: PublishedFile[] = [
        {
          name: pageData.pageName,
          jsonContent: pageData.jsonData,
          filename: pageData.filename,
        },
      ];

      // Recursively add additional pages
      for (const additionalPage of pageData.additionalPages) {
        files.push(...flattenPublishedPages(additionalPage));
      }

      return files;
    },
    [],
  );

  // Start publishing when component mounts
  useEffect(() => {
    const pageIndexParam = searchParams.get("pageIndex");
    if (pageIndexParam === null) {
      setError("No page index provided");
      return;
    }

    const pageIndex = parseInt(pageIndexParam, 10);
    if (isNaN(pageIndex)) {
      setError("Invalid page index");
      return;
    }

    let cancelFn: ((errorOnCancel?: boolean) => void) | null = null;
    let isMounted = true;

    const startPublishing = async () => {
      try {
        setIsPublishing(true);
        setError(null);
        const { promise, cancel } = callPlugin("exportPage", { pageIndex });
        cancelFn = cancel;

        const response = await promise;

        // Check if component is still mounted before updating state
        if (!isMounted) {
          return;
        }

        if (response.success && response.data) {
          const exportData = response.data as unknown as ExportPageResponseData;
          const files = flattenPublishedPages(exportData);
          setPublishedFiles(files);

          // After successful export, publish to GitHub
          if (accessToken) {
            setPublishingStatus("uploading");
            try {
              const githubService = new GitHubService(accessToken);
              const result = await githubService.publishPageExports(
                RECURSICA_FIGMA_OWNER,
                RECURSICA_FIGMA_REPO,
                exportData,
                "main",
              );

              if (isMounted) {
                setPublishingStatus("complete");
                setPrUrl(result.pr.html_url);
                setIsPublishing(false);
              }
            } catch (publishError) {
              if (isMounted) {
                setPublishingStatus("error");
                setIsPublishing(false);
                setError(
                  publishError instanceof Error
                    ? publishError.message
                    : "Failed to publish to GitHub. Please try again.",
                );
              }
            }
          } else {
            if (isMounted) {
              setError("No access token available. Please authenticate first.");
              setPublishingStatus("error");
            }
          }
        } else {
          setError(
            response.message || "Failed to export page. Please try again.",
          );
          if (isMounted) {
            setPublishingStatus("error");
          }
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to export page",
          );
          setPublishingStatus("error");
        }
      } finally {
        if (isMounted) {
          // Only set isPublishing to false if we're not in the middle of uploading
          if (
            publishingStatus !== "uploading" &&
            publishingStatus !== "creating-pr"
          ) {
            setIsPublishing(false);
          }
        }
      }
    };

    startPublishing();

    // Cleanup: cancel the plugin call if component unmounts
    return () => {
      isMounted = false;
      if (cancelFn) {
        cancelFn(false); // Cancel without error since user navigated away
      }
    };
  }, [searchParams, flattenPublishedPages]);

  const handleDownload = (file: PublishedFile) => {
    try {
      const blob = new Blob([file.jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Publishing</h1>

        <DebugConsole showClearButton={false} />

        <PluginPrompt />

        <div>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
            Published Files:
          </h2>
          {isPublishing || publishingStatus === "uploading" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #e0e0e0",
                  borderTop: "2px solid #666",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>
                {publishingStatus === "exporting"
                  ? "Exporting page..."
                  : publishingStatus === "uploading"
                    ? "Uploading to GitHub..."
                    : publishingStatus === "creating-pr"
                      ? "Creating pull request..."
                      : "Waiting for publish to complete..."}
              </p>
            </div>
          ) : error ? (
            <p style={{ color: "#c62828", fontStyle: "italic" }}>{error}</p>
          ) : publishingStatus === "complete" && prUrl ? (
            <div
              style={{
                padding: "12px",
                marginBottom: "12px",
                backgroundColor: "#e8f5e9",
                border: "1px solid #4caf50",
                borderRadius: "4px",
              }}
            >
              <p style={{ margin: "0 0 8px 0", color: "#2e7d32" }}>
                ✓ Successfully published to GitHub!
              </p>
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                }}
              >
                View Pull Request
              </a>
            </div>
          ) : publishedFiles.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Waiting for publish to complete...
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {publishedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginBottom: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{file.name}</span>
                  <button
                    onClick={() => handleDownload(file)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "transparent",
                      color: "#d40d0d",
                      border: "1px solid #d40d0d",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#d40d0d";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#d40d0d";
                    }}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
