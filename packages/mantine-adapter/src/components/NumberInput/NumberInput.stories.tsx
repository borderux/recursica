import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "UI-Kit/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    assistiveText: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    hideControls: { control: "boolean" },
    formLayout: {
      control: "select",
      options: ["stacked", "side-by-side"],
    },
    labelSize: {
      control: "select",
      options: ["small", "default", "large"],
    },
    assistiveWithIcon: { table: { disable: true } },
    labelOptionalText: { table: { disable: true } },
    labelWithEditIcon: { table: { disable: true } },
    onLabelEditClick: { table: { disable: true } },
    emptyValueComponent: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    label: "Amount",
    placeholder: "Enter an amount",
    assistiveText: "Must be greater than 0",
    defaultValue: 10,
    min: 0,
    max: 100,
  },
};

export const SideBySideLayout: Story = {
  args: {
    ...Default.args,
    formLayout: "side-by-side",
  },
};

export const States: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 400,
      }}
    >
      <NumberInput label="Default" placeholder="Enter a number" />
      <NumberInput label="Disabled" placeholder="Disabled input" disabled />
      <NumberInput label="Error" placeholder="Error state" error />
      <NumberInput label="Read Only" value={42} readOnly />
      <NumberInput label="Required" required />
    </div>
  ),
};

export const WithLeftIcon: Story = {
  args: {
    label: "Price",
    placeholder: "0.00",
    leftSection: <span>$</span>,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Percentage",
    placeholder: "0",
    rightSection: <span>%</span>,
    hideControls: true, // Typically hiding controls if rightSection is occupied
  },
};

export const HiddenControls: Story = {
  args: {
    label: "Zip Code",
    placeholder: "Enter zip code",
    hideControls: true,
  },
};
