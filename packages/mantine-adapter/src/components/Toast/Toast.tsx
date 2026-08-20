import React from "react";
import {
  Notification as MantineNotification,
  type NotificationProps as MantineNotificationProps,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Toast.module.css";

import { type RecursicaToastProps } from "@recursica/adapter-common";

/**
 * Toast component wrapping Mantine's Notification.
 *
 * Can be used as a standalone visual component to display a notification or message.
 */
export type ToastProps = RecursicaOverStyled<
  Omit<MantineNotificationProps, "color" | "radius" | "variant" | "loading"> &
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
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "color", // Colors are token-driven via `data-variant`; Mantine's native palette isn't exposed.
      "radius", // Toast corner radius is controlled by design tokens, not a raw radius prop.
      "loading", // Toast never renders a loading state; always forced off via `loading={false}` below.
    ] as const satisfies readonly (keyof MantineNotificationProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );

    // Bind CSS module classes to Mantine's internal classNames API
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
      <MantineNotification
        ref={ref}
        {...(sanitizedProps as unknown as Omit<
          MantineNotificationProps,
          "color" | "radius" | "variant" | "loading"
        >)}
        withCloseButton={withCloseButton}
        withBorder={false} // Border is handled via CSS or tokens if needed
        data-variant={variant}
        classNames={mergedClassNames}
        loading={false}
      />
    );
  },
);

Toast.displayName = "Toast";
