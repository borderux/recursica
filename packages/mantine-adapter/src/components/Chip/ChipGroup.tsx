import {
  ChipGroup as MantineChipGroup,
  ChipGroupProps as MantineChipGroupProps,
} from "@mantine/core";
import { Children, cloneElement, isValidElement, ReactElement } from "react";

interface FigmaProps {
  /** If set to true, uses removable chips instead of selectable chips.  Removable and selectable are mutually exclusive.  Default is true*/
  Removable?: boolean;
}

type ChipGroupProps = MantineChipGroupProps & FigmaProps;

export const ChipGroup = (props: ChipGroupProps) => {
  const { Removable, children, ...rest } = props;
  const isRemovable = Removable !== undefined ? Removable : true;
  const clonedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<{ Removable?: boolean }>, {
        Removable: isRemovable,
      });
    }
    return child;
  });
  return <MantineChipGroup {...rest}>{clonedChildren}</MantineChipGroup>;
};

ChipGroup.displayName = "ChipGroup";
