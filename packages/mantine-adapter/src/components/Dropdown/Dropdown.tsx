import { Select, type SelectProps } from "./Select";
import { Multiselect, type MultiselectProps } from "./Multiselect";
import { IconName } from "../Icons/Icon";
import { ComboboxItem } from "../../types";
import { type LayoutProps } from "../base/FormControlLayout/FormControlLayout";

export type FigmaProps = LayoutProps & {
  /** The icon to display in the left section of the dropdown */
  LeadIcon?: IconName;
  /** The label of the dropdown */
  Label: string;
  /** The error text of the dropdown */
  Error?: string;
  /** Whether the dropdown is disabled */
  Disabled: boolean;
  /**
   * The data to display in the dropdown.
   */
  data: ComboboxItem[];
};

export type DropdownProps = SelectProps | MultiselectProps;

export function Dropdown(props: DropdownProps) {
  return props.Content === "Value" ? (
    <Select {...props} />
  ) : (
    <Multiselect {...props} />
  );
}
