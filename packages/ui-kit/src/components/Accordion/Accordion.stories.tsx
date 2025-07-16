import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "contained", "filled", "separated"],
    },
    chevronPosition: {
      control: "select",
      options: ["left", "right"],
    },
    chevronSize: {
      control: "number",
    },
    multiple: {
      control: "boolean",
    },
    defaultValue: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Control>What is Recursica?</Accordion.Control>
          <Accordion.Panel>
            Recursica is a design system platform that helps teams create,
            manage, and distribute design tokens and components across their
            projects.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>How does it work?</Accordion.Control>
          <Accordion.Panel>
            Recursica connects your design tools (like Figma) with your
            development workflow, automatically syncing design tokens and
            generating code-ready components.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Control>What platforms are supported?</Accordion.Control>
          <Accordion.Panel>
            Recursica supports multiple platforms including React, Vue, Angular,
            and more. It also integrates with popular design tools and version
            control systems.
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Design Tokens</Accordion.Control>
          <Accordion.Panel>
            Design tokens are the visual design atoms of the design system —
            specifically, they are named entities that store visual design
            attributes.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Components</Accordion.Control>
          <Accordion.Panel>
            Components are reusable UI elements that can be combined to create
            more complex interfaces. They follow consistent design patterns and
            use design tokens.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Control>Themes</Accordion.Control>
          <Accordion.Panel>
            Themes define the visual appearance of your design system, including
            colors, typography, spacing, and other design attributes.
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Getting Started</Accordion.Control>
          <Accordion.Panel>
            Follow our step-by-step guide to set up Recursica in your project
            and start syncing your design tokens.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Configuration</Accordion.Control>
          <Accordion.Panel>
            Learn how to configure Recursica to match your project's specific
            needs and requirements.
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Documentation</Accordion.Control>
          <Accordion.Panel>
            Comprehensive documentation covering all aspects of the Recursica
            platform, from basic usage to advanced features.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>API Reference</Accordion.Control>
          <Accordion.Panel>
            Detailed API documentation for developers who want to integrate
            Recursica into their custom workflows.
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};

export const LeftChevron: Story = {
  args: {
    chevronPosition: "left",
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Support</Accordion.Control>
          <Accordion.Panel>
            Get help from our support team or community when you encounter
            issues or have questions about Recursica.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Community</Accordion.Control>
          <Accordion.Panel>
            Join our community of designers and developers to share experiences,
            ask questions, and contribute to the ecosystem.
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};
