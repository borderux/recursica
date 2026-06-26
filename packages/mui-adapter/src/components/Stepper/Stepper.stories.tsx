import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, Step, StepLabel } from "./Stepper";
import { Button } from "../Button/Button";
import { Group } from "../Group/Group";
import { Flex } from "../Flex/Flex";

const meta: Meta<typeof Stepper> = {
  title: "UI-Kit/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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

  const steps = [
    {
      label: "First step",
      description: "Create an account and set up your billing profile",
    },
    {
      label: "Second step",
      description:
        "Verify email and ensure all notification preferences are correct",
    },
    { label: "Final step", description: "Get full access" },
  ];

  return (
    <Flex direction="column" style={{ width: 600 }}>
      <Stepper {...args} activeStep={active}>
        {steps.map((step, index) => (
          <Step key={index} completed={active > index}>
            <StepLabel description={step.description}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {active === steps.length ? (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          Completed, click back button to get to previous step
        </div>
      ) : (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          Step {active + 1} content
        </div>
      )}

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

  const steps = [
    {
      label:
        "This is an extremely long step title designed to test how the layout handles multiline text wrapping and constraints",
      description: "Create an account and set up your billing profile",
    },
    {
      label: "Second step",
      description:
        "Verify email and ensure all notification preferences are correct",
    },
    { label: "Final step", description: undefined },
  ];

  return (
    <Flex direction="column" style={{ width: 600 }}>
      <Stepper {...args} activeStep={active}>
        {steps.map((step, index) => (
          <Step key={index} completed={active > index}>
            <StepLabel description={step.description}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {active === steps.length && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          Completed, click back button to get to previous step
        </div>
      )}

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
