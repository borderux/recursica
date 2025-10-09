import React, { ReactNode } from "react";
import type { Recursica } from "@recursica/official-release";
import { RecursicaBundleContext } from "./RecursicaBundleContext.js";

export interface RecursicaBundleProviderProps {
  bundle: Recursica;
  children: ReactNode;
}

export const RecursicaBundleProvider: React.FC<
  RecursicaBundleProviderProps
> = ({ bundle, children }) => {
  return (
    <RecursicaBundleContext.Provider value={{ bundle }}>
      {children}
    </RecursicaBundleContext.Provider>
  );
};
