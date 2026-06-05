import React from "react";
import { InputLabel, type InputLabelProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./Label.module.css";

import { type RecursicaLabelProps } from "@recursica/adapter-common";

export interface LabelProps extends InputLabelProps, RecursicaLabelProps {
  overStyled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label(props, ref) {
    const {
      overStyled = false,
      required = false,
      labelOptionalText = "",
      labelWithEditIcon = false,
      onLabelEditClick,
      labelActionArea,
      children,
      className,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    const PenIcon = () => (
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
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    );

    // Bypassing MUI's floating functionality by forcing shrink=true to static inline positioning.
    return (
      <InputLabel
        ref={ref}
        shrink={true}
        className={className ? `${styles.root} ${className}` : styles.root}
        {...(sanitizedProps as InputLabelProps)}
      >
        <div className={styles.innerLayout}>
          <span className={styles.textWrapper}>
            <span className={styles.text}>{children}</span>
            {required && <span className={styles.required}> *</span>}
          </span>

          <div className={styles.endNodes}>
            {labelActionArea && (
              <span className={styles.actionArea}>{labelActionArea}</span>
            )}
            {!required && labelOptionalText && !labelActionArea && (
              <span className={styles.optionalText}>
                {labelOptionalText === true ? "Optional" : labelOptionalText}
              </span>
            )}
            {labelWithEditIcon && (
              <button
                type="button"
                className={styles.editIcon}
                onClick={onLabelEditClick}
                aria-label="Edit label"
              >
                <PenIcon />
              </button>
            )}
          </div>
        </div>
      </InputLabel>
    );
  },
);

Label.displayName = "Label";
