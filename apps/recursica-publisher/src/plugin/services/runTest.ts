/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";
import { retSuccess, retError } from "../utils/response";
import { debugConsole } from "./debugConsole";
// Previous test imports commented out - only running testInstanceChildrenAndOverrides
// import {
//   testItemSpacingVariableBinding,
//   testItemSpacingVariableBindingImportSimulation,
//   testItemSpacingVariableBindingFailure,
//   testItemSpacingVariableBindingFix,
// } from "./test/testItemSpacingVariableBinding";
// import {
//   testConstraints,
//   testConstraintsVectorInComponentFailure,
//   testConstraintsVectorInComponentFix,
//   testConstraintsVectorStandalone,
// } from "./test/testConstraints";
import { testInstanceChildrenAndOverrides } from "./test/testInstanceChildrenAndOverrides";

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
    debugConsole.log("=== Starting Test ===");

    // Delete any existing "Test" variable collection before running tests
    // This ensures a clean slate for each test run
    debugConsole.log('Cleaning up "Test" variable collection...');
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();
    for (const collection of localCollections) {
      if (collection.name === "Test") {
        debugConsole.log(
          `  Found existing "Test" collection (ID: ${collection.id.substring(0, 8)}...), deleting...`,
        );
        // Delete all variables in the collection first
        const variables = await figma.variables.getLocalVariablesAsync();
        for (const variable of variables) {
          if (variable.variableCollectionId === collection.id) {
            variable.remove();
          }
        }
        collection.remove();
        debugConsole.log('  Deleted "Test" collection');
      }
    }

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
      debugConsole.log('Created "Test" page');
    } else {
      debugConsole.log('Found existing "Test" page');
    }

    // Switch to the test page
    await figma.setCurrentPageAsync(testPage);

    // Find and delete the "Test" frame (and all its children) if it exists
    const existingTestFrame = testPage.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (existingTestFrame) {
      debugConsole.log(
        'Found existing "Test" frame, deleting it and all children...',
      );
      existingTestFrame.remove();
      debugConsole.log('Deleted existing "Test" frame');
    }

    // Create new "Test" frame container
    const testFrame = figma.createFrame();
    testFrame.name = "Test";
    testPage.appendChild(testFrame);
    debugConsole.log('Created new "Test" frame container');

    // Run all tests in sequence
    const allTests: Array<{
      name: string;
      success: boolean;
      message: string;
      details?: Record<string, unknown>;
    }> = [];

    // Previous tests commented out for reference - only running new test
    /*
    // Test 1: Original 5 approaches (proves binding can work in isolation)
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("TEST 1: Original 5 Approaches");
    debugConsole.log("=".repeat(60));
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
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("TEST 2: Import Simulation");
    debugConsole.log("=".repeat(60));
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
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log(
      "TEST 3: Failure Demonstration (Old Broken Approach)",
    );
    debugConsole.log("=".repeat(60));
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
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("TEST 4: Fix Demonstration (New Fixed Approach)");
    debugConsole.log("=".repeat(60));
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
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("TEST 5: Constraints Import/Export (Issue #4)");
    debugConsole.log("=".repeat(60));
    const test5Results = await testConstraints(testPage.id);
    allTests.push({
      name: "Constraints Import/Export",
      success: test5Results.success,
      message: test5Results.message,
      details: test5Results.details,
    });

    // Clean up test frame for next test
    testFrame5.remove();
    const testFrame6 = figma.createFrame();
    testFrame6.name = "Test";
    testPage.appendChild(testFrame6);

    // Test 6: Constraints on VECTOR in COMPONENT - Failure Case
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log(
      "TEST 6: Constraints on VECTOR in COMPONENT (FAILURE CASE)",
    );
    debugConsole.log("=".repeat(60));
    const test6Results = await testConstraintsVectorInComponentFailure(
      testPage.id,
    );
    allTests.push({
      name: "Constraints VECTOR in COMPONENT (Failure)",
      success: test6Results.success,
      message: test6Results.message,
      details: test6Results.details,
    });

    // Clean up test frame for next test
    testFrame6.remove();
    const testFrame7 = figma.createFrame();
    testFrame7.name = "Test";
    testPage.appendChild(testFrame7);

    // Test 7: Constraints on VECTOR in COMPONENT - Fix Case
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log(
      "TEST 7: Constraints on VECTOR in COMPONENT (FIX CASE)",
    );
    debugConsole.log("=".repeat(60));
    const test7Results = await testConstraintsVectorInComponentFix(testPage.id);
    allTests.push({
      name: "Constraints VECTOR in COMPONENT (Fix)",
      success: test7Results.success,
      message: test7Results.message,
      details: test7Results.details,
    });

    // Clean up test frame for next test
    testFrame7.remove();
    const testFrame8 = figma.createFrame();
    testFrame8.name = "Test";
    testPage.appendChild(testFrame8);

    // Test 8: Constraints on standalone VECTOR (not in COMPONENT)
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log(
      "TEST 8: Constraints on Standalone VECTOR (not in COMPONENT)",
    );
    debugConsole.log("=".repeat(60));
    const test8Results = await testConstraintsVectorStandalone(testPage.id);
    allTests.push({
      name: "Constraints VECTOR Standalone",
      success: test8Results.success,
      message: test8Results.message,
      details: test8Results.details,
    });

    // Clean up test frame for next test
    testFrame8.remove();
    const testFrame9 = figma.createFrame();
    testFrame9.name = "Test";
    testPage.appendChild(testFrame9);
    */

    // Test 9: Instance Children and Overrides Behavior
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("TEST 9: Instance Children and Overrides Behavior");
    debugConsole.log("=".repeat(60));
    const test9Results = await testInstanceChildrenAndOverrides(testPage.id);
    allTests.push({
      name: "Instance Children and Overrides",
      success: test9Results.success,
      message: test9Results.message,
      details: test9Results.details,
    });

    // Overall summary
    debugConsole.log("\n" + "=".repeat(60));
    debugConsole.log("=== ALL TESTS COMPLETE ===");
    debugConsole.log("=".repeat(60));
    const successfulTests = allTests.filter((t) => t.success);
    const failedTests = allTests.filter((t) => !t.success);
    debugConsole.log(
      `Total: ${allTests.length} | Passed: ${successfulTests.length} | Failed: ${failedTests.length}`,
    );
    for (const test of allTests) {
      debugConsole.log(
        `  ${test.success ? "✓" : "✗"} ${test.name}: ${test.message}`,
      );
    }

    // Overall success if all critical tests pass
    // Currently only running Test 9 (previous tests commented out for reference)
    const overallSuccess = test9Results.success;

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
    debugConsole.error(`Test failed: ${errorMessage}`);
    return retError("runTest", errorMessage);
  }
}
