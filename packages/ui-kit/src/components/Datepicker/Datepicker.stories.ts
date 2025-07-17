import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Datepicker } from "./Datepicker";

const meta = {
  title: "Datepicker",
  component: Datepicker,
  parameters: {},
  tags: ["autodocs"],
  args: {
    label: "Datepicker",
    onChange: fn(),
  },
} satisfies Meta<typeof Datepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
