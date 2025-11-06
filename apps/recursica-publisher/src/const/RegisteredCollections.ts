/**
 * Registered Remote Collections
 *
 * Maps remote collection IDs to their GUIDs.
 * Remote collections must be explicitly registered here before they can be exported.
 *
 * To add a new remote collection:
 * 1. Get the collection ID from Figma (e.g., from the collection object's `id` property)
 * 2. Generate a GUID for it (UUID v4)
 * 3. Add the mapping: collectionId -> GUID
 *
 * Format: collectionId is the full collection ID string from Figma
 * Example: "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2151:0"
 */

export const REGISTERED_REMOTE_COLLECTIONS: Record<string, string> = {
  // Example format (replace with actual collection IDs and GUIDs):
  // "VariableCollectionId:example123/2151:0": "550e8400-e29b-41d4-a716-446655440000",
};
