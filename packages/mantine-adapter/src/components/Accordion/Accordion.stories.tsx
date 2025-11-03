/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { LAYER_ARG_TYPES } from "../Layer/stories.util";
import { Layer as LayerComponent } from "../Layer";

const PlaceholderContent = () => (
  <span
    style={{
      padding: "20px",
      backgroundColor: "#f6d5d8",
      display: "block",
    }}
  >
    Replace slot with content (component instance)
  </span>
);

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: {
    // Hide all actual component props from controls
    children: { table: { disable: true } },
    classNames: { table: { disable: true } },
    Divider: {
      control: { type: "boolean" },
      description: "Whether to show a divider between accordion items",
      defaultValue: true,
    },
    ...LAYER_ARG_TYPES,
  },
  parameters: {
    controls: {
      include: ["Title", "Divider", "Layer"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta> & {
  args: {
    Title?: string;
  };
};

export const Default: Story = {
  args: {
    Title: "Accordion",
    Divider: true,
    Layer: "layer-0",
  },
  render: (args) => {
    // Transform custom controls into component behavior
    const { Title, Layer, ...accordionProps } = args as any;
    return (
      <LayerComponent Layer={Layer}>
        <Accordion {...accordionProps}>
          <Accordion.Item value="item-1">
            <Accordion.Control>{Title}</Accordion.Control>
            <Accordion.Panel>
              <PlaceholderContent />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Control>{Title}</Accordion.Control>
            <Accordion.Panel>
              <PlaceholderContent />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Control>{Title}</Accordion.Control>
            <Accordion.Panel>
              <PlaceholderContent />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </LayerComponent>
    );
  },
};
