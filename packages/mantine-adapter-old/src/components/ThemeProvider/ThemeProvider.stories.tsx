import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./ThemeProvider";

const meta: Meta<typeof ThemeProvider> = {
  title: "Components/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {
  args: {
    currentTheme: "recursicabrand-light-theme",
    children: (
      <div style={{ padding: "20px", border: "1px solid #ccc" }}>
        <h2>Light Theme Applied</h2>
        <p>Check the root element for the theme class</p>
      </div>
    ),
  },
};

export const DarkTheme: Story = {
  args: {
    currentTheme: "recursicabrand-dark-theme",
    children: (
      <div style={{ padding: "20px", border: "1px solid #ccc" }}>
        <h2>Dark Theme Applied</h2>
        <p>Check the root element for the theme class</p>
      </div>
    ),
  },
};

export const NoTheme: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", border: "1px solid #ccc" }}>
        <h2>No Theme Applied</h2>
        <p>No theme class should be applied to root</p>
      </div>
    ),
  },
};
