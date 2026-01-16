# Test Infrastructure

This folder contains test functions for debugging and validating import/export functionality in the Figma plugin. Tests are designed to isolate specific issues and verify fixes work correctly.

## Overview

The test infrastructure provides a way to:

- **Debug issues** without running full imports/exports
- **Validate fixes** by reproducing problems in isolation
- **Document investigations** through well-documented test cases
- **Verify behavior** of specific Figma API operations

## How to Run Tests

### From the UI

1. Navigate to the Home page in the plugin
2. Click the **"Test"** button
3. You'll be redirected to the Test page (`/test`)
4. The test will run automatically and display results in the Debug Console
5. Results are also shown in a summary card with expandable details

### What Happens When You Run Tests

1. The `runTest` service (`apps/recursica-publisher/src/plugin/services/runTest.ts`) is called
2. **Any existing "Test" variable collection is deleted** (ensures clean slate for each test run)
3. A fixed "Test" page is found or created in your Figma file
4. A "Test" frame container is created (or recreated if it exists)
5. All registered tests are run in sequence
6. Each test creates its own test frames within the container
7. Results are logged to the Debug Console and returned to the UI

### Variable Collection Cleanup

**IMPORTANT**: Before each test run, the `runTest` service automatically deletes any existing variable collection named "Test". This ensures:

- Each test run starts with a clean slate
- No leftover variables or collections from previous test runs
- Consistent test results across multiple runs

**All tests must use a collection named "Test"** - do not use any other collection name in tests.

## Test Structure

### Test File Organization

**CRITICAL RULE: Each test file must test a single issue only.**

