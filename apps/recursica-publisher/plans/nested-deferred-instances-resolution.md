# Nested Deferred Instances Resolution

## Problem Statement

When a deferred instance is a child of another deferred instance, resolving the parent instance causes the child deferred instance to be lost. This happens because:

1. Parent deferred instance creates a placeholder frame `[Deferred: Parent]`
2. Child deferred instance creates a placeholder frame `[Deferred: Child]` inside the parent placeholder
3. When resolving the parent:
   - We replace the parent placeholder with the actual instance
   - The actual instance has default children from the component
   - The child placeholder (which was inside the parent placeholder) is removed with the parent placeholder
   - The child deferred instance is lost and cannot be resolved

## Test Findings (testInstanceChildrenAndOverrides)

We ran tests to understand how Figma instances work:

1. **Instances have children immediately**: When you create an instance from a component, it immediately has children that are separate nodes (different IDs) from the component's children.

2. **Cannot move nodes into instances**: The Figma API throws "Cannot move node. New parent is an instance or is inside of an instance" when attempting to use `insertChild` or `appendChild` to move existing nodes into an instance.

3. **Must create new nodes**: We cannot move placeholder children into instances. We must:
   - Create a new instance from the component
   - Replace the matching child in the parent instance with the newly created instance
   - The placeholder children are used to determine what to create, but we don't move them

**Implication**: When resolving child deferred instances, we must create new instances (not move placeholder children) and then replace the matching children in the parent instance.

## Requirements

- **Multiple levels deep**: Deferred instances can be nested multiple levels (child, grandchild, etc.)
- **Multiple children**: A deferred instance can have multiple deferred children
- **Matching strategy**: Match child deferred instances to actual instance children by **name only**

## Solution: Extract and Resolve Child Deferred Instances

### Approach

Pass placeholder context down through recursive calls and store parent-child relationships:

1. **Pass context down**: Add `currentPlaceholderId` parameter to `recreateNodeFromData` to track when we're inside a placeholder
2. **Detect nested deferred instances**: When creating a placeholder, if `currentPlaceholderId` is set, we're creating a child placeholder inside a parent placeholder
3. **Store relationship**: Store `parentPlaceholderId` in the deferred instance data
4. **Extract before replacement**: Before replacing a parent placeholder, extract all child deferred instances that reference it
5. **Resolve as instance overrides**: After replacing the parent, resolve child deferred instances by matching names and creating instance overrides

### Implementation Steps

#### Step 1: Pass Placeholder Context Through Recursion

**File**: `apps/recursica-publisher/src/plugin/services/pageImportNew.ts`

Add `currentPlaceholderId: string | undefined` parameter to `recreateNodeFromData`:

- When we're inside a placeholder, pass its ID down to all recursive calls
- When we create a new placeholder, pass its ID to children
- When we're not in a placeholder, pass `undefined`

**Function signature change**:

```typescript
async function recreateNodeFromData(
  nodeData: any,
  parentNode: SceneNode | null,
  // ... other params ...
  currentPlaceholderId?: string, // NEW: ID of placeholder we're currently inside
): Promise<SceneNode | null>;
```

#### Step 2: Detect and Store Nested Deferred Instances

**File**: `apps/recursica-publisher/src/plugin/services/pageImportNew.ts`

When creating a placeholder:

- If `currentPlaceholderId` is set → we're creating a child placeholder inside a parent placeholder
- Store `parentPlaceholderId = currentPlaceholderId` in the deferred instance data
- Pass the new placeholder's ID as `currentPlaceholderId` to children

**Data structure change**:

```typescript
const deferred = {
  placeholderFrameId: placeholderFrame.id,
  parentNodeId: actualParentId,
  parentPlaceholderId: currentPlaceholderId, // NEW: ID of parent placeholder if we're inside one
  instanceEntry,
  nodeData,
  instanceIndex: nodeData._instanceRef,
};
```

#### Step 2: Extract Child Deferred Instances Before Parent Replacement

**File**: `apps/recursica-publisher/src/plugin/services/pageImportNew.ts` (in `resolveDeferredNormalInstances`)

Before replacing a parent placeholder:

1. Find all deferred instances where `parentPlaceholderId` matches the current placeholder being resolved
2. Extract their data (placeholderFrameId, nodeData, instanceEntry, etc.)
3. Store them in a temporary array
4. These will be resolved after the parent is replaced

**Logic**:

```typescript
// Before replacing parent placeholder
const childDeferredInstances = allDeferredInstances.filter(
  (deferred) => deferred.parentPlaceholderId === placeholderFrameId,
);
```

#### Step 3: Resolve Child Deferred Instances as Instance Overrides

**File**: `apps/recursica-publisher/src/plugin/services/pageImportNew.ts` (in `resolveDeferredNormalInstances`)

After replacing the parent placeholder with the actual instance:

1. For each extracted child deferred instance:
   - **Resolve the child deferred instance first** (create the actual instance from its component)
   - Find the matching child in the actual instance by **name** (exact match, recursively search all descendants)
   - If multiple children have the same name, throw an error (cannot resolve ambiguity)
   - If found, **replace the matching child with the newly created instance** (instance override)
   - If not found, log a warning (child might not exist in the component)

