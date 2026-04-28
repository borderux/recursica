import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "UI-Kit/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Radio\` component represents a fundamental standalone boolean selection node mapping to the native HTML \`<input type="radio">\`. 

> [!WARNING]
> This component represents the isolated primitive structure. If you need macro form configurations, standard vertical alignments, side-by-side array wrappers, or integrated assistive text and error borders natively, you MUST use the \`<Radio.Group>\` orchestrator instead!
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
    readOnly: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    defaultChecked: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Standard Radio Primitive",
  },
};

export const CheckedState: Story = {
  args: {
    ...Default.args,
    defaultChecked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    ...Default.args,
    disabled: true,
    defaultChecked: true,
  },
};

export const ReadOnlyStandalone: Story = {
  args: {
    readOnly: true,
    readOnlyComponent: <span>Locked Native Value</span>,
  },
};