- **One Issue Per File**: Each test file should focus on testing one specific issue (e.g., Issue #1, Issue #4)
- **Multiple Test Functions**: A single test file may contain multiple test functions, but they must all be related to the same issue
- **File Naming**: Test files should be named descriptively (e.g., `testItemSpacingVariableBinding.ts` for Issue #1, `testConstraints.ts` for Issue #4)
- **Documentation**: Each test file must document the issue it's testing at the top of the file

**Example Structure:**

- `testItemSpacingVariableBinding.ts` - All tests for Issue #1 (itemSpacing variable binding)
  - `testItemSpacingVariableBinding()` - Original 5 approaches
  - `testItemSpacingVariableBindingImportSimulation()` - Import simulation
  - `testItemSpacingVariableBindingFailure()` - Failure demonstration
  - `testItemSpacingVariableBindingFix()` - Fix demonstration
- `testConstraints.ts` - All tests for Issue #4 (constraints import/export)
  - `testConstraints()` - Constraints export/import verification

### Test Page Management

- **Fixed Page**: A "Test" page is created once and never deleted (ensures stable Figma page links)
- **Test Frame**: A single "Test" frame is created as a container for all test artifacts
- **Clean Slate**: The "Test" frame is deleted and recreated before each test run

### Test Function Signature

All test functions follow this pattern:

```typescript
export async function testSomething(
  pageId: string,
  // ... additional parameters as needed
): Promise<TestResult> {
  // Test implementation
}
```

### TestResult Interface

```typescript
export interface TestResult {
  success: boolean; // Whether the test passed
  message: string; // Human-readable result message
  details?: any; // Optional detailed results (JSON-serializable)
}
```

## Creating a New Test

### Step 1: Create Test File

**IMPORTANT: Each test file must test a single issue only.**

Create a new file in this folder: `testYourIssue.ts` (name should reflect the issue being tested)

```typescript
/// <reference types="@figma/plugin-typings" />
import { debugConsole } from "../debugConsole";

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test: Your Issue Name (Issue #X)
 *
 * ISSUE DESCRIPTION:
 * What issue this test is validating. Reference the issue number if applicable.
 *
 * ROOT CAUSE:
 * What is the root cause of the issue (if known).
 *
 * TEST OBJECTIVE:
 * What the test is trying to prove or verify.
 *
 * EXPECTED RESULT:
 * What should happen when the test runs successfully.
 *
 * NOTE: This file tests Issue #X only. Each test file should focus on a single issue.
 */
export async function testYourFeature(pageId: string): Promise<TestResult> {
  try {
    await debugConsole.log("=== Test: Your Feature ===");

    // Get the test page
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!page || page.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container
    const testFrame = page.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Your test implementation here
    // Create test nodes, run operations, verify results

    return {
      success: true,
      message: "Test completed successfully",
      details: {
        // Your test details
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}
```

### Step 2: Register Test in runTest.ts

Add your test to the imports and call it in the `runTest` function:

```typescript
// In runTest.ts
import { testYourFeature } from "./test/testYourFeature";

// In the runTest function, add:
await debugConsole.log("\n" + "=".repeat(60));
await debugConsole.log("TEST N: Your Feature Test");
await debugConsole.log("=".repeat(60));

// Clean up test frame for next test
testFrameN.remove();
const testFrameNPlus1 = figma.createFrame();
testFrameNPlus1.name = "Test";
testPage.appendChild(testFrameNPlus1);

const testNResults = await testYourFeature(testPage.id);
allTests.push({
  name: "Your Feature Test",
  success: testNResults.success,
  message: testNResults.message,
  details: testNResults.details,
});
```

## Current Tests

### testItemSpacingVariableBinding.ts

This file contains tests for Issue #1: `itemSpacing` variable binding during import.

#### Tests Included:

1. **testItemSpacingVariableBinding** (Original 5 Approaches)

   - Tests 5 different approaches to binding `itemSpacing` to a variable
   - Proves that binding can work in isolation
   - Documents the investigation process

2. **testItemSpacingVariableBindingImportSimulation**

   - Simulates the full import process
   - Verifies that binding survives all import operations
   - Tests the complete sequence: create frame → set layout → bind → set properties → append children

3. **testItemSpacingVariableBindingFailure** (Failure Demonstration)

   - Demonstrates the OLD BROKEN approach
   - Shows how direct assignment to `boundVariables` fails
   - Shows how "late setting" and "FINAL FIX" code overrides bindings without checks
   - **Expected to fail** (demonstrates the bug)

4. **testItemSpacingVariableBindingFix** (Fix Demonstration)
   - Demonstrates the NEW FIXED approach
   - Uses `setBoundVariable()` API correctly
   - Shows how "late setting" and "FINAL FIX" code check before overriding
   - **Expected to pass** (demonstrates the fix works)

## Best Practices

### Documentation

- **Always document** what issue the test addresses
- **Explain** the test objective and expected outcome
- **Document** each test step with clear comments
- **Include** references to related code (e.g., "This simulates code from pageImportNew.ts line 3148")

### Test Isolation

- Each test should be **independent** and not rely on other tests
- Tests should **clean up** after themselves (or rely on the test frame being recreated)
- Don't assume test execution order

### Logging

- Use `debugConsole.log()` for informational messages
- Use `debugConsole.warning()` for warnings
- Use `debugConsole.error()` for errors
- Log **before and after** critical operations to trace behavior

### Error Handling

- Always wrap test logic in try/catch
- Return meaningful error messages
- Log errors to the debug console
- Return `TestResult` with `success: false` on failure

### Test Data

- Create test variables, collections, and nodes as needed
- Use descriptive names (e.g., "Test Frame 1 - Immediate Bind")
- Clean up test data if necessary (though the test frame recreation handles most cleanup)

## Debug Console

All test output goes to the Debug Console, which:

- Shows real-time logs as tests execute
- Allows copying results to clipboard
- Persists logs across test runs (unless cleared)
- Can be cleared manually with the "Clear" button

## Integration with Import Code

Tests are designed to:

- **Reproduce issues** found during real imports
- **Validate fixes** before running full imports
- **Document** the root cause of issues
- **Prevent regressions** by catching issues early

When you discover an issue during import:

1. Create a test that reproduces the issue in isolation
2. Verify the test demonstrates the problem
3. Apply fixes to the import code
4. Verify the test passes with the fixes
5. Run a real import to confirm

## File Organization

```
plugin/services/test/
├── README.md                              # This file
├── testItemSpacingVariableBinding.ts      # Issue #1 tests (itemSpacing variable binding)
├── testConstraints.ts                      # Issue #4 tests (constraints import/export)
└── testYourIssue.ts                       # Your new test file (one issue per file)
```

**File Naming Convention:**

- Use descriptive names that indicate the issue being tested
- Format: `test[IssueName].ts` (e.g., `testItemSpacingVariableBinding.ts`, `testConstraints.ts`)
- Each file should contain all test functions related to a single issue

## Related Files

- **runTest.ts**: Orchestrates test execution (`apps/recursica-publisher/src/plugin/services/runTest.ts`)
- **Test.tsx**: UI component for displaying test results (`apps/recursica-publisher/src/pages/Test.tsx`)
- **Home.tsx**: Entry point with "Test" button (`apps/recursica-publisher/src/pages/Home.tsx`)
- **debugConsole.ts**: Debug logging service (`apps/recursica-publisher/src/plugin/services/debugConsole.ts`)
