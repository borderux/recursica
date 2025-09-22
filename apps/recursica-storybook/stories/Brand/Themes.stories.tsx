import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemesPage } from "../../src/components/themes";

const meta: Meta<typeof ThemesPage> = {
  title: "Brand/Themes",
  component: ThemesPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Complete themes overview showing primary color categories and color scales visualization. Includes Black, White, Alert, Warn, Success, Disabled, and Overlay colors, plus color scales with tone backgrounds and regular/subtle variants.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Themes: Story = {};
