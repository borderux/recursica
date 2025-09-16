import { useState } from "react";
import { usePlugin } from "../context/usePlugin";

export default function ResetMetadata() {
  const { resetMetadata, loading, error, clearError } = usePlugin();
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetMetadata = async () => {
    setResetStatus("idle");
    setErrorMessage("");
    clearError();

    try {
      await resetMetadata();
      setResetStatus("success");
    } catch (error) {
      setResetStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reset metadata",
      );
    }
  };

  return (
    <div>
      <h1>Reset Variables Sync Status</h1>
      <p>
        This will reset the variables-synced status in the Figma variable
        collections, allowing them to be synced again.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h3>What this does</h3>
        <p style={{ color: "#1976d2", fontWeight: "bold" }}>
          This action will reset the variables-synced tag for all local variable
          collections, allowing them to be synchronized again. File type and
          theme name metadata will be preserved.
        </p>
      </div>

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

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleResetMetadata}
          disabled={loading.operations}
          style={{
            padding: "10px 20px",
            backgroundColor: loading.operations ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading.operations ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading.operations ? "Resetting..." : "Reset Variables Sync Status"}
        </button>
      </div>

      {resetStatus === "success" && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e8f5e8",
            border: "1px solid #4caf50",
            borderRadius: "4px",
            color: "#2e7d32",
          }}
        >
          ✅ Variables sync status reset successfully! All variable collections
          can now be synchronized again. File type and theme name have been
          preserved.
        </div>
      )}

      {resetStatus === "error" && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "4px",
            color: "#c62828",
          }}
        >
          ❌ Error: {errorMessage}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>What this does:</h3>
        <ul>
          <li>
            Resets the variables-synced tag for all local variable collections
          </li>
          <li>
            Allows collections to be synchronized again with the team library
          </li>
          <li>Preserves file type and theme name metadata</li>
          <li>Useful when you need to re-sync variables after changes</li>
        </ul>
      </div>
    </div>
  );
}
