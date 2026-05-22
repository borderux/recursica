import React from "react";
import { Box } from "@mui/material";
import styles from "./ReadOnlyField.module.css";

export const ReadOnlyBooleanField: React.FC<{
  checked: boolean;
  label?: React.ReactNode;
}> = ({ checked, label }) => {
  return (
    <Box
      component="span"
      className={styles.textField}
      style={{ display: "inline-flex", gap: "8px", alignItems: "baseline" }}
    >
      {label && <span style={{ fontWeight: 500 }}>{label}:</span>}
      <span>{checked ? "True" : "False"}</span>
    </Box>
  );
};

ReadOnlyBooleanField.displayName = "ReadOnlyBooleanField";
