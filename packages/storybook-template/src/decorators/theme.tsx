import React from "react";
import type { Decorator } from "@storybook/react-vite";

export interface ThemeDecoratorOptions {
  defaultTheme?: "light" | "dark";
  lightThemeClass?: string;
  darkThemeClass?: string;
  ThemeProvider?: React.ComponentType<{
    currentTheme: string;
    children: React.ReactNode;
  }>;
}

export const withTheme = (options: ThemeDecoratorOptions = {}): Decorator => {
  const {
    defaultTheme = "dark",
    lightThemeClass = "light-theme",
    darkThemeClass = "dark-theme",
    ThemeProvider,
  } = options;

  return (Story, context) => {
    const themeName =
      context.globals?.theme ||
      context.parameters?.theme?.default ||
      defaultTheme;
    const currentTheme =
      themeName === "light" ? lightThemeClass : darkThemeClass;

    if (ThemeProvider) {
      return (
        <ThemeProvider currentTheme={currentTheme}>
          <Story />
        </ThemeProvider>
      );
    }

    return <Story />;
  };
};
