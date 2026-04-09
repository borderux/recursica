import React, { forwardRef } from "react";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./AssistiveElement.module.css";

export interface RecursicaAssistiveElementProps {
  /** The semantic variant driving the icon and text colors natively mapped across the UI Kit tokens. */
  assistiveVariant?: "help" | "error";
  /** Explicitly toggle the rendering of the variant-specific SVG bounding box. */
  assistiveWithIcon?: boolean;
}

export type AssistiveElementProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLDivElement> & RecursicaAssistiveElementProps
>;

const InfoIcon = () => (
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

const AlertIcon = () => (
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

export const AssistiveElement = forwardRef<
  HTMLDivElement,
  AssistiveElementProps
>(function AssistiveElement(
  {
    assistiveVariant = "help",
    assistiveWithIcon = true,
    children,
    className,
    overStyled = false,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const rootClass = styles.root;
  const finalClass = className ? `${rootClass} ${className}` : rootClass;

  const IconComponent = assistiveVariant === "error" ? AlertIcon : InfoIcon;

  return (
    <div
      ref={ref}
      className={finalClass}
      data-variant={assistiveVariant}
      style={restRecord.style as React.CSSProperties}
      {...restRecord} // Spread standard HTML attributes (like id, aria-*, role) natively.
    >
      {assistiveWithIcon && (
        <span className={styles.iconWrapper}>
          <IconComponent />
        </span>
      )}
      <span className={styles.textWrapper}>{children}</span>
    </div>
  );
});

AssistiveElement.displayName = "AssistiveElement";
