import {
  type SelectProps as MantineSelectProps,
  Select as MantineSelect,
  ComboboxLikeRenderOptionInput,
  Flex,
} from "@mantine/core";
import { styles, errorContainer, optionStyle } from "./Dropdown.css";
import { Icon } from "../Icons/Icon";
import { forwardRef } from "react";
import type { ComboboxItem } from "../../types";
import { FigmaProps } from "./Dropdown";

export type SelectProps = Omit<MantineSelectProps, "data"> &
  FigmaProps & {
    Content: "Value";
  };
const renderSelectOption: (
  item: ComboboxLikeRenderOptionInput<ComboboxItem>,
) => React.ReactNode = ({ option }) => (
  <Flex className={optionStyle} align="center" onClick={option.onClick}>
    {option.icon ? <Icon name={option.icon} /> : undefined}
    {option.label}
  </Flex>
);

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      Label: label,
      Error,
      LeadIcon,
      Layout = "Stacked",
      Disabled,
      data,
      value,
      ...props
    },
    ref,
  ) => {
    const selectedOption = data.find((item) => item.value === value);
    const displayIcon = selectedOption?.icon || LeadIcon;

    return (
      <MantineSelect
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
        leftSection={displayIcon ? <Icon name={displayIcon} /> : undefined}
        rightSection={<Icon name="chevron_down_outline" />}
        data={data}
        value={value}
        disabled={Disabled}
      />
    );
  },
);

Select.displayName = "Dropdown";
