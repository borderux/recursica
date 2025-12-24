import { useState } from "react";
import { formatLogsForClipboard } from "../utils/formatLogsForClipboard";
import type { DebugConsoleMessage } from "../plugin/services/debugConsole";

interface DebugConsoleProps {
  title: string; // Title describing the action being performed
  isActive: boolean; // Whether operation is in progress
  isComplete?: boolean; // Whether operation completed successfully
  error?: string | null; // Error message if operation failed
  debugLogs?: DebugConsoleMessage[]; // Debug logs to copy
  successMessage?: string; // Optional success message when complete
}

export default function DebugConsole({
  title,
  isActive,
  isComplete = false,
  error = null,
  debugLogs,
  successMessage,
}: DebugConsoleProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLogs = async () => {
    const logsText = formatLogsForClipboard(debugLogs);
    if (!logsText) {
      alert("No logs available to copy");
      return;
    }

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(logsText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }

      // Fallback to execCommand for older browsers or restricted contexts
      const textArea = document.createElement("textarea");
      textArea.value = logsText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error("execCommand('copy') failed");
      }
    } catch (err) {
      console.error("Failed to copy logs:", err);
      alert(
        "Failed to copy logs to clipboard. Please select and copy manually.",
      );
    }
  };

  const showCopyButton = isComplete || error;

  return (
    <>
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
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Activity Spinner */}
        {isActive && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
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
            <p style={{ margin: 0, color: "#666", fontStyle: "italic" }}>
              {title}...
            </p>
          </div>
        )}

        {/* Success Message */}
        {isComplete && !error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e8f5e9",
              border: "1px solid #4caf50",
              borderRadius: "4px",
              color: "#2e7d32",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{successMessage || `${title} completed successfully`}</span>
            {showCopyButton && (
              <button
                onClick={handleCopyLogs}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: copySuccess ? "#28a745" : "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = "#555";
                  }
                }}
                onMouseOut={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = "#666";
                  }
                }}
              >
                {copySuccess ? "Copied!" : "Copy Logs"}
              </button>
            )}
          </div>
        )}

        {/* Error Area */}
        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#c62828",
                fontSize: "14px",
              }}
            >
              {title} Failed
            </div>
            <div
              style={{
                color: "#c62828",
                fontSize: "14px",
                marginBottom: showCopyButton ? "12px" : "0",
              }}
            >
              {error}
            </div>
            {showCopyButton && (
              <button
                onClick={handleCopyLogs}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  backgroundColor: copySuccess ? "#28a745" : "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = "#555";
                  }
                }}
                onMouseOut={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = "#666";
                  }
                }}
              >
                {copySuccess ? "Copied!" : "Copy Logs"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
