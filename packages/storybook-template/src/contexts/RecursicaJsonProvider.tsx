/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useMemo } from "react";
import { RecursicaJsonContext } from "./RecursicaJsonContext.js";

export interface RecursicaJsonProviderProps {
  tokensJson?: any;
  brandJson?: any;
  uiKitJson?: any;
  children: ReactNode;
}

export const RecursicaJsonProvider: React.FC<RecursicaJsonProviderProps> = ({
  tokensJson,
  brandJson,
  uiKitJson,
  children,
}) => {
  const contextValue = useMemo(
    () => ({ tokensJson, brandJson, uiKitJson }),
    [tokensJson, brandJson, uiKitJson],
  );

  if (!tokensJson && !brandJson && !uiKitJson) {
    return <>{children}</>;
  }

  return (
    <RecursicaJsonContext.Provider value={contextValue}>
      {children}
    </RecursicaJsonContext.Provider>
  );
};
