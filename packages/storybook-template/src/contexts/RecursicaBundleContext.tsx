import { createContext, useContext } from "react";
import type { Recursica } from "@recursica/official-release";

export interface RecursicaBundleContextType {
  bundle: Recursica;
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
