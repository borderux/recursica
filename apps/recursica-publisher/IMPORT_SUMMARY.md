# Page Import Summary

This document summarizes the import steps and logic for `pageImportNew.ts`, which handles importing JSON-exported Figma pages back into Figma.

## Overview

The import process is a multi-stage pipeline that:

1. Validates and loads JSON data
2. Processes collections (variable collections)
3. Processes variables
4. Processes component instances
5. Recreates the page structure with all nodes

## Import Stages

### Stage 1: Validate Metadata

- Validates that the JSON contains required metadata fields
- Extracts page GUID, name, and version information
- **Failure**: Returns error and stops import

### Stage 2: Load and Expand JSON

- Loads the string table (for compressed string references)
- Expands compressed JSON data using `expandJsonData()`
- Converts string table references back to actual strings
- **Failure**: Returns error and stops import

### Stage 3: Load Collection Table

- Loads the collections table from JSON
- Creates a `CollectionTable` instance from the serialized data
- Collections are stored once in a table, referenced by index
- **Note**: If no collections table exists, import completes early (no collections to process)

### Stage 4: Match Collections

- For each collection in the table:
  - **Local collections**: Attempts to match with existing local collections
    - First tries matching by GUID (if present in entry)
    - Falls back to name matching (for backward compatibility)
  - **Remote collections**: Skipped (handled separately, must be registered)
- Categorizes collections into:
  - `recognizedCollections`: Matched by GUID (exact match)
  - `potentialMatches`: Matched by name only (requires user confirmation)
  - `collectionsToCreate`: No match found (will create new)

### Stage 5: Prompt for Potential Matches

- For each potential match (name-only match):
  - Prompts user: "Found existing [collection name] variable collection. Should I use it?"
  - If user confirms: Adds to `recognizedCollections`
  - If user rejects: Moves to `collectionsToCreate`
- Ensures modes exist for user-confirmed collections

### Stage 6: Ensure Modes for Recognized Collections

- For each recognized collection (GUID-matched, not user-confirmed):
  - Ensures all modes from the exported collection exist in the target collection
  - Creates missing modes by name
  - Builds mode ID mapping: old modeId → new modeId
- **Note**: User-confirmed collections already had modes ensured in Stage 5

### Stage 7: Create New Collections

- For each collection in `collectionsToCreate`:
  - Normalizes collection name (handles standard names like "Token"/"Theme")
  - Finds unique name (handles conflicts) by appending an underscore and incrementing number. Ex: "Tokens_1"
  - Creates new `VariableCollection` via Figma API
  - Stores GUID on collection (from entry or generates new)
  - Ensures all modes exist (creates by name)
  - Adds to `recognizedCollections` for variable processing

### Stage 8: Load Variable Table

- Loads the variables table from JSON
- Creates a `VariableTable` instance from the serialized data
- Variables are stored once in a table, referenced by index
- **Note**: If no variables table exists, import completes early (no variables to process)

### Stage 9: Match and Create Variables

- For each variable in the table:
  - Gets the collection using `_colRef` (collection table index)
  - Searches for existing variable by name within the collection
  - **If variable exists**:
    - Validates type matches
    - If type matches: Uses existing variable
    - If type mismatches: Creates new variable with incremented name, logs warning
  - **If variable doesn't exist**:
    - Creates new variable with the specified type
  - Restores `valuesByMode` (all mode values)
    - Resolves VARIABLE_ALIAS references recursively
    - Uses mode ID mapping to convert old mode IDs to new mode IDs
- Categorizes variables into:
  - `recognizedVariables`: Existing variables (reused)
  - `newlyCreatedVariables`: New variables created during import
    The goal is to never overwrite existing variables. If a match exists, it will try to use it, otherwise it will
    create a new variable.

### Stage 10: Load Instance Table

- Loads the instance table from JSON (if present)
- Creates an `InstanceTable` instance from the serialized data
- Instances are stored once in a table, referenced by index
- **Note**: Instance table is optional (may not exist in older JSON formats)

### Stage 10.5: Create Remote Instances

