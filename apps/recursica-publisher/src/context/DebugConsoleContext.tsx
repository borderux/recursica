import { createContext } from "react";

export interface DebugConsoleMessage {
  type: "error" | "warning" | "log";
  message: string;
}

export interface DebugConsoleContextType {
  messages: DebugConsoleMessage[];
  clear: () => void;
  getFormattedLog: () => string;
}

export const DebugConsoleContext = createContext<
  DebugConsoleContextType | undefined
>(undefined);
