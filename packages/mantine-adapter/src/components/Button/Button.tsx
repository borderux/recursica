import {
  createPolymorphicComponent,
  Button as ManButton,
  type ButtonProps as ManButtonProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { styles } from "./Button.css";
import { type IconName, Icon } from "../Icons/Icon";

type IconStyle = {
  /** The content of the button */
  Content: "Icon";
  /** The icon of the button */
  Icon: IconName;
};

type TextStyle = {
  /** The content of the button */
  Content: "Text";
  /** The trailing icon of the button */
  TrailingIcon?: IconName;
};

type IconTextStyle = {
  /** The content of the button */
  Content: "IconText";
  /** The leading icon of the button */
  LeadingIcon: IconName;
  /** The trailing icon of the button */
  TrailingIcon?: IconName;
};

type FigmaProps = {
  /** The style of the button */
  Style?: "solid" | "outline" | "ghost";
  /** The size of the button */
  Size?: "default" | "small";
  /** The disabled state of the button */
  Disabled?: boolean;
  /** The loading state of the button */
  Loading?: boolean;
  /** The label of the button */
  Label: string;
  /** The content of the button */
  Content: "Icon" | "Text" | "IconText";
} & (IconStyle | TextStyle | IconTextStyle);

export type ButtonProps = ManButtonProps & FigmaProps;

/** Primary UI component for user interaction */
export const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      Style = "solid",
      Size = "default",
      Disabled = false,
      Loading = false,
      Label,
      Content,
      ...props
    },
    ref,
  ) => {
    let rightSection: React.ReactNode | undefined;
    let leftSection: React.ReactNode | undefined;
    let showText: boolean;

    switch (Content) {
      case "Icon": {
        const { Icon: iconName } = props as IconStyle;
        rightSection = <Icon size={20} name={iconName} />;
        showText = false;
        break;
      }
      case "IconText": {
        const { LeadingIcon: leadingIconName, TrailingIcon: trailingIconName } =
          props as IconTextStyle;
        leftSection = <Icon size={20} name={leadingIconName} />;
        rightSection = trailingIconName ? (
          <Icon size={20} name={trailingIconName} />
        ) : undefined;
        showText = true;
        break;
      }
      default: {
        const { TrailingIcon: trailingIconName } = props as TextStyle;
        rightSection = trailingIconName ? (
          <Icon size={20} name={trailingIconName} />
        ) : undefined;
        showText = true;
        break;
      }
    }
    // If loading is true, disabled should also be true
    const isDisabled = Disabled || Loading;

    return (
      <ManButton
        {...props}
        ref={ref}
        variant={Style}
        size={Size}
        aria-label={Label}
        loading={Loading}
        loaderProps={{ children: <Icon size={20} name="arrow_path_outline" /> }}
        disabled={isDisabled}
        data-content={Content}
        rightSection={rightSection}
        leftSection={leftSection}
        classNames={styles}
      >
        {showText ? Label : null}
      </ManButton>
    );
  },
);

ForwardedButton.displayName = "Button";

/**
 * Make the button polymorphic to any component
 */
export const Button = createPolymorphicComponent<"button", ButtonProps>(
  ForwardedButton,
);
