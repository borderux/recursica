# Shared Plugin Utilities

This directory contains abstracted utilities that eliminate code duplication between `exportToJSON.ts` and `teamLibrary.ts`.

## Files

### `types.ts`

- Common TypeScript interfaces and types with direct imports from `@recursica/schemas`
- Shared data structures for variables, typography, and effects
- Uses schema types directly without re-exporting
- Ensures consistency with project-wide type definitions

### `dataTransformers.ts`

- Utility functions for data transformation
- `parseLineHeight()` - Standardizes Figma LineHeight objects
- `generateVariableId()` - Creates unique, safe variable identifiers
- `processInParallel()` - Helper for concurrent processing
- `combineObjects()` - Merges multiple objects efficiently

### `figmaApiHelpers.ts`

- Common Figma API operations with error handling
- `resolveVariableAlias()` - Resolves variable references
- `processVariableValue()` - Handles different variable value types
- `processVariableMode()` - Converts raw variable modes to processed format
- API wrappers with consistent error handling

### `variableProcessors.ts`

- High-level processors for different variable types
- `processLocalVariableCollection()` - Processes local Figma variables
- `processRemoteVariableCollection()` - Processes team library variables
- `processLocalTypographyStyles()` - Processes local typography
- `processLocalEffectStyles()` - Processes local effects

## Benefits

1. **Eliminated Duplication**: Removed ~150 lines of duplicated code
2. **Consistent Error Handling**: Standardized error handling across all API calls
3. **Type Safety**: Uses `@recursica/schemas` types for consistency across the project
4. **Schema Compliance**: All types align with the project's JSON schema definitions
5. **Maintainability**: Changes to processing logic only need to be made in one place
6. **Testability**: Isolated functions are easier to unit test

## Usage

```typescript
// Before refactoring - each file had its own implementation
async function decodeVariables() {
  // 50+ lines of variable processing logic
}

// After refactoring - shared implementation
async function decodeVariables() {
  return await processLocalVariableCollection(collection);
}

// Type usage pattern - import schema types directly
import type { FontFamilyToken, EffectToken } from '@recursica/schemas';

// Use schema types directly instead of re-exporting
const typography: FontFamilyToken = {
  variableName: 'heading-1',
  fontFamily: 'Inter',
  // ... other properties
};
```
