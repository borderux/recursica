import React from "react";
import { InputLabel, type InputLabelProps } from "@mui/material";
import { filterStylingProps } from "../../utils/filterStylingProps";
import styles from "./Label.module.css";

export interface LabelProps extends InputLabelProps {
  overStyled?: boolean;
  /** Explicit optional text to render safely mapping alongside the label. Hidden natively if 'required' is flagged true. */
  labelOptionalText?: React.ReactNode | true;
  /** Triggers the inline edit action icon native layout hook beside the label element. */
  labelWithEditIcon?: boolean;
  /** Fires specifically on icon click natively. */
  onLabelEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Replaces the right side optional text block natively with any custom React node (e.g. actions, toggles). */
  labelActionArea?: React.ReactNode;
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
        required={required}
        className={className ? `${styles.root} ${className}` : styles.root}
        classes={{
          asterisk: styles.required, // Override MUI asterisk hook safely to our token colors
        }}
        {...(sanitizedProps as InputLabelProps)}
      >
        <div className={styles.innerLayout}>
          <span className={styles.text}>{children}</span>

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
