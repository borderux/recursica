import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DebugConsole from "../../components/DebugConsole";
import { useImportWizard } from "../../context/ImportWizardContext";
import { useImportData } from "../../context/ImportDataContext";
import { callPlugin } from "../../utils/callPlugin";

export default function Step5Importing() {
  const navigate = useNavigate();
  const { wizardState, resetWizard, setImportPromise, setWizardState } =
    useImportWizard();
  const { importData, setImportData } = useImportData();
  const [importError, setImportError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    // Check if import is already in progress or failed
    if (
      !importData ||
      !importData.mainFile ||
      importData.mainFile.status !== "success" ||
      !importData.wizardSelections
    ) {
      setImportError("No import data available");
      setIsImporting(false);
      return;
    }

    // Populate wizard state from importData if not already set (for completed/failed imports)
    if (!wizardState.selectedComponent && importData.mainFile.data) {
      const mainFileData = importData.mainFile.data as {
        metadata?: { guid?: string; name?: string; version?: number };
      };
      const metadata = mainFileData?.metadata;

      if (metadata?.guid && metadata?.name) {
        const ref = importData.source?.branch || "main";
        setWizardState((prev) => ({
          ...prev,
          selectedComponent: {
            guid: metadata.guid,
            name: metadata.name,
            version: metadata.version || 0,
            ref,
          },
        }));
      }
    }

    // If import is already completed, just show the result
    if (importData.importStatus === "completed") {
      setIsImporting(false);
      return;
    }

    // If import failed previously, show the error
    if (importData.importStatus === "failed") {
      setImportError(importData.importError || "Import failed");
      setIsImporting(false);
      return;
    }

    // If import is already in progress, don't start a new one
    if (importData.importStatus === "in_progress") {
      setIsImporting(true);
      return;
    }

    // Only start import if status is "pending" or undefined (new import)
    const startImport = async () => {
      try {
        setIsImporting(true);
        setImportError(null);

        // Mark import as in progress
        if (!importData.mainFile) {
          setImportError("No main file available");
          setIsImporting(false);
          return;
        }

        setImportData((prev) => {
          if (!prev || !prev.mainFile) return prev;
          return {
            ...prev,
            importStatus: "in_progress",
            importError: undefined,
          };
        });

        const mainFileData = importData.mainFile.data as {
          metadata?: { guid?: string; name?: string; version?: number };
        };
        const metadata = mainFileData?.metadata;

        // Build dependencies from additional files
        const dependencies = importData.additionalFiles
          .filter((file) => {
            if (file.status !== "success" || !file.data) return false;
            const depSelection = importData.wizardSelections!.dependencies.find(
              (d) => {
                const fileData = file.data as {
                  metadata?: { guid?: string; name?: string; version?: number };
                };
                return d.guid === fileData?.metadata?.guid;
              },
            );
            return depSelection && !depSelection.useExisting;
          })
          .map((file) => {
            const fileData = file.data as {
              metadata?: { guid?: string; name?: string; version?: number };
            };
            const fileMetadata = fileData?.metadata;
            const depSelection = importData.wizardSelections!.dependencies.find(
              (d) => d.guid === fileMetadata?.guid,
            );
            return {
              guid: fileMetadata?.guid || "",
              name: fileMetadata?.name || file.name.replace(".json", ""),
              version: fileMetadata?.version || 0,
              jsonData: fileData,
              useExisting: depSelection?.useExisting || false,
            };
          });

        const wizardImportData = {
          mainComponent: {
            guid: metadata?.guid || "",
            name:
              metadata?.name || importData.mainFile.name.replace(".json", ""),
            version: metadata?.version || 0,
            jsonData: importData.mainFile.data,
          },
          dependencies,
          wizardSelections: importData.wizardSelections,
          variableSummary: importData.variableSummary || {
            tokens: { existing: 0, new: 0 },
            theme: { existing: 0, new: 0 },
            layers: { existing: 0, new: 0 },
          },
        };

        const { promise } = callPlugin(
          "importSingleComponentWithWizard",
          wizardImportData,
        );

        setImportPromise(promise);

        promise
          .then((result) => {
            if (!result.success) {
              const errorMsg = result.message || "Import failed";
              setImportError(errorMsg);
              // Mark import as failed
              setImportData((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  importStatus: "failed",
                  importError: errorMsg,
                };
              });
            } else {
              // Mark import as completed
              setImportData((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  importStatus: "completed",
                  importError: undefined,
                };
              });
            }
            setIsImporting(false);
            setImportPromise(null);
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error ? err.message : "Import failed";
            setImportError(errorMessage);
            // Mark import as failed
            setImportData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                importStatus: "failed",
                importError: errorMessage,
              };
            });
            setIsImporting(false);
            setImportPromise(null);
          });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start import";
        setImportError(errorMessage);
        // Mark import as failed
        setImportData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            importStatus: "failed",
            importError: errorMessage,
          };
        });
        setIsImporting(false);
      }
    };

    // Only start if status is pending or undefined
    if (!importData.importStatus || importData.importStatus === "pending") {
      startImport();
    }
  }, [
    importData,
    setImportPromise,
    setImportData,
    setWizardState,
    wizardState.selectedComponent,
  ]);

  const handleIgnore = () => {
    // Clear import data when user clicks Done/Ignore
    setImportData(null);
    resetWizard();
    navigate("/");
  };

  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      const { promise } = callPlugin("cleanupFailedImport", {});
      const result = await promise;

      if (!result.success) {
        console.error(
          `[Step5Importing] Cleanup failed: ${result.message || "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error("[Step5Importing] Cleanup error:", err);
    } finally {
      setIsCleaningUp(false);
      resetWizard();
      navigate("/");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
          Importing
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            margin: 0,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
          }}
        >
          {importData?.importStatus === "completed"
            ? `Import complete: ${wizardState.selectedComponent?.name || importData?.mainFile?.name?.replace(".json", "") || "component"}`
            : isImporting
              ? `Importing ${wizardState.selectedComponent?.name || "component"}...`
              : importError
                ? "Import failed"
                : "Ready to import"}
        </p>
      </div>

      <DebugConsole label="Import Logs:" showClearButton={false} />

      {importError && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Import Failed
          </div>
          <div>{importError}</div>
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
        {importError ? (
          <>
            <button
              onClick={handleIgnore}
              disabled={isCleaningUp}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: isCleaningUp ? "#ccc" : "#666",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isCleaningUp ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => {
                if (!isCleaningUp) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseOut={(e) => {
                if (!isCleaningUp) {
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              Ignore
            </button>
            <button
              onClick={handleCleanup}
              disabled={isCleaningUp}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: isCleaningUp ? "#ccc" : "#d40d0d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isCleaningUp ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => {
                if (!isCleaningUp) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseOut={(e) => {
                if (!isCleaningUp) {
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              {isCleaningUp ? "Cleaning up..." : "Cleanup"}
            </button>
          </>
        ) : (
          <button
            onClick={handleIgnore}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
