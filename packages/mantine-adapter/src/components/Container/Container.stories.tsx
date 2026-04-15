import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";
import { Text } from "../Text/Text";

type ContainerStoryProps = React.ComponentProps<typeof Container>;

const meta: Meta<ContainerStoryProps> = {
  title: "UI-Kit/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container is a generic layout wrapper that safely maps to Mantine's Container, standardizing maximum content widths across the application.",
      },
    },
  },
  args: {
    size: "md",
    fluid: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Maximum width defined by Mantine system sizes",
    },
    fluid: {
      control: "boolean",
      description: "If true, overrides size and sets max-width to 100%",
    },
    defaultChecked: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<ContainerStoryProps>;

export const Default: Story = {
  render: (args) => (
    <div style={{ backgroundColor: "#f0f0f0", padding: "16px" }}>
      <Container
        {...args}
        style={{
          backgroundColor: "white",
          padding: "16px",
          border: "1px solid #ccc",
        }}
      >
        <Text>
          This is a Container holding centered content. The background and
          border are added just to demonstrate the layout bounds visually.
        </Text>
      </Container>
    </div>
  ),
};

export const SmallContainer: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <div style={{ backgroundColor: "#f0f0f0", padding: "16px" }}>
      <Container
        {...args}
        style={{
          backgroundColor: "white",
          padding: "16px",
          border: "1px solid #ccc",
        }}
      >
        <Text>Small Container Layout</Text>
      </Container>
    </div>
  ),
};

export const FluidContainer: Story = {
  args: {
    fluid: true,
  },
  render: (args) => (
    <div style={{ backgroundColor: "#f0f0f0", padding: "16px" }}>
      <Container
        {...args}
        style={{
          backgroundColor: "white",
          padding: "16px",
          border: "1px solid #ccc",
        }}
      >
        <Text>Fluid Container Layout</Text>
      </Container>
    </div>
  ),
};
