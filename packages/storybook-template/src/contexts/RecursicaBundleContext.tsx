/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext } from "react";

export interface RecursicaBundleContextType {
  bundle: any;
}

export const RecursicaBundleContext =
  createContext<RecursicaBundleContextType | null>(null);

export const useRecursicaBundle = (): RecursicaBundleContextType => {
  const context = useContext(RecursicaBundleContext);

  if (!context) {
    throw new Error(
      "useRecursicaBundle must be used within a RecursicaBundleProvider. " +
        "Please pass recursicaBundle to createPreviewConfig.",
    );
  }

  return context;
};
