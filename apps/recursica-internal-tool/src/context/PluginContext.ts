import { createContext } from "react";
import type {
  LibraryUsage,
  RemoteComponent,
  RemoteStyle,
} from "../plugin/types/messages";

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

  // Used Libraries
  detectUsedLibraries: () => Promise<void>;
  usedLibraries: LibraryUsage[];
  remoteComponents: RemoteComponent[];
  remoteStyles: RemoteStyle[];

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
