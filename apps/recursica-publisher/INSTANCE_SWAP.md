Summary of Changes
What we're working on
Fixing INSTANCE_SWAP component property handling during export/import. These properties allow swapping instances in component variants, and their defaultValue was a node ID that needed proper resolution.
Files changed

1. frameParser.ts — Export logic
   Added processComponentPropertyDefinitions() to handle INSTANCE_SWAP properties during export.
   Changes:
   Accepts both INSTANCE and COMPONENT nodes (removed strict INSTANCE requirement).
   Resolves defaultValue node IDs using:
   Local tree search within the component/component set.
   figma.getNodeByIdAsync() as fallback (replaces getNodeById()).
   Converts defaultValue node IDs to \_instanceRef entries in the instance table.
   Handles remote component detection: only fails if remote === true and the component isn't found on any local page.
   Adds debug logging for property location, search process, and instance location.
   Classifies instances as "internal" or "normal" based on page location.
   Extracts variant and component properties from instances.
2. instanceParser.ts — Utility exports
   Exported getPageFromNode() and getComponentMetadataFromPage() for use in frameParser.ts.
3. pageImportNew.ts — Import logic
   Added handling for INSTANCE_SWAP properties during import.
   Changes:
   Resolves \_instanceRef from the instance table.
   Searches for matching instances within component set children.
   Uses resolved instance node IDs as defaultValue when calling addComponentProperty().
   Hard fails on remote instances.
   Skips properties without \_instanceRef or with invalid references.
4. stringTable.ts — String compression
   Added componentPropertyDefinitions: "cPropD" to the string table for JSON compression.
   Current issue
   Component incorrectly detected as remote:
   Error: "Style=outline" is flagged as remote, but it exists on a different page in the same file.
   The code should find it via the page search (page.findOne()), but it isn't being found.
   Possible causes:
   The page search isn't finding the component.
   The component is actually from a library (remote === true) and doesn't exist locally.
   Timing/loading issues with figma.loadAllPagesAsync().
   Approach
   Export: Convert INSTANCE_SWAP defaultValue node IDs to \_instanceRef entries in the instance table.
   Import: Resolve \_instanceRef back to actual instance node IDs when recreating properties.
   This provides stable references that survive import/export cycles, similar to how other instance references are handled.
