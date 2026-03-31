import React from "react";

/* Shared styles used across wizard step components */

export const cardStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 6,
  fontSize: 14,
};

export const successCard: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: "#e8f5e9",
  color: "#1b5e20",
};

export const errorCard: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: "#fde8e8",
  color: "#c00",
};

export const warningCard: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: "#fff8e1",
  color: "#f57f17",
};

export const infoRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
  fontSize: 13,
  borderBottom: "1px solid #eee",
};

export const labelStyle: React.CSSProperties = {
  color: "#888",
  fontWeight: 500,
  minWidth: 80,
};

export const linkStyle: React.CSSProperties = {
  color: "#1565c0",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: 12,
};
