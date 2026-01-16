# Import/Export Architecture

This document describes the import/export logic in the plugin services layer. It is the source of truth for how `pageExportNew.ts` and `pageImportNew.ts` work, including architectural decisions and trade-offs.

Before changing import/export code, read this document end-to-end.

## Documentation Rules

- Update this document when behavior, stages, or decision logic changes.
- Add new decisions to the "Future Design Decisions Template" section.
- Keep this doc scoped to the import/export area; avoid unrelated repo details.

## Scope

Focused on:

- `pageExportNew.ts` (export)
- `pageImportNew.ts` (import)
- `parsers/` (type-specific parsers and tables)
- `dependencyResolver.ts` (multi-page import ordering)
- `remotesPage.ts` (remote component handling)
- `debugConsole.ts` (import/export logging)
- `mergeImportService.ts` (post-import merge utilities)
- `singleComponentImportService.ts` (wizard-driven imports)
- `getImportSummary.ts` (import summary aggregation)
- `quickCopy.ts` (export/import-based page duplication)
- `runTest.ts` and `test/` (import/export test harness)
- `utils/svgPathNormalizer.ts` (vector path normalization)

## Export Logic

### Export Overview

Export builds a compact JSON representation of a Figma page by:

1. Traversing the node tree with type-specific parsers.
2. Writing tables for deduplication (collections, variables, instances, styles, images, strings).
3. Serializing only non-default values.
4. Compressing repeated strings via a string table.

### Key Files

- `pageExportNew.ts`: Export orchestration and traversal.
- `parsers/`: Node parsers, defaults, and table implementations.

### Core Mechanisms

- **Type-specific parsers**: Each node type has its own parser (frame, text, vector, shape, instance).
- **Table-based deduplication**: Entities are stored once in tables and referenced by index.
- **Default value optimization**: Only non-default values are serialized.
- **String table compression**: Repeated strings are stored once and referenced by index.
- **Instance discovery**: Export can run in discovery mode to extract instance references quickly.

## Import Logic

### Import Overview

Import is a multi-stage pipeline that:

- Validates metadata.
- Expands compressed JSON.
- Matches or creates collections and variables.
- Recreates nodes with a two-pass approach.
- Defers unresolved instances for post-import resolution.

### Import Stages (Matches Code)

The stage labels below reflect the comments in `pageImportNew.ts`. Two stages use the same numeric label in code (`Stage 10.5`); this document keeps that naming for consistency.

1. **Stage 1: Validate Metadata**
   - Validate required metadata fields (GUID, name, version).
1. **Stage 2: Load and Expand JSON**
   - Load string table and expand compressed JSON.
1. **Stage 3: Load Collection Table**
   - Deserialize the collections table.
1. **Stage 4: Match Collections**
   - Match local collections by GUID or name.
1. **Stage 5: Prompt for Potential Matches**
   - Prompt (or use wizard selections) for name-only matches.
1. **Stage 6: Ensure Modes for Recognized Collections**
   - Ensure modes exist and build mode ID mappings.
1. **Stage 7: Create New Collections**
   - Create new collections and set GUIDs.
1. **Stage 8: Load Variable Table**
   - Deserialize variables table.
1. **Stage 9: Match and Create Variables**
   - Match by name and create variables if needed.
1. **Stage 9.5: Import Styles**
   - Import styles after variables so bindings can resolve.
1. **Stage 10: Load Instance Table**
   - Load instance table (optional).
1. **Stage 10.5: Load Image Table**
   - Load images table for Base64 image restoration.
1. **Stage 10.5: Create Remote Instances**
   - Recreate remote components on the REMOTES page.
1. **Stage 11: Create Page and Recreate Structure**
   - Create page and rebuild node tree.

### Early Exit Conditions

The import pipeline exits early if:

- No collections table exists in JSON.
- No variables table exists in JSON.

These are valid terminal states and return “import complete” responses.

### Two-Pass Node Recreation

Import uses a two-pass approach to handle component dependencies:

- **First pass**: Create all component nodes (no children) so instances can reference them.
- **Second pass**: Recreate full structure and resolve instances/variables.

This avoids failures when components reference other components in the same page.

## Deferred Instances

### Why Deferred Instances Exist

Deferred instances are created when a normal (cross-page) instance cannot be resolved during import because:

- The referenced page is not yet imported.
- The referenced component is not yet created (circular dependencies).
- The referenced component cannot be found during traversal.

### How Deferred Instances Are Created

When a normal instance cannot be resolved:

- A placeholder frame is created with name `[Deferred: <componentName>]`.
- A `DeferredNormalInstance` entry is added to `deferredInstances`.
- Nested deferred instances are tracked via `parentPlaceholderId`.

### How Deferred Instances Are Resolved

Deferred instances are resolved after all pages are imported via `resolveDeferredNormalInstances()`:

- **Bottom-up order**: Deepest nested placeholders are resolved first.
- **Nested handling**: Child deferred instances are resolved when parent is resolved.
- **Matching strategy**:
  - GUID match (preferred)
  - Exact name match
  - Clean name match
  - Version suffix removal
- **Restores**:
  - Component properties
  - Bound variables
  - Instance overrides

If an instance still cannot be resolved, it remains as a placeholder and a failure is recorded.

## Special Cases

- **Component sets**: Variants are created first, then combined via `combineAsVariants()`.
- **Remote instances**: Stored as full structure and recreated on the REMOTES page.
- **Variable aliases**: Resolved recursively during import.

## Design Decisions

### Export Format Evolution (Summary)

The export format evolved to reduce size and improve fidelity. See `PLAN.md` for full details.

- **v2.0.0**: Type-specific parsers and default value optimization.
- **v2.1.0**: Variable table deduplication.
- **v2.3.0**: Collections table with mode mapping.
- **v2.5.0**: Collection GUID matching.
- **v2.6.0**: Instance table with internal/normal/remote classification.

### Key Decisions

- **Table-based deduplication**: Store collections, variables, instances, styles, images once.
- **String table compression**: Reduce repeated strings and JSON size.
- **GUID-first matching**: Prefer GUID matching for collections and components.
- **Two-pass node recreation**: Ensure components exist before instances.
- **Deferred instance resolution**: Handle circular dependencies and import ordering issues.
- **Bottom-up resolution**: Resolve nested deferred instances safely.

### Future Design Decisions Template

When making new decisions, add an entry here:

```text
## Decision: <short title>
Date:
Version:
Problem:
Decision:
Rationale:
Implementation Notes:
```

## References

- `pageExportNew.ts` for export orchestration and parsers usage
- `pageImportNew.ts` for pipeline stages and deferred instance logic
- `dependencyResolver.ts` for multi-page ordering and circular dependency detection
- `PLAN.md` for full export format version history

## Lessons Learned

- (Add new lessons here as changes are made.)
