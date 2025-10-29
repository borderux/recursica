/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { Layer } from "./Layer";
import { LAYER_ARG_TYPES } from "./stories.util";

const meta: Meta<typeof Layer> = {
  title: "Components/Layer",
  component: Layer,
  argTypes: {
    ...LAYER_ARG_TYPES,
  },
  parameters: {
    controls: {
      include: ["Layer"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    layer: "0",
    children: "Layer 0 content",
  },
};
