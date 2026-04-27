import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "UI-Kit/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Switch\` component is an atomic form primitive representing boolean states, natively aligned to the Recursica design system.

> [!IMPORTANT]  
> Unlike \`Checkbox\`, the \`Switch\` is typically used for standalone settings toggles. It fully supports the universal \`ReadOnlyField\` boundaries when passed the \`readOnly\` attribute.

### Usage
To render a standard switch:
\`\`\`tsx
<Switch label="Enable Notifications" defaultChecked />
\`\`\`
`,
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    defaultChecked: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
      description:
        "Toggles structural read-only data presentation bypassing interaction boundaries completely.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    disabled: false,
    label: "Standard Switch",
  },
};

export const StaticVariations: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Switch label="Default Unchecked State" />
      <Switch label="Checked State" defaultChecked />
      <Switch label="Disabled Unchecked" disabled />
      <Switch label="Disabled Checked" defaultChecked disabled />
    </div>
  ),
};

export const StaticReadOnly: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Switch
        label="Read Only Switch"
        readOnly
        readOnlyComponent={<span>Enabled</span>}
      />
    </div>
  ),
};
