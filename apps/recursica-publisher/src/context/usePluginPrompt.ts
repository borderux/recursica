import { useContext } from "react";
import { PluginPromptContext } from "./PluginPromptContext";

export function usePluginPrompt() {
  const context = useContext(PluginPromptContext);
  if (context === undefined) {
    throw new Error(
      "usePluginPrompt must be used within a PluginPromptProvider",
    );
  }
  return context;
}
