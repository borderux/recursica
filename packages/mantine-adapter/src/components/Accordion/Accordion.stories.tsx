/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

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
  },
  parameters: {
    controls: {
      include: ["Title"],
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
  },
  argTypes: {
    Title: {
      control: { type: "text" },
      description: "Title for accordion items",
    },
  } as any,
  render: (args) => {
    // Transform custom controls into component behavior
    const { Title, ...accordionProps } = args as any;
    return (
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
    );
  },
};
