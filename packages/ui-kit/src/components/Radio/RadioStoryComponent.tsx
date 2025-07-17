import { Radio } from "./Radio";

interface RadioStory {
  value: string;
  label: string;
  showLabel?: boolean;
  disabled?: boolean;
}

interface RadioStoryComponentProps {
  radios: RadioStory[];
  label: string;
  optional?: boolean;
  defaultValue?: string;
}
export function RadioStoryComponent({
  radios,
  label,
  optional,
  defaultValue,
}: RadioStoryComponentProps) {
  return (
    <Radio.Group
      name="favoriteFramework"
      label={label}
      optional={optional}
      defaultValue={defaultValue}
    >
      {radios.map(({ value, label, disabled, showLabel }) => (
        <Radio
          key={value}
          value={value}
          label={label}
          disabled={disabled}
          showLabel={showLabel}
        />
      ))}
    </Radio.Group>
  );
}
