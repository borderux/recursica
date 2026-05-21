import React, { forwardRef } from "react";
import { InputLabel, type InputLabelProps } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Label.module.css";

export interface RecursicaLabelProps {
  /** Specifies the sizing metrics natively mapping the Label boundaries. */
  labelSize?: "default" | "small" | "md";
  /** Overall alignment directive for the label strings natively forcing Left/Right justification. */
  labelAlignment?: "left" | "right";
  /** Injects an indicator text block alongside the label. Can be boolean (`true` maps to '(Optional)') or custom React nodes. */
  labelOptionalText?: boolean | React.ReactNode;
  /** When true, forces the native Edit Icon to replace the standard asterisk visually. */
  labelWithEditIcon?: boolean;
  /** Custom action area to render alongside the label instead of the default edit icon. */
  labelActionArea?: React.ReactNode;
  /** Interaction hook invoked whenever a generated edit icon block natively triggers a click event. */
  onLabelEditClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** The root element type to render. Usually left as 'label', but can be 'div' inside groups. */
  as?: React.ElementType;
}

export type LabelProps = RecursicaOverStyled<
  Omit<InputLabelProps, "size"> & RecursicaLabelProps
>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    labelSize = "default",
    labelAlignment,
    required = false,
    labelOptionalText,
    labelWithEditIcon,
    labelActionArea,
    onLabelEditClick,
    children,
    overStyled = false,
    as: componentAs,
    ...rest
  },
  ref,
) {
  const resolvedAlignment = labelAlignment || "left";

  let resolvedOptionalText: React.ReactNode | undefined;
  if (!required) {
    if (labelOptionalText === true) resolvedOptionalText = "optional";
    else if (labelOptionalText) resolvedOptionalText = labelOptionalText;
  }

  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClasses = {
    asterisk: styles.required,
  };

  const classesProp = restRecord.classes;
  if (
    classesProp &&
    typeof classesProp === "object" &&
    !Array.isArray(classesProp)
  ) {
    const o = classesProp as Partial<Record<string, string>>;
    mergedClasses.asterisk = o.asterisk
      ? `${styles.required} ${o.asterisk}`
      : styles.required;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <InputLabel
      ref={ref}
      component={componentAs}
      className={finalClass}
      classes={mergedClasses}
      data-size={labelSize}
      data-alignment={resolvedAlignment}
      required={required && !labelWithEditIcon}
      shrink={true} // Forces the label to not float over the input natively in MUI
      {...(restRecord as Record<string, any>)}
    >
      <span className={styles.labelText}>{children}</span>
      {resolvedOptionalText && (
        <span className={styles.optionalText}>
          {typeof resolvedOptionalText === "string"
            ? `(${resolvedOptionalText})`
            : resolvedOptionalText}
        </span>
      )}
      {labelActionArea ? (
        <span className={styles.actionAreaWrapper}>{labelActionArea}</span>
      ) : labelWithEditIcon ? (
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
      ) : null}
    </InputLabel>
  );
});

Label.displayName = "Label";
