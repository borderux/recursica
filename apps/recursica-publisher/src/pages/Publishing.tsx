import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";
import PluginPrompt from "../components/PluginPrompt";
import { callPlugin } from "../utils/callPlugin";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";

interface PublishedFile {
  name: string;
  jsonContent: string;
  filename: string;
}

export default function Publishing() {
  const [searchParams] = useSearchParams();
  const [publishedFiles, setPublishedFiles] = useState<PublishedFile[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        } else {
          setError(
            response.message || "Failed to export page. Please try again.",
          );
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to export page",
          );
        }
      } finally {
        if (isMounted) {
          setIsPublishing(false);
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
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Publishing</h1>

        <DebugConsole />

        <PluginPrompt />

        <div>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
            Published Files:
          </h2>
          {isPublishing ? (
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
                Waiting for publish to complete...
              </p>
            </div>
          ) : error ? (
            <p style={{ color: "#c62828", fontStyle: "italic" }}>{error}</p>
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
