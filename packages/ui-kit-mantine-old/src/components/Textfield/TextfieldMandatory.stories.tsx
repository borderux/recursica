import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Textfield } from "./Textfield";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Textfield/Mandatory",
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
    onChange: fn(),
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

export const LabelMandatory: Story = {
  args: {},
};

export const LabelMandatoryWithError: Story = {
  args: {
    error: "Error message",
  },
};

export const LabelMandatoryDisabled: Story = {
  args: {
    disabled: true,
  },
};

export const LabelMandatoryWithHelpText: Story = {
  args: {
    helpText: "Help text",
  },
};

export const LabelMandatoryWithLeadingIcon: Story = {
  args: {
    leadingIcon: "academic_cap_outline",
  },
};

export const LabelMandatoryWithTrailingIcon: Story = {
  args: {
    trailingIcon: "adjustments_horizontal_outline",
  },
};

export const LabelMandatoryValued: Story = {
  args: {
    value: "Value",
  },
};

export const LabelMandatoryValuedWithError: Story = {
  args: {
    value: "Value",
    error: "Error message",
  },
};

export const LabelMandatoryValuedDisabled: Story = {
  args: {
    value: "Value",
    disabled: true,
  },
};

export const LabelMandatoryValuedHelpText: Story = {
  args: {
    value: "Value",
    helpText: "Help text",
  },
};

export const LabelMandatoryValuedLeadingIcon: Story = {
  args: {
    value: "Value",
    leadingIcon: "academic_cap_outline",
  },
};

export const LabelMandatoryValuedTrailingIcon: Story = {
  args: {
    value: "Value",
    trailingIcon: "adjustments_horizontal_outline",
  },
};

export const LabelMandatoryValuedReadOnly: Story = {
  args: {
    value: "Value",
    readOnly: true,
  },
};
