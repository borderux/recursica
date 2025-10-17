import {
  type MultiSelectProps,
  ComboboxLikeRenderOptionInput,
  Flex,
  MultiSelect,
} from "@mantine/core";
import { styles, errorContainer, optionStyle } from "./Dropdown.css";
import { Icon } from "../Icons/Icon";
import { forwardRef } from "react";
import type { ComboboxItem } from "../../types";
import { FigmaProps } from "./Dropdown";

export type MultiselectProps = Omit<MultiSelectProps, "data"> &
  FigmaProps & {
    Content: "Multiple values";
  };
const renderSelectOption: (
  item: ComboboxLikeRenderOptionInput<ComboboxItem>,
) => React.ReactNode = ({ option }) => (
  <Flex className={optionStyle} align="center" onClick={option.onClick}>
    {option.icon ? <Icon name={option.icon} /> : undefined}
    {option.label}
  </Flex>
);

export const Multiselect = forwardRef<HTMLInputElement, MultiselectProps>(
  (
    {
      Label: label,
      Error,
      LeadIcon: leadingIcon,
      Layout = "Stacked",
      Disabled,
      data,
      value,
      ...props
    },
    ref,
  ) => {
    return (
      <MultiSelect
        {...props}
        comboboxProps={{
          offset: 2,
        }}
        ref={ref}
        withCheckIcon={false}
        withScrollArea={false}
        classNames={styles}
        wrapperProps={{
          "data-form-control-layout": Layout,
        }}
        label={label}
        aria-label={label}
        error={
          Error ? (
            <Flex className={errorContainer}>
              <Icon name="exclamation_circle_outline" size={16} />
              <span>{Error}</span>
            </Flex>
          ) : undefined
        }
        renderOption={renderSelectOption}
        leftSectionPointerEvents="none"
        leftSection={leadingIcon ? <Icon name={leadingIcon} /> : undefined}
        rightSection={<Icon name="chevron_down_outline" />}
        data={data}
        value={value}
        disabled={Disabled}
      />
    );
  },
);

Multiselect.displayName = "Dropdown";
