import { useEffect, useRef } from "react";
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
