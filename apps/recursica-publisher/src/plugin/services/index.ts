import { getCurrentUser } from "./getCurrentUser";
import { loadPages } from "./loadPages";
import { exportPage } from "./pageExportNew";
import { importPage, cleanupCreatedEntities } from "./pageImportNew";
import { quickCopy } from "./quickCopy";
import { storeAuthData } from "./storeAuthData";
import { loadAuthData } from "./loadAuthData";
import { clearAuthData } from "./clearAuthData";
import { storeSelectedRepo } from "./storeSelectedRepo";
import { getComponentMetadata } from "./getComponentMetadata";
import { getAllComponents } from "./getAllComponents";
import { pluginPromptResponse } from "./pluginPromptResponse";
import { switchToPage } from "./switchToPage";

// Services map - all service functions indexed by their names
// This is the single source of truth for available services
export const services = {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  cleanupCreatedEntities,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeSelectedRepo,
  getComponentMetadata,
  getAllComponents,
  pluginPromptResponse,
  switchToPage,
} as const;

// Re-export individual services for convenience
export {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  cleanupCreatedEntities,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeSelectedRepo,
  getComponentMetadata,
  getAllComponents,
  pluginPromptResponse,
  switchToPage,
};
