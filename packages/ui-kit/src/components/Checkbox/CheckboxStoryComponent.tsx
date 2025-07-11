import { Checkbox } from "./Checkbox";

interface CheckboxStory {
  value: string;
  label: string;
  disabled?: boolean;
  indeterminate?: boolean;
  checked?: boolean;
  showLabel?: boolean;
}

interface CheckboxStoryComponentProps {
  checkboxes: CheckboxStory[];
  label: string;
  optional?: boolean;
  defaultValue?: string[];
  value?: string[];
}
export function CheckboxStoryComponent({
  checkboxes,
  label,
  optional,
  defaultValue,
  value,
}: CheckboxStoryComponentProps) {
  return (
    <Checkbox.Group
      label={label}
      optional={optional}
      defaultValue={defaultValue}
      value={value}
    >
      {checkboxes.map(
        ({ value, label, disabled, indeterminate, checked, showLabel }) => (
          <Checkbox
            key={value}
            value={value}
            label={label}
            disabled={disabled}
            showLabel={showLabel}
            indeterminate={indeterminate}
            checked={checked}
          />
        ),
      )}
    </Checkbox.Group>
  );
}
