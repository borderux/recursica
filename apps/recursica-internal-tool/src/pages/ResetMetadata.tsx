import { useState } from "react";

export default function ResetMetadata() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetMetadata = async () => {
    setIsResetting(true);
    setResetStatus("idle");
    setErrorMessage("");

    try {
      // Send message to plugin sandbox
      parent.postMessage(
        {
          pluginMessage: {
            type: "reset-metadata",
          },
        },
        "*",
      );

      // Listen for response
      const handleMessage = (event: MessageEvent) => {
        if (event.data.pluginMessage?.type === "reset-metadata-response") {
          if (event.data.pluginMessage.success) {
            setResetStatus("success");
          } else {
            setResetStatus("error");
            setErrorMessage(
              event.data.pluginMessage.error || "Unknown error occurred",
            );
          }
          setIsResetting(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (isResetting) {
          setResetStatus("error");
          setErrorMessage("Reset operation timed out");
          setIsResetting(false);
          window.removeEventListener("message", handleMessage);
        }
      }, 10000);
    } catch (error) {
      setResetStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reset metadata",
      );
      setIsResetting(false);
    }
  };

  return (
    <div>
      <h1>Reset Metadata</h1>
      <p>This will reset all metadata in the Figma variable collections.</p>

      <div style={{ marginBottom: "20px" }}>
        <h3>Warning</h3>
        <p style={{ color: "#d32f2f", fontWeight: "bold" }}>
          This action will permanently remove all metadata from all local
          variable collections. This action cannot be undone.
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleResetMetadata}
          disabled={isResetting}
          style={{
            padding: "10px 20px",
            backgroundColor: isResetting ? "#ccc" : "#d32f2f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isResetting ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {isResetting ? "Resetting..." : "Reset All Metadata"}
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
          ✅ Metadata reset successfully! All variable collections have been
          cleared of metadata.
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
          <li>Clears all metadata from all local variable collections</li>
          <li>Resets collection-level metadata</li>
          <li>Cannot be undone - make sure to backup if needed</li>
        </ul>
      </div>
    </div>
  );
}
