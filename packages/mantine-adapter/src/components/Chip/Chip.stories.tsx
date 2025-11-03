/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";
import { LAYER_ARG_TYPES } from "../Layer/stories.util";
import { Layer } from "../Layer";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    ...LAYER_ARG_TYPES,
    id: {
      control: "text",
      description: "Id of the chip used to identify it",
    },
    Selected: {
      control: "boolean",
      description: "Set to true or false if chip shows selected state",
    },
    Leading_Icon: {
      control: { type: "select" },
      options: [] as string[],
      description:
        "Icon to show. If selected is true, the chip selected icon will overlay this icon",
    },
    Label: {
      control: "text",
      description: "Label to show on the chip",
    },
    Error: {
      control: "boolean",
      description: "Shows the error state of the chip",
    },
    Removable: {
      control: "boolean",
      description: "If set to true, shows the X icon and chip can be removed",
    },
    disabled: {
      control: "boolean",
      description: "If set to true, the chip is disabled",
    },
    onChange: {
      table: { disable: true },
    },
    onClose: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
  } as any,
  parameters: {
    controls: {
      include: [
        "Layer",
        "id",
        "Selected",
        "Leading_Icon",
        "Label",
        "Error",
        "Removable",
        "disabled",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta> & {
  args?: any;
};

export const Default: Story = {
  args: {
    Layer: "layer-0",
    id: "chip-1",
    Selected: false,
    Leading_Icon: undefined,
    Label: "Chip",
    Error: false,
    Removable: true,
    disabled: false,
  },
  render: (args: any) => {
    const { Layer: layer, ...chipProps } = args;
    return (
      <Layer Layer={layer}>
        <Chip {...chipProps} />
      </Layer>
    );
  },
};
