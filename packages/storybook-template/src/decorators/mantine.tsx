import React from "react";
import type { Decorator } from "@storybook/react-vite";

export interface ProviderDecoratorOptions {
  Provider: React.ComponentType<{ children: React.ReactNode }>;
  props?: Record<string, any>;
}

export const withProvider = (options: ProviderDecoratorOptions): Decorator => {
  const { Provider, props = {} } = options;

  return (Story) => {
    return (
      <Provider {...props}>
        <Story />
      </Provider>
    );
  };
};
