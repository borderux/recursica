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
The \`TimePicker\` primitive provides a segmented hour/minute (optionally seconds) time entry input integrated directly into the \`FormControlWrapper\` architecture. By default it renders in 12-hour format with a dedicated AM/PM selector — a Recursica-specific deviation from Mantine's own 24-hour default. Pass \`hideAmPm\` for a plain 24-hour input instead.

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
    hideAmPm: {
      control: "boolean",
      description:
        "Hides the AM/PM selector and switches to 24-hour entry. Recursica-specific; defaults to false (12-hour + AM/PM).",
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

export const HiddenAmPm: Story = {
  args: {
    label: "24-Hour Time",
    assistiveText: "hideAmPm switches to a plain 24-hour input.",
    hideAmPm: true,
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
