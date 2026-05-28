import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToastStoryArgs = Record<string, any>;

const meta = {
  title: "UI-Kit/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Toast` component is a standalone visual component wrapping Mui's `Alert`. Note that this component is visually decoupled from `@mui/material/Snackbar` and is meant to be used when you need to render a static or manually-controlled notification panel.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed above the message body",
    },
    children: {
      control: "text",
      description: "Main notification message",
    },
    withCloseButton: {
      control: "boolean",
      description: "Whether the close button is visible",
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    title: "Update Available",
    children:
      "A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",
    withCloseButton: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: ToastStoryArgs) => {
    return <Toast {...args} />;
  },
};

export const WithIcon: Story = {
  args: {
    variant: "default",
    title: "Action Required",
    children:
      "You must complete your profile setup before accessing this feature.",
    icon: "⚠️",
  },
  parameters: {
    controls: { disable: true },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: ToastStoryArgs) => {
    return <Toast {...args} />;
  },
};
