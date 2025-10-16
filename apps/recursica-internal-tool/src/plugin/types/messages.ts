/**
 * Type definitions for plugin messages
 */

export interface BaseMessage {
  type: string;
}

// Get Current User Messages
export interface GetCurrentUserMessage extends BaseMessage {
  type: "get-current-user";
}

export interface GetCurrentUserResponse extends BaseMessage {
  type: "current-user";
  payload: string;
}

// Reset Metadata Messages
export interface ResetMetadataMessage extends BaseMessage {
  type: "reset-metadata";
}

export interface ResetMetadataResponse extends BaseMessage {
  type: "reset-metadata-response";
  success: boolean;
  message?: string;
  error?: string;
}

// Page Management Messages
export interface LoadPagesMessage extends BaseMessage {
  type: "load-pages";
}

export interface PageListResponse extends BaseMessage {
  type: "pages-loaded";
  success: boolean;
  pages?: Array<{ name: string; index: number }>;
  error?: string;
}

export interface ExportPageMessage extends BaseMessage {
  type: "export-page";
  pageIndex: number;
}

export interface PageExportResponse extends BaseMessage {
  type: "page-export-response";
  success: boolean;
  filename?: string;
  jsonData?: string;
  pageName?: string;
  error?: string;
}

export interface ImportPageMessage extends BaseMessage {
  type: "import-page";
  jsonData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PageImportResponse extends BaseMessage {
  type: "page-import-response";
  success: boolean;
  pageName?: string;
  totalNodes?: number;
  error?: string;
}

export interface QuickCopyMessage extends BaseMessage {
  type: "quick-copy";
}

export interface QuickCopyResponse extends BaseMessage {
  type: "quick-copy-response";
  success: boolean;
  pageName?: string;
  newPageName?: string;
  totalNodes?: number;
  error?: string;
}

// Theme Settings Messages
export interface LoadThemeSettingsMessage extends BaseMessage {
  type: "load-theme-settings";
}

export interface ThemeSettingsLoadedResponse extends BaseMessage {
  type: "theme-settings-loaded";
  success: boolean;
  fileType?: string;
  themeName?: string;
  error?: string;
}

export interface UpdateThemeSettingsMessage extends BaseMessage {
  type: "update-theme-settings";
  fileType: string;
  themeName: string;
}

export interface ThemeSettingsUpdatedResponse extends BaseMessage {
  type: "theme-settings-updated";
  success: boolean;
  message?: string;
  error?: string;
}

// Auth Storage Messages
export interface StoreAuthDataMessage extends BaseMessage {
  type: "store-auth-data";
  accessToken: string;
  platform: string;
  selectedRepo?: string;
}

export interface StoreAuthDataResponse extends BaseMessage {
  type: "auth-data-stored";
  success: boolean;
  error?: string;
}

export interface LoadAuthDataMessage extends BaseMessage {
  type: "load-auth-data";
}

export interface LoadAuthDataResponse extends BaseMessage {
  type: "auth-data-loaded";
  success: boolean;
  accessToken?: string;
  platform?: string;
  selectedRepo?: string;
  error?: string;
}

export interface ClearAuthDataMessage extends BaseMessage {
  type: "clear-auth-data";
}

export interface ClearAuthDataResponse extends BaseMessage {
  type: "auth-data-cleared";
  success: boolean;
  error?: string;
}

// Selected Repository Messages
export interface StoreSelectedRepoMessage extends BaseMessage {
  type: "store-selected-repo";
  selectedRepo: string;
}

export interface StoreSelectedRepoResponse extends BaseMessage {
  type: "selected-repo-stored";
  success: boolean;
  error?: string;
}

export interface ErrorMessage extends BaseMessage {
  type: "error";
  success: false;
  error: string;
}

export type PluginMessage =
  | GetCurrentUserMessage
  | ResetMetadataMessage
  | LoadPagesMessage
  | ExportPageMessage
  | ImportPageMessage
  | QuickCopyMessage
  | LoadThemeSettingsMessage
  | UpdateThemeSettingsMessage
  | StoreAuthDataMessage
  | LoadAuthDataMessage
  | ClearAuthDataMessage
  | StoreSelectedRepoMessage;

export type PluginResponse =
  | GetCurrentUserResponse
  | ResetMetadataResponse
  | PageListResponse
  | PageExportResponse
  | PageImportResponse
  | QuickCopyResponse
  | ThemeSettingsLoadedResponse
  | ThemeSettingsUpdatedResponse
  | StoreAuthDataResponse
  | LoadAuthDataResponse
  | ClearAuthDataResponse
  | StoreSelectedRepoResponse
  | ErrorMessage;
