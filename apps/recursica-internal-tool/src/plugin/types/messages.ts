/**
 * Type definitions for plugin messages
 */

export interface BaseMessage {
  type: string;
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

export interface ErrorMessage extends BaseMessage {
  type: "error";
  success: false;
  error: string;
}

export type PluginMessage =
  | ResetMetadataMessage
  | LoadPagesMessage
  | ExportPageMessage
  | ImportPageMessage
  | QuickCopyMessage;

export type PluginResponse =
  | ResetMetadataResponse
  | PageListResponse
  | PageExportResponse
  | PageImportResponse
  | QuickCopyResponse
  | ErrorMessage;
