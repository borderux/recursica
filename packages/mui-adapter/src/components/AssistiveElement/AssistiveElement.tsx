import React from "react";
import { FormHelperText, type FormHelperTextProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./AssistiveElement.module.css";

import { type RecursicaAssistiveElementProps } from "@recursica/adapter-common";

export interface AssistiveElementProps
  extends FormHelperTextProps,
    RecursicaAssistiveElementProps {
  overStyled?: boolean;
}

export const AssistiveElement = React.forwardRef<
  HTMLParagraphElement,
  AssistiveElementProps
>(function AssistiveElement(props, ref) {
  const {
    assistiveVariant = "help",
    assistiveWithIcon = true,
    overStyled = false,
    className,
    children,
    ...rest
  } = props;

  const sanitizedProps = filterStylingProps(rest, overStyled);

  const HelpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );

  // Map to MUI's native error prop if it's explicitly an error state
  const isError = assistiveVariant === "error";

  // Force component = "div" so flex layouts execute correctly inside HelperText
  return (
    <FormHelperText
      ref={ref}
      component="div"
      error={isError}
      data-variant={assistiveVariant}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...(sanitizedProps as FormHelperTextProps)}
    >
      {assistiveWithIcon && (
        <div className={styles.icon}>
          {assistiveVariant === "error" ? <ErrorIcon /> : <HelpIcon />}
        </div>
      )}
      <div className={styles.text}>{children}</div>
    </FormHelperText>
  );
});

AssistiveElement.displayName = "AssistiveElement";
