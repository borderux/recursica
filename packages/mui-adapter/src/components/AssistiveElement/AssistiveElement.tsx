import React from "react";
import { FormHelperText, type FormHelperTextProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./AssistiveElement.module.css";

export interface AssistiveElementProps extends FormHelperTextProps {
  /** Governs the semantic rendering block (changes icon and CSS structural hooks natively). */
  assistiveVariant?: "help" | "error";
  /** Renders the structural mapping icon inline beside the text natively. */
  assistiveWithIcon?: boolean;
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
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
