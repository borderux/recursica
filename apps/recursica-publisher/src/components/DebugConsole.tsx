import React, { useEffect } from "react";
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

  // Clear debug console when component mounts if clearOnMount is true
  useEffect(() => {
    if (clearOnMount) {
      clear();
    }
  }, [clear, clearOnMount]);

  return (
    <div style={{ marginBottom: "20px" }}>
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
