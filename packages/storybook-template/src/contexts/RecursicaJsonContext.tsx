/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

export interface RecursicaJsonContextType {
  tokensJson?: any;
  brandJson?: any;
  uiKitJson?: any;
}

export const RecursicaJsonContext =
  createContext<RecursicaJsonContextType | null>(null);

export const useRecursicaJson = (): RecursicaJsonContextType => {
  const context = useContext(RecursicaJsonContext);

  if (!context) {
    throw new Error(
      "useRecursicaJson must be used within a RecursicaJsonProvider. " +
        "Please pass recursicaTokensJsonPath, recursicaBrandJsonPath, or recursicaUIKitJsonPath to createPreviewConfig.",
    );
  }

  return context;
};
