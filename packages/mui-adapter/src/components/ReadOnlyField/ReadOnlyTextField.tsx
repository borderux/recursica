/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./ReadOnlyField.module.css";

export interface RecursicaReadOnlyTextFieldProps {
  /** The value strictly rendered as text output */
  value?: any;
}

export type ReadOnlyTextFieldProps =
  RecursicaOverStyled<RecursicaReadOnlyTextFieldProps>;

export const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = ({
  value,
  overStyled = false,
  ...rest
}) => {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <Box
      component="p"
      className={
        classNameProp
          ? `${styles.textField} ${classNameProp}`
          : styles.textField
      }
      {...sanitizedProps}
    >
      {value != null
        ? React.isValidElement(value)
          ? value
          : Array.isArray(value)
            ? value.join(", ")
            : String(value)
        : ""}
    </Box>
  );
};

ReadOnlyTextField.displayName = "ReadOnlyTextField";
