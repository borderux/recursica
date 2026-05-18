import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "UI-Kit/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "SegmentedControl provides a linear set of two or more segments, each of which functions as a mutually exclusive button.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: { table: { disable: true } },
    data: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    data: ["React", "Angular", "Vue", "Svelte"],
    orientation: "horizontal",
    fullWidth: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: any) => {
    return <SegmentedControl {...args} />;
  },
};

export const FullWidth: Story = {
  args: {
    data: ["Daily", "Weekly", "Monthly"],
    fullWidth: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: any) => {
    return <SegmentedControl {...args} />;
  },
};

export const Vertical: Story = {
  args: {
    data: ["Option 1", "Option 2", "Option 3"],
    orientation: "vertical",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: any) => {
    return <SegmentedControl {...args} />;
  },
};

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const WithIcons: Story = {
  args: {
    data: [
      {
        value: "daily",
        label: (
          <>
            <CheckIcon />
            <span>Daily</span>
          </>
        ),
      },
      {
        value: "weekly",
        label: (
          <>
            <CheckIcon />
            <span>Weekly</span>
          </>
        ),
      },
      {
        value: "monthly",
        label: (
          <>
            <CheckIcon />
            <span>Monthly</span>
          </>
        ),
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: any) => {
    return <SegmentedControl {...args} />;
  },
};