**CRITICAL CONSTRAINT**: We **cannot move existing nodes into instances**, and we **cannot insert/append newly created nodes into instances**. The Figma API will throw "Cannot move node. New parent is an instance or is inside of an instance". Therefore:

- We must **create a new instance** from the component (not move the placeholder child)
- The instance will automatically get default children from the component
- **We can only modify existing children in place** - we cannot:
  - Replace children (cannot insert new nodes)
  - Add new children (cannot append new nodes)
  - Remove children (we keep defaults not in JSON)
- **We update existing children from JSON** to preserve:
  - Bound variables on children (update fills, etc.)
  - Properties that can be modified in place
- **We cannot preserve**:
  - Instance overrides that require replacing children (Figma limitation)
  - Children that exist only in JSON (cannot add new children to instances)
- We can then **replace** the matching child in the parent instance with the newly created instance (this works because we're replacing at the parent level, not inside an instance)
- The placeholder children are used to determine what to update, but we modify existing instance children in place

**Assumptions**:

- Paths and names do not change between placeholder creation and resolution
- No duplicate children with the same name (error if found)
- This is an instance override scenario - we're modifying a child of the instance without affecting the component

**Matching and replacement logic**:

```typescript
// Step 1: Resolve the child deferred instance (create actual instance from component)
const childComponent = await findChildComponent(...);
const childInstanceNode = childComponent.createInstance();
// The instance now has default children from the component

// Step 1a: Update children from JSON to preserve bound variables, etc.
// CRITICAL: We can only modify existing children in place - cannot add/replace children in instances
// We need to:
// - Match children by name and update them in place (from JSON)
// - Update properties like fills, bound variables, etc. on existing children
// - Keep default children that aren't in JSON (don't delete them - they're part of the component)
// - If a child in JSON doesn't match instance tree → log warning and continue (don't fail)
// - Cannot add children that exist only in JSON (Figma limitation - cannot append to instances)
// - If a child in JSON is a deferred instance, we handle it differently (see nested deferred instances)
// IMPORTANT: JSON children tree may not match instance tree - this is expected and we should warn but continue
await updateInstanceChildrenFromJson(childInstanceNode, childDeferred.nodeData, ...);

// Step 2: Find matching child in parent instance by name (recursive search)
const findChildRecursively = (node: SceneNode | ChildrenMixin, name: string): SceneNode | null => {
  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child.name === name) {
        return child;
      }
      const found = findChildRecursively(child, name);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const matchingChild = findChildRecursively(instanceNode, nodeData.name);

if (!matchingChild) {
  // Child doesn't exist - log warning
  await debugConsole.warning(`Could not find matching child "${nodeData.name}" in resolved instance`);
} else {
  // Step 3: Replace matching child with newly created instance
  // NOTE: We can replace because childInstanceNode is newly created, not moved
  const childParent = matchingChild.parent;
  if (childParent) {
    const childIndex = childParent.children.indexOf(matchingChild);
    childParent.insertChild(childIndex, childInstanceNode);
    matchingChild.remove();
  }
}
```

#### Step 4: Handle Recursive Nesting

Since deferred instances can be nested multiple levels deep:

- When recreating children from JSON, if a child is a deferred instance, **resolve it immediately** (no placeholder needed)
- All components exist by this point (first pass created them), so we can create instances directly
- Recursively handle nested deferred instances during child recreation
- This ensures all levels of nesting are handled without creating additional placeholders

**Recursive resolution during child recreation**:

- When recreating children from JSON, for each child:
  - If child is a deferred instance → resolve it immediately (component exists)
  - If child is a regular node → create it from JSON data
  - If child matches a default child by name → replace/update it
  - If default child not in JSON → keep it (don't delete)
- Nested deferred instances are resolved on-the-fly during child recreation, not in a separate pass

#### Step 5: Update Resolution Order (Bottom-Up)

**File**: `apps/recursica-publisher/src/plugin/services/pageImportNew.ts` (in `resolveDeferredNormalInstances`)

**CRITICAL**: We must resolve deferred instances **bottom-up** (leaf children first, parents last) to avoid losing nested placeholders.

**Why bottom-up?**

- When we replace a parent placeholder, any child placeholders inside it are removed
- If we haven't extracted/resolved those child deferred instances first, we lose them
- Bottom-up ensures all children are resolved before their parent is replaced
- This prevents losing nested deferred instances during parent replacement

**Resolution order**:

1. **Sort deferred instances by depth** (children first, parents last):

   - Count how many levels deep each deferred instance is (based on `parentPlaceholderId` chain)
   - Process deepest first (leaf nodes), shallowest last (root nodes)

2. **For each deferred instance (in bottom-up order)**:

   - Extract child deferred instances (those with `parentPlaceholderId` matching current placeholder)
   - Create the instance from component (gets default children)
   - **Update children from JSON** to preserve bound variables, etc. (modify existing children in place)
   - Replace parent placeholder with the instance
   - Resolve extracted child deferred instances (they're already processed in bottom-up order)

3. **Alternative approach** (if sorting by depth is complex):
   - Process in multiple passes:
     - Pass 1: Resolve all deferred instances with no `parentPlaceholderId` (root level)
     - Pass 2: Resolve all deferred instances whose parent placeholders were resolved in Pass 1
     - Pass 3: Continue until all are resolved
   - This naturally processes bottom-up without explicit depth calculation

**IMPORTANT**: Both parent and child instances need their children updated from JSON after creation, because:

- The instance gets default children from the component
- Our JSON tree contains the actual structure with bound variables, etc.
- We must update the existing children to preserve these customizations (cannot add/replace children in instances)

**Handling JSON/Instance Tree Mismatches**:

- **JSON children may not match instance tree** - this is expected and normal:

  - Instance has default children from component
  - JSON may have instance overrides (children replaced with different instances)
  - JSON may have additional children (that we can't add to instances)
  - JSON may be missing children (that exist in component - we keep them)

- **When updating children from JSON**:

  - Match children by name (recursive search if needed)
  - If JSON child matches instance child → update properties (fills, bound variables, etc.)
  - If JSON child doesn't match instance tree → **log warning and continue** (don't fail)
  - If instance child not in JSON → keep it (don't delete - it's part of component)
  - Continue processing all children - warnings don't stop the import

- **Warning examples**:

  - `"Child 'X' in JSON does not exist in instance - skipping (instance override or Figma limitation)"`
  - `"Instance has child 'Y' not in JSON - keeping default child"`

- **This approach ensures**:
  - Import doesn't fail due to tree mismatches
  - We preserve what we can (bound variables, properties on matching children)
  - We document what we can't preserve (instance overrides, missing children)

## Implementation Details

### Modified Data Structure

```typescript
interface DeferredInstance {
  placeholderFrameId: string;
  parentNodeId: string;
  parentPlaceholderId?: string; // NEW: ID of parent placeholder if parent is also deferred
  instanceEntry: InstanceTableEntry;
  nodeData: any;
  instanceIndex?: number;
}
```

### Key Functions to Modify

1. **`recreateNodeFromData`** (around lines 1783-1903 and 2142-2262):

   - Add `currentPlaceholderId?: string` parameter
   - When creating a placeholder, if `currentPlaceholderId` is set, store it as `parentPlaceholderId`
   - When creating a placeholder, pass its ID as `currentPlaceholderId` to recursive calls
   - Pass `currentPlaceholderId` down through all recursive calls

2. **`resolveDeferredNormalInstances`** (around lines 7900-7931):
   - Before replacing placeholder, extract child deferred instances where `parentPlaceholderId === placeholderFrameId`
   - After replacing placeholder, resolve extracted children:
     - Find matching child by name (exact match)
     - Check for duplicate names and throw error
     - Resolve and replace matching child (instance override)
   - Handle recursive nesting (children of children)

### Error Handling

- **Duplicate names**: If multiple children have the same name, throw an error (cannot resolve ambiguity) - this should not happen in valid designs
- **Name mismatch**: If a child deferred instance cannot be matched to a child in the actual instance (name doesn't exist), log a warning and skip it (child may have been removed from component)
- **Placeholder not found**: If a child deferred instance's placeholder cannot be found during resolution, it may have already been resolved - check if an instance with matching name exists
- **Path/name changes**: We assume paths and names do not change between placeholder creation and resolution - if they do, resolution will fail

## Testing Scenarios

1. **Simple nested**: Parent deferred → Child deferred (1 level)
2. **Deep nesting**: Parent → Child → Grandchild (2+ levels)
3. **Multiple children**: Parent deferred with multiple deferred children
4. **Mixed**: Parent deferred with some deferred children and some non-deferred children
5. **Circular**: Parent and child reference each other (circular dependency)

## Files to Modify

1. `apps/recursica-publisher/src/plugin/services/pageImportNew.ts`
   - Modify deferred instance creation to store `parentPlaceholderId`
   - Modify `resolveDeferredNormalInstances` to extract and resolve child deferred instances

## Implementation Todos

1. Add `currentPlaceholderId` parameter to `recreateNodeFromData` function signature
2. Pass `currentPlaceholderId` down through all recursive calls
3. When creating a placeholder, if `currentPlaceholderId` is set, store it as `parentPlaceholderId` in deferred instance data
4. When creating a placeholder, pass its ID as `currentPlaceholderId` to children
5. Before replacing parent placeholder, extract all child deferred instances where `parentPlaceholderId === placeholderFrameId`
6. After replacing parent placeholder, resolve extracted child deferred instances:
   - Find matching child in actual instance by name (exact match)
   - Check for duplicate names and throw error if found
   - Resolve child deferred instance and replace matching child (instance override)
7. Handle recursive nesting (children of children) - recursively resolve nested deferred instances
8. Add error handling for unmatched children and duplicate names
9. Add debug logging for the extraction and resolution process
