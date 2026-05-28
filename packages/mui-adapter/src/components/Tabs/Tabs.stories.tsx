import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, Tab, TabPanel } from "./Tabs";
import { TabContext } from "@mui/lab";
import { Flex } from "../Flex/Flex";

const meta: Meta<typeof Tabs> = {
  title: "UI-Kit/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "outline", "pills"],
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    // @ts-expect-error Custom prop not in native TabsProps
    disabled: {
      control: "boolean",
    },
    defaultChecked: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const InteractiveTabs = (
  args: React.ComponentProps<typeof Tabs> & {
    disabled?: boolean;
    inverted?: boolean;
  },
) => {
  const [value, setValue] = useState("gallery");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Flex w={600} h={300}>
      <TabContext value={value}>
        <Tabs onChange={handleChange} {...args}>
          <Tab
            value="gallery"
            label="Gallery"
            disabled={args.disabled}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
            iconPosition="start"
          />
          <Tab
            value="messages"
            label="Messages"
            disabled={args.disabled}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            }
            iconPosition="start"
          />
          <Tab
            value="settings"
            label="Settings"
            disabled={args.disabled}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            }
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value="gallery">Gallery tab content</TabPanel>

        <TabPanel value="messages">Messages tab content</TabPanel>

        <TabPanel value="settings">Settings tab content</TabPanel>
      </TabContext>
    </Flex>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal",
  },
};

export const Outline: Story = {
  render: (args) => <InteractiveTabs {...args} />,
  args: {
    variant: "outline",
    orientation: "horizontal",
  },
};

export const Pills: Story = {
  render: (args) => <InteractiveTabs {...args} />,
  args: {
    variant: "pills",
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  render: (args) => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "vertical",
  },
};

export const Inverted: Story = {
  render: (args) => <InteractiveTabs {...args} />,
  args: {
    variant: "default",
    orientation: "horizontal",
    inverted: true,
  },
};
