import React from "react";
import {
  type FormLayoutType,
  type FormLabelSizeType,
} from "@recursica/adapter-common";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./FormControlLayout.module.css";

export interface FormControlLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  overStyled?: boolean;
  formLayout?: FormLayoutType;
  labelSize?: FormLabelSizeType;
  /** Section rendered inside the left layout block (typically the Label natively) */
  leftSection?: React.ReactNode;
}

export const FormControlLayout = React.forwardRef<
  HTMLDivElement,
  FormControlLayoutProps
>(function FormControlLayout(props, ref) {
  const {
    overStyled = false,
    formLayout = "stacked",
    labelSize = "default",
    leftSection,
    className,
    children,
    ...rest
  } = props;

  const sanitizedProps = filterStylingProps(rest, overStyled);

  return (
    <div
      ref={ref}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-form-layout={formLayout}
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
