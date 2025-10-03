import { createPolymorphicComponent, Button as ManButton } from "@mantine/core";
import { forwardRef, type HTMLAttributes } from "react";
import { styles } from "./Button.css";
import { type IconName, Icon } from "../Icons/Icon";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** The label of the button */
  label: string;
  /** The style of the button */
  variant?: "solid" | "outline" | "text";
  /** The size of the button */
  size?: "default" | "small";
  /** The icon for icon variant */
  icon?: IconName;
  /** The leading icon for iconText variant */
  leading?: IconName;
  /** The trailing icon for iconText variant */
  trailing?: IconName;
  /** The loading state of the button */
  loading?: boolean;
  /** The disabled state of the button */
  disabled?: boolean;
}

/** Primary UI component for user interaction */
export const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = "solid",
      size = "default",
      icon,
      leading,
      trailing,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    // Detect buttonStyle based on props
    const hasIcon = !!icon;
    const hasLeading = !!leading;
    const hasTrailing = !!trailing;

    let buttonStyle: "text" | "iconText" | "icon";
    let rightSection: React.ReactNode | undefined;
    let leftSection: React.ReactNode | undefined;
    let showText: boolean;

    if (hasIcon && !hasLeading && !hasTrailing) {
      // Icon buttonStyle: label + icon
      buttonStyle = "icon";
      rightSection = <Icon name={icon!} />;
      showText = false;
    } else if (hasLeading || hasTrailing) {
      // IconText buttonStyle: label + leading/trailing icons
      buttonStyle = "iconText";
      rightSection = hasTrailing ? <Icon name={trailing!} /> : undefined;
      leftSection = hasLeading ? <Icon name={leading!} /> : undefined;
      showText = true;
    } else {
      // Text buttonStyle: label only
      buttonStyle = "text";
      showText = true;
    }

    // If loading is true, disabled should also be true
    const isDisabled = disabled || loading;

    return (
      <ManButton
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label}
        loading={loading}
        loaderProps={{ children: <Icon name="arrow_path_outline" /> }}
        disabled={isDisabled}
        data-style={buttonStyle}
        rightSection={rightSection}
        leftSection={leftSection}
        classNames={styles}
        {...props}
      >
        {showText ? label : null}
      </ManButton>
    );
  },
);

ForwardedButton.displayName = "Button";

export const Button = createPolymorphicComponent<"button", ButtonProps>(
  ForwardedButton,
);
