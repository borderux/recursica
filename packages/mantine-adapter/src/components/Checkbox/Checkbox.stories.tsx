import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI-Kit/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Checkbox\` component is a precisely engineered, atomic form primitive representing boolean states natively aligned to the Recursica design system. It overrides Mantine's standard properties explicitly enforcing our variables natively across all structural boundaries.

> [!IMPORTANT]  
> The atomic \`Checkbox\` is intended primarily as an internal primitive. **When wrapping multiple Checkbox elements together or rendering form controls, always utilize the \`<Checkbox.Group>\` component.** \`Checkbox.Group\` inherits the global \`FormControlWrapper\`, granting instantaneous access to macroscopic layout structuring, assistive descriptions, validation errors, and strict flex arrays.

### Usage
To render a solitary component natively:
\`\`\`tsx
<Checkbox label="Acknowledge Terms" defaultChecked />
\`\`\`
`,
      },
    },
  },
  argTypes: {
    disabled: {
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

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    disabled: false,
    label: "Standard Unchecked Property",
  },
};

export const LongLabelWrap: Story = {
  args: {
    label:
      "A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries.",
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
      <Checkbox label="Default Unchecked State" />
      <Checkbox label="Acknowledge Configuration" defaultChecked />
      <Checkbox label="Indeterminate Master" indeterminate />
      <Checkbox label="Disabled Variant" disabled />
      <Checkbox label="Disabled Checked Variant" checked disabled />
    </div>
  ),
};
