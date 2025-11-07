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

### Version 2.5.0

- Introduced collection GUID system for reliable cross-file collection matching
- Collections now store a globally unique identifier (GUID) as plugin data
- GUIDs enable matching collections across files even when multiple collections share the same name
- Added `collectionGuid` field to `CollectionTableEntry` interface
- During export: Collections get or generate GUIDs and store them in plugin data
- During import: Collections are matched by GUID first, then fall back to name matching (backward compatible)
- Solves the problem of ambiguous collection matching when multiple collections have the same name
- Removed `type` and `id` fields from variable alias serialization in `valuesByMode` (only `_varRef` is stored)
- Variable references in JSON now use minimal format: `{ _varRef: number }` instead of `{ type: "VARIABLE_ALIAS", id: string, _varRef: number }`

### Version 2.6.0

- Introduced instance table system for component instance deduplication
- Instances stored once in a table, referenced by index throughout JSON using `_instanceRef`
- Instance table stored at root level: `{ metadata, collections, variables, instances, libraries, pageData }`
- Instances classified into three types: `internal` (same page), `normal` (different page, same file), `remote` (different file)
- Internal instances store only component node ID (minimal storage)
- Normal instances store component GUID and version from page metadata (for cross-page resolution)
- Remote instances store full visual structure (fallback when reference cannot be resolved)
- Reduces JSON size by deduplicating component references when the same component is used multiple times

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

### Collection Name Validation

**Non-Local Collection Restrictions**:

- Non-local (remote/team-bound) collections must have specific names to be valid
- Only the following names are allowed for non-local collections:
  - `"Token"` or `"Tokens"` (case-sensitive)
  - `"Theme"` or `"Themes"` (case-sensitive)
- Local collections can have any name (no restrictions)
- If a non-local collection is encountered with an invalid name during export or import, an error is thrown with the invalid collection name

**Validation Behavior**:

- **During Export**: When adding a collection to the collections table, if the collection is non-local and has an invalid name, an error is thrown immediately
- **During Import**: When processing a collection table entry, if the collection is non-local and has an invalid name, an error is thrown before attempting to find or create the collection

**Multiple Collections with Same Name**:

- In Figma, collections are uniquely identified by their `collectionId`, not by name
- Multiple collections can have the same name (e.g., three separate collections all named "Theme")
- Each collection with the same name appears as a separate collection in the Figma UI
- The collections table uses `collectionId` as the unique identifier, so multiple collections with the same name are stored separately

### Collection GUID System (v2.5.0+)

**Problem**: When importing JSON, if multiple collections have the same name, we cannot reliably determine which collection to link to. Collection IDs change between files, so they cannot be used for cross-file matching.

**Solution**: Store a globally unique identifier (GUID) as plugin data on each collection, similar to how components are handled.

**Implementation**:

- **GUID Storage**: GUIDs are stored as plugin data on collections using key `"recursica:collectionId"`
- **GUID Generation**: UUID v4 is generated using `crypto.randomUUID()` if a collection doesn't already have a GUID
- **GUID Persistence**: GUIDs persist across file saves, copies, and other operations
- **CollectionTableEntry**: Added optional `collectionGuid` field to store GUID in exported JSON

**During Export**:

- When adding a collection to the collections table, get or generate a GUID for the collection
- Store the GUID in the collection table entry
- GUID is stored on the collection itself as plugin data for future exports

**During Import**:

- **For Local Collections**:

  1. First, try to match existing collections by GUID (if GUID is present in the entry)
  2. If no GUID match, fall back to name matching (for backward compatibility)
  3. If collection is matched by name and has a GUID in the entry, set the GUID on the collection
  4. If no matching collection is found, create a new one and set the GUID
  5. If GUID is missing from entry (legacy format), generate a new GUID

- **For External Collections**:
  1. Match by name in team library (required for external collections)
  2. Import the collection (which creates a local copy)
  3. Set GUID on the imported collection if available in the entry
  4. If GUID is missing, generate a new GUID

**Benefits**:

- **Reliable Matching**: Collections can be matched across files even when multiple collections share the same name
- **Backward Compatible**: Falls back to name matching if GUID is not present (legacy JSON support)
- **Automatic Migration**: Collections without GUIDs get them automatically during export/import
- **Cross-File Consistency**: Same collection in different files can be reliably identified and reused

### Registered Remote Collections (v2.5.0+)

**Problem**: Remote collections cannot have plugin data written to them (Figma API restriction). This means we cannot store GUIDs directly on remote collections like we do for local collections.

