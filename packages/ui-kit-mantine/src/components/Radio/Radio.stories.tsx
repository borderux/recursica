import type { Meta, StoryObj } from "@storybook/react";
import { RadioStoryComponent } from "./RadioStoryComponent";

const meta = {
  title: "Radio",
  component: RadioStoryComponent,
  decorators: [],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof RadioStoryComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HideLabel: Story = {
  args: {
    label: "Select your radio option",
    radios: [
      { value: "rad1", label: "Radio 1", showLabel: false },
      {
        value: "rad2",
        label: "Radio 2 Lorem ipsum dolor sit amet",
        showLabel: false,
      },
      { value: "rad3", label: "Radio 3", disabled: true, showLabel: false },
    ],
  },
};

export const Default: Story = {
  args: {
    label: "Select your radio option",
    radios: [
      { value: "rad1", label: "Radio 1" },
      { value: "rad2", label: "Radio 2 Lorem ipsum dolor sit amet" },
      { value: "rad3", label: "Radio 3", disabled: true },
    ],
  },
};

export const Optional: Story = {
  args: {
    label: "Select your radio option",
    optional: true,
    radios: [
      { value: "rad1", label: "Radio 1" },
      { value: "rad2", label: "Radio 2 Lorem ipsum dolor sit amet" },
      { value: "rad3", label: "Radio 3", disabled: true },
    ],
  },
};

export const Controlled: Story = {
  args: {
    label: "Select your radio option",
    defaultValue: "rad3",
    radios: [
      { value: "rad1", label: "Radio 1" },
      { value: "rad2", label: "Radio 2 Lorem ipsum dolor sit amet" },
      { value: "rad3", label: "Radio 3", disabled: true },
    ],
  },
};
