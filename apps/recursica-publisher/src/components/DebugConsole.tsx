import { useEffect, useRef, useState } from "react";
import { useDebugConsole } from "../context/useDebugConsole";

interface DebugConsoleProps {
  height?: string;
  label?: string;
  showClearButton?: boolean;
  clearOnMount?: boolean;
}

export default function DebugConsole({
  height = "100px",
  label = "Publishing Log:",
  showClearButton = true,
  clearOnMount = true,
}: DebugConsoleProps) {
  const { getFormattedLog, clear } = useDebugConsole();
  const debugLogs = getFormattedLog();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Clear debug console when component mounts if clearOnMount is true
  useEffect(() => {
    if (clearOnMount) {
      clear();
    }
  }, [clear, clearOnMount]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [debugLogs]);

  const handleCopy = async () => {
    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(debugLogs);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        // Fall through to fallback method
      }
    }

    // Fallback for browsers without clipboard API or when it fails
    if (textareaRef.current) {
      try {
        textareaRef.current.select();
        const success = document.execCommand("copy");
        if (success) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } else {
          console.error("Failed to copy using execCommand");
        }
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  return (
    <div style={{ marginBottom: "5px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <label
          style={{
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={handleCopy}
            style={{
              padding: "4px 12px",
              fontSize: "12px",
              backgroundColor: "transparent",
              color: copySuccess ? "#28a745" : "#666",
              border: `1px solid ${copySuccess ? "#28a745" : "#ccc"}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              if (!copySuccess) {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }
            }}
            onMouseOut={(e) => {
              if (!copySuccess) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {copySuccess ? "Copied!" : "Copy"}
          </button>
          {showClearButton && (
            <button
              onClick={clear}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                backgroundColor: "transparent",
                color: "#666",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        readOnly
        value={debugLogs}
        style={{
          width: "100%",
          height,
          padding: "10px",
          boxSizing: "border-box",
          fontFamily: "monospace",
          fontSize: "12px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          resize: "none",
          backgroundColor: "#f5f5f5",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#d40d0d";
          e.currentTarget.style.outline = "none";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#ccc";
        }}
      />
    </div>
  );
}
