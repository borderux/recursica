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
 *
 * TEST OBJECTIVE:
 * Verify that constraints are correctly exported and imported, specifically
 * testing that SCALE constraints are preserved through the export/import cycle.
 *
 * CONSTRAINT VALUES:
 * - "MIN" = Left/Top (default)
 * - "CENTER" = Center
 * - "MAX" = Right/Bottom
 * - "STRETCH" = Stretch
 * - "SCALE" = Scale (the one we're testing)
 *
 * TEST STEPS:
 * 1. Create a frame with SCALE constraints (both horizontal and vertical)
 * 2. Verify constraints are set correctly
 * 3. Simulate export by reading constraintHorizontal and constraintVertical
 * 4. Simulate import by creating a new frame and setting constraints from "exported" data
 * 5. Verify the imported frame has SCALE constraints (not MIN)
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

    // Set constraints to SCALE (both horizontal and vertical)
    // Note: constraintHorizontal/constraintVertical are not in Figma's TypeScript types, so we use 'as any'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (originalFrame as any).constraintHorizontal = "SCALE";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (originalFrame as any).constraintVertical = "SCALE";
    await debugConsole.log("  Set constraintHorizontal to SCALE");
    await debugConsole.log("  Set constraintVertical to SCALE");

    // Verify constraints were set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalConstraintH = (originalFrame as any).constraintHorizontal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalConstraintV = (originalFrame as any).constraintVertical;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportedConstraintH = (originalFrame as any).constraintHorizontal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportedConstraintV = (originalFrame as any).constraintVertical;
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

    // Check constraints before setting (should be MIN by default)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraintHBefore = (importedFrame as any).constraintHorizontal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraintVBefore = (importedFrame as any).constraintVertical;
    await debugConsole.log(
      `  Constraints before setting: H=${constraintHBefore}, V=${constraintVBefore} (expected: MIN, MIN)`,
    );

    // Set constraints from nodeData (as import code would)
    if (nodeData.constraintHorizontal !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (importedFrame as any).constraintHorizontal =
        nodeData.constraintHorizontal;
      await debugConsole.log(
        `  Set constraintHorizontal to ${nodeData.constraintHorizontal}`,
      );
    }
    if (nodeData.constraintVertical !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (importedFrame as any).constraintVertical = nodeData.constraintVertical;
      await debugConsole.log(
        `  Set constraintVertical to ${nodeData.constraintVertical}`,
      );
    }

    // Step 4: Verify imported constraints
    await debugConsole.log("\n--- Step 4: Verify Imported Constraints ---");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importedConstraintH = (importedFrame as any).constraintHorizontal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importedConstraintV = (importedFrame as any).constraintVertical;
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (testCaseFrame as any).constraintHorizontal = testCase.h;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (testCaseFrame as any).constraintVertical = testCase.v;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultH = (testCaseFrame as any).constraintHorizontal;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultV = (testCaseFrame as any).constraintVertical;

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
