/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useMemo } from "react";
import { RecursicaBundleContext } from "./RecursicaBundleContext";

export interface RecursicaBundleProviderProps {
  bundle: any;
  children: ReactNode;
}

export const RecursicaBundleProvider: React.FC<
  RecursicaBundleProviderProps
> = ({ bundle, children }) => {
  const contextValue = useMemo(() => ({ bundle }), [bundle]);

  if (!bundle) {
    return <>{children}</>;
  }

  return (
    <RecursicaBundleContext.Provider value={contextValue}>
      {children}
    </RecursicaBundleContext.Provider>
  );
};
