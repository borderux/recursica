import {
  createPolymorphicComponent,
  Button as ManButton,
  type ButtonProps as ManButtonProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { styles } from "./Button.css";
import { type IconName, Icon } from "../Icons/Icon";

type FigmaVariantProps = {
  /** The style of the button */
  Style?: "solid" | "outline" | "text";
  /** The size of the button */
  Size?: "default" | "small";
  /** The disabled state of the button */
  Disabled?: boolean;
  /** The loading state of the button */
  Loading?: boolean;
  /** The trailing icon for iconText variant */
  TrailingIcon?: IconName;
  /** The label of the button */
  Label: string;
  /** The leading icon for iconText variant */
  LeadingIcon?: IconName;
  /** The icon for icon variant */
  Icon?: IconName;
};

export type ButtonProps = Omit<
  ManButtonProps,
  | "variant"
  | "size"
  | "disabled"
  | "loading"
  | "rightSection"
  | "label"
  | "leftSection"
> &
  FigmaVariantProps;

/** Primary UI component for user interaction */
export const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      Style: variant = "solid",
      Size: size = "default",
      Disabled: disabled = false,
      Loading: loading = false,
      TrailingIcon: trailing,
      Label: label,
      LeadingIcon: leading,
      Icon: icon,
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
