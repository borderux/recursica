import { usePluginPrompt } from "../context/usePluginPrompt";
import { useEffect, useRef } from "react";

export default function PluginPrompt() {
  const { prompt, ok, cancel } = usePluginPrompt();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate height based on content
  const lineHeight = 20; // Line height for multi-line text
  const padding = 10; // Container padding
  const iconHeight = 20; // Icon height (matches question mark icon line height)

  const hasPrompt = !!prompt;

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt?.message]);

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: "10px",
          width: "100%",
          padding: `${padding}px`,
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: hasPrompt ? "#f5f5f5" : "#fafafa",
          transition: "background-color 0.2s ease-in-out",
        }}
      >
        {/* Question mark icon column */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-start",
            paddingTop: "2px",
          }}
        >
          <div
            style={{
              color: hasPrompt ? "#999" : "#d0d0d0",
              fontSize: "18px",
              fontWeight: "bold",
              lineHeight: "20px",
              transition: "color 0.2s ease-in-out",
            }}
            title="Plugin Prompt"
          >
            ?
          </div>
        </div>

        {/* Message textarea column - flex grow */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <textarea
            ref={textareaRef}
            readOnly
            value={prompt?.message ?? ""}
            style={{
              width: "100%",
              minHeight: `${lineHeight}px`,
              padding: "0",
              margin: "0",
              boxSizing: "border-box",
              fontFamily: "inherit",
              fontSize: "12px",
              border: "none",
              backgroundColor: "transparent",
              resize: "none",
              color: hasPrompt ? "#333" : "#d0d0d0",
              overflow: "hidden",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: `${lineHeight}px`,
              cursor: "default",
              transition: "color 0.2s ease-in-out",
            }}
            disabled={!hasPrompt}
          />
        </div>

        {/* Buttons column - hugs content, aligned to bottom */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "5px",
            }}
          >
            <button
              onClick={cancel}
              disabled={!hasPrompt}
              style={{
                padding: "0 12px",
                height: `${iconHeight}px`,
                fontSize: "12px",
                backgroundColor: "transparent",
                color: "#666",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "0",
                visibility: hasPrompt ? "visible" : "hidden",
                display: "flex",
                alignItems: "center",
              }}
              onMouseOver={(e) => {
                if (hasPrompt) {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {prompt?.cancelLabel ?? "Cancel"}
            </button>
            <button
              onClick={ok}
              disabled={!hasPrompt}
              style={{
                padding: "0 12px",
                height: `${iconHeight}px`,
                fontSize: "12px",
                backgroundColor: "#d40d0d",
                color: "white",
                border: "1px solid #d40d0d",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "0",
                visibility: hasPrompt ? "visible" : "hidden",
                display: "flex",
                alignItems: "center",
              }}
              onMouseOver={(e) => {
                if (hasPrompt) {
                  e.currentTarget.style.backgroundColor = "#b00b0b";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#d40d0d";
              }}
            >
              {prompt?.okLabel ?? "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
