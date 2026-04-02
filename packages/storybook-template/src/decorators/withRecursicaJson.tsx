/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { RecursicaJsonProvider } from "../contexts/RecursicaJsonProvider.js";

export interface RecursicaJsonDecoratorOptions {
  tokensJson?: any;
  brandJson?: any;
  uiKitJson?: any;
}

export const withRecursicaJson = ({
  tokensJson,
  brandJson,
  uiKitJson,
}: RecursicaJsonDecoratorOptions): Decorator => {
  const RecursicaJsonDecorator = (Story: any) => (
    <RecursicaJsonProvider
      tokensJson={tokensJson}
      brandJson={brandJson}
      uiKitJson={uiKitJson}
    >
      <Story />
    </RecursicaJsonProvider>
  );

  RecursicaJsonDecorator.displayName = "withRecursicaJson";
  return RecursicaJsonDecorator;
};
