import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { callPlugin } from "../../utils/callPlugin";
import type { PrimaryImportMetadata } from "../../plugin/services/singleComponentImportService";
import type { ImportSummaryData } from "../../plugin/services/getImportSummary";

export default function ExistingImport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PrimaryImportMetadata | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummaryData | null>(
    null,
  );

  const fetchImportSummary = useCallback(async () => {
    try {
      const { promise } = callPlugin("getImportSummary", {});
      const result = await promise;
      if (result.success && result.data) {
        const data = result.data as { summary: ImportSummaryData };
        setImportSummary(data.summary);
      }
    } catch (err) {
      console.error("[ExistingImport] Failed to fetch import summary:", err);
    }
  }, []);

  useEffect(() => {
    const loadExistingImport = async () => {
      try {
        const { promise } = callPlugin("checkForExistingPrimaryImport", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as {
            exists: boolean;
            pageId?: string;
            metadata?: PrimaryImportMetadata;
          };

          if (data.exists && data.metadata && data.pageId) {
            setMetadata(data.metadata);
            setPageId(data.pageId);
            // Fetch import summary
            fetchImportSummary();
          } else {
            // No existing import, go to step 1
            navigate("/import-wizard/step1");
          }
        } else {
          navigate("/import-wizard/step1");
        }
      } catch (err) {
        console.error("Error loading existing import:", err);
        navigate("/import-wizard/step1");
      }
    };

    loadExistingImport();
  }, [navigate, fetchImportSummary]);

  const [clearingMetadata, setClearingMetadata] = useState(false);

  const handleDelete = async () => {
    if (!pageId) {
      setError("Page ID not available");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this import? This will remove all imported pages and collections created",
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { promise } = callPlugin("deleteImportGroup", { pageId });
      const result = await promise;

      if (result.success) {
        // Navigate back to step 1
        navigate("/import-wizard/step1");
      } else {
        setError(result.message || "Failed to delete import group");
        setLoading(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete import group";
      setError(errorMessage);
      setLoading(false);
      console.error("[ExistingImport] Error:", err);
    }
  };

  const handleClearMetadata = async () => {
    if (!pageId) {
      setError("Page ID not available");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to clear the import metadata? This will remove the 'under review' status and allow you to start a new import.",
      )
    ) {
      return;
    }

    setClearingMetadata(true);
    setError(null);

    try {
      const { promise } = callPlugin("clearImportMetadata", { pageId });
      const result = await promise;

      if (result.success) {
        // Navigate back to step 1
        navigate("/import-wizard/step1");
      } else {
        setError(result.message || "Failed to clear import metadata");
        setClearingMetadata(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear import metadata";
      setError(errorMessage);
      setClearingMetadata(false);
      console.error("[ExistingImport] Error:", err);
    }
  };

  if (!metadata) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p>Loading existing import...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            marginTop: "0",
          }}
        >
          Review Import
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Component: {metadata.componentName} (Version:{" "}
          {metadata.componentVersion})
        </p>
      </div>

      {/* Import Summary Table */}
      {importSummary && (
        <>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#333",
              margin: "0",
            }}
          >
            Please review all pages created as part of the import. If you
            confirm they look good, Merge them into your file to proceed, or
            press Cancel to stop this import.
          </p>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              marginTop: "0",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                margin: "0",
                padding: "12px 16px",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Import Summary
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <th
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Pages Created
                  </td>
                  <td
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    {importSummary.pagesCreated.length === 0 ? (
                      <span style={{ color: "#666", fontStyle: "italic" }}>
                        None
                      </span>
                    ) : (
                      <ul
                        style={{
                          margin: "0",
                          paddingLeft: "20px",
                          listStyle: "disc",
                        }}
                      >
                        {importSummary.pagesCreated.map((page) => (
                          <li key={page.pageId} style={{ marginBottom: "2px" }}>
                            {page.pageName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Pages Existing
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    {importSummary.pagesExisting.length === 0 ? (
                      <span style={{ color: "#666", fontStyle: "italic" }}>
                        None
                      </span>
                    ) : (
                      <ul
                        style={{
                          margin: "0",
                          paddingLeft: "20px",
                          listStyle: "disc",
                        }}
                      >
                        {importSummary.pagesExisting.map((page) => (
                          <li key={page.pageId} style={{ marginBottom: "2px" }}>
                            {page.pageName} ({page.componentPage})
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    New Variables
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    {importSummary.totalVariablesCreated}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    New Styles
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    {importSummary.totalStylesCreated}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleClearMetadata}
          disabled={clearingMetadata || loading}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "normal",
            backgroundColor: clearingMetadata || loading ? "#ccc" : "#fff",
            color: clearingMetadata || loading ? "#999" : "#333",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: clearingMetadata || loading ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!clearingMetadata && !loading) {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }
          }}
          onMouseOut={(e) => {
            if (!clearingMetadata && !loading) {
              e.currentTarget.style.backgroundColor = "#fff";
            }
          }}
        >
          {clearingMetadata ? "Clearing..." : "Clear Metadata"}
        </button>
        <button
          onClick={handleDelete}
          disabled={loading || clearingMetadata}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "normal",
            backgroundColor: loading || clearingMetadata ? "#ccc" : "#fff",
            color: loading || clearingMetadata ? "#999" : "#333",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: loading || clearingMetadata ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!loading && !clearingMetadata) {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }
          }}
          onMouseOut={(e) => {
            if (!loading && !clearingMetadata) {
              e.currentTarget.style.backgroundColor = "#fff";
            }
          }}
        >
          {loading ? "Cancelling..." : "Cancel"}
        </button>
        <button
          onClick={() => navigate("/import-wizard/merge/step1")}
          disabled={loading || clearingMetadata}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: loading || clearingMetadata ? "#ccc" : "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading || clearingMetadata ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!loading && !clearingMetadata) {
              e.currentTarget.style.opacity = "0.9";
            }
          }}
          onMouseOut={(e) => {
            if (!loading && !clearingMetadata) {
              e.currentTarget.style.opacity = "1";
            }
          }}
        >
          Merge
        </button>
      </div>
    </div>
  );
}
