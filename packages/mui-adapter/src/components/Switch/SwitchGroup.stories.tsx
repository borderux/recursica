import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { SwitchGroup } from "./SwitchGroup";
import { useState } from "react";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof SwitchGroup> = {
  title: "UI-Kit/SwitchGroup",
  component: SwitchGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`SwitchGroup\` component is the mandatory organizational wrapper for orchestrating \`Switch\` primitives into macro form layouts. It inherently leverages the \`FormControlWrapper\`, granting native access to structural alignments, assistive descriptions, and strict flex arrays.

### Supported Layout Vectors
- **\`formLayout="stacked"\`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked switch array.
- **\`formLayout="side-by-side"\`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal switches cleanly alongside it horizontally.

> [!IMPORTANT]  
> If you require a solitary \`Switch\` field to natively accept an overarching form label, assistive text, or align with other side-by-side components in a form column, you must wrap it inside a \`Switch.Group\` to trigger the \`FormControlWrapper\` mapping.
`,
      },
    },
  },
  argTypes: {
    ...formControlArgTypes,
    readOnly: {
      control: "boolean",
      description:
        "Passes read-only lock natively down mapping inner switches into explicitly disabled states.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SwitchGroup>;

export const Default: Story = {
  args: {
    formLayout: "stacked",
    label: "Standard Group",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({ withLayer, layer, ...args }: any) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="1" label="Option 1" />
        <Switch value="2" label="Option 2" />
      </SwitchGroup>
    );
  },
};

export const StackedLayout: Story = {
  args: {
    formLayout: "stacked",
    label: "Notification Settings",
    description: "Manage your preferences.",
    assistiveText: "We recommend turning these on.",
    error: "",
    required: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({ withLayer, layer, ...args }: any) {
    const [value, setValue] = useState<string[]>(["email"]);
    return (
      <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>
    );
  },
};

export const SideBySideLayout: Story = {
  args: {
    ...StackedLayout.args,
    formLayout: "side-by-side",
    labelSize: "default",
    labelAlignment: "left",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({ withLayer, layer, ...args }: any) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="weekly" label="Weekly Digest" />
        <Switch value="marketing" label="Marketing Emails" />
      </SwitchGroup>
    );
  },
};

export const SolitaryFormControl: Story = {
  args: {
    formLayout: "side-by-side",
    label: "Enable Backups",
    description: "Automatically back up your data nightly.",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({ withLayer, layer, ...args }: any) {
    const [value, setValue] = useState<string[]>(["auto"]);
    return (
      <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="auto" label="Auto-backup" />
      </SwitchGroup>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    ...StackedLayout.args,
    readOnly: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: function StoryRender({ withLayer, layer, ...args }: any) {
    const [value, setValue] = useState<string[]>(["email", "sms"]);
    return (
      <SwitchGroup {...args} value={value} onChange={setValue}>
        <Switch value="email" label="Email Alerts" />
        <Switch value="push" label="Push Notifications" />
        <Switch value="sms" label="SMS Messages" />
      </SwitchGroup>
    );
  },
};
