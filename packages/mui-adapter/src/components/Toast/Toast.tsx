import React from "react";
import {
  Alert as MuiAlert,
  AlertTitle as MuiAlertTitle,
  IconButton as MuiIconButton,
  type AlertProps as MuiAlertProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Toast.module.css";

import { type RecursicaToastProps as BaseRecursicaToastProps } from "@recursica/adapter-common";

export interface RecursicaToastProps extends BaseRecursicaToastProps {
  withCloseButton?: boolean;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}

/**
 * Toast component wrapping Mui's Alert.
 *
 * Can be used as a standalone visual component to display a notification or message.
 */
export type ToastProps = RecursicaOverStyled<
  Omit<MuiAlertProps, "color" | "radius" | "variant" | "onClose"> &
    RecursicaToastProps
>;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  function Toast(
    {
      overStyled = false,
      variant = "default",
      withCloseButton = true,
      title,
      icon,
      children,
      onClose,
      className,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    // Note MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
    // used to read the wrong key, silently no-op-ing any caller-supplied classes.
    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        message: styles.body,
        icon: styles.icon,
        action: styles.closeButton,
      },
      (sanitizedProps as Record<string, unknown>).classes as
        | Partial<Record<string, string>>
        | undefined,
    );

    const handleClose = () => {
      if (onClose) onClose();
    };

    return (
      <MuiAlert
        ref={ref}
        {...(sanitizedProps as unknown as Omit<
          MuiAlertProps,
          "color" | "radius" | "variant" | "onClose"
        >)}
        // MUI's Alert falls back to its own built-in severity icon (default severity is
        // "success", hence a checkmark) when `icon` is left `undefined` — `icon={false}`
        // is required to render no icon at all, which is Recursica's own default.
        icon={icon ?? false}
        data-variant={variant}
        className={`${className || ""}`}
        classes={mergedClassNames}
        action={
          withCloseButton ? (
            <MuiIconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </MuiIconButton>
          ) : undefined
        }
      >
        {title && (
          <MuiAlertTitle className={styles.title}>{title}</MuiAlertTitle>
        )}
        <div className={styles.description}>{children}</div>
      </MuiAlert>
    );
  },
);

Toast.displayName = "Toast";
