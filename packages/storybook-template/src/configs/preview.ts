import React from "react";
import type { Preview } from "@storybook/react-vite";
import type { Recursica } from "@recursica/official-release";
import {
  withProvider,
  withTheme,
  withRecursicaBundle,
} from "../decorators/index.js";
import {
  commonParameters,
  accessibilityParameters,
  backgroundParameters,
  lightBackgroundParameters,
  controlParameters,
} from "../parameters/index.js";

export interface PreviewConfigOptions {
  defaultTheme?: "light" | "dark";
  enableProvider?: boolean;
  Provider?: React.ComponentType<{ children: React.ReactNode }>;
  providerProps?: Record<string, any>;
  enableThemeProvider?: boolean;
  ThemeProvider?: React.ComponentType<{
    currentTheme: string;
    children: React.ReactNode;
  }>;
  lightThemeClass?: string;
  darkThemeClass?: string;
  customParameters?: Record<string, any>;
  recursicaBundle?: Recursica;
}

export const createPreviewConfig = (
  options: PreviewConfigOptions = {},
): Preview => {
  const {
    defaultTheme = "dark",
    enableProvider = false,
    Provider,
    providerProps = {},
    enableThemeProvider = false,
    ThemeProvider,
    lightThemeClass,
    darkThemeClass,
    customParameters = {},
    recursicaBundle,
  } = options;

  const decorators = [];

  // Add provider decorator if enabled
  if (enableProvider && Provider) {
    decorators.push(withProvider({ Provider, props: providerProps }));
  }

  // Add theme decorator if enabled
  if (enableThemeProvider && ThemeProvider) {
    decorators.push(
      withTheme({
        defaultTheme,
        ThemeProvider,
        lightThemeClass,
        darkThemeClass,
      }),
    );
  }

  // Add recursica bundle decorator if bundle is provided
  if (recursicaBundle) {
    decorators.push(withRecursicaBundle({ bundle: recursicaBundle }));
  }

  // Combine all parameters
  const parameters = {
    ...commonParameters,
    ...accessibilityParameters,
    ...controlParameters,
    ...(defaultTheme === "light"
      ? lightBackgroundParameters
      : backgroundParameters),
    ...customParameters,
  };

  return {
    parameters,
    decorators,
    globalTypes: {
      theme: {
        name: "Theme",
        description: "Global theme for components",
        defaultValue: defaultTheme,
        toolbar: {
          icon: "circlehollow",
          items: [
            { value: "dark", title: "Dark" },
            { value: "light", title: "Light" },
          ],
          showName: true,
          dynamicTitle: true,
        },
      },
    },
  };
};