- Processes all `instanceType === "remote"` entries from instance table. Remote instances are references to Team libraries (aka Icons)
- Creates or finds "REMOTES" page
- For each remote instance:
  - Recreates the component from stored `structure` (full visual representation). This will only be visual, and cannot contain references to other components.
  - Creates component on REMOTES page
  - Stores mapping: instance table index → component node
- Returns `remoteComponentMap` for use in Stage 11
- **Note**: Remote instances cannot be resolved by reference (component doesn't exist in target file), so full structure is stored and recreated

### Stage 11: Create Page and Recreate Structure

#### Page Creation Logic

1. **Check for existing page by GUID**:

   - Searches all pages for one with matching GUID in plugin data
   - If found and `isMainPage === false`: Prompts user "Found existing component [name]. Should I use it or create a copy?"
     - User chooses "Use": Returns existing page (skips structure recreation)
     - User chooses "Copy": Proceeds to create new page
   - If `isMainPage === true`: Always creates a copy (no prompt). This means we always create a new page for the component that is being imported. It will have a unique name by appending underscore and an incrementing number (Ex: Accordion_1)

2. **Check for existing page by name**:

   - If page with same name exists, creates scratch page with unique name
   - Scratch page name format: `__[originalName]` (will be renamed on success)

3. **Create new page**:
   - Creates new `PageNode`
   - Sets page name (original or scratch name)
   - Sets page background if specified in JSON
   - Switches to the new page

#### Structure Recreation

1. **Normalize structure types**:

   - Converts numeric node type enums to strings recursively
   - Handles both `children` (expanded) and `child` (compressed) keys

2. **Build node ID mapping**:

   - Maintains map: old node ID → new node
   - Used for resolving internal instance references

3. **Recursively recreate nodes** (Two-Pass Approach):

   The import uses a **two-pass approach** to handle component dependencies:

   **First Pass: Create All Components**

   - Recursively collects ALL COMPONENT nodes from the entire tree (including nested components)
   - Creates each component node (without children) and adds component property definitions
   - Stores each component in `nodeIdMapping` immediately
   - **Result**: All components exist in the mapping before any instances try to reference them

   **Second Pass: Process All Nodes**

   - Processes all children normally (depth-first traversal)
   - When encountering a COMPONENT that was created in first pass:
     - Reuses the existing component from `nodeIdMapping`
     - Processes its children recursively
   - When encountering an INSTANCE:
     - Can immediately find the referenced component in `nodeIdMapping` (for internal instances)
     - Creates instance from the component

   **Example**: If Accordion references Logo:

   - Logo component is created in **first pass** (along with all other components)
   - Accordion is processed in **second pass**
   - When Accordion's Logo instance is encountered, Logo already exists in `nodeIdMapping`
   - Instance is created successfully from the existing Logo component

   For each node:

   - Creates node of appropriate type (FRAME, TEXT, COMPONENT, etc.)
   - Applies default values first
   - Applies non-default properties from JSON
   - Handles special cases:
     - **COMPONENT**: Adds component property definitions (first pass) or reuses existing (second pass)
     - **COMPONENT_SET**: Creates component variants, then combines using `combineAsVariants()`
     - **INSTANCE**: Resolves instance reference (see below)
   - Recursively processes children (second pass only)
   - Restores bound variables (fills, strokes, effects, etc.)

4. **Instance Resolution**:

   - When encountering `_instanceRef` in node data:
     - Looks up instance table entry by index
     - Resolves component based on `instanceType`:
       - **`internal`**: Looks up component by `componentNodeId` in node ID mapping
       - **`normal`**:
         - Searches all pages for page with matching `componentGuid` and `componentVersion` in metadata
         - Navigates `path` array (node names) from page root to component
         - Validates: node type is COMPONENT, name matches
         - If not found: Creates placeholder frame, defers resolution (added to `deferredInstances`)
       - **`remote`**: Looks up component in `remoteComponentMap` (created in Stage 10.5)
     - Creates instance from resolved component
     - Applies variant properties and component properties
     - Replaces `_instanceRef` with actual instance reference

5. **Variable Resolution**:

   - When encountering `_varRef` in node data:
     - Looks up variable in `recognizedVariables` map by table index
     - Binds variable to the property (fill, stroke, effect, etc.)
     - Handles VARIABLE_ALIAS values recursively

6. **Final Steps**:
   - Renames scratch page to original name (if was scratch page)
   - Stores page metadata (GUID, version) on page node
   - Returns page and deferred instances (if any)

## Post-Import: Deferred Instance Resolution

After all pages are imported, deferred normal instances can be resolved:

- **`resolveDeferredNormalInstances()`**:
  - Processes all deferred instances collected during import
  - Searches for referenced pages by `componentPageName`
  - Resolves component using path navigation
  - Replaces placeholder frames with actual instances
  - Handles circular dependencies by resolving after all pages exist

This is needed because many components create circular references to each other, which is hard to resolve.

## Key Design Patterns

### Table-Based Deduplication

- **Collections Table**: Stores each unique collection once, referenced by index
- **Variables Table**: Stores each unique variable once, referenced by index
- **Instance Table**: Stores each unique component reference once, referenced by index
- Reduces JSON size significantly when same entities are used multiple times

### GUID-Based Matching

- Collections use GUIDs stored as plugin data for reliable cross-file matching
- Pages use GUIDs in metadata for matching existing pages
- Components use GUIDs for cross-page resolution (normal instances)

### Mode ID Mapping

- Mode IDs are file-specific and change between files
- Collections store mode information as `modeId → modeName` mapping
- During import: Creates modes by name, builds mapping: old modeId → new modeId
- When setting variable values: Converts old mode IDs to new mode IDs

### Intelligent Matching

- **Collections**: Match by GUID first, fall back to name (with user confirmation)
- **Variables**: Match by name within collection, validate type
- **Components**: Match by GUID + version for normal instances, use ID mapping for internal instances

### Error Handling

- **External collections not found**: Throws error, stops import
- **Type mismatches**: Logs warning, creates new variable with incremented name
- **Missing components**: Creates placeholder frame, defers resolution
- **Invalid structure**: Logs warning, continues with other nodes

## Data Flow

```
JSON Data
  ↓
[Stage 1] Validate Metadata
  ↓
[Stage 2] Expand JSON (string table)
  ↓
[Stage 3] Load Collections Table
  ↓
[Stage 4] Match Collections (GUID/name)
  ↓
[Stage 5] Prompt for Potential Matches
  ↓
[Stage 6] Ensure Modes for Recognized Collections
  ↓
[Stage 7] Create New Collections
  ↓
[Stage 8] Load Variables Table
  ↓
[Stage 9] Match and Create Variables
  ↓
[Stage 10] Load Instance Table
  ↓
[Stage 10.5] Create Remote Instances
  ↓
[Stage 11] Create Page & Recreate Structure
  ↓
  ├─→ Recreate Nodes (recursive)
  ├─→ Resolve Instance References
  ├─→ Resolve Variable References
  └─→ Apply Properties & Bindings
  ↓
Imported Page
```

## Special Cases

### Component Sets

- Cannot create COMPONENT_SET directly
- Creates all component variants first
- Combines variants using `figma.combineAsVariants()`
- Handles variant properties and component properties

### Remote Instances

- Cannot resolve by reference (component doesn't exist in target file)
- Stores full visual structure in instance table
- Recreates as local components on "REMOTES" page
- Used as fallback when reference cannot be resolved

### Normal Instances (Cross-Page)

- References components on different pages in same file
- Uses component metadata (GUID + version) stored on PAGE node
- Navigates path array (node names) to find component
- May be deferred if referenced page not yet imported

### Variable Aliases

- Variables can reference other variables (VARIABLE_ALIAS)
- Recursively resolved during export
- Recursively resolved during import
- Uses variable name matching within collection

## Performance Considerations

- **String Table**: Compresses repeated strings (e.g., "FRAME", "SOLID") to reduce JSON size
- **Table Deduplication**: Stores entities once, references by index
- **Lazy Loading**: Only loads pages when needed (e.g., for normal instance resolution)
- **Deferred Resolution**: Defers normal instance resolution until all pages imported (handles circular dependencies)
