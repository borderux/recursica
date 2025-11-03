/* eslint-disable @typescript-eslint/no-unused-vars */
import { LabelProps } from "./types";
import { InputLabelProps, DataAttributes } from "@mantine/core";
import * as styles from "./Label.css";

/**
 * Pure function that maps LabelProps to Mantine Input.Label props
 * Handles all the logic for CSS classname mapping and indicator processing
 */
export const mapInputLabelProps = (
  props: LabelProps,
): InputLabelProps & DataAttributes => {
  const {
    Indicator = "none",
    Show_label = true,
    Optional_text = "(optional)",
    Label_placement = "top",
    Label,
    children,
    Align = "middle",
    ...rest
  } = props;

  // Enforce required prop rules to map to our asterisk indicator and cannot be none/optional
  const effectiveIndicator = props.required
    ? Indicator === "asterisk / full label text"
      ? "asterisk / full label text"
      : "asterisk / truncate overflow"
    : Indicator;

  // Build CSS classnames based on placement and indicator
  // Use comprehensive indicator classes that include base styling
  const indicatorClass =
    effectiveIndicator === "optional"
      ? styles.labelOptional
      : effectiveIndicator.includes("asterisk")
        ? styles.labelAsterisk
        : styles.labelNone;

  // Apply placement-specific overrides
  const placementClass = Label_placement === "left" ? styles.labelLeft : "";
  const alignClass =
    Label_placement === "left"
      ? Align === "top"
        ? styles.labelLeftTop
        : styles.labelLeftMiddle
      : "";
  const truncateClass =
    effectiveIndicator === "asterisk / truncate overflow" &&
    Label_placement === "left"
      ? styles.labelTruncate
      : "";
  const hiddenClass = !Show_label ? styles.labelHidden : "";

  const labelClassName =
    `${placementClass} ${alignClass} ${truncateClass} ${indicatorClass} ${hiddenClass}`.trim();

  return {
    // Mantine Input.Label props
    ...rest,
    // Set required to true if we have an asterisk indicator type
    required: effectiveIndicator.includes("asterisk") || props.required,
    classNames: {
      ...(typeof rest.classNames === "object" ? rest.classNames : {}),
      label: labelClassName,
    },
  };
};
