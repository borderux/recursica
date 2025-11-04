import { useEffect, useState } from "react";

interface ReferenceFile {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  lastIndexed?: string;
}

export default function ReferenceFiles() {
  const [files, setFiles] = useState<ReferenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualFileKey, setManualFileKey] = useState("");
  const [manualFileName, setManualFileName] = useState("");

  // Load files on mount
  useEffect(() => {
    parent.postMessage(
      { pluginMessage: { type: "load-reference-files" } },
      "*",
    );
  }, []);

  // Listen for messages from plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { pluginMessage } = event.data;
      if (!pluginMessage) return;

      switch (pluginMessage.type) {
        case "reference-files-loaded":
          setLoading(false);
          if (pluginMessage.success) {
            // Normalize URLs to fix any incorrectly stored URLs
            const normalizedFiles = (pluginMessage.files || []).map(
              (file: ReferenceFile) => {
                let normalizedUrl = file.fileUrl;

                // Fix URLs that might have been incorrectly constructed
                if (
                  normalizedUrl.includes("figma.com/file/https://") ||
                  normalizedUrl.includes("figma.com/file/http://")
                ) {
                  // Extract the actual URL part
                  const urlMatch = normalizedUrl.match(/(https?:\/\/[^\s]+)/);
                  if (urlMatch) {
                    normalizedUrl = urlMatch[1];
                    // If it's a /design/ URL, convert to /file/ format
                    if (normalizedUrl.includes("/design/")) {
                      const designMatch = normalizedUrl.match(
                        /figma\.com\/design\/([a-zA-Z0-9]+)/,
                      );
                      if (designMatch) {
                        const fileKey = designMatch[1];
                        normalizedUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(file.fileName || "Unknown File")}`;
                      }
                    }
                  }
                } else if (normalizedUrl.includes("/design/")) {
                  // Convert /design/ URLs to /file/ format
                  const designMatch = normalizedUrl.match(
                    /figma\.com\/design\/([a-zA-Z0-9]+)/,
                  );
                  if (designMatch) {
                    const fileKey = designMatch[1];
                    normalizedUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(file.fileName || "Unknown File")}`;
                  }
                }

                return {
                  ...file,
                  fileUrl: normalizedUrl,
                };
              },
            );
            setFiles(normalizedFiles);
            setError(null);
          } else {
            setError(pluginMessage.error || "Failed to load reference files");
          }
          break;

        case "reference-file-added":
          if (pluginMessage.success) {
            setSuccessMessage(
              `Successfully added "${pluginMessage.file?.fileName}" to reference files`,
            );
            setError(null);
            setShowManualEntry(false);
            setManualFileKey("");
            setManualFileName("");
            // Reload files
            parent.postMessage(
              { pluginMessage: { type: "load-reference-files" } },
              "*",
            );
          } else {
            setError(pluginMessage.error || "Failed to add reference file");
            setSuccessMessage(null);
          }
          break;

        case "reference-file-removed":
          if (pluginMessage.success) {
            setSuccessMessage(`Successfully removed file`);
            setError(null);
            // Reload files
            parent.postMessage(
              { pluginMessage: { type: "load-reference-files" } },
              "*",
            );
          } else {
            setError(pluginMessage.error || "Failed to remove reference file");
            setSuccessMessage(null);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleAddCurrentFile = () => {
    setError(null);
    setSuccessMessage(null);
    parent.postMessage({ pluginMessage: { type: "add-reference-file" } }, "*");
  };

  const handleAddManualFile = () => {
    if (!manualFileKey.trim()) {
      setError("Please enter a file key or URL");
      return;
    }

    let fileKey = manualFileKey.trim();
    let fileUrl = "";
    const fileName = manualFileName.trim() || "Unknown File";

    // Check if it's already a full URL
    if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
      // Extract file key from URL (handles both /file/ and /design/ formats)
      const fileMatch = fileKey.match(
        /figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/,
      );
      if (fileMatch) {
        const extractedKey = fileMatch[1];

        // If it's already a /file/ URL, use it as-is (but clean it up)
        if (fileKey.includes("/file/")) {
          // Reconstruct clean /file/ URL: /file/{key}/{name}
          fileUrl = `https://www.figma.com/file/${extractedKey}/${encodeURIComponent(fileName)}`;
          fileKey = extractedKey;
        } else if (fileKey.includes("/design/")) {
          // Convert /design/ URL to /file/ URL format
          fileUrl = `https://www.figma.com/file/${extractedKey}/${encodeURIComponent(fileName)}`;
          fileKey = extractedKey;
        } else {
          setError(
            "Could not determine URL format. Please enter a valid Figma file URL or file key.",
          );
          return;
        }
      } else {
        setError(
          "Could not extract file key from URL. Please enter a valid Figma file URL or file key.",
        );
        return;
      }
    } else {
      // It's just a file key, construct the URL
      fileUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(fileName)}`;
    }

    setError(null);
    setSuccessMessage(null);
    parent.postMessage(
      {
        pluginMessage: {
          type: "add-reference-file-manual",
          fileKey,
          fileName,
          fileUrl,
        },
      },
      "*",
    );
  };

  const handleRemoveFile = (fileKey: string, fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove "${fileName}" from reference files?`,
      )
    ) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    parent.postMessage(
      {
        pluginMessage: {
          type: "remove-reference-file",
          fileKey,
        },
      },
      "*",
    );
  };

  const handleOpenFile = (fileUrl: string) => {
    // Normalize the URL before opening to fix any issues
    let normalizedUrl = fileUrl;

    // Fix URLs that might have been incorrectly constructed
    if (
      normalizedUrl.includes("figma.com/file/https://") ||
      normalizedUrl.includes("figma.com/file/http://")
    ) {
      // Extract the actual URL part
      const urlMatch = normalizedUrl.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        normalizedUrl = urlMatch[1];
        // If it's a /design/ URL, convert to /file/ format
        if (normalizedUrl.includes("/design/")) {
          const designMatch = normalizedUrl.match(
            /figma\.com\/design\/([a-zA-Z0-9]+)/,
          );
          if (designMatch) {
            const fileKey = designMatch[1];
            // Find the file name from the stored file
            const file = files.find(
              (f) => f.fileUrl === fileUrl || f.fileKey === fileKey,
            );
            normalizedUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(file?.fileName || "Unknown File")}`;
          }
        }
      }
    }

    console.log("Opening normalized URL:", normalizedUrl);

    // Send message to plugin to open the URL
    parent.postMessage(
      {
        pluginMessage: {
          type: "open-external-url",
          url: normalizedUrl,
        },
      },
      "*",
    );
  };

  return (
    <div>
      <h1>Reference Files</h1>
      <p>
        Manage reference files (like icon libraries) that you want to index or
        reference from other files.
      </p>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c33",
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#efe",
            border: "1px solid #cfc",
            borderRadius: "4px",
            color: "#3c3",
          }}
        >
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={handleAddCurrentFile}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Current File as Reference
          </button>
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            style={{
              padding: "8px 16px",
              backgroundColor: showManualEntry ? "#666" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showManualEntry ? "Cancel" : "Add File Manually"}
          </button>
        </div>

        {showManualEntry && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "14px" }}>
              For library files or files without a file key, you can manually
              add them by entering the file key or URL.
            </p>
            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                File Key or URL:
              </label>
              <input
                type="text"
                value={manualFileKey}
                onChange={(e) => setManualFileKey(e.target.value)}
                placeholder="e.g., abc123xyz or https://www.figma.com/file/abc123xyz/..."
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                File Name (optional):
              </label>
              <input
                type="text"
                value={manualFileName}
                onChange={(e) => setManualFileName(e.target.value)}
                placeholder="e.g., Icons Library"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
            </div>
            <button
              onClick={handleAddManualFile}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add File
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading reference files...</p>
      ) : files.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666" }}>
          No reference files added yet. Open a file you want to reference and
          click "Add Current File as Reference".
        </p>
      ) : (
        <div>
          <h2>Reference Files ({files.length})</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #ccc",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "8px" }}>File Name</th>
                <th style={{ padding: "8px" }}>File Key</th>
                <th style={{ padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.fileKey}
                  style={{
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "8px" }}>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenFile(file.fileUrl);
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007acc",
                        textDecoration: "underline",
                      }}
                      title="Click to open file"
                    >
                      {file.fileName}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenFile(file.fileUrl);
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#007acc",
                        textDecoration: "underline",
                      }}
                      title="Click to open file"
                    >
                      {file.fileKey}
                    </span>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Opening file:", file.fileUrl);
                        handleOpenFile(file.fileUrl);
                      }}
                      style={{
                        padding: "4px 8px",
                        marginRight: "8px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 1,
                      }}
                      type="button"
                    >
                      Open in Figma
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFile(file.fileKey, file.fileName);
                      }}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 1,
                      }}
                      type="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
