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
import { summarizeVariablesForWizard } from "./summarizeVariablesForWizard";
import {
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
} from "./mergeImportService";
import { runTest } from "./runTest";

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
  summarizeVariablesForWizard,
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
  runTest,
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
  summarizeVariablesForWizard,
  getLocalVariableCollections,
  getCollectionGuids,
  mergeImportGroup,
  runTest,
};

export type { PageDependency };
