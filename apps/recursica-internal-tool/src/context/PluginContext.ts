import { createContext } from "react";
import { type GitHubRepo } from "../services/github/githubService";

export interface ThemeSettings {
  fileType: string;
  themeName: string;
}

export interface PageInfo {
  name: string;
  index: number;
}

export interface IPluginContext {
  // Theme Settings
  themeSettings: ThemeSettings;
  updateThemeSettings: (fileType: string, themeName: string) => Promise<void>;
  loadThemeSettings: () => Promise<void>;

  // Page Management
  pages: PageInfo[];
  loadPages: () => Promise<void>;
  exportPage: (pageIndex: number) => Promise<void>;
  importPage: (jsonData: any) => Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
  quickCopy: () => Promise<void>;

  // GitHub Integration
  selectedRepo: GitHubRepo | null;
  saveSelectedRepo: (repo: GitHubRepo) => void;
  saveAccessToken: (accessToken: string) => void;
  accessToken: string | null;
  deleteAccessToken: () => void;
  // Reset Metadata
  resetMetadata: () => Promise<void>;

  // Loading states
  loading: {
    themeSettings: boolean;
    pages: boolean;
    operations: boolean;
    github: boolean;
  };

  // User ID
  userId: string | null;

  // Error handling
  error: string | undefined;
  clearError: () => void;
}

export const PluginContext = createContext<IPluginContext | null>(null);
