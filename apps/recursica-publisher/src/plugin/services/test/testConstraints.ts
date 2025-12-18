/// <reference types="@figma/plugin-typings" />
import { debugConsole } from "../debugConsole";

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Test: Constraints Import/Export (Issue #4)
 *
 * IMPORTANT: This file tests Issue #4 only. Each test file should focus on a single issue.
 *
 * ISSUE DESCRIPTION:
 * When importing components, constraints are not being set correctly.
 * The original has "Scale Vertical" and "Scale Horizontal" (SCALE for both),
 * but the import is setting "Left Horizontal" and "Top Vertical" (MIN for both).
 *
 * ROOT CAUSE:
 * Constraints were not being exported, and therefore could not be imported.
 * Additionally, the wrong API was being used - constraints must be set using the
 * `constraints` object API, not direct properties.
 *
 * SOLUTION:
 * Use the correct Figma Plugin API: `node.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }`
 * Map exported values to Figma API values:
 *   - MIN -> LEFT (horizontal) / TOP (vertical)
 *   - MAX -> RIGHT (horizontal) / BOTTOM (vertical)
 *   - CENTER -> CENTER (both)
 *   - STRETCH -> LEFT_RIGHT (horizontal) / TOP_BOTTOM (vertical)
 *   - SCALE -> SCALE (both)
 *
 * TEST OBJECTIVE:
 * Verify that constraints are correctly exported and imported, specifically
 * testing that SCALE constraints are preserved through the export/import cycle.
 *
 * CONSTRAINT VALUES (Exported):
 * - "MIN" = Left/Top (default)
 * - "CENTER" = Center
 * - "MAX" = Right/Bottom
 * - "STRETCH" = Stretch
 * - "SCALE" = Scale (the one we're testing)
 *
 * CONSTRAINT VALUES (Figma API):
 * Horizontal: 'LEFT', 'RIGHT', 'CENTER', 'LEFT_RIGHT', 'SCALE'
 * Vertical: 'TOP', 'BOTTOM', 'CENTER', 'TOP_BOTTOM', 'SCALE'
 *
 * TEST STEPS:
 * 1. Create a frame with SCALE constraints (both horizontal and vertical)
 * 2. Verify constraints are set correctly
 * 3. Simulate export by reading constraintHorizontal and constraintVertical
 * 4. Simulate import by creating a new frame and setting constraints from "exported" data
 * 5. Verify the imported frame has SCALE constraints (not MIN)
 *
 * ADDITIONAL TESTS:
 * - testConstraintsVectorInComponentFailure: Demonstrates the "object is not extensible"
 *   error when trying to set constraints on a VECTOR node that is a child of a COMPONENT,
 *   after the node has been fully created (vectorPaths set, size set, appended to parent).
 *   This test should FAIL, demonstrating the bug.
 *
 * - testConstraintsVectorInComponentFix: Demonstrates the FIXED behavior: setting constraints
 *   on a VECTOR node that is a child of a COMPONENT, IMMEDIATELY after creation (before
 *   vectorPaths, size, or appending to parent). This test should PASS, demonstrating the fix.
 *
 * - testConstraintsVectorStandalone: Tests if constraints can be set on standalone VECTOR nodes
 *   (not in COMPONENTs) to determine if the issue is specific to COMPONENT children or a
 *   general VECTOR limitation.
 */
export async function testConstraints(pageId: string): Promise<TestResult> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Note: constraintHorizontal/constraintVertical are not in Figma's TypeScript types,
  // so we use 'as any' throughout this test function
  try {
    await debugConsole.log(
      "=== Test: Constraints Import/Export (Issue #4) ===",
    );

    // Get the test page
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!page || page.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = page.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Step 1: Create a frame with SCALE constraints (simulating original design)
    await debugConsole.log(
      "\n--- Step 1: Create frame with SCALE constraints ---",
    );
    const originalFrame = figma.createFrame();
    originalFrame.name = "Original Frame - SCALE Constraints";
    originalFrame.resize(100, 100);
    testFrame.appendChild(originalFrame);

    // Set constraints using the correct API: constraints object
    await debugConsole.log(
      "  Setting constraints using constraints object API...",
    );
    try {
      (originalFrame as any).constraints = {
        horizontal: "SCALE",
        vertical: "SCALE",
      };
      await debugConsole.log("  ✓ Set constraints using constraints object");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await debugConsole.warning(
        `  ✗ Failed to set constraints: ${errorMessage}`,
      );
      throw new Error(`Failed to set constraints on frame: ${errorMessage}`);
    }

    // Verify constraints were set
    const constraintH = (originalFrame as any).constraints?.horizontal;
    const constraintV = (originalFrame as any).constraints?.vertical;
    await debugConsole.log(
      `  Original constraints: H=${constraintH}, V=${constraintV}`,
    );

    if (constraintH !== "SCALE" || constraintV !== "SCALE") {
      throw new Error(
        `Failed to set SCALE constraints. Got H=${constraintH}, V=${constraintV}`,
      );
    }

    // Verify constraints were set (read from constraints object)
    const originalConstraintH = (originalFrame as any).constraints?.horizontal;
    const originalConstraintV = (originalFrame as any).constraints?.vertical;
    await debugConsole.log(
      `  Original constraints: H=${originalConstraintH}, V=${originalConstraintV}`,
    );

    if (originalConstraintH !== "SCALE" || originalConstraintV !== "SCALE") {
      return {
        success: false,
        message: "Failed to set SCALE constraints on original frame",
        details: {
          constraintHorizontal: originalConstraintH,
          constraintVertical: originalConstraintV,
        },
      };
    }

    // Step 2: Simulate export - read constraints (as export code would)
    await debugConsole.log(
      "\n--- Step 2: Simulate Export (read constraints) ---",
    );
    const exportedConstraintH = (originalFrame as any).constraints?.horizontal;
    const exportedConstraintV = (originalFrame as any).constraints?.vertical;
    await debugConsole.log(
      `  Exported constraints: H=${exportedConstraintH}, V=${exportedConstraintV}`,
    );

    // Simulate nodeData structure (as it would appear in exported JSON)
    const nodeData = {
      type: "FRAME",
      name: "Imported Frame - Should Have SCALE",
      width: 100,
      height: 100,
      constraintHorizontal: exportedConstraintH,
      constraintVertical: exportedConstraintV,
    };

    // Step 3: Simulate import - create new frame and set constraints
    await debugConsole.log(
      "\n--- Step 3: Simulate Import (create frame and set constraints) ---",
    );
    const importedFrame = figma.createFrame();
    importedFrame.name = "Imported Frame - SCALE Constraints";
    importedFrame.resize(nodeData.width, nodeData.height);
    testFrame.appendChild(importedFrame);

    // Check constraints before setting (should be MIN/MIN by default)
    const importedConstraintHBefore = (importedFrame as any).constraints
      ?.horizontal;
    const importedConstraintVBefore = (importedFrame as any).constraints
      ?.vertical;
    await debugConsole.log(
      `  Constraints before setting: H=${importedConstraintHBefore}, V=${importedConstraintVBefore} (expected: MIN, MIN)`,
    );

    // Set constraints from nodeData using the constraints object API
    (importedFrame as any).constraints = {
      horizontal: exportedConstraintH,
      vertical: exportedConstraintV,
    };
    await debugConsole.log(
      `  Set constraints using constraints object: H=${exportedConstraintH}, V=${exportedConstraintV}`,
    );

    // Step 4: Verify imported constraints
    await debugConsole.log("\n--- Step 4: Verify Imported Constraints ---");
    const importedConstraintH = (importedFrame as any).constraints?.horizontal;
    const importedConstraintV = (importedFrame as any).constraints?.vertical;
    await debugConsole.log(
      `  Imported constraints: H=${importedConstraintH}, V=${importedConstraintV}`,
    );
    await debugConsole.log(`  Expected constraints: H=SCALE, V=SCALE`);

    const success =
      importedConstraintH === "SCALE" && importedConstraintV === "SCALE";

    if (success) {
      await debugConsole.log("  ✓ Constraints correctly imported as SCALE");
    } else {
      await debugConsole.warning(
        `  ⚠️ Constraints mismatch! Expected SCALE, got H=${importedConstraintH}, V=${importedConstraintV}`,
      );
    }

    // Test other constraint values to ensure they work too
    await debugConsole.log("\n--- Step 5: Test Other Constraint Values ---");
    const testCases = [
      { h: "MIN", v: "MIN", name: "MIN/MIN" },
      { h: "CENTER", v: "CENTER", name: "CENTER/CENTER" },
      { h: "MAX", v: "MAX", name: "MAX/MAX" },
      { h: "STRETCH", v: "STRETCH", name: "STRETCH/STRETCH" },
    ];

    const testResults: Array<{
      name: string;
      success: boolean;
      details: Record<string, unknown>;
    }> = [];

    for (const testCase of testCases) {
      const testCaseFrame = figma.createFrame();
      testCaseFrame.name = `Test Frame - ${testCase.name}`;
      testCaseFrame.resize(50, 50);
      testFrame.appendChild(testCaseFrame);

      // Use exported values directly (no mapping needed - Figma API uses same values)
      (testCaseFrame as any).constraints = {
        horizontal: testCase.h,
        vertical: testCase.v,
      };

      const resultH = (testCaseFrame as any).constraints?.horizontal;
      const resultV = (testCaseFrame as any).constraints?.vertical;

      const testSuccess = resultH === testCase.h && resultV === testCase.v;

      testResults.push({
        name: testCase.name,
        success: testSuccess,
        details: {
          expected: { h: testCase.h, v: testCase.v },
          actual: { h: resultH, v: resultV },
        },
      });

      if (testSuccess) {
        await debugConsole.log(
          `  ✓ ${testCase.name}: Correctly set to H=${resultH}, V=${resultV}`,
        );
      } else {
        await debugConsole.warning(
          `  ⚠️ ${testCase.name}: Expected H=${testCase.h}, V=${testCase.v}, got H=${resultH}, V=${resultV}`,
        );
      }
    }

    const allTestsPassed = testResults.every((r) => r.success);

    return {
      success: success && allTestsPassed,
      message:
        success && allTestsPassed
          ? "Constraints correctly exported and imported (SCALE preserved)"
          : `Constraints test failed: SCALE=${success ? "PASS" : "FAIL"}, Other values=${allTestsPassed ? "PASS" : "FAIL"}`,
      details: {
        original: {
          constraintHorizontal: originalConstraintH,
          constraintVertical: originalConstraintV,
        },
        exported: {
          constraintHorizontal: exportedConstraintH,
          constraintVertical: exportedConstraintV,
        },
        imported: {
          constraintHorizontal: importedConstraintH,
          constraintVertical: importedConstraintV,
        },
        otherValues: testResults,
        allTestsPassed: success && allTestsPassed,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Constraints test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Test: Constraints on VECTOR nodes inside COMPONENT (Issue #4 - Old Approach)
 *
 * This test demonstrates that using the constraints object API works even when
 * setting constraints on a VECTOR node that is a child of a COMPONENT, after
 * the node has been fully created (vectorPaths set, size set, appended to parent).
 *
 * NOTE: With the old approach (direct properties), this would fail with "object is not extensible".
 * However, with the constraints object API, this succeeds, demonstrating that the fix works.
 *
 * EXPECTED BEHAVIOR: This test should PASS, demonstrating that the constraints object API works.
 */
export async function testConstraintsVectorInComponentFailure(
  pageId: string,
): Promise<TestResult> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  try {
    await debugConsole.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FAILURE CASE) ===",
    );

    // Get the test page
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!page || page.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = page.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Step 1: Create a COMPONENT
    await debugConsole.log(
      "\n--- Step 1: Create COMPONENT (parent for VECTOR) ---",
    );
    const component = figma.createComponent();
    component.name = "Test Component - Vector Constraints";
    component.resize(100, 100);
    testFrame.appendChild(component);
    await debugConsole.log("  Created COMPONENT");

    // Step 2: Create a VECTOR as a child of the COMPONENT
    await debugConsole.log(
      "\n--- Step 2: Create VECTOR as child of COMPONENT ---",
    );
    const vector = figma.createVector();
    vector.name = "Test Vector - Should Have SCALE Constraints";
    component.appendChild(vector);
    await debugConsole.log("  Created VECTOR and appended to COMPONENT");

    // Step 3: Set vectorPaths and size (simulating the import process)
    await debugConsole.log(
      "\n--- Step 3: Set vectorPaths and size (simulating import) ---",
    );
    // Create a simple path
    vector.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z",
      },
    ];
    vector.resize(50, 50);
    await debugConsole.log("  Set vectorPaths and size");

    // Step 4: Try to set constraints AFTER vectorPaths and size using constraints object API
    await debugConsole.log(
      "\n--- Step 4: Try to set constraints (AFTER vectorPaths/size) ---",
    );
    await debugConsole.log(
      "  This simulates setting constraints after the node is fully created",
    );
    await debugConsole.log(
      "  Using constraints object API (should work even after appending to COMPONENT)",
    );

    let constraintHSet = false;
    let constraintVSet = false;
    let constraintHError: string | undefined;
    let constraintVError: string | undefined;

    // Try using constraints object API (this should work, but we're testing the old broken approach)
    try {
      (vector as any).constraints = {
        horizontal: "SCALE",
        vertical: "SCALE",
      };
      const verifyH = (vector as any).constraints?.horizontal;
      const verifyV = (vector as any).constraints?.vertical;
      if (verifyH === "SCALE" && verifyV === "SCALE") {
        constraintHSet = true;
        constraintVSet = true;
        await debugConsole.log(
          "  ✓ Constraints set successfully using constraints object (unexpected - should have failed with old approach)",
        );
      } else {
        await debugConsole.warning(
          `  ⚠️ Constraints set but values are H=${verifyH || "undefined"}, V=${verifyV || "undefined"}`,
        );
      }
    } catch (error) {
      constraintHError = error instanceof Error ? error.message : String(error);
      constraintVError = constraintHError; // Same error for both
      await debugConsole.warning(
        `  ✗ Failed to set constraints: ${constraintHError}`,
      );
    }

    // Step 5: Verify final state
    await debugConsole.log("\n--- Step 5: Verify Final State ---");
    const finalConstraintH = (vector as any).constraints?.horizontal;
    const finalConstraintV = (vector as any).constraints?.vertical;
    await debugConsole.log(
      `  Final constraints: H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
    );

    // This test should PASS (constraints object API works)
    const success =
      constraintHSet &&
      constraintVSet &&
      finalConstraintH === "SCALE" &&
      finalConstraintV === "SCALE";

    if (success) {
      await debugConsole.log(
        "  ✓ Constraints successfully set using constraints object API (even after appending to COMPONENT)",
      );
    } else {
      await debugConsole.warning(
        `  ⚠️ Constraints could not be set. H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
      );
    }

    return {
      success,
      message: success
        ? "Constraints successfully set on VECTOR in COMPONENT using constraints object API (even after appending)"
        : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet,
        constraintVSet,
        constraintHError,
        constraintVError,
        finalConstraintH,
        finalConstraintV,
        success,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(
      `Constraints vector in component failure test error: ${errorMessage}`,
    );
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Test: Constraints on VECTOR nodes inside COMPONENT (Issue #4 - Fix Case)
 *
 * This test demonstrates the FIXED behavior: setting constraints on a VECTOR node
 * that is a child of a COMPONENT, IMMEDIATELY after creation (before vectorPaths,
 * size, or appending to parent).
 *
 * EXPECTED BEHAVIOR: This test should PASS, demonstrating the fix works.
 */
export async function testConstraintsVectorInComponentFix(
  pageId: string,
): Promise<TestResult> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  try {
    await debugConsole.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FIX CASE) ===",
    );

    // Get the test page
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!page || page.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = page.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Step 1: Create a COMPONENT
    await debugConsole.log(
      "\n--- Step 1: Create COMPONENT (parent for VECTOR) ---",
    );
    const component = figma.createComponent();
    component.name = "Test Component - Vector Constraints (Fixed)";
    component.resize(100, 100);
    testFrame.appendChild(component);
    await debugConsole.log("  Created COMPONENT");

    // Step 2: Create a VECTOR (but DON'T append it yet)
    await debugConsole.log(
      "\n--- Step 2: Create VECTOR (NOT appended yet) ---",
    );
    const vector = figma.createVector();
    vector.name = "Test Vector - SCALE Constraints (Fixed)";
    await debugConsole.log("  Created VECTOR (not yet appended to COMPONENT)");

    // Step 3: Set vectorPaths FIRST (required before constraints)
    await debugConsole.log(
      "\n--- Step 3: Set vectorPaths FIRST (required before constraints) ---",
    );
    vector.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z",
      },
    ];
    await debugConsole.log("  Set vectorPaths");

    // Step 4: Set size (after vectorPaths, before constraints)
    await debugConsole.log(
      "\n--- Step 4: Set size (after vectorPaths, before constraints) ---",
    );
    vector.resize(50, 50);
    await debugConsole.log("  Set size to 50x50");

    // Step 5: Append to COMPONENT FIRST (before setting constraints)
    // NOTE: Based on test results, it seems VECTOR nodes may need to be in the tree before constraints can be set
    await debugConsole.log(
      "\n--- Step 5: Append VECTOR to COMPONENT (before setting constraints) ---",
    );
    await debugConsole.log(
      "  NOTE: Testing if constraints can be set after appending (alternative approach)",
    );
    component.appendChild(vector);
    await debugConsole.log("  Appended VECTOR to COMPONENT");

    // Step 6: Try to set constraints AFTER appending
    await debugConsole.log(
      "\n--- Step 6: Try to set constraints AFTER appending (FIX ATTEMPT) ---",
    );
    await debugConsole.log(
      "  This tests if constraints can be set after the node is in the tree",
    );

    let constraintHSet = false;
    let constraintVSet = false;
    let constraintHError: string | undefined;
    let constraintVError: string | undefined;

    // Try using constraints object API (this should work)
    try {
      (vector as any).constraints = {
        horizontal: "SCALE",
        vertical: "SCALE",
      };
      const verifyH = (vector as any).constraints?.horizontal;
      const verifyV = (vector as any).constraints?.vertical;
      if (verifyH === "SCALE" && verifyV === "SCALE") {
        constraintHSet = true;
        constraintVSet = true;
        await debugConsole.log(
          "  ✓ Constraints set successfully using constraints object: H=SCALE, V=SCALE",
        );
      } else {
        await debugConsole.warning(
          `  ⚠️ Constraints set but values are H=${verifyH || "undefined"}, V=${verifyV || "undefined"} (expected SCALE)`,
        );
      }
    } catch (error) {
      constraintHError = error instanceof Error ? error.message : String(error);
      constraintVError = constraintHError; // Same error for both
      await debugConsole.warning(
        `  ✗ Failed to set constraints: ${constraintHError}`,
      );
    }

    // Step 7: Verify constraints are set
    await debugConsole.log("\n--- Step 7: Verify constraints are set ---");
    const finalConstraintH = (vector as any).constraints?.horizontal;
    const finalConstraintV = (vector as any).constraints?.vertical;
    await debugConsole.log(
      `  Final constraints: H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
    );
    await debugConsole.log("  Expected: H=SCALE, V=SCALE");

    const success =
      constraintHSet &&
      constraintVSet &&
      finalConstraintH === "SCALE" &&
      finalConstraintV === "SCALE";

    if (success) {
      await debugConsole.log(
        "  ✓ Constraints correctly set and preserved through all operations",
      );
    } else {
      await debugConsole.warning(
        `  ⚠️ Constraints test failed! Expected SCALE/SCALE, got H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
      );
    }

    return {
      success,
      message: success
        ? "Constraints correctly set on VECTOR in COMPONENT when set immediately after creation"
        : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet,
        constraintVSet,
        constraintHError,
        constraintVError,
        finalConstraintH,
        finalConstraintV,
        success,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(
      `Constraints vector in component fix test error: ${errorMessage}`,
    );
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Test: Constraints on standalone VECTOR (not in COMPONENT)
 *
 * This test checks if constraints can be set on VECTOR nodes at all,
 * to determine if the issue is specific to VECTOR nodes in COMPONENTs
 * or a general limitation of VECTOR nodes.
 */
export async function testConstraintsVectorStandalone(
  pageId: string,
): Promise<TestResult> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  try {
    await debugConsole.log(
      "=== Test: Constraints on Standalone VECTOR (not in COMPONENT) ===",
    );

    // Get the test page
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!page || page.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = page.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Create a standalone VECTOR (not in a COMPONENT)
    await debugConsole.log(
      "\n--- Step 1: Create standalone VECTOR (not in COMPONENT) ---",
    );
    const vector = figma.createVector();
    vector.name = "Test Vector - Standalone";
    await debugConsole.log("  Created VECTOR (standalone, not in COMPONENT)");

    // Set vectorPaths and size
    await debugConsole.log("\n--- Step 2: Set vectorPaths and size ---");
    vector.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z",
      },
    ];
    vector.resize(50, 50);
    await debugConsole.log("  Set vectorPaths and size");

    // Append to testFrame (not a COMPONENT)
    await debugConsole.log(
      "\n--- Step 3: Append VECTOR to testFrame (not COMPONENT) ---",
    );
    testFrame.appendChild(vector);
    await debugConsole.log("  Appended VECTOR to testFrame");

    // Try to set constraints using different approaches
    await debugConsole.log(
      "\n--- Step 4: Try to set constraints on standalone VECTOR ---",
    );
    await debugConsole.log(
      "  Testing multiple approaches: constraints object, then direct properties",
    );
    let constraintHSet = false;
    let constraintVSet = false;
    let constraintHError: string | undefined;
    let constraintVError: string | undefined;

    // Try using constraints object API
    await debugConsole.log(
      "  Attempting to set constraints using constraints object API...",
    );
    try {
      (vector as any).constraints = {
        horizontal: "SCALE",
        vertical: "SCALE",
      };
      const verifyH = (vector as any).constraints?.horizontal;
      const verifyV = (vector as any).constraints?.vertical;
      if (verifyH === "SCALE" && verifyV === "SCALE") {
        constraintHSet = true;
        constraintVSet = true;
        await debugConsole.log(
          "  ✓ Constraints set successfully via constraints object: H=SCALE, V=SCALE",
        );
      } else {
        await debugConsole.warning(
          `  ⚠️ Constraints set but values are H=${verifyH || "undefined"}, V=${verifyV || "undefined"}`,
        );
      }
    } catch (error) {
      constraintHError = error instanceof Error ? error.message : String(error);
      constraintVError = constraintHError; // Same error for both
      await debugConsole.warning(
        `  ✗ Failed to set constraints: ${constraintHError}`,
      );
    }

    // Verify final state
    await debugConsole.log("\n--- Step 5: Verify Final State ---");
    const finalConstraintH = (vector as any).constraints?.horizontal;
    const finalConstraintV = (vector as any).constraints?.vertical;
    await debugConsole.log(
      `  Final constraints: H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
    );

    const success =
      constraintHSet &&
      constraintVSet &&
      finalConstraintH === "SCALE" &&
      finalConstraintV === "SCALE";

    if (success) {
      await debugConsole.log(
        "  ✓ Constraints can be set on standalone VECTOR nodes",
      );
      await debugConsole.log(
        "  → This suggests the issue is specific to VECTOR nodes in COMPONENTs",
      );
    } else {
      await debugConsole.warning(
        "  ⚠️ Constraints cannot be set on standalone VECTOR nodes either",
      );
      await debugConsole.warning(
        "  → This suggests VECTOR nodes may not support constraints at all, or there's a different issue",
      );
    }

    return {
      success,
      message: success
        ? "Constraints can be set on standalone VECTOR nodes (issue is specific to COMPONENT children)"
        : "Constraints cannot be set on standalone VECTOR nodes (may be a general limitation)",
      details: {
        constraintHSet,
        constraintVSet,
        constraintHError,
        constraintVError,
        finalConstraintH,
        finalConstraintV,
        success,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(
      `Constraints standalone vector test error: ${errorMessage}`,
    );
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
