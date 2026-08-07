import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "./TimePicker";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof TimePicker> = {
  title: "UI-Kit/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`TimePicker\` primitive provides a masked \`HH:mm\` (optionally \`HH:mm:ss\`) time entry input integrated directly into the \`FormControlWrapper\` architecture. Unlike \`DatePicker\`, it has no calendar/dropdown UI.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<TimePicker
  label="Start Time"
  assistiveText="Select the deployment kick-off time."
  formLayout="stacked"
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    ...formControlArgTypes,
    disabled: {
      control: "boolean",
      description:
        "Maps the formal disabled variable states structurally to the input core.",
    },
    error: {
      control: "text",
      description:
        "Applies the strict error string boundary rendering invalid structures seamlessly.",
    },
    required: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    assistiveText: {
      control: "text",
    },
    readOnly: {
      control: "boolean",
      description:
        "Toggles structural read-only data presentation explicitly blocking standard component bindings.",
    },
    withSeconds: {
      control: "boolean",
      description: "Shows and allows editing the seconds segment.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {
    disabled: false,
    label: "Meeting Time",
    assistiveText: "Choose the start time in your local timezone.",
  },
};

export const FormsSideBySide: Story = {
  args: {
    label: "Incident Start Time",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side",
  },
};

export const WithSeconds: Story = {
  args: {
    label: "Precise Execution Time",
    assistiveText: "Includes a seconds segment for exact scheduling.",
    withSeconds: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Time Slot",
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Deployment Window",
    error: "The chosen time falls outside the allowed deployment window.",
    required: true,
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "Static ReadOnly Review",
    value: "14:30",
    readOnly: true,
  },
};

export const EditableReadOnly: Story = {
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: "09:00",
    readOnly: true,
    labelWithEditIcon: true,
  },
};
