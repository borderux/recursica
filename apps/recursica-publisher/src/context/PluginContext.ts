import { createContext } from "react";
export interface ThemeSettings {
  fileType: string;
  themeName: string;
}

export interface IPluginContext {
  // Theme Settings
  themeSettings: ThemeSettings;
  updateThemeSettings: (fileType: string, themeName: string) => Promise<void>;
  loadThemeSettings: () => Promise<void>;

  // Reset Metadata
  resetMetadata: () => Promise<void>;

  // Loading states
  loading: {
    themeSettings: boolean;
    pages: boolean;
    operations: boolean;
  };

  // Error handling
  error: string | undefined;
  clearError: () => void;
}

export const PluginContext = createContext<IPluginContext | null>(null);
