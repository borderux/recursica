import { type SelectProps, Select } from "@mantine/core";
import { Flex } from "../Flex/Flex";
import {
  styles,
  errorContainer,
  labelContainer,
  optionStyle,
} from "./Dropdown.css";
import { Icon, type IconName } from "../Icons/Icon";
import { Typography } from "../Typography";
import { forwardRef } from "react";
import type { ComboboxItem } from "../../types";

export type DropdownProps = Pick<
  SelectProps,
  | "onChange"
  | "placeholder"
  | "disabled"
  | "error"
  | "defaultValue"
  | "value"
  | "readOnly"
> & {
  /**
   * The data to display in the dropdown.
   */
  data: ComboboxItem[];
  /**
   * The label of the dropdown.
   */
  label: string;
  /**
   * Whether to show the label @default true
   */
  showLabel?: boolean;
  /**
   * The icon to display in the left section of the dropdown. @default undefined
   */
  leadingIcon?: IconName;
  /**
   * Whether the label is optional. @default false
   */
  isOptional?: boolean;
};

const renderSelectOption: SelectProps["renderOption"] = ({ option }) => (
  <Flex className={optionStyle} onClick={option.onClick}>
    {option.icon ? <Icon name={option.icon} /> : undefined}
    {option.label}
  </Flex>
);

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      label,
      error,
      leadingIcon,
      isOptional = false,
      showLabel = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Select
        comboboxProps={{
          offset: 2,
        }}
        ref={ref}
        withCheckIcon={false}
        withScrollArea={false}
        classNames={styles}
        label={
          showLabel ? (
            isOptional ? (
              <Flex className={labelContainer}>
                <Typography variant="body-2/normal">{label}</Typography>
                <Typography
                  variant="caption"
                  color="form/label/color/optional indicator"
                >
                  (optional)
                </Typography>
              </Flex>
            ) : (
              <Typography variant="body-2/normal">{label}</Typography>
            )
          ) : undefined
        }
        aria-label={label}
        error={
          error ? (
            <Flex className={errorContainer}>
              <Icon name="error_Outlined" size={16} />
              <Typography variant="caption">{error}</Typography>
            </Flex>
          ) : undefined
        }
        renderOption={renderSelectOption}
        leftSectionPointerEvents="none"
        leftSection={leadingIcon ? <Icon name={leadingIcon} /> : undefined}
        rightSection={<Icon name="keyboard_arrow_down_Outlined" />}
        {...props}
      />
    );
  },
);

Dropdown.displayName = "Dropdown";
