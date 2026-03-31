/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Chip as MantineChip,
  ChipProps as MantineChipProps,
} from "@mantine/core";
import { IconName, Icon } from "../Icon/Icon";
import * as styles from "./Chip.css";

export type ChipValue = string | number | readonly string[] | undefined;

interface FigmaProps {
  /** Id of the chip used to identify it */
  id: string;
  /** Set to true or false if chip shows selected state */
  Selected?: boolean;
  /** Icon to show.  If selected is true, the chip selected icon will overlay this icon */
  Leading_Icon?: IconName;
  /** Label to show on the chip */
  Label?: React.ReactNode;
  /** Shows the error state of the chip */
  Error?: boolean;
  /** Updated onChange that provides more details than Mantine onChange */
  onChange?: (isSelected: boolean, value: ChipValue, id: string) => void;
  /** Called when chip is removed. TODO: don't understand what it means for a chip to be selectable and removable */
  onClose?: (value: ChipValue, id: string) => void;
  /** If set to true, shows the X icon and chip can be removed */
  Removable?: boolean;
}
type MantineWithUnsupportedPropsRemoved = Omit<
  MantineChipProps,
  "variant" | "size" | "color" | "autoContrast"
>;
export type ChipProps = MantineWithUnsupportedPropsRemoved & FigmaProps;

interface ChipChildProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

const ChipChild = (props: ChipChildProps) => {
  const { onClose, children } = props;
  const handleClose = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClose?.();
  };
  return (
    <>
      {children}
      {onClose ? <Icon name="x_mark_solid" onClick={handleClose} /> : null}
    </>
  );
};

/**
 * The Recursica Chip component is different than the Mantine Chip component that it allows chips to be deleted
 * Its default behavior is a checkbox/checkbox group.
 *
 * Usage:
 * - Standalone: Use `checked` and `onChange(checked: boolean)`. The onChange callback only provides the boolean state,
 *   so if you need to identify which chip was clicked, use the `id` prop or wrap onChange in a closure.
 * - In ChipGroup: Use `value` prop to identify the chip. The ChipGroup's onChange will provide the selected value(s).
 */
export const Chip = (props: ChipProps) => {
  const {
    Selected,
    Leading_Icon,
    Label,
    Error,
    Removable,
    onClose,
    onChange,
    children,
    ...rest
  } = props;

  const onChangeHandler = (checked: boolean) => {
    onChange?.(checked, rest.value, rest.id);
  };

  const onCloseHandler = Removable
    ? () => {
        onClose?.(rest.value, rest.id);
      }
    : undefined;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      Removable &&
      onClose &&
      (event.key === "Delete" || event.key === "Backspace")
    ) {
      event.preventDefault();
      event.stopPropagation();
      onClose(rest.value, rest.id);
    }
    // Call the original onKeyDown if provided
    rest.onKeyDown?.(event);
  };

  // Transform Figma props to Mantine props
  const mantineProps = {
    ...rest,
    variant: "outline", // We only support outline variant
    size: undefined, // Mantine Chip does not support size
    color: undefined, // Mantine Chip does not support color
    autoContrast: undefined, // Mantine Chip does not support autoContrast
    checked: Selected || rest.checked,
    onChange: onChangeHandler,
    icon: Leading_Icon ? <Icon name={Leading_Icon} /> : props.icon,
    onClose: onCloseHandler,
    onKeyDown: handleKeyDown,
    classNames: {
      label: styles.label,
      ...rest.classNames,
    },
  };

  return (
    <MantineChip {...mantineProps}>
      <ChipChild onClose={Removable ? onCloseHandler : undefined}>
        {Label ?? children}
      </ChipChild>
    </MantineChip>
  );
};

Chip.displayName = "Chip";
