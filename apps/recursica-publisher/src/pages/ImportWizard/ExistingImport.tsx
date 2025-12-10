import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { callPlugin } from "../../utils/callPlugin";
import type { PrimaryImportMetadata } from "../../plugin/services/singleComponentImportService";

export default function ExistingImport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PrimaryImportMetadata | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);

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
  }, [navigate]);

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
          Already Importing
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Component: {metadata.componentName} (Version:{" "}
          {metadata.componentVersion})
        </p>
      </div>

      <div
        style={{
          padding: "16px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          Import Summary
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>Dependencies:</strong>{" "}
            {metadata.wizardSelections.dependencies.length} total
            <br />
            {
              metadata.wizardSelections.dependencies.filter(
                (d) => !d.useExisting,
              ).length
            }{" "}
            imported
            <br />
            {
              metadata.wizardSelections.dependencies.filter(
                (d) => d.useExisting,
              ).length
            }{" "}
            using existing
          </div>
          <div>
            <strong>Tokens Collection:</strong>{" "}
            {metadata.wizardSelections.tokensCollection === "new"
              ? (() => {
                  const normalizeName = (name: string) =>
                    name.toLowerCase().replace(/s$/, "").replace(/_\d+$/, "");
                  const createdCollection = metadata.createdCollections.find(
                    (c) => {
                      const normalized = normalizeName(c.collectionName);
                      return normalized === "token" || normalized === "tokens";
                    },
                  );
                  return createdCollection
                    ? `Created new: "${createdCollection.collectionName}"`
                    : "Created new";
                })()
              : "Used existing"}
          </div>
          <div>
            <strong>Theme Collection:</strong>{" "}
            {metadata.wizardSelections.themeCollection === "new"
              ? (() => {
                  const normalizeName = (name: string) =>
                    name.toLowerCase().replace(/s$/, "").replace(/_\d+$/, "");
                  const createdCollection = metadata.createdCollections.find(
                    (c) => {
                      const normalized = normalizeName(c.collectionName);
                      return normalized === "theme" || normalized === "themes";
                    },
                  );
                  return createdCollection
                    ? `Created new: "${createdCollection.collectionName}"`
                    : "Created new";
                })()
              : "Used existing"}
          </div>
          <div>
            <strong>Layers Collection:</strong>{" "}
            {metadata.wizardSelections.layersCollection === "new"
              ? (() => {
                  const normalizeName = (name: string) =>
                    name.toLowerCase().replace(/s$/, "").replace(/_\d+$/, "");
                  const createdCollection = metadata.createdCollections.find(
                    (c) => {
                      const normalized = normalizeName(c.collectionName);
                      return normalized === "layer" || normalized === "layers";
                    },
                  );
                  return createdCollection
                    ? `Created new: "${createdCollection.collectionName}"`
                    : "Created new";
                })()
              : "Used existing"}
          </div>
          <div>
            <strong>Import Date:</strong>{" "}
            {new Date(metadata.importDate).toLocaleString()}
          </div>
          {metadata.importError && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "#ffebee",
                border: "1px solid #f44336",
                borderRadius: "4px",
                color: "#c62828",
              }}
            >
              <strong>Import Error:</strong> {metadata.importError}
            </div>
          )}
        </div>
      </div>

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
          {loading ? "Deleting..." : "Delete"}
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
