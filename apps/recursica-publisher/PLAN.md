# JSON Parser/Exporter/Importer Plan and Design Decisions

This document tracks all design decisions, implementation details, and changes made to the JSON parser/exporter/importer system for the Figma plugin.

## Table of Contents

1. [Export Format Versions](#export-format-versions)
2. [Collections Table System](#collections-table-system)
3. [Variable Table System](#variable-table-system)
4. [Instance Table System](#instance-table-system)
5. [Variable Resolution Strategy](#variable-resolution-strategy)
6. [Default Value Handling](#default-value-handling)
7. [Type-Specific Parser Architecture](#type-specific-parser-architecture)
8. [Unhandled Key Tracking](#unhandled-key-tracking)
9. [Variable Import/Export Decisions](#variable-importexport-decisions)
10. [Future Considerations](#future-considerations)

## Export Format Versions

### Version 1.0.0

- Initial implementation
- Basic node serialization
- No variable deduplication
- No default value optimization

### Version 2.0.0

- Added type-specific parsers
- Implemented default value handling (only serialize non-default values)
- Added unhandled key tracking
- Reduced JSON size significantly

### Version 2.1.0

- Introduced variable table/index system
- Variables stored once in a table, referenced by index throughout JSON
- Reduced JSON size for files with many bound variables
- Variable table stored at root level: `{ metadata, variables, pageData }`

### Version 2.2.0

- Added `valuesByMode` storage to variable table entries
- Enables accurate variable recreation on import
- Recursive VARIABLE_ALIAS resolution in `valuesByMode`
- Intelligent variable matching and creation on import

### Version 2.3.0

- Introduced collections table/index system
- Collections stored once in a table, referenced by index in variable entries
- Mode information (modeId -> modeName) stored per collection
- Mode ID mapping during import (old mode IDs -> new mode IDs)
- Ensures collections and modes exist by name before creating variables
- Solves mode ID mismatch issue when creating collections

### Version 2.4.0

- Simplified variable table entries by removing unnecessary fields from serialized JSON
- Renamed `collectionRef` to `_colRef` to match `_varRef` naming pattern
- Removed from serialized JSON: `variableKey`, `id`, `collectionName`, `collectionId`, `isLocal`
- These fields are now internal-only (used during export for deduplication, kept for legacy compatibility during import)
- Added `getSerializedTable()` method to `VariableTable` that filters out internal-only fields
- Reduced JSON size by excluding fields that can be inferred from collection table references

## Collections Table System

### Design Rationale

Collections are shared across multiple variables, and each collection has its own set of modes. Instead of storing collection metadata with each variable, we store each unique collection once in a table. This also solves the critical mode ID mapping problem: mode IDs are file-specific, so we need to map old mode IDs to new mode IDs when importing.

### Implementation

- **CollectionTable Class**: Manages unique collections using `collectionId` as the unique identifier
- **CollectionTableEntry Interface**: Contains all metadata needed to recreate a collection:
  - `collectionName`: Name of the collection
  - `collectionId`: Original collection ID
  - `isLocal`: Whether the collection is local or team-bound
  - `modes`: Record mapping modeId -> modeName (for mode ID mapping)

### Collection Reference Format

Variables reference collections by index in the collections table:

```typescript
interface VariableTableEntry {
  variableName: string;
  variableType: string;
  _colRef?: number; // Reference to collection table index (v2.4.0+)
  valuesByMode?: Record<string, VariableValue | VariableAliasSerialized>;
  // Internal-only fields (not serialized to JSON):
  variableKey?: string; // Only used during export for deduplication
  id?: string; // Only used for fallback in legacy scenarios
  // Legacy fields kept for backward compatibility only:
  collectionName?: string;
  collectionId?: string;
  isLocal?: boolean;
  collectionRef?: number; // Legacy alias for _colRef (v2.3.0)
}
```

**v2.4.0 Changes**:

- `collectionRef` renamed to `_colRef` to match `_varRef` naming pattern
- Removed from serialized JSON: `variableKey`, `id`, `collectionName`, `collectionId`, `isLocal`
- These fields are only used internally during export/import processing
- JSON size reduced by excluding fields that can be inferred from collection table references

### Mode Handling

**During Export**:

- As variables are encountered, their collections are added to the collections table
- For each collection, all modes are stored as `modeId -> modeName` mapping
- This allows us to recreate modes by name during import

**During Import**:

1. Load collections table first
2. For each collection entry:

   - Find existing collection by name, or create if not found
   - For each mode in the exported modes:
     - Check if mode exists by name in the collection
     - If exists: Use existing mode's ID
     - If not exists: Create mode and get new mode ID
     - Build mapping: old modeId -> new modeId

3. When creating variables:

   - Use mode mapping to convert old mode IDs to new mode IDs
   - Set values using new mode IDs

### Benefits

- **Mode ID Mapping**: Solves the critical issue where mode IDs differ between files
- **Collection Deduplication**: Collections stored once, referenced by index
- **Mode Preservation**: Ensures all modes exist before creating variables
- **Name-Based Matching**: Uses mode names (semantic) instead of IDs (file-specific)
- **Backward Compatible**: Legacy format still supported

## Variable Table System

### Design Rationale

Variables are often repeated many times throughout a design file (e.g., color tokens, spacing values). Instead of storing full variable metadata with each bound variable reference, we store each unique variable once in a table and reference it by index.

### Implementation

- **VariableTable Class**: Manages unique variables using `variableKey` as the unique identifier
- **VariableTableEntry Interface**: Contains all metadata needed to recreate a variable:
  - `variableName`: Name of the variable
  - `variableType`: Type (COLOR, FLOAT, STRING, BOOLEAN)
  - `collectionRef`: Reference to collection table index (v2.3.0+)
  - `variableKey`: Unique key for the variable
  - `id`: Original variable ID
  - `valuesByMode`: Serialized values for all modes (v2.2.0+)
  - Legacy fields (for backward compatibility): `collectionName`, `collectionId`, `isLocal`

### Reference Format

Variables are referenced in JSON using:

```json
{
  "_varRef": 0
}
```

This format is minimal and unambiguous - the presence of `_varRef` indicates it's a variable reference (not a value).

### Variable Deduplication

- Variables are deduplicated by `variableKey` (globally unique in Figma)
- If the same variable appears multiple times, only one entry is stored
- All references point to the same table index

## Instance Table System

### Design Rationale

INSTANCE nodes reference other components (main components). During export, we need to:

- Store sufficient information to recreate instances on import
- Handle different scenarios: remote components (different file), top-level components (different page, same file), and internal components (same page)
- Deduplicate component information when the same component is referenced multiple times
- Provide a globally unique identifier that works across different files and users

Similar to the variable table system, we store each unique component once in an instance table and reference it by index.

### Globally Unique Component Identifier (GUID)

Components are identified using a GUID (Globally Unique Identifier) stored as plugin data on the component node itself. This approach provides:

1. **Persistence**: The GUID is stored on the component node and survives file saves, copies, and other operations
2. **Global Uniqueness**: GUIDs are globally unique across all files and users
3. **Simple Lookup**: Maintain an in-memory index during import for fast component resolution
4. **Cross-File Compatibility**: When importing JSON into a different file, the GUID allows matching and reuse of existing components

**Implementation**:

- Store GUID using plugin data key: `"recursica:componentId"`
- Generate GUID (UUID v4) if component doesn't already have one
- Store GUID in instance table entry as `globalComponentId`
- During import, maintain a `Map<string, ComponentNode>` index for fast lookup

### Instance Classification

INSTANCE nodes are classified into three categories based on their main component's location:

#### 1. Remote Components (Different File)

- **Detection**: `mainComponent.remote === true`
- **Characteristics**: Component exists in a different file (team library or external file)
- **Reference Resolution**: Cannot resolve reference on import (component doesn't exist in target file)
- **Storage Strategy**: Store full visual structure in instance table (acts as fallback)

#### 2. Top-Level Components (Different Page, Same File)

- **Detection**: `mainComponent.remote === false` AND component's page ID ≠ instance's page ID
- **Characteristics**: Component exists on a different page within the same file
- **Reference Resolution**: Can resolve reference on import using GUID (component exists in file, can search all pages)
- **Storage Strategy**: Store reference only (GUID, name, variant properties, component properties)

#### 3. Internal Components (Same Page)

- **Detection**: `mainComponent.remote === false` AND component's page ID === instance's page ID
- **Characteristics**: Component exists on the same page as the instance
- **Reference Resolution**: Can resolve reference on import using GUID (component exists on same page)
- **Storage Strategy**: Store reference only (GUID, name, variant properties, component properties)

### Implementation

- **InstanceTable Class**: Manages unique components using `globalComponentId` (GUID) as the unique identifier
- **InstanceTableEntry Interface**: Contains metadata needed to recreate an instance:

```typescript
interface InstanceTableEntry {
  // Globally unique identifier (GUID stored as plugin data)
  globalComponentId: string; // UUID v4 format

  // Component identification
  componentName: string; // Component name (may be variant property string)
  componentSetName?: string; // Actual component set name (if variant)
  componentType: string; // Component type (COMPONENT, COMPONENT_SET)
  componentKey?: string; // Component key (for same-file matching, optional)

  // Classification
  isRemote: boolean; // Whether component is from different file
  isTopLevel: boolean; // Whether component is on different page (same file)
  isInternal: boolean; // Whether component is on same page

  // Path information
  _path?: string; // Path within library/file (for remote/top-level)
  _instancePath?: string; // Path of instance in current file (for reference)

  // Variant/Property information
  variantProperties?: Record<string, string>; // Variant property values
  componentProperties?: Record<string, any>; // Component property values

  // Full structure (for remote components only)
  structure?: any; // Full visual structure (recursively exported)

  // Remote library information (if applicable)
  remoteLibraryName?: string;
  remoteLibraryKey?: string;
}
```

### Reference Format

Instances reference components in JSON using:

```json
{
  "_instanceRef": 0
}
```

Similar to `_varRef`, the presence of `_instanceRef` indicates it's an instance reference pointing to the instance table index.

### GUID Management

**During Export**:

1. **Get or Create GUID**:

   ```typescript
   const PLUGIN_DATA_KEY = "recursica:componentId";
   let guid = mainComponent.getPluginData(PLUGIN_DATA_KEY);

   if (!guid) {
     guid = generateUUID(); // Generate UUID v4
     mainComponent.setPluginData(PLUGIN_DATA_KEY, guid);
   }
   ```

2. **Store in Instance Table**:
   - Add component to instance table with `globalComponentId: guid`
   - Store reference index in instance node data as `_instanceRef`

**During Import**:

1. **Build Component Index**:

   ```typescript
   const componentIdIndex = new Map<string, ComponentNode>();
   ```

2. **Search for Existing Components**:

   - Before creating components, search all pages for components with matching GUIDs
   - Populate index: `componentIdIndex.set(guid, component)`

3. **Create or Reuse Components**:

   - If component exists in index: Reuse it
   - If not: Create new component and store GUID on it
   - Add to index for future lookups

4. **Create Instances**:
   - Look up component by GUID from index
   - Create instance from component
   - Apply variant properties and component properties

### Page Detection Logic

To classify instances, we need to determine which page the component and instance are on:

```typescript
function getPageFromNode(node: any): PageNode | null {
  let current: any = node;
  while (current) {
    if (current.type === "PAGE") {
      return current;
    }
    try {
      current = current.parent;
    } catch (error) {
      // Parent access may fail for remote components
      return null;
    }
  }
  return null;
}

// Classification logic
const instancePage = getPageFromNode(instanceNode);
const componentPage = getPageFromNode(mainComponent);

const isRemote = mainComponent.remote === true;
const isTopLevel =
  !isRemote &&
  componentPage &&
  instancePage &&
  componentPage.id !== instancePage.id;
const isInternal =
  !isRemote &&
  componentPage &&
  instancePage &&
  componentPage.id === instancePage.id;
```

### Export Strategy

**During Export**:

1. **Encounter INSTANCE node**:

   - Get main component via `getMainComponentAsync()`
   - Get or create GUID for component (store as plugin data if new)
   - Determine classification (remote/top-level/internal)
   - Get or add component to instance table

2. **For Remote Components**:

   - Recursively export full visual structure using `extractNodeData()`
   - Store structure in instance table entry
   - Store reference metadata (GUID, name, path, etc.)

3. **For Top-Level/Internal Components**:

   - Store reference metadata only (GUID, name, variant props, component props, path)
   - Do NOT store full structure (can be resolved by GUID on import)

4. **Store Instance Reference**:
   - Add `_instanceRef` to node data pointing to instance table index

### Import Strategy

**During Import**:

1. **Build Component Index** (First Pass):

   - Search all pages in file for components with `recursica:componentId` plugin data
   - Build index: `Map<guid, ComponentNode>`

2. **Process Instance Table** (Second Pass):

   - For each instance table entry:
     - If `isRemote` and has `structure`: Recreate component from structure, store GUID
     - If `isTopLevel` or `isInternal`: Look up component by GUID in index
     - If component not found: Log warning, create from structure (if available) or skip

3. **Create Instances** (Third Pass):
   - When encountering `_instanceRef` in node data:
     - Look up component by GUID from index
     - Create instance from component
     - Apply variant properties and component properties

### Benefits

- **Component Deduplication**: Each unique component stored once, referenced by index
- **Selective Structure Storage**: Only remote components store full structure (saves space)
- **Reference Preservation**: Top-level/internal components can be resolved by GUID
- **Cross-File Compatibility**: GUIDs work across different files and users
- **Persistence**: GUIDs stored on components survive file operations
- **Fast Lookup**: In-memory index enables O(1) component resolution during import
- **Fallback Support**: Structure available for remote components when reference fails
- **Variant Handling**: Variant properties and component properties preserved

### Known Limitations

1. **Remote Component Access**:

   - Cannot access parent chain beyond COMPONENT_SET for remote components
   - Path information may be limited to component set name only

2. **Plugin Data Scope**:

   - Plugin data is file-specific, so GUIDs are only available within the same file
   - For remote components, GUID lookup won't work (must use structure)

3. **Component Key Uniqueness**:

   - Component keys are file-specific, not universally unique
   - GUID provides the globally unique identifier needed for cross-file scenarios

4. **Library Dependencies**:
   - Remote components require full structure storage
   - No automatic component library import/sync

## Variable Resolution Strategy

### Export: Recursive VARIABLE_ALIAS Resolution

When a variable's `valuesByMode` contains VARIABLE_ALIAS references (variables pointing to other variables), we recursively resolve them:

1. **Primitive Values**: Stored as-is (string, number, boolean)
2. **VARIABLE_ALIAS Values**:
   - Recursively resolve the referenced variable
   - Add referenced variable to table if not already present
   - Add referenced variable's collection to collections table
   - Store serialized alias with both:
     - `id`: Original variable ID (for fallback)
     - `_varRef`: Reference to variable table entry (for resolution)

This ensures that when we import, we can recreate the complete variable dependency graph.

### Import: Intelligent Variable Matching

When importing variables:

1. **Collection Resolution** (v2.3.0+):

   - Load collections table first
   - For each collection entry:
     - Find existing collection by name, or create if not found
     - Ensure all modes exist by name (create if missing)
     - Build mode mapping: old modeId -> new modeId

2. **Variable Matching**:

   - Get collection from collections table (using `collectionRef` or legacy fields)
   - Search for existing variable by name within the collection
   - If found: Validate type matches
     - If type matches: Use existing variable
     - If type mismatches: Log warning, skip binding (continue import)

3. **Variable Creation**:
   - If variable doesn't exist: Create it using stored `valuesByMode`
   - Use mode mapping to convert old mode IDs to new mode IDs
   - Restore all mode values with new mode IDs
   - Resolve VARIABLE_ALIAS values by finding variables by name

### Error Handling

- **External collection not found**: Throw error, stop import (requirement 3a)
- **Type mismatch**: Log warning, skip binding to that variable, continue import (requirement 4c)
- **Variable creation failure**: Log error, continue with other variables

## Default Value Handling

### Rationale

Figma nodes have many properties with default values. Storing these defaults in JSON wastes space and provides no benefit since they can be inferred on import.

### Implementation

1. **Node Defaults**: Defined in `nodeDefaults.ts` for each node type
2. **Parser Behavior**: Only serialize properties that differ from defaults
3. **Import Behavior**: Apply defaults first, then override with serialized values

### Benefits

- Significantly reduced JSON size (often 50-70% reduction)
- Easier to read JSON (only meaningful differences shown)
- Maintainable: Default changes automatically propagate

## Type-Specific Parser Architecture

### Design

Instead of one monolithic parser, we use type-specific parsers:

- `baseNodeParser.ts`: Common properties (name, position, visibility, etc.)
- `frameParser.ts`: Frame/Component/Instance properties (layout, padding, etc.)
- `textParser.ts`: Text-specific properties (font, alignment, spacing, etc.)
- `vectorParser.ts`: Vector/Line properties (stroke caps, joins, etc.)
- `shapeParser.ts`: Shape properties (point count, inner radius, etc.)
- `instanceParser.ts`: Instance properties (main component reference)
- `boundVariableParser.ts`: Variable binding extraction

### Benefits

- Modular and maintainable
- Easy to extend for new node types
- Clear separation of concerns
- Type-safe property handling

## Unhandled Key Tracking

### Purpose

Track which node properties are not explicitly handled by parsers. This helps identify:

- Missing parser implementations
- New Figma API features we haven't handled
- Properties we intentionally ignore

### Implementation

- Each parser tracks which keys it handles
- After parsing, compare all node keys against handled keys
- Unhandled keys are stored as `_unhandledKeys` array in the JSON
- Can be reviewed to improve parser coverage

### Format

```json
{
  "type": "FRAME",
  "name": "My Frame",
  "_unhandledKeys": ["someNewProperty", "anotherProperty"]
}
```

## Variable Import/Export Decisions

### Decision: Store Variable Values (v2.2.0)

**Question**: Should we store variable values (`valuesByMode`) in the JSON?

**Answer**: Yes.

**Rationale**:

- To recreate variables accurately, we need their values
- Variables may reference other variables (VARIABLE_ALIAS), which need to be resolved
- Values may not match defaults, so we can't infer them

**Implementation**:

- Store `valuesByMode` in `VariableTableEntry`
- Recursively resolve VARIABLE_ALIAS values to capture full dependency graph
- Store both original ID and table reference for each alias

### Decision: Recursive VARIABLE_ALIAS Resolution

**Question**: How should we handle VARIABLE_ALIAS values in `valuesByMode`?

**Answer**: Recursively resolve them and add all referenced variables to the table.

**Rationale**:

- Variables referencing other variables create a dependency graph
- We need all referenced variables to recreate the original accurately
- Prevents broken references on import

**Implementation**:

- When encountering VARIABLE_ALIAS, resolve the referenced variable
- Add referenced variable to table (recursively processing its values)
- Store alias with both ID (fallback) and `_varRef` (preferred resolution)

### Decision: Variable Matching by Name

**Question**: How should we match existing variables on import?

**Answer**: Match by variable name within the same collection.

**Rationale**:

- Variable IDs are file-specific and won't match across files
- Variable names are semantic identifiers that should match
- Collection scoping ensures we match the right variable

**Implementation**:

- Search for variable by name within the collection
- If found and type matches: use existing variable
- If found but type mismatches: log warning, skip binding
- If not found: create new variable

### Decision: Auto-Create Local Collections

**Question**: What should we do if a local collection doesn't exist?

**Answer**: Create it automatically.

**Rationale**:

- Local collections are file-specific and safe to create
- Reduces friction for users
- Ensures import can proceed

**Implementation**:

- Check if collection exists by name
- If not found, create new collection with that name
- Use collection for variable creation/matching

### Decision: Require External Collections

**Question**: What should we do if an external collection doesn't exist?

**Answer**: Throw error and stop import.

**Rationale**:

- External collections are team-wide and shouldn't be created arbitrarily
- Missing collection indicates configuration issue
- Fail fast rather than create broken state

**Implementation**:

- Validate collection exists in team library
- If not found, throw descriptive error
- Import stops (no partial state)

### Decision: Type Mismatch Handling

**Question**: What should we do if a variable exists but has a different type?

**Answer**: Log warning and continue without binding.

**Rationale**:

- Type mismatch indicates configuration issue
- Continuing allows other variables to be bound
- User can see warning and fix issue

**Implementation**:

- Compare `variable.resolvedType` with expected type
- If mismatch: log warning with details
- Return null from resolution function (skip binding)
- Continue with other variables

## Future Considerations

### Potential Enhancements

1. **Two-Pass Variable Import**:

   - First pass: Create all variables (without mode values)
   - Second pass: Set mode values (resolving VARIABLE_ALIAS references)
   - Would handle circular dependencies better

2. **Variable Collection Metadata**:

   - Store collection metadata (modes, etc.)
   - Ensure imported collections match original structure

3. **Variable Value Validation**:

   - Validate that stored values are valid for the variable type
   - Handle edge cases (e.g., missing referenced variables)

4. **Incremental Import**:

   - Support importing into existing page
   - Handle ID conflicts gracefully

5. **Export Optimization**:

   - Further optimize JSON size
   - Consider compression for large files

6. **Component Instance Handling**:

   - Currently stores basic info (name, key)
   - Could store component property values
   - Could handle component variants

7. **Style References**:
   - Similar to variables, styles could be deduplicated
   - Text styles, effect styles, etc.

### Known Limitations

1. **Circular Variable Dependencies**:

   - Currently handled by visited set during export
   - Import may have issues with very complex circular dependencies
   - Two-pass approach would help

2. **Component Library Dependencies**:

   - Instances require main component to exist
   - No automatic component import yet
   - Falls back to frame if component not found

3. **Variable Mode Names**:

   - Assumes mode IDs are consistent
   - May need to match by mode name instead

4. **External Variable References**:
   - Requires external collection to be published
   - No automatic publishing/syncing

## Services

### getAllComponents Service

**Purpose**: Traverse all pages and collect component metadata for each page.

**Implementation**:

- Loads all pages using `figma.loadAllPagesAsync()`
- Iterates through all nodes in `figma.root.children`
- For each node:
  - Type checks to ensure it's a PAGE node (`node.type === "PAGE"`)
  - Skips non-PAGE nodes with a warning (defensive programming)
  - Retrieves component metadata from plugin data (key: `RecursicaPublishedMetadata`)
  - If no metadata exists, creates an empty entry with the cleaned component name
  - If parsing fails, falls back to empty entry with cleaned name
- Returns an object with `{ components: ComponentMetadata[] }`

**Return Format**:

```typescript
{
  components: ComponentMetadata[]
}
```

Each `ComponentMetadata` entry includes:

- `_ver`: Version number (1 or greater)
- `id`: GUID (empty string if not published)
- `name`: Cleaned component name
- `version`: Version number (0 if not published)
- `publishDate`: ISO date string (empty if not published)
- `history`: History object (empty if not published)

**Behavior**:

- Pages without metadata still get an entry with empty fields but populated `name`
- Handles parse errors gracefully by falling back to empty metadata
- Uses the same `getComponentName` utility for name cleaning as `getComponentMetadata`
- Includes defensive type checking to ensure only PAGE nodes are processed (though API guarantees all root children are pages)

## Change Log

### 2024-12-XX: Added getAllComponents Service

- Added `getAllComponents` service to traverse all pages and collect component metadata
- Returns array of component metadata with empty entries for pages without metadata
- Service automatically registered in services map and available via message routing

### 2024-12-XX: Version 2.4.0

- Simplified variable table entries by removing unnecessary fields from serialized JSON
- Renamed `collectionRef` to `_colRef` to match `_varRef` naming pattern
- Removed from serialized JSON: `variableKey`, `id`, `collectionName`, `collectionId`, `isLocal`
- These fields are now internal-only (used during export for deduplication, kept for legacy compatibility during import)
- Added `getSerializedTable()` method to `VariableTable` that filters out internal-only fields
- Updated `fromTable()` to handle missing `variableKey` gracefully (optional during import)
- Updated import functions to use collection table for resolving variable aliases
- Reduced JSON size by excluding fields that can be inferred from collection table references

### 2024-12-XX: Version 2.3.0

- Introduced collections table/index system
- Collections stored once, referenced by index in variable entries
- Mode information (modeId -> modeName) stored per collection
- Mode ID mapping during import (old mode IDs -> new mode IDs)
- Ensures collections and modes exist by name before creating variables
- Solves mode ID mismatch issue when creating collections
- Updated variable table entries to use `collectionRef` instead of collection fields
- JSON structure updated: `{ metadata, collections, variables, pageData }`

### 2024-12-XX: Version 2.2.0

- Added `valuesByMode` to variable table entries
- Implemented recursive VARIABLE_ALIAS resolution
- Added intelligent variable matching by name
- Auto-create local collections
- Require external collections (throw error if missing)
- Type validation with warning on mismatch

### 2024-12-XX: Version 2.1.0

- Introduced variable table/index system
- Reduced JSON size for files with many variables
- Added `_varRef` reference format

### 2024-12-XX: Version 2.0.0

- Added type-specific parsers
- Implemented default value handling
- Added unhandled key tracking
- Significant JSON size reduction
