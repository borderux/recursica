import React from "react";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./FormControlLayout.module.css";

import { type RecursicaFormControlLayoutProps } from "@recursica/adapter-common";

export interface FormControlLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RecursicaFormControlLayoutProps {
  overStyled?: boolean;
}

export const FormControlLayout = React.forwardRef<
  HTMLDivElement,
  FormControlLayoutProps
>(function FormControlLayout(props, ref) {
  const {
    overStyled = false,
    formLayout = "stacked",
    labelSize = "default",
    controlMaxWidth,
    controlMinWidth,
    leftSection,
    className,
    children,
    style,
    ...rest
  } = props;

  const sanitizedProps = filterStylingProps(rest, overStyled);

  return (
    <div
      ref={ref}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-form-layout={formLayout}
      style={
        {
          ...style,
          ...(controlMaxWidth
            ? { "--form-control-max-width": controlMaxWidth }
            : {}),
          ...(controlMinWidth
            ? { "--form-control-min-width": controlMinWidth }
            : {}),
        } as React.CSSProperties
      }
      {...sanitizedProps}
    >
      {/* 
        The left section strictly enforces the Label boundary sizes 
        We render it unconditionally if side-by-side to preserve the grid column layout 
      */}
      {formLayout === "side-by-side" ? (
        <div className={styles.leftSection} data-label-size={labelSize}>
          {leftSection}
        </div>
      ) : (
        leftSection && (
          <div className={styles.leftSection} data-label-size={labelSize}>
            {leftSection}
          </div>
        )
      )}

      {/* The main content area natively flows into the remaining space */}
      <div className={styles.rightSection}>{children}</div>
    </div>
  );
});

FormControlLayout.displayName = "FormControlLayout";
