import React, { forwardRef } from "react";
import styles from "./FormControlLayout.module.css";

import { type RecursicaFormControlLayoutProps } from "@recursica/adapter-common";

export interface FormControlLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RecursicaFormControlLayoutProps {}

/**
 * A layout component used to correctly position form inputs alongside their labels.
 *
 * **When to use this:**
 * Typically, you should use `FormControlWrapper` instead, which uses this component
 * under the hood to handle layout automatically.
 *
 * However, this component is useful when you need to align standalone inputs
 * (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing
 * and alignment of your other form fields in a `side-by-side` layout.
 */
export const FormControlLayout = forwardRef<
  HTMLDivElement,
  FormControlLayoutProps
>(function FormControlLayout(
  {
    formLayout = "stacked",
    labelSize = "default",
    controlMaxWidth,
    controlMinWidth,
    leftSection,
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  const rootClass = className ? `${styles.root} ${className}` : styles.root;

  // We explicitly render leftSection even if null in side-by-side to preserve the empty grid column bounding constraints.
  // In stacked layouts, if there is no label, we omit the wrapper to avoid unnecessary padding.
  const hasLeftContent = leftSection !== undefined && leftSection !== null;
  const shouldRenderLeft = hasLeftContent || formLayout === "side-by-side";

  return (
    <div
      ref={ref}
      className={rootClass}
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
      {...rest}
    >
      {shouldRenderLeft && (
        <div className={styles.leftSection} data-size={labelSize}>
          {leftSection}
        </div>
      )}

      <div className={styles.rightSection}>{children}</div>
    </div>
  );
});

FormControlLayout.displayName = "FormControlLayout";
