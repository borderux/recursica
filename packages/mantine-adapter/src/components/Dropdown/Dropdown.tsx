import { type SelectProps, Select } from "@mantine/core";
import { Flex } from "../Flex/Flex";
import { styles, errorContainer, optionStyle } from "./Dropdown.css";
import { Icon, type IconName } from "../Icons/Icon";
import { forwardRef } from "react";
import type { ComboboxItem } from "../../types";

type FigmaVariantProps = {
  /** The label of the dropdown */
  Layout: "Stacked" | "Side by Side";
  /** The icon to display in the left section of the dropdown */
  LeadIcon?: IconName;
  /** The label of the dropdown */
  Label: string;
  /** The error text of the dropdown */
  ErrorText?: string;
  /**
   * The data to display in the dropdown.
   */
  data: ComboboxItem[];
};

export type DropdownProps = Omit<SelectProps, "data" | "label"> &
  FigmaVariantProps;

const renderSelectOption: SelectProps["renderOption"] = ({ option }) => (
  <Flex className={optionStyle} align="center" onClick={option.onClick}>
    {option.icon ? <Icon name={option.icon} /> : undefined}
    {option.label}
  </Flex>
);

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      Label: label,
      error,
      LeadIcon: leadingIcon,
      Layout: labelPlacement = "Stacked",
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
        label={label}
        aria-label={label}
        error={
          error ? (
            <Flex className={errorContainer}>
              <Icon name="exclamation_circle_outline" size={16} />
              <span>{error}</span>
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
