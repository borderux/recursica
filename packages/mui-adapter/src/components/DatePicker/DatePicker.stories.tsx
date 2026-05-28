import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof DatePicker> = {
  title: "UI-Kit/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`DatePicker\` primitive provides a unified calendar date selection input integrated directly into the \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica overrides the internal Mantine \`DatePickerInput\` wrapper defaults, safely injecting the date picker into our rigid structural layout systems. State modifiers (e.g. Focus, Errors, ReadOnly) hook seamlessly back onto our native CSS mapping architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<DatePicker 
  label="Start Date" 
  assistiveText="Select the deployment kick-off date." 
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
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    disabled: false,
    label: "Project Deadline",
    placeholder: "Select a deadline...",
    assistiveText: "Specify the absolute cutoff for code submission.",
  },
};

export const FormsSideBySide: Story = {
  args: {
    label: "Incident Start Date",
    placeholder: "Pick date...",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Launch Date",
    placeholder: "Select launch date...",
    leftSection: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Date Range",
    placeholder: "Disabled selection...",
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Execution Date",
    placeholder: "Pick a valid date...",
    error: "The chosen date conflicts with an existing deployment freeze.",
    required: true,
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    value: new Date("2026-05-21"),
    readOnly: true,
  },
};

export const EditableReadOnly: Story = {
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    defaultValue: new Date("2026-06-01"),
    readOnly: true,
    labelWithEditIcon: true,
  },
};
