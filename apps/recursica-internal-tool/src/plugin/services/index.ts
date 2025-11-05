import { getCurrentUser } from "./getCurrentUser";
import { loadPages } from "./loadPages";
import { exportPage } from "./pageExport";
import { importPage } from "./pageImport";
import { quickCopy } from "./quickCopy";
import { storeAuthData } from "./storeAuthData";
import { loadAuthData } from "./loadAuthData";
import { clearAuthData } from "./clearAuthData";
import { storeSelectedRepo } from "./storeSelectedRepo";

// Services map - all service functions indexed by their names
// This is the single source of truth for available services
export const services = {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeSelectedRepo,
} as const;

// Re-export individual services for convenience
export {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeSelectedRepo,
};
