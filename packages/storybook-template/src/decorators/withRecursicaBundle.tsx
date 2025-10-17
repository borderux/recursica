/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { RecursicaBundleProvider } from "../contexts/RecursicaBundleProvider";
export interface RecursicaBundleDecoratorOptions {
  bundle: any;
}

export const withRecursicaBundle = ({
  bundle,
}: RecursicaBundleDecoratorOptions): Decorator => {
  return (Story) => {
    return (
      <RecursicaBundleProvider bundle={bundle}>
        <Story />
      </RecursicaBundleProvider>
    );
  };
};
