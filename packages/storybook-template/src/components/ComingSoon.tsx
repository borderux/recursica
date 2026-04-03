import React from "react";
import { Layer } from "@recursica/adapter-common";

export interface ComingSoonProps {
  componentName: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ componentName }) => {
  return (
    <Layer
      layer={1}
      style={{
        padding: "48px",
        textAlign: "center",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        minHeight: "200px",
      }}
    >
      <div
        style={{
          padding: "16px",
          background:
            "var(--recursica-color-warning-muted, rgba(255, 170, 0, 0.1))",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--recursica-color-warning-emphasis, #ffaa00)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="20" height="8" rx="1" />
          <path d="M17 14v7" />
          <path d="M7 14v7" />
          <path d="M17 3v3" />
          <path d="M7 3v3" />
          <path d="m14 14-8-8" />
          <path d="m22 14-8-8" />
        </svg>
      </div>
      <div>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "24px",
            color: "var(--recursica-color-text-emphasis, inherit)",
          }}
        >
          Coming Soon
        </h3>
        <p
          style={{
            margin: 0,
            color: "var(--recursica-color-text-subtle, #666)",
            fontSize: "16px",
          }}
        >
          The <strong>{componentName}</strong> component is currently under
          construction.
        </p>
      </div>
    </Layer>
  );
};
