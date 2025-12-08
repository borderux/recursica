import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DebugConsole from "../../components/DebugConsole";
import { useImportWizard } from "../../context/ImportWizardContext";
import { callPlugin } from "../../utils/callPlugin";

export default function Step5Importing() {
  const navigate = useNavigate();
  const { wizardState, resetWizard, importPromise, setImportPromise } =
    useImportWizard();
  const [importError, setImportError] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    // Monitor the import promise for completion or failure
    if (!importPromise) {
      return;
    }

    importPromise
      .then((result) => {
        if (!result.success) {
          setImportError(result.message || "Import failed");
        }
        // Clear the promise after it resolves
        setImportPromise(null);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "Import failed";
        setImportError(errorMessage);
        setImportPromise(null);
      });
  }, [importPromise, setImportPromise]);

  const handleIgnore = () => {
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
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Importing {wizardState.selectedComponent?.name}...
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
