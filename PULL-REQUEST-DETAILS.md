# Improve Figma Plugin Variable Handling and Performance

## Overview

This pull request enhances the Figma plugin's variable processing capabilities by improving performance, filtering out unnecessary collections, and optimizing CSS generation logic.

## Problem

The plugin was experiencing several issues:

1. **Duplicate file generation**: CSS files were being created even when adapter files were already generated
2. **Unnecessary processing**: "ID variables" collections were being processed despite not containing design tokens
3. **Performance bottlenecks**: Some operations were running sequentially instead of in parallel
4. **Inconsistent theme handling**: Theme names weren't being properly extracted from Figma variables

## Solution

Implemented comprehensive improvements to variable handling:

1. **Smart CSS generation**: Only generate CSS when no adapter files exist, preventing duplicates
2. **Collection filtering**: Exclude "ID variables" collections from all processing operations
3. **Performance optimization**: Enhanced parallel processing for team library operations
4. **Improved theme handling**: Better fallback logic for theme names with fallback to figma.root.name

## Key Changes

### Modified Files

- `apps/figma-plugin/src/context/Repository/RepositoryProvider.tsx` - Added conditional CSS generation logic
- `apps/figma-plugin/src/plugin/exportToJSON.ts` - Added "ID variables" collection filtering
- `apps/figma-plugin/src/plugin/syncTokens.ts` - Enhanced variable synchronization and theme handling
- `apps/figma-plugin/src/plugin/teamLibrary.ts` - Improved parallel processing and collection filtering

## Technical Implementation

### Conditional CSS Generation

- **Smart logic**: CSS generation only runs when `adapterFiles.length === 0`
- **Prevents duplication**: Avoids creating CSS files when adapters already handle the output
- **Maintains functionality**: CSS generation still works for projects without custom adapters

### Collection Filtering

- **Consistent filtering**: "ID variables" collections are excluded from all operations
- **Performance improvement**: Reduces unnecessary processing of non-design token collections
- **Cleaner data**: Ensures only relevant design tokens are processed and exported

### Enhanced Theme Handling

- **Better extraction**: Improved logic for extracting theme names from Figma variables
- **Fallback support**: Uses figma.root.name as fallback when theme variable is not available
- **Consistent naming**: Ensures theme names are properly formatted using PascalCase

### Performance Optimizations

- **Parallel processing**: Team library operations now run in parallel where possible
- **Reduced blocking**: Sequential operations only where data dependencies require it
- **Better resource utilization**: More efficient use of available processing power

## Benefits

- **Eliminates duplicate files**: No more redundant CSS generation
- **Improved performance**: Faster processing through parallelization and filtering
- **Better data quality**: Cleaner exports without irrelevant collections
- **Enhanced reliability**: More consistent theme handling and variable processing
- **Maintainable code**: Cleaner separation of concerns and better error handling

## Testing

- TypeScript compilation passes without errors
- ESLint passes with no style violations
- Build process completes successfully
- Variable processing has been tested with various Figma project structures

## Impact

These improvements enhance the plugin's reliability and performance when working with complex Figma projects, particularly those with multiple variable collections and custom adapters. Users will experience faster processing times and cleaner output files.
