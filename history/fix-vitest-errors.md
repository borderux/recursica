# Fix Vitest Errors in Figma Plugin

## Issue

Vitest was failing to start with the error:

```typescript
TypeError: Workspace config file "/Users/mattmassey/work/recursica/apps/figma-plugin/vitest.workspace.ts" must export a default array of project paths.
```

## Root Cause

The `vitest.workspace.ts` file in the figma-plugin was incorrectly configured as a regular Vitest config file instead of a workspace configuration that exports an array of project paths.

## Solution

1. **Removed incorrectly configured files:**

   - `apps/figma-plugin/vitest.workspace.ts` - Was configured as regular config instead of workspace
   - `apps/figma-plugin/vitest.shims.d.ts` - Not needed without tests

2. **Removed unused dependencies:**
   - `@vitest/browser` - Only needed for browser testing
   - `@vitest/coverage-v8` - Only needed for test coverage
   - `vitest` - Main Vitest package
   - `playwright` - Only used for Vitest browser testing

## Verification

- No test files exist in the figma-plugin project
- No test scripts are defined in package.json
- The project doesn't require testing setup

## Result

Vitest errors should now be resolved. The figma-plugin project no longer has unnecessary testing dependencies and configuration files that were causing conflicts.

## Additional Improvement

### Enhanced Pre-Push Hook Error Messages

While fixing the Vitest errors, we also improved the pre-push git hook to provide better error feedback:

- **More descriptive error messages** with clear action items
- **Step-by-step quick fix instructions** for common issues
- **Better error handling** for missing remote branches
- **Enhanced visual formatting** with colors and emojis for better readability
- **Contextual information** showing branch names and file paths

The hook now provides clear guidance when `PULL-REQUEST-DETAILS.md` needs to be updated, making it easier for developers to understand and resolve pre-push failures.
