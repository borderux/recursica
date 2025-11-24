# Revised Figma Plugin Synchronization Plan

## Overview

This document outlines the revised plan for the Figma plugin's collection synchronization workflow, incorporating all decisions made during the discussion.

## Detection Logic

### File Type Detection (Pattern Matching)

1. **Tokens file**: Collection name contains "tokens" (case-insensitive)
2. **Brand/Themes file**: Collection name contains "theme" or "themes" (case-insensitive)
3. **UI Kit file**: Collection name contains "ui kit" or "uikit" (case-insensitive)
4. **Icons file**: No matching collections found → checks pages for icon components
5. **Error**: If none of the above match

**Priority**: Check `file-type` metadata on collections first (most reliable), then fall back to name matching.

## Metadata Storage

### Collection-Level Metadata (Preserved)

Stored via `collection.setSharedPluginData('recursica', key, value)`:

- **`file-type`**: `'tokens' | 'themes' | 'ui-kit' | 'icons'` - Used for detection and validation
- **`theme-name`**: Theme name string (e.g., `'DarkTheme'`) - Auto-extracted from "ID variables" collection or falls back to file name
- **`textStyles`, `effectStyles`, `gridStyles`, `paintStyles`**: JSON arrays of style keys - Used for exporting styles

### Global Plugin Metadata (New)

Stored via `figma.clientStorage.setAsync('recursica-sync-metadata', ...)` as a single JSON object:

```typescript
{
  tokens: {
    collectionKey: string,
    needsConnection: boolean,
    synchronized: boolean
  },
  brand: {
    collectionKey: string,
    synchronized: boolean,
    published: boolean
  }
}
```

**Note**: No file ID stored for UI Kit - detected by collections each time.

## Workflow

### 1. Tokens File

1. User downloads Tokens file from Figma community
2. User runs plugin in Tokens file
3. **Detection**: Check for collection with "tokens" in name (pattern matching)
4. **Check global metadata**: Look for `tokens` entry
   - If exists and `synchronized === true`: Show "Already synced" message
   - If exists but `synchronized === false`: Continue to sync
   - If not exists: Continue to sync
5. **Publish check**: Verify Tokens collection is published
   - Check via `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()`
   - If not published: Prompt user to publish (show instructions)
   - If published: Continue
6. **Store metadata**:
   - Get collection key from local Tokens collection
   - Store in global metadata: `{ collectionKey, needsConnection: true, synchronized: false }`
7. **Set collection metadata**:
   - Set `file-type: 'tokens'` on collection
   - Save style metadata (`saveEffectsInMetadata`)
8. **Prompt user**: "Go to your Brand file and run the plugin"

### 2. Brand File

1. User downloads Brand file from Figma community
2. User runs plugin in Brand file
3. **Detection**: Check for collection with "theme" or "themes" in name (pattern matching)
4. **Check global metadata**: Look for `tokens` entry
   - If not exists: Error "Please run the plugin in your Tokens file first"
   - If exists: Continue
5. **Verify Tokens collection accessible**:
   - Use `tokens.collectionKey` from global metadata
   - Try to access via `figma.teamLibrary.getVariablesInLibraryCollectionAsync(tokens.collectionKey)`
   - If not accessible: Error "Cannot access Tokens collection. Please add Tokens as a library in this file."
   - If accessible: Continue
6. **Sync Brand → Tokens**:
   - Get all variables in Brand collection
   - For each variable, check all mode values for `VARIABLE_ALIAS` references
   - For each alias pointing to Tokens:
     - Extract variable name from referenced variable
     - Verify variable exists in Tokens collection (by name)
     - Fix reference to use new Tokens collection key and variable ID
   - **Validation**: Check all referenced Tokens variables exist
     - If missing: Console log missing variable names, UI shows "X variables are missing from Tokens collection"
     - If all found: Continue
7. **Store metadata**:
   - Get collection key from local Brand collection
   - Store in global metadata: `{ collectionKey, synchronized: false, published: true }`
   - Set `tokens.synchronized = false` (indicates re-sync needed)
