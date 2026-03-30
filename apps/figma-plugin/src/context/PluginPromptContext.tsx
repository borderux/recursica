import { createContext } from "react";

export interface PluginPromptData {
  message: string;
  requestId: string;
  okLabel: string;
  cancelLabel: string;
}

export interface PluginPromptContextType {
  prompt: PluginPromptData | null;
  clear: () => void;
  ok: () => void;
  cancel: () => void;
}

export const PluginPromptContext = createContext<
  PluginPromptContextType | undefined
>(undefined);
