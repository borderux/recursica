# Architectural Refactor: Move Validation System to Schemas Package

## Summary

This pull request implements a comprehensive architectural refactor to move the JSON schema validation system from the `@recursica/common` package to the `@recursica/schemas` package. This change resolves build conflicts between Node.js-specific validation code and browser-compatible utilities, creating a cleaner separation of concerns and enabling proper module bundling for both Node.js tools and browser applications.

- **Simplified error handling logic** by replacing complex logic with static messaging
- **Better component structure** with improved readability and maintainability
- **Consistent styling** that aligns with the overall design system

### 1. Architectural Refactor

- **Moved validators** from `packages/common/src/validators/` to `packages/schemas/src/validators/`
- **Moved test files** from `packages/common/src/test/` to `packages/schemas/src/test/`
- **Moved validation script** from `packages/common/scripts/validate-sample.ts` to `packages/schemas/scripts/validate-sample.ts`
- **Updated package exports** to reflect the new structure

### 2. Package Structure Improvements

#### @recursica/common (Browser-Compatible)

- **Purpose**: Pure browser-compatible utilities only
- **Contents**: Parsers, detectors, string utilities
- **Removed**: All validation logic, test scripts, Node.js dependencies
- **Benefits**: Clean, focused package that works in browser environments

#### @recursica/schemas (Node.js Tools)

- **Purpose**: Schema definitions, validation, and type generation
- **Contents**:
  - JSON schema files in `dist/` (for Git URL access)
  - Compiled validators in `lib/` (not tracked in git)
  - Test JSON files in `src/test/`
  - Validation scripts and utilities
- **Benefits**: Logical home for all schema-related functionality

### 3. Build System Enhancements

- **Updated build scripts** to exclude test files from schema processing
- **Modified generate-types.js** to compile validators to separate `lib/` directory
- **Added tsconfig.validators.json** for validator compilation
- **Updated package.json exports** to point to correct locations

### 4. Dependency Resolution

- **Fixed mantine-adapter build** by properly handling `@recursica/common` as external dependency
- **Resolved figma-plugin build** by removing Node.js-specific imports
- **Updated rollup configuration** for better module resolution
- **Added missing type definitions** (`@types/archiver`)

- **Before**: Complex error handling logic with dynamic messaging
- **After**: Simplified static error message with visual icon feedback
- **Benefit**: More predictable and maintainable error states

### Validation System Architecture

The validation system now resides in `packages/schemas/src/validators/` with:

- `validateVariables.ts` - Variables schema validation with specialized reference rules
- `validateConfiguration.ts` - Configuration schema validation
- `validateIcons.ts` - Icons schema validation
- `errorFormatter.ts` - Shared error formatting utility
- `index.ts` - Validators directory exports

### Build Process

1. **Schema Validation**: `validate-schemas.js` validates JSON schemas (excludes test files)
2. **Type Generation**: `generate-types.js` generates TypeScript types and copies schemas to `dist/`
3. **Validator Compilation**: Compiles validators using `tsconfig.validators.json` to `lib/`
4. **Package Building**: Each package builds with proper dependencies

### Package Exports

#### @recursica/schemas

```json
{
  ".": "./dist/index.js",
  "./validators": "./lib/validators/index.js",
  "./*.json": "./dist/*.json"
}
```

#### @recursica/common

```json
{
  ".": "./dist/index.js",
  "./types": "./dist/types/index.d.ts"
}
```

## Benefits

### Build System Improvements

- ✅ **Resolved mantine-adapter build failures** - No more "Cannot find module '@recursica/common'" errors
- ✅ **Fixed figma-plugin build** - No more Node.js module conflicts in browser environment
- ✅ **Clean dependency graph** - Clear separation between Node.js tools and browser utilities
- ✅ **Proper module bundling** - Each package can be bundled correctly for its target environment

### Architecture Benefits

- **Separation of Concerns**: Node.js tools vs browser utilities clearly separated
- **Maintainability**: Related functionality grouped logically
- **Scalability**: Easy to add new validation rules or browser utilities
- **Testing**: Validation tests co-located with validation code

### Development Experience

- **Faster builds**: No more circular dependency issues
- **Clearer imports**: Developers know which package to import from
- **Better tooling**: IDE support for proper module resolution
- **CI/CD friendly**: All builds pass consistently

## Testing and Validation

### Build Verification

- ✅ **`npm run build`** - All packages build successfully
- ✅ **`npm run test`** - Only runs tests for packages that have them
- ✅ **CI simulation** - Local CI build simulation works correctly

### Package-Specific Tests

- **@recursica/schemas**: Schema validation and type generation tests
- **@recursica/common**: No tests (pure utility functions)
- **@recursica/mantine-adapter**: Builds successfully with external dependencies
- **@recursica/figma-plugin**: Builds successfully with browser-compatible imports

## Breaking Changes

⚠️ **Minor Breaking Changes**: Import paths for validators have changed

- **Before**: `import { validateVariables } from '@recursica/common'`
- **After**: `import { validateVariables } from '@recursica/schemas/validators'`

### Migration Guide

- Update import statements to use `@recursica/schemas/validators`
- Update any scripts that reference the old validation locations
- No changes needed for browser-compatible utilities from `@recursica/common`

## Documentation Updates

### Package READMEs

- Updated `packages/common/README.md` to reflect browser-only focus
- Updated `packages/schemas/README.md` to document validation system
- Added clear usage examples for both packages

### Scripts and Tools

- **validate-sample**: Now in `packages/schemas/scripts/`
- **CI simulation**: Added `scripts/simulate-ci-build.sh` for local testing
- **Build scripts**: Updated to handle new package structure

## Quality Assurance

### Code Review Checklist

- [x] All packages build successfully
- [x] No circular dependencies
- [x] Proper separation of Node.js vs browser code
- [x] Updated import statements throughout codebase
- [x] Test files moved to appropriate locations
- [x] Build scripts updated for new structure

### Error Handling

- [x] Graceful handling of missing dependencies
- [x] Clear error messages for build failures
- [x] Proper fallbacks for module resolution

## Future Enhancements

### Potential Improvements

1. **CLI Tool**: Command-line interface for validation
2. **IDE Integration**: Real-time validation in editors
3. **Performance Optimization**: Caching for frequently used schemas
4. **Additional Validation Rules**: More specialized design system constraints

## Conclusion

This architectural refactor successfully resolves build conflicts and creates a cleaner, more maintainable codebase. The separation of Node.js validation tools from browser-compatible utilities enables proper module bundling for all target environments while maintaining the robust validation capabilities. All builds now pass consistently, and the development experience is significantly improved.
