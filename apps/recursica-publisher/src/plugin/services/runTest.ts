/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";
import { retSuccess, retError } from "../utils/response";
import { debugConsole } from "./debugConsole";
import {
  testItemSpacingVariableBinding,
  testItemSpacingVariableBindingImportSimulation,
  testItemSpacingVariableBindingFailure,
  testItemSpacingVariableBindingFix,
} from "./test/testItemSpacingVariableBinding";
import { testConstraints } from "./test/testConstraints";

export interface RunTestResponseData {
  testResults: {
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  };
  allTests: Array<{
    name: string;
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  }>;
}

/**
 * Service for running tests
 * Creates/manages a Test page and runs the hard-coded test function
 */
export async function runTest(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    await debugConsole.log("=== Starting Test ===");

    // Load all pages
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;

    // Find or create "Test" page (never delete it)
    let testPage = allPages.find(
      (p) => p.type === "PAGE" && p.name === "Test",
    ) as PageNode | undefined;

    if (!testPage) {
      // Create new "Test" page if it doesn't exist
      testPage = figma.createPage();
      testPage.name = "Test";
      await debugConsole.log('Created "Test" page');
    } else {
      await debugConsole.log('Found existing "Test" page');
    }

    // Switch to the test page
    await figma.setCurrentPageAsync(testPage);

    // Find and delete the "Test" frame (and all its children) if it exists
    const existingTestFrame = testPage.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (existingTestFrame) {
      await debugConsole.log(
        'Found existing "Test" frame, deleting it and all children...',
      );
      existingTestFrame.remove();
      await debugConsole.log('Deleted existing "Test" frame');
    }

    // Create new "Test" frame container
    const testFrame = figma.createFrame();
    testFrame.name = "Test";
    testPage.appendChild(testFrame);
    await debugConsole.log('Created new "Test" frame container');

    // Run all tests in sequence
    const allTests: Array<{
      name: string;
      success: boolean;
      message: string;
      details?: Record<string, unknown>;
    }> = [];

    // Test 1: Original 5 approaches (proves binding can work in isolation)
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log("TEST 1: Original 5 Approaches");
    await debugConsole.log("=".repeat(60));
    const test1Results = await testItemSpacingVariableBinding(testPage.id);
    allTests.push({
      name: "Original 5 Approaches",
      success: test1Results.success,
      message: test1Results.message,
      details: test1Results.details,
    });

    // Clean up test frame for next test
    testFrame.remove();
    const testFrame2 = figma.createFrame();
    testFrame2.name = "Test";
    testPage.appendChild(testFrame2);

    // Test 2: Import simulation (proves binding survives import operations)
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log("TEST 2: Import Simulation");
    await debugConsole.log("=".repeat(60));
    const test2Results = await testItemSpacingVariableBindingImportSimulation(
      testPage.id,
    );
    allTests.push({
      name: "Import Simulation",
      success: test2Results.success,
      message: test2Results.message,
      details: test2Results.details,
    });

    // Clean up test frame for next test
    testFrame2.remove();
    const testFrame3 = figma.createFrame();
    testFrame3.name = "Test";
    testPage.appendChild(testFrame3);

    // Test 3: Failure demonstration (proves old broken approach fails)
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log(
      "TEST 3: Failure Demonstration (Old Broken Approach)",
    );
    await debugConsole.log("=".repeat(60));
    const test3Results = await testItemSpacingVariableBindingFailure(
      testPage.id,
    );
    allTests.push({
      name: "Failure Demonstration",
      success: test3Results.success,
      message: test3Results.message,
      details: test3Results.details,
    });

    // Clean up test frame for next test
    testFrame3.remove();
    const testFrame4 = figma.createFrame();
    testFrame4.name = "Test";
    testPage.appendChild(testFrame4);

    // Test 4: Fix demonstration (proves new fixed approach works)
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log("TEST 4: Fix Demonstration (New Fixed Approach)");
    await debugConsole.log("=".repeat(60));
    const test4Results = await testItemSpacingVariableBindingFix(testPage.id);
    allTests.push({
      name: "Fix Demonstration",
      success: test4Results.success,
      message: test4Results.message,
      details: test4Results.details,
    });

    // Clean up test frame for next test
    testFrame4.remove();
    const testFrame5 = figma.createFrame();
    testFrame5.name = "Test";
    testPage.appendChild(testFrame5);

    // Test 5: Constraints (Issue #4)
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log("TEST 5: Constraints Import/Export (Issue #4)");
    await debugConsole.log("=".repeat(60));
    const test5Results = await testConstraints(testPage.id);
    allTests.push({
      name: "Constraints Import/Export",
      success: test5Results.success,
      message: test5Results.message,
      details: test5Results.details,
    });

    // Overall summary
    await debugConsole.log("\n" + "=".repeat(60));
    await debugConsole.log("=== ALL TESTS COMPLETE ===");
    await debugConsole.log("=".repeat(60));
    const successfulTests = allTests.filter((t) => t.success);
    const failedTests = allTests.filter((t) => !t.success);
    await debugConsole.log(
      `Total: ${allTests.length} | Passed: ${successfulTests.length} | Failed: ${failedTests.length}`,
    );
    for (const test of allTests) {
      await debugConsole.log(
        `  ${test.success ? "✓" : "✗"} ${test.name}: ${test.message}`,
      );
    }

    // Overall success if all critical tests pass
    // Test 1, 2, 4, and 5 should pass. Test 3 should "pass" (demonstrate failure)
    const overallSuccess =
      test1Results.success &&
      test2Results.success &&
      test3Results.success && // This "success" means we demonstrated the failure
      test4Results.success &&
      test5Results.success;

    const responseData: RunTestResponseData = {
      testResults: {
        success: overallSuccess,
        message: `All tests completed: ${successfulTests.length}/${allTests.length} passed`,
        details: {
          summary: {
            total: allTests.length,
            passed: successfulTests.length,
            failed: failedTests.length,
          },
          tests: allTests,
        },
      },
      allTests,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return retSuccess("runTest", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Test failed: ${errorMessage}`);
    return retError("runTest", errorMessage);
  }
}
