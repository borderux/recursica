import React from "react";
import {
  Snackbar as MuiNotification,
  type SnackbarProps as MuiNotificationProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Toast.module.css";

export interface RecursicaToastProps {
  /**
   * The visual variant of the toast.
   * @default "default"
   */
  variant?: "default" | "error" | "success";

  /**
   * Loading state is natively unsupported by Recursica UI Kit.
   * If a loading state is required, pass a `<Loader size="sm" />` directly into the `icon` prop.
   */
  loading?: false;
}

/**
 * Toast component wrapping Mui's Notification.
 *
 * Can be used as a standalone visual component to display a notification or message.
 */
export type ToastProps = RecursicaOverStyled<
  Omit<MuiNotificationProps, "color" | "radius" | "variant" | "loading"> &
    RecursicaToastProps
>;

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  function Toast(
    {
      overStyled = false,
      variant = "default",
      withCloseButton = true,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    // Bind CSS module classes to Mui's internal classNames API
    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      body: styles.body,
      title: styles.title,
      description: styles.description,
      closeButton: styles.closeButton,
      icon: styles.icon,
      loader: styles.loader,
    };

    const classNamesProp = (sanitizedProps as Record<string, unknown>)
      .classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Record<string, string>;
      Object.keys(o).forEach((key) => {
        if (mergedClassNames[key]) {
          mergedClassNames[key] = `${mergedClassNames[key]} ${o[key]}`;
        } else {
          mergedClassNames[key] = o[key];
        }
      });
    }

    return (
      <MuiNotification
        ref={ref}
        withCloseButton={withCloseButton}
        withBorder={false} // Border is handled via CSS or tokens if needed
        data-variant={variant}
        classes={mergedClassNames}
        loading={false}
        {...(sanitizedProps as unknown as Omit<
          MuiNotificationProps,
          "color" | "radius" | "variant" | "loading"
        >)}
      />
    );
  },
);

Toast.displayName = "Toast";
