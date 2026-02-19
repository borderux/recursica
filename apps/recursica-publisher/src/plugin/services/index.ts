import { getCurrentUser } from "./getCurrentUser";
import { loadPages } from "./loadPages";
import { exportPage } from "./import-export/pageExportNew";
import {
  importPage,
  cleanupCreatedEntities,
  resolveDeferredNormalInstances,
} from "./import-export/pageImportNew";
import {
  determineImportOrder,
  buildDependencyGraph,
  resolveImportOrder,
  importPagesInOrder,
  type PageDependency,
} from "./import-export/dependencyResolver";
import { quickCopy } from "./import-export/quickCopy";
import { storeAuthData } from "./storeAuthData";
import { loadAuthData } from "./loadAuthData";
import { clearAuthData } from "./clearAuthData";
import { storeImportData } from "./storeImportData";
import { loadImportData } from "./loadImportData";
import { clearImportData } from "./clearImportData";
import { storeSelectedRepo } from "./storeSelectedRepo";
import { getComponentMetadata } from "./getComponentMetadata";
import { getAllComponents } from "./getAllComponents";
import { pluginPromptResponse } from "./pluginPromptResponse";
import { switchToPage } from "./switchToPage";
import {
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
} from "./import-export/mergeImportService";
import {
  checkForExistingPrimaryImport,
  createImportDividers,
  importSingleComponentWithWizard,
  deleteImportGroup,
  clearImportMetadata,
  cleanupFailedImport,
} from "./import-export/singleComponentImportService";
import { getImportSummary } from "./import-export/getImportSummary";
import { runTest } from "./import-export/runTest";
import {
  getPublishInitStatus,
  setPublishInitStatus,
} from "./publishInitMetadata";
import { getAllPages } from "./getAllPages";
import { storePageMetadata } from "./storePageMetadata";
import { importVariablesCsv } from "./importVariablesCsv";

// Services map - all service functions indexed by their names
// This is the single source of truth for available services
export const services = {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  cleanupCreatedEntities,
  resolveDeferredNormalInstances,
  determineImportOrder,
  buildDependencyGraph,
  resolveImportOrder,
  importPagesInOrder,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeImportData,
  loadImportData,
  clearImportData,
  storeSelectedRepo,
  getComponentMetadata,
  getAllComponents,
  pluginPromptResponse,
  switchToPage,
  checkForExistingPrimaryImport,
  createImportDividers,
  importSingleComponentWithWizard,
  deleteImportGroup,
  clearImportMetadata,
  cleanupFailedImport,
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
  getImportSummary,
  runTest,
  getPublishInitStatus,
  setPublishInitStatus,
  getAllPages,
  storePageMetadata,
  importVariablesCsv,
} as const;

// Re-export individual services for convenience
export {
  getCurrentUser,
  loadPages,
  exportPage,
  importPage,
  cleanupCreatedEntities,
  resolveDeferredNormalInstances,
  determineImportOrder,
  buildDependencyGraph,
  resolveImportOrder,
  importPagesInOrder,
  quickCopy,
  storeAuthData,
  loadAuthData,
  clearAuthData,
  storeImportData,
  loadImportData,
  clearImportData,
  storeSelectedRepo,
  getComponentMetadata,
  getAllComponents,
  pluginPromptResponse,
  switchToPage,
  checkForExistingPrimaryImport,
  createImportDividers,
  importSingleComponentWithWizard,
  deleteImportGroup,
  clearImportMetadata,
  cleanupFailedImport,
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
  getImportSummary,
  runTest,
  getPublishInitStatus,
  setPublishInitStatus,
  getAllPages,
  storePageMetadata,
  importVariablesCsv,
};

export type { PageDependency };