8. **Set collection metadata**:
   - Set `file-type: 'themes'` on collection
   - Set `theme-name` (auto-extract from "ID variables" or use file name)
   - Save style metadata
9. **Prompt user**: "Go to your UI Kit file and run the plugin"

### 3. UI Kit File

1. User downloads UI Kit file from Figma community
2. User runs plugin in UI Kit file
3. **Detection**: Check for collection with "ui kit" or "uikit" in name (pattern matching)
   - If no matching collections: Could be Icons file or incorrect file
   - Check for icons: If icons found → Icons file (separate workflow)
   - If no icons: Prompt user "Is this the UI Kit file, Icons file, or unsure?"
4. **Check global metadata**: Look for `tokens` and `brand` entries
   - If no `tokens`: Error "Please run the plugin in your Tokens file first"
   - If no `brand`: Error "Please run the plugin in your Brand file first"
   - If both exist: Continue
5. **Verify collections accessible**:
   - Try to access Tokens collection using `tokens.collectionKey`
   - Try to access Brand collection using `brand.collectionKey`
   - If either not accessible: Error "Cannot access [Tokens/Brand] collection. Please add as libraries."
   - If both accessible: Continue
6. **Check sync status**:
   - If `tokens.synchronized === false` OR `brand.synchronized === false`: Need to sync
   - If both `true`: Skip sync (already synchronized)
7. **Sync UI Kit → Tokens & Brand**:
   - Get all variables in UI Kit collections
   - For each variable, check all mode values for `VARIABLE_ALIAS` references
   - For each alias:
     - If points to Tokens: Fix reference to use `tokens.collectionKey`
     - If points to Brand: Fix reference to use `brand.collectionKey`
     - Verify referenced variable exists (by name) in target collection
   - **Validation**: Check all referenced variables exist
     - If missing: Console log missing variable names, UI shows count
     - If all found: Continue
8. **Update metadata**:
   - Set `tokens.synchronized = true`
   - Set `brand.synchronized = true`
9. **Set collection metadata**:
   - Set `file-type: 'ui-kit'` on collections
   - Save style metadata
10. **Complete**: All files synchronized

## Re-sync Logic

- **Trigger**: When user runs plugin in a file, set that file's `synchronized = false` in global metadata
- **Tokens file**: Sets `tokens.synchronized = false`
- **Brand file**: Sets `brand.synchronized = false` and `tokens.synchronized = false` (since Brand depends on Tokens)
- **UI Kit file**: Checks sync status and syncs if needed

## Validation Logic

### Variable Reference Validation

- **When**: Only when syncing to a dependent file
  - Brand → Tokens (Brand depends on Tokens)
  - UI Kit → Tokens & Brand (UI Kit depends on both)
- **How**:
  1. Find all variables in source collection that reference target collection
  2. Extract variable names from references
  3. Verify each variable name exists in target collection (by name, not key)
  4. If any missing: Console log all missing names, UI shows "X variables are missing"
  5. Match by name only, no fallback

## Preserved Functionality

1. **Style metadata**: Continue saving `textStyles`, `effectStyles`, `gridStyles`, `paintStyles`
2. **Theme name extraction**: Continue extracting from "ID variables" collection or falling back to file name
3. **File type detection**: Continue using `file-type` metadata as primary detection method
4. **Icons file support**: Continue detecting and handling icons files (separate from sync workflow)

## Removed Functionality

1. **`variables-synced` collection metadata**: Replaced by global plugin metadata `synchronized` flags
2. **Auto-sync on load**: Replaced by explicit workflow with user prompts
3. **Hardcoded `TEST_COLLECTION_KEYS`**: Replaced by global plugin metadata storage

## Error Handling

- Clear error messages guiding user to next step
- Validation errors list missing variables in console, show count in UI
- Library access errors with instructions to add libraries
- Missing dependency errors with instructions to run plugin in prerequisite files

## Backward Compatibility

- Files with old metadata structure will be treated as "not synced"
- Start workflow from scratch (user re-runs plugin in each file)
- No automatic migration needed
