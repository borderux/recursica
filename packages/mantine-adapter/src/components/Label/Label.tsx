import React, { forwardRef } from "react";
import { Input, type InputLabelProps } from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Label.module.css";

export interface RecursicaLabelProps {
  /** Overall structural flow mapping the Form Control natively cascading down to Label and Input logic. */
  formLayout?: "stacked" | "side-by-side";
  /** Specifies the sizing metrics natively mapping the Label boundaries. */
  labelSize?: "default" | "small";
  /** Overall alignment directive for the label strings natively forcing Left/Right justification. */
  labelAlignment?: "left" | "right";
  /** Injects an indicator text block alongside the label. Can be boolean (`true` maps to '(Optional)') or custom React nodes. */
  labelOptionalText?: boolean | React.ReactNode;
  /** When true, forces the native Edit Icon to replace the standard asterisk visually. */
  labelWithEditIcon?: boolean;
  /** Interaction hook invoked whenever a generated edit icon block natively triggers a click event. */
  onLabelEditClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type LabelProps = RecursicaOverStyled<
  Omit<InputLabelProps, "size"> & RecursicaLabelProps
>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    formLayout = "stacked",
    labelSize = "default",
    labelAlignment,
    required = false,
    labelOptionalText,
    labelWithEditIcon,
    onLabelEditClick,
    children,
    overStyled = false,
    ...rest
  },
  ref,
) {
  const resolvedAlignment =
    labelAlignment || (formLayout === "side-by-side" ? "right" : "left");

  let resolvedOptionalText: React.ReactNode | undefined;
  if (!required) {
    if (labelOptionalText === true) resolvedOptionalText = "Optional";
    else if (labelOptionalText) resolvedOptionalText = labelOptionalText;
  }

  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames: Partial<Record<string, string>> = {
    label: styles.root,
    required: styles.required,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.label = o.label
      ? `${styles.root} ${o.label}`
      : styles.root;
    mergedClassNames.required = o.required
      ? `${styles.required} ${o.required}`
      : styles.required;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <Input.Label
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      data-layout={formLayout}
      data-size={labelSize}
      data-alignment={resolvedAlignment}
      required={required && !labelWithEditIcon}
      {...sanitizedProps}
    >
      <span className={styles.labelText}>{children}</span>
      {resolvedOptionalText && (
        <span className={styles.optionalText}>
          {typeof resolvedOptionalText === "string"
            ? `(${resolvedOptionalText})`
            : resolvedOptionalText}
        </span>
      )}
      {labelWithEditIcon && (
        <button
          type="button"
          className={styles.editIconWrapper}
          data-replaces-asterisk={required ? "true" : undefined}
          onClick={onLabelEditClick}
          aria-label="Edit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5303 2.46967C11.8232 2.17678 12.2981 2.17678 12.591 2.46967L13.5303 3.40898C13.8232 3.70188 13.8232 4.17675 13.5303 4.46964L5.61288 12.3871C5.45268 12.5473 5.24434 12.6483 5.01809 12.6766L2.39534 13.0044C2.10091 13.0412 1.83856 12.7789 1.87538 12.4845L2.2032 9.86175C2.23147 9.63551 2.3325 9.42716 2.4927 9.26696L11.5303 2.46967Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </Input.Label>
  );
});

Label.displayName = "Label";
