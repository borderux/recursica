import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";
import { Button } from "../Button/Button";
import { Group } from "../Group/Group";
import { Flex } from "../Flex/Flex";

const meta: Meta<typeof Stepper> = {
  title: "UI-Kit/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`Stepper\` component provides a visual progression interface strictly mapped to Recursica's UI-Kit.
This component wraps Mantine's \`Stepper\` and natively enforces Figma tokens for sizes, colors, gaps, and states (\`completed\`, \`current\`, \`upcoming\`).

### Layout & Orientation
Orientation dictates how the steps flow:
- **horizontal**: Steps render side-by-side. 
- **vertical**: Steps stack vertically, mapping seamlessly to the vertical gap tokens.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "large"],
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    defaultChecked: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const InteractiveStepper = (args: React.ComponentProps<typeof Stepper>) => {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Flex direction="column" w={600}>
      <Stepper {...args} active={active} onStepClick={setActive}>
        <Stepper.Step
          label="First step"
          description="Create an account and set up your billing profile"
        />
        <Stepper.Step
          label="Second step"
          description="Verify email and ensure all notification preferences are correct"
        />
        <Stepper.Step label="Final step" description="Get full access" />
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group mt={24} justify="center" gap={8}>
        <Button variant="outline" onClick={prevStep} disabled={active === 0}>
          Previous step
        </Button>
        <Button variant="outline" onClick={nextStep} disabled={active === 3}>
          Next step
        </Button>
      </Group>
    </Flex>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal",
  },
};

export const Small: Story = {
  render: (args) => <InteractiveStepper {...args} />,
  args: {
    size: "small",
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  render: (args) => <InteractiveStepper {...args} />,
  args: {
    size: "large",
    orientation: "vertical",
  },
};

const StressTestStepper = (args: React.ComponentProps<typeof Stepper>) => {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Flex direction="column" w={600}>
      <Stepper {...args} active={active} onStepClick={setActive}>
        <Stepper.Step
          label="This is an extremely long step title designed to test how the layout handles multiline text wrapping and constraints"
          description="Create an account and set up your billing profile"
        />
        <Stepper.Step
          label="Second step"
          description="Verify email and ensure all notification preferences are correct"
        />
        <Stepper.Step label="Final step" />
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group mt={24} justify="center" gap={8}>
        <Button variant="outline" onClick={prevStep} disabled={active === 0}>
          Previous step
        </Button>
        <Button variant="outline" onClick={nextStep} disabled={active === 3}>
          Next step
        </Button>
      </Group>
    </Flex>
  );
};

export const LayoutStressTest: Story = {
  render: (args) => <StressTestStepper {...args} />,
  args: {
    size: "large",
    orientation: "horizontal",
  },
};
