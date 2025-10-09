import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemesPage } from "../../src/pages/Themes";

const meta: Meta<typeof ThemesPage> = {
  title: "Themes/Themes",
  component: ThemesPage,
  argTypes: {
    theme: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Color palette organized by color families, showing all available color tokens with their hex values.",
      },
    },
  },
  render: (args, { globals: { theme } }) => {
    return <ThemesPage {...args} theme={theme} />;
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPaletteStory: Story = {
  name: "Themes",
};
