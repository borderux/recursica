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
};

export type { PageDependency };
