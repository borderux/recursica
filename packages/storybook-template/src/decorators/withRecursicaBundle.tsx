import React from "react";
import type { Decorator } from "@storybook/react-vite";
import type { Recursica } from "@recursica/official-release";
import { RecursicaBundleProvider } from "../contexts/RecursicaBundleProvider.js";

export interface RecursicaBundleDecoratorOptions {
  bundle: Recursica;
}

export const withRecursicaBundle = ({
  bundle,
}: RecursicaBundleDecoratorOptions): Decorator => {
  return (Story) => (
    <RecursicaBundleProvider bundle={bundle}>
      <Story />
    </RecursicaBundleProvider>
  );
};
