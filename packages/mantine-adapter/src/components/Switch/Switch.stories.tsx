import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { Stack } from "../Stack/Stack";

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
    controlMaxWidth: { table: { disable: true } },
    controlMinWidth: { table: { disable: true } },
    emptyValueComponent: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    disabled: false,
    label: "Standard Switch",
  },
  // We explicitly destructure global Storybook injected arguments so they do not leak into the DOM natively.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Switch {...args} />,
};

export const SideBySideLayout: Story = {
  args: {
    label: "Opt-in form alignment",
    formLayout: "side-by-side",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Switch {...args} />,
};

export const StaticVariations: Story = {
  args: {},
  render: () => (
    <Stack gap="xl">
      <Switch label="Default Unchecked State" />
      <Switch label="Checked State" defaultChecked />
      <Switch label="Disabled Unchecked" disabled />
      <Switch label="Disabled Checked" defaultChecked disabled />
    </Stack>
  ),
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Switch {...args} />,
};

export const CustomReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Switch
      {...args}
      readOnlyComponent={({ checked, label }) => (
        <span style={{ fontWeight: "bold", color: checked ? "green" : "red" }}>
          {label} {checked ? "ENABLED" : "DISABLED"}
        </span>
      )}
    />
  ),
};
