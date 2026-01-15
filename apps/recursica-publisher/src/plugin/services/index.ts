import { getCurrentUser } from "./getCurrentUser";
import { loadPages } from "./loadPages";
import { exportPage } from "./pageExportNew";
import {
  importPage,
  cleanupCreatedEntities,
  resolveDeferredNormalInstances,
} from "./pageImportNew";
import {
  determineImportOrder,
  buildDependencyGraph,
  resolveImportOrder,
  importPagesInOrder,
  type PageDependency,
} from "./dependencyResolver";
import { quickCopy } from "./quickCopy";
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
  checkForExistingPrimaryImport,
  createImportDividers,
  importSingleComponentWithWizard,
  deleteImportGroup,
  clearImportMetadata,
  cleanupFailedImport,
} from "./singleComponentImportService";
import {
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
} from "./mergeImportService";
import { getImportSummary } from "./getImportSummary";
import { runTest } from "./runTest";
import {
  getPublishInitStatus,
  setPublishInitStatus,
} from "./publishInitMetadata";
import { getAllPages } from "./getAllPages";
import { storePageMetadata } from "./storePageMetadata";

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
};

export type { PageDependency };
