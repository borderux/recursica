import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Textfield } from "./Textfield";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Textfield/OverflowNoWrap",
  component: Textfield,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    disabled: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    label: {
      control: "text",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    label: "Textfield",
    placeholder: "Placeholder",
    isOptional: true,
    onChange: fn(),
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(args.value);
    return (
      <Textfield
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    );
  },
} satisfies Meta<typeof Textfield>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOptionalValued: Story = {
  args: {},
};

export const LabelOptionalValuedWithError: Story = {
  args: {
    error: "Error message",
  },
};

export const LabelOptionalValuedDisabled: Story = {
  args: {
    disabled: true,
  },
};

export const LabelOptionalValuedHelpText: Story = {
  args: {
    helpText: "Help text",
  },
};

export const LabelOptionalValuedLeadingIcon: Story = {
  args: {
    leadingIcon: "academic_cap_outline",
  },
};

export const LabelOptionalValuedTrailingIcon: Story = {
  args: {
    trailingIcon: "adjustments_horizontal_outline",
  },
};

export const LabelOptionalValuedReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
