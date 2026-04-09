import type { Meta, StoryObj } from "@storybook/react";
import { TextField } from "./TextField";
import { Layer } from "@recursica/adapter-common";

const meta: Meta<typeof TextField> = {
  title: "UI-Kit/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`TextField\` primitive functions as a universal text entry input natively integrated directly into the unified \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica forcibly overrides the internal Mantine \`Input.Wrapper\` defaults injecting an untamed \`<Input>\` layout primitive perfectly mapped back into our rigid design systems. State modifiers (e.g. Focus, Errors) hook flawlessly back onto our CSS module mapping variable colors strictly accurately.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<TextField 
  label="Primary Network Socket" 
  assistiveText="Ensure connections resolve seamlessly." 
  formLayout="stacked" 
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    formLayout: {
      control: "radio",
      options: ["stacked", "side-by-side"],
      description:
        "Controls the overarching grid format structure of the input component.",
    },
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

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: "Authentication Token",
    placeholder: "Enter validation hash...",
    assistiveText:
      "Tokens are stored identically locally and strictly ephemeral.",
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const FormsSideBySide: Story = {
  args: {
    label: "Distributed Access Control",
    placeholder: "admin@node.local",
    assistiveText:
      "Specify the exact cluster administrative credentials enforcing strict domain policies. This violently long string tests native textual wrapping safely mapping alongside inputs.",
    formLayout: "side-by-side",
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Search Global Context",
    placeholder: "Search for repositories...",
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
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const WithTrailingIcon: Story = {
  args: {
    label: "Validation URL",
    placeholder: "https://recursica.dev",
    rightSection: (
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
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Disabled Deployment Node",
    placeholder: "Disabled primitive map...",
    disabled: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const ErrorState: Story = {
  args: {
    label: "Cluster Failure",
    placeholder: "Failing component instance...",
    defaultValue: "Invalid Execution Plan",
    error:
      "Critical runtime node disconnect detected traversing DOM architecture.",
    required: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const StaticReadOnly: Story = {
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    value: "Explicitly Uneditable Bound Output",
    readOnly: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};

export const EditableReadOnly: Story = {
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    defaultValue: "Waiting for Edit Execution",
    readOnly: true,
    labelWithEditIcon: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <TextField {...args} />
    </Layer>
  ),
};
