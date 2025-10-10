/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Preview } from "@storybook/react-vite";
import { withProvider, withTheme } from "../decorators/index";
import { withRecursicaBundle } from "../decorators/withRecursicaBundle";
import {
  commonParameters,
  accessibilityParameters,
  backgroundParameters,
  lightBackgroundParameters,
  controlParameters,
} from "../parameters/index";

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
  recursicaBundle?: any;
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

  // Add recursica bundle decorator if bundle is provided
  if (recursicaBundle) {
    decorators.push(withRecursicaBundle({ bundle: recursicaBundle }));
  }

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