**Solution**: Maintain a code-based registry of remote collection IDs mapped to their GUIDs. Remote collections must be explicitly registered before they can be exported.

**Implementation**:

- **Registry Location**: `src/const/RegisteredCollections.ts`
- **Registry Format**: `Record<string, string>` mapping collection ID → GUID
- **Collection ID**: The full collection ID string from Figma (e.g., `"VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2151:0"`)
- **GUID**: UUID v4 string for the collection

**During Export**:

- When processing a remote collection, check if its `collection.id` exists in `REGISTERED_REMOTE_COLLECTIONS`
- If registered: Use the GUID from the registry
- If not registered: Throw error: `"Unrecognized remote variable collection. Please contact the developers to register your collection to proceed"`
- Export fails immediately if an unregistered remote collection is encountered

**During Import**:

- Same validation: Remote collections must be registered
- If not registered: Throw the same error and fail import

**Registration Process**:

To add a new remote collection:

1. Get the collection ID from Figma (from error message or collection object's `id` property)
2. Generate a UUID v4 GUID for it
3. Add the mapping to `RegisteredCollections.ts`:

   ```typescript
   export const REGISTERED_REMOTE_COLLECTIONS: Record<string, string> = {
     "VariableCollectionId:example123/2151:0":
       "550e8400-e29b-41d4-a716-446655440000",
   };
   ```

**Benefits**:

- **Explicit Control**: Only approved remote collections can be exported/imported
- **Security**: Prevents accidental export of unauthorized remote collections
- **Consistency**: Ensures all remote collections have stable GUIDs across files
- **Developer Control**: Requires code changes to add new remote collections, ensuring review process

**Error Handling**:

- Errors are caught and logged to the debug console with full stack traces
- Export/import operations fail gracefully with user-friendly error messages
- Error message: `"Unrecognized remote variable collection. Please contact the developers to register your collection to proceed"`

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

#### 1. Internal (Same Page)

- **Detection**: `mainComponent.remote === false` AND component's page ID === instance's page ID
- **Characteristics**: Component exists on the same page as the instance being exported
- **Storage Strategy**: Store only the node ID of the component in the instance table entry
- **Reference Resolution**: On import, resolve by looking up the component node ID within the same page
- **Instance Table Entry**: Minimal - just the component node ID reference

#### 2. Normal (Different Page, Same File)

- **Detection**: `mainComponent.remote === false` AND component's page ID ≠ instance's page ID
- **Characteristics**: Component exists on a different page within the same file. This page will be exported as a separate component file and referenced using its GUID.
- **Storage Strategy**: Store the GUID and version number from the component's published metadata (stored as plugin data on the PAGE node using key `RecursicaPublishedMetadata`)
- **Publishing Requirement**: The page should be published (have component metadata with non-empty `id` and `version > 0`). If not published, the page is collected for publishing prompts at the end of export.
- **Reference Resolution**: On import, resolve by looking up the component page using the stored GUID and version number
- **Instance Table Entry**: Store `componentGuid` (from metadata.id), `componentVersion` (from metadata.version), and component name. If not published, store the page reference for later publishing.

#### 3. Remote (Different File)

- **Detection**: `mainComponent.remote === true`
- **Characteristics**: Component exists in a different file (team library or external file)
- **Storage Strategy**: Store a complete visual representation of the instance in the instance table (all node information needed to visually render it). This is a fallback since the reference cannot be resolved.
- **Reference Resolution**: Cannot resolve reference on import (component doesn't exist in target file). The visual representation is used to recreate the instance.
- **Instance Table Entry**: Store full visual structure (recursively exported using `extractNodeData()`) plus reference metadata (name, path, etc.)

### Implementation

- **InstanceTable Class**: Manages unique instances using a composite key based on instance type:
  - For `internal`: Uses `internal:${componentNodeId}` as the unique key
  - For `normal`: Uses `normal:${componentGuid}:${componentVersion}` as the unique key
  - For `remote`: Uses `remote:${remoteLibraryKey}:${componentName}` as the unique key (fallback to component name and type if library key unavailable)
  - Provides `addInstance()` method that returns the index (existing or newly added)
  - Provides `getInstanceByIndex()` for lookup during import
  - Provides `getSerializedTable()` for JSON export
  - Provides static `fromTable()` method for reconstruction during import
- **InstanceTableEntry Interface**: Contains metadata needed to recreate an instance (see interface definition above)
- **Key Generation**: The `generateKey()` method creates unique keys based on instance type to ensure proper deduplication
- **Serialization**: All fields in `InstanceTableEntry` are included in the serialized JSON (no filtering needed, unlike variable table)

```typescript
interface InstanceTableEntry {
  // Instance type classification
  instanceType: "internal" | "normal" | "remote";

  // For internal instances (same page)
  componentNodeId?: string; // Node ID of the component on the same page

  // For normal instances (different page, same file)
  componentGuid?: string; // GUID from component metadata (RecursicaPublishedMetadata.id)
  componentVersion?: number; // Version number from component metadata (RecursicaPublishedMetadata.version)
  componentPageName?: string; // Name of the page that contains the component

  // For remote instances (different file)
  structure?: any; // Full visual structure (recursively exported using extractNodeData())
  remoteLibraryName?: string; // Library name if available
  remoteLibraryKey?: string; // Library key if available

  // Common fields (used for all types)
  componentName: string; // Component name (may be variant property string)
  componentSetName?: string; // Actual component set name (if variant)
  componentType?: string; // Component type (COMPONENT, COMPONENT_SET) - mainly for remote
  path?: string[]; // Path within library/file (for remote/normal components) - REQUIRED for normal instances to locate the specific component on the referenced page. Array of node names from page root to component. Empty array means component is at page root. Empty names are represented as empty strings in the array. Duplicate names are allowed but may require validation during import to resolve ambiguity.
  variantProperties?: Record<string, string>; // Variant property values
  componentProperties?: Record<string, any>; // Component property values
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

### Component Identification

**For Internal Instances**:

- Use the component's node ID directly (same page, simple reference)

**For Normal Instances (Different Page, Same File)**:

- Use the component metadata stored on the PAGE node (plugin data key: `RecursicaPublishedMetadata`)
- The metadata contains:
  - `id`: GUID (globally unique identifier for the component)
  - `version`: Version number of the published component
- This metadata is set when a page is published as a component
- The GUID and version are stored in the instance table entry for reference resolution on import
- The page will be exported as a separate component file (`.comp.json`)

**For Remote Instances**:

- Cannot use GUID resolution (component doesn't exist in target file)
- Store full visual structure instead

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
const isInternal =
  !isRemote &&
  componentPage &&
  instancePage &&
  componentPage.id === instancePage.id;
const isNormal =
  !isRemote &&
  componentPage &&
  instancePage &&
  componentPage.id !== instancePage.id;

// Determine instance type
let instanceType: "internal" | "normal" | "remote";
if (isRemote) {
  instanceType = "remote";
} else if (isInternal) {
  instanceType = "internal";
} else if (isNormal) {
  instanceType = "normal";
}
```

### Export Strategy

**During Export**:

1. **Encounter INSTANCE node**:

   - Get main component via `getMainComponentAsync()`
   - Determine classification (internal/normal/remote)
   - Get or add component to instance table based on classification

2. **For Internal Instances (Same Page)**:

   - Store only the component's node ID in the instance table entry
   - Set `instanceType: "internal"` and `componentNodeId: mainComponent.id`
   - Store variant properties and component properties if present
   - Minimal storage - just enough to resolve on import

3. **For Normal Instances (Different Page, Same File)**:

   - Get the page node that contains the main component
   - Retrieve component metadata from the page using plugin data key `RecursicaPublishedMetadata`
   - **Check Publishing Status**: Check if metadata exists and has `id` (non-empty) and `version > 0`
   - **If published**: Store `componentGuid` (from metadata.id), `componentVersion` (from metadata.version), and `componentPageName` (from page.name)
   - **If not published**: Store the page reference (page node and page name) in an unpublished components list for later processing. Continue with export but note that this component needs publishing.
   - Set `instanceType: "normal"`
   - Store variant properties and component properties if present
   - Do NOT store full structure (can be resolved by GUID and version on import)

4. **For Remote Instances (Different File)**:

   - Recursively export full visual structure using `extractNodeData()` (excluding the instance reference itself to avoid circular references)
   - Store structure in instance table entry
   - Set `instanceType: "remote"`
   - Store reference metadata (name, path, library info if available)
   - Store variant properties and component properties if present
   - This visual representation serves as the fallback when the reference cannot be resolved

5. **Store Instance Reference**:

   - Add instance entry to `InstanceTable` using `context.instanceTable.addInstance(entry)`
   - Get the returned index from `addInstance()` (will return existing index if instance already in table)
   - Add `_instanceRef` to node data pointing to instance table index
   - Replace the instance node's `mainComponent` reference in the JSON with `_instanceRef` to point to the instance table entry
   - The `_instanceRef` field is stored directly in the node data (e.g., `{ type: "INSTANCE", _instanceRef: 0, ... }`)

6. **Handle Unpublished Components** (After Export):
   - If any unpublished components were collected during export:
     - Step through each unpublished page in the list
     - For each page, prompt the user using the plugin's prompt feature: "Would you like to publish [Page Name] as a component?"
     - If user says "Yes":
       - Call `exportPageNew` for that page to generate its JSON export
       - The exported JSON file will be saved with filename: `<component-name>.comp.json` (where component-name is the cleaned page name)
       - This publishes the page as a component, storing the component metadata on the page node
       - The export process can generate multiple JSON files: one for the main page being exported, plus one for each published component page
     - If user says "No": Skip that page and continue with the next one
   - After all prompts are complete, the main page export continues or completes

### Import Strategy

**During Import**:

1. **Process Instance Table** (First Pass):

   - For each instance table entry:
     - **If `instanceType === "internal"`**: Look up component by `componentNodeId` on the same page (will be resolved when recreating nodes on that page)
     - **If `instanceType === "normal"`**:
       - Search all pages for a page with component metadata matching `componentGuid` and `componentVersion`
       - If found: Use `path` array to navigate from the page root to the specific component node
         - `path` is an array of node names (e.g., ["Frame1", "Container", "Button"])
         - **Cannot use node IDs** because IDs differ across files/users
         - Empty names in path are represented as empty strings `""`
         - If `path` is empty array, the component is at the page root (search page's direct children)
         - Starting from the page, navigate by name: for each segment in the path array:
           - Find child nodes with matching name (may be multiple if names are duplicated)
           - If multiple matches found, try each path and validate at the end
           - Handle empty strings by finding nodes with empty or whitespace-only names
         - **Validation**: After navigating to the final node, verify:
           - Node type matches `componentType` (COMPONENT or COMPONENT_SET)
           - Node name matches `componentName` (or if `componentSetName` is present, the node should be a COMPONENT_SET with that name, and we'll need to find the specific variant component within it)
         - If validation fails and multiple paths exist: Try the next matching path
         - If all paths fail validation: Log error and skip (path resolution found wrong node, possibly due to structure changes)
         - The validated node at the end of the path is the component to use for the instance
       - If not found: Log error and skip (should not happen if export validation worked)
       - **Note**: `path` is essential for normal instances because a page can contain multiple components, and we need to identify the specific one. Using names (as array) avoids separator conflicts, and validation ensures we find the correct component even with duplicate names.
     - **If `instanceType === "remote"`**:
       - Recreate component from the stored `structure` (visual representation)
       - This creates a local copy of the remote component that can be used for the instance

2. **Create Instances** (Second Pass):
   - When encountering `_instanceRef` in node data during node recreation:
     - Look up the instance table entry by index
     - Get the resolved component (from step 1 above)
     - Create instance from the component
     - Apply variant properties and component properties from the instance table entry
     - Replace the `_instanceRef` in the JSON node data with the actual instance reference

### Unpublished Component Publishing Flow

**During Export** (`pageExportNew`):

When processing instances of type "normal" (different page, same file):

1. **Collect Unpublished Components**:

   - For each instance that references a component on a different page:
     - Get the page node containing the main component
     - Retrieve component metadata using `RecursicaPublishedMetadata` plugin data key
     - Check if metadata exists and has valid `id` (non-empty string) and `version > 0`
     - If not published, add the page reference (page node, page name, page index) to an unpublished components list
   - Continue with export (do not fail)

2. **Publishing Prompts** (After Export):

   - After the main page export completes, if any unpublished components were collected:
     - Iterate through each unpublished page in the list
     - For each page, show a prompt dialog: `"Would you like to publish [Page Name] as a component?"`
     - Wait for user response
     - **If user confirms ("Yes")**:
       - Call `exportPageNew` for that page to generate its component JSON
       - Save the exported JSON file with filename: `<component-name>.comp.json`
         - Where `component-name` is the cleaned page name (e.g., "Button" → "Button.comp.json")
       - The `exportPageNew` function will store component metadata on the page node (GUID, version, etc.)
       - This publishes the page as a component
     - **If user declines ("No")**:
       - Skip that page and continue with the next one
     - Continue until all unpublished pages have been processed

3. **Multiple JSON Files**:

   - `exportPageNew` can generate multiple JSON files:
     - One for the main page being exported (e.g., `MyPage_export.json`)
     - One for each component page that gets published (e.g., `Button.comp.json`, `Input.comp.json`)
   - Each published component page gets its own JSON file with the `.comp.json` extension
   - The main page export continues regardless of whether components are published or not

### Implementation Details

**Export Process** (`instanceParser.ts`):

1. When an `INSTANCE` node is encountered during export:

   - Get main component via `await node.getMainComponentAsync()`
   - Determine instance type using `getPageFromNode()` helper:
     - Check if `mainComponent.remote === true` → `remote`
     - Check if component page ID === instance page ID → `internal`
     - Otherwise → `normal`
   - Extract variant properties and component properties from instance node
   - Build parent paths for both instance and component
   - Create `InstanceTableEntry` with appropriate fields based on type
   - For `normal` instances: Retrieve component metadata from page using `getSharedPluginData("recursica", "RecursicaPublishedMetadata")`
   - For `remote` instances: Attempt to get library info via `getPublishStatusAsync()` and team library APIs, then extract full structure using `extractNodeData()`
   - Add entry to instance table: `const index = context.instanceTable.addInstance(entry)`
   - Return `{ _instanceRef: index }` instead of `mainComponent` object

2. Instance table is included in JSON export at root level:

   ```json
   {
     "metadata": { ... },
     "collections": { ... },
     "variables": { ... },
     "instances": {
       "0": { "instanceType": "internal", "componentNodeId": "...", ... },
       "1": { "instanceType": "normal", "componentGuid": "...", ... },
       ...
     },
     "libraries": [ ... ],
     "pageData": { ... }
   }
   ```

3. **Key Generation Logic**:

   The `InstanceTable.generateKey()` method creates unique keys for deduplication:

   - `internal:${componentNodeId}` - Simple node ID for same-page components
   - `normal:${componentGuid}:${componentVersion}` - GUID + version for cross-page components (path is not part of key since GUID+version uniquely identifies the page)
   - `remote:${remoteLibraryKey}:${componentName}` - Library key + name for remote components
   - Fallback: `${instanceType}:${componentName}:${componentType}` if required fields missing

4. **Path Resolution and Validation**:

   When resolving a normal instance during import:

   - Navigate the `path` array from the page root to find the target node
   - **Cannot use node IDs** because IDs differ across files/users - must use names
   - Path is stored as array of node names to avoid separator conflicts
   - For each segment in the path array:
     - Find child nodes with matching name (may be multiple if names are duplicated)
     - Handle `"<*EMPTY*>"` by finding nodes with empty or whitespace-only names
     - If multiple matches found at any level, try each path and validate at the end
   - **Validation is critical**: After navigating to the node, verify:
     - Node type matches `componentType` (must be COMPONENT or COMPONENT_SET)
     - Node name matches `componentName` (for regular components) OR
     - If `componentSetName` is present, the node should be a COMPONENT_SET with name matching `componentSetName`, and we need to find the specific variant component within the set that matches `componentName` and `variantProperties`
   - If validation fails and multiple paths exist: Try the next matching path
   - If all paths fail validation: Log an error and skip the instance (path resolution found wrong node, possibly due to structure changes)
   - This validation ensures we're using the correct component even if the page structure has changed slightly or names are duplicated
   - **Note**: Duplicate names are handled by trying all matching paths and validating each one. The first path that passes validation is used.

### Benefits

- **Component Deduplication**: Each unique component stored once, referenced by index
- **Selective Structure Storage**: Only remote components store full structure (saves space). Internal and normal components use minimal references
- **Reference Preservation**: Normal components can be resolved by GUID and version from component metadata
- **Interactive Publishing**: Prompts users to publish unpublished component pages during export, allowing them to publish dependencies on-the-fly
- **Efficient Storage**: Internal instances only store node ID; normal components store GUID + version; remote instances store full structure only when needed
- **Reduced JSON Size**: When the same component is used multiple times, it's stored once in the instance table and referenced by index
- **Multiple JSON Outputs**: Can generate multiple JSON files in one export session (main page + published component pages)
- **Fast Lookup**: In-memory index enables O(1) component resolution during import
- **Fallback Support**: Structure available for remote components when reference fails
- **Variant Handling**: Variant properties and component properties preserved for all instance types

### Known Limitations

1. **Remote Component Access**:

   - Cannot access parent chain beyond COMPONENT_SET for remote components
   - Path information may be limited to component set name only
   - Full visual structure must be stored since reference cannot be resolved

2. **Component Publishing Requirement**:

   - Components referenced from other pages should be published for proper resolution
   - If unpublished, the user is prompted to publish them during export
   - Users can choose to publish or skip each component page
   - Export continues regardless of publishing decisions

3. **Component Metadata Dependency**:

   - Other component references rely on component metadata being stored on PAGE nodes
   - If metadata is missing or corrupted, the reference cannot be resolved
   - Export validation prevents this scenario by failing early

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
