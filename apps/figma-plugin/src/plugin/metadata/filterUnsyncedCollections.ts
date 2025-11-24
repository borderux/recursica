/**
 * @deprecated This function is no longer used. Sync status is now tracked in global plugin metadata
 * (figma.clientStorage) instead of collection-level metadata.
 *
 * This file is kept for reference but the function is not used anywhere in the codebase.
 */
export function filterUnsyncedCollections(
  localCollections: VariableCollection[]
): VariableCollection[] {
  // Return all collections since we no longer track sync status at collection level
  return localCollections;
}
