import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { RecursicaThemeProvider } from "@recursica/adapter-common";

export const withRecursicaTheme = (
  defaultTheme: "light" | "dark" = "light",
): Decorator => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DecoratorComponent = (Story: React.ComponentType, context: any) => {
    const themeName =
      context.globals?.theme ||
      context.parameters?.theme?.default ||
      defaultTheme;

    return (
      <RecursicaThemeProvider theme={themeName}>
        <Story />
      </RecursicaThemeProvider>
    );
  };
  DecoratorComponent.displayName = "RecursicaThemeDecorator";

  return DecoratorComponent;
};
