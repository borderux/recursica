import { useContext } from "react";
import { DebugConsoleContext } from "./DebugConsoleContext";

export function useDebugConsole() {
  const context = useContext(DebugConsoleContext);
  if (context === undefined) {
    throw new Error(
      "useDebugConsole must be used within a DebugConsoleProvider",
    );
  }
  return context;
}
