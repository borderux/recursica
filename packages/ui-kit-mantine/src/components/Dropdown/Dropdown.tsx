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
  /**
   * The placement of the label relative to the dropdown. @default 'top'
   */
  labelPlacement?: "top" | "left";
};

const renderSelectOption: SelectProps["renderOption"] = ({ option }) => (
  <Flex className={optionStyle} align="center" onClick={option.onClick}>
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
      labelPlacement = "top",
      data,
      value,
      ...props
    },
    ref,
  ) => {
    const selectedOption = data.find((item) => item.value === value);
    const displayIcon = selectedOption?.icon || leadingIcon;

    return (
      <Select
        comboboxProps={{
          offset: 2,
        }}
        ref={ref}
        withCheckIcon={false}
        withScrollArea={false}
        classNames={styles}
        wrapperProps={{
          "data-label-placement": labelPlacement,
        }}
        label={
          showLabel ? (
            isOptional ? (
              <Flex className={labelContainer}>
                <Typography variant="body-2/normal">{label}</Typography>
                <Typography
                  variant="caption"
                  opacity={0.84}
                  color="form/value+placeholder/color/input-value"
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
              <Icon name="exclamation_circle_outline" size={16} />
              <Typography variant="caption">{error}</Typography>
            </Flex>
          ) : undefined
        }
        renderOption={renderSelectOption}
        leftSectionPointerEvents="none"
        leftSection={displayIcon ? <Icon name={displayIcon} /> : undefined}
        rightSection={<Icon name="chevron_down_outline" />}
        data={data}
        value={value}
        {...props}
      />
    );
  },
);

Dropdown.displayName = "Dropdown";
