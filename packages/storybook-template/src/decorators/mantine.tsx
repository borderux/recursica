import React from "react";
import type { Decorator } from "@storybook/react-vite";

export interface ProviderDecoratorOptions {
  Provider: React.ComponentType<{ children: React.ReactNode }>;
  props?: Record<string, unknown>;
}

export const withProvider = (options: ProviderDecoratorOptions): Decorator => {
  const { Provider, props = {} } = options;

  const DecoratorComponent = (Story: React.ComponentType) => (
    <Provider {...props}>
      <Story />
    </Provider>
  );
  DecoratorComponent.displayName = "ProviderDecorator";

  return DecoratorComponent;
};
