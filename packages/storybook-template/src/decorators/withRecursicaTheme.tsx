import React, { useEffect, useState } from "react";
import type { Decorator } from "@storybook/react-vite";
import { RecursicaThemeProvider } from "@recursica/adapter-common";
import { addons } from "storybook/internal/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

const channel = addons.getChannel();

export const withRecursicaTheme = (
  defaultTheme: "light" | "dark" = "light",
): Decorator => {
  const DecoratorComponent = (Story: React.ComponentType) => {
    const [isDark, setIsDark] = useState(defaultTheme === "dark");

    useEffect(() => {
      const handleMode = (dark: boolean) => setIsDark(dark);
      channel.on(DARK_MODE_EVENT_NAME, handleMode);
      return () => channel.off(DARK_MODE_EVENT_NAME, handleMode);
    }, []);

    return (
      <RecursicaThemeProvider theme={isDark ? "dark" : "light"}>
        <Story />
      </RecursicaThemeProvider>
    );
  };
  DecoratorComponent.displayName = "RecursicaThemeDecorator";

  return DecoratorComponent;
};
