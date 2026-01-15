/// <reference types="@figma/plugin-typings" />
import { debugConsole } from "../debugConsole";

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Test: itemSpacing Variable Binding (Issue #1)
 *
 * IMPORTANT: This file tests Issue #1 only. Each test file should focus on a single issue.
 *
 * ISSUE DESCRIPTION:
 * When importing UI Kit components, frames with Auto Layout have their vertical gap (itemSpacing)
 * bound to a variable (e.g., "dimension/default") in the original design. However, after import,
 * the itemSpacing is hard-coded to 0 instead of being bound to the variable.
 *
 * ROOT CAUSE HYPOTHESIS:
 * When `layoutMode` is set on a frame, Figma automatically initializes `itemSpacing` to 0.
 * If a property has a direct value (even 0), it cannot be bound to a variable. The binding
 * must be set before any direct value is assigned, or the direct value must be cleared first.
 *
 * TEST OBJECTIVE:
 * This test experiments with different approaches to bind itemSpacing to a variable after
 * enabling Auto Layout, to determine the correct sequence of operations that allows the
 * variable binding to succeed.
 *
 * TEST APPROACHES:
 *
 * Approach 1: Immediate Bind After layoutMode
 *   - Set layoutMode to VERTICAL
 *   - Immediately call setBoundVariable("itemSpacing", variable) before any other operations
 *   - Hypothesis: If we bind immediately, before Figma assigns a default value, it might work
 *
 * Approach 2: Clear Then Bind
 *   - Set layoutMode to VERTICAL
 *   - Set itemSpacing to 0 explicitly
 *   - Then call setBoundVariable("itemSpacing", variable)
 *   - Hypothesis: Explicitly clearing the value might allow binding afterward
 *
 * Approach 3: Bind Before layoutMode
 *   - Try to call setBoundVariable("itemSpacing", variable) before setting layoutMode
 *   - Then set layoutMode to VERTICAL
 *   - Hypothesis: Setting the binding first might persist when layoutMode is enabled
 *   - Expected: This will likely fail because itemSpacing doesn't exist until layoutMode is set
 *
 * Approach 4: Remove Then Bind
 *   - Set layoutMode to VERTICAL
 *   - Call setBoundVariable("itemSpacing", null) to remove any existing binding
 *   - Then call setBoundVariable("itemSpacing", variable) to set the new binding
 *   - Hypothesis: Explicitly removing any existing binding might clear the way for a new one
 *
 * Approach 5: Wait Then Bind
 *   - Set layoutMode to VERTICAL
 *   - Wait 10ms (using setTimeout)
 *   - Then call setBoundVariable("itemSpacing", variable)
 *   - Hypothesis: Waiting might allow Figma's internal initialization to complete first
 *
 * EXPECTED OUTCOME:
 * One or more of these approaches should successfully bind itemSpacing to the variable.
 * The successful approach(es) will be documented and applied to the import code in
 * apps/recursica-publisher/src/plugin/services/pageImportNew.ts
 */
export async function testItemSpacingVariableBinding(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log("=== Test: itemSpacing Variable Binding ===");

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

    // Create a variable collection and a dimension variable
    debugConsole.log("Creating test variable collection and variable...");
    const collection = figma.variables.createVariableCollection("Test");
    const defaultMode = collection.modes[0];
    const spacingVariable = figma.variables.createVariable(
      "Spacing",
      collection,
      "FLOAT",
    );
    spacingVariable.setValueForMode(defaultMode.modeId, 16);

    debugConsole.log(
      `Created variable: "${spacingVariable.name}" = ${spacingVariable.valuesByMode[defaultMode.modeId]} in collection "${collection.name}"`,
    );

    const results: Array<{
      approach: string;
      success: boolean;
      message: string;
      details?: Record<string, unknown>;
    }> = [];

    /**
     * APPROACH 1: Immediate Bind After layoutMode
     *
     * Strategy: Set layoutMode, then immediately bind the variable before any other operations.
     * This tests if binding can succeed if done before Figma's internal initialization
     * assigns a default value to itemSpacing.
     *
     * Steps:
     * 1. Create a frame
     * 2. Set layoutMode to VERTICAL
     * 3. Immediately call setBoundVariable("itemSpacing", variable) - no delay, no other operations
     * 4. Check if binding succeeded
     */
    // Approach 1: Set layoutMode, then immediately set bound variable before any other operations
    debugConsole.log(
      "\n--- Approach 1: Set layoutMode, then immediately bind ---",
    );
    try {
      const frame1 = figma.createFrame();
      frame1.name = "Test Frame 1 - Immediate Bind";
      testFrame.appendChild(frame1);

      // Set layoutMode
      frame1.layoutMode = "VERTICAL";
      debugConsole.log("  Set layoutMode to VERTICAL");

      // Immediately set bound variable
      frame1.setBoundVariable("itemSpacing", spacingVariable);
      debugConsole.log("  Set bound variable immediately after layoutMode");

      // Check if it worked
      const boundVar1 = frame1.boundVariables?.itemSpacing;
      const itemSpacing1 = frame1.itemSpacing;

      const success1 = boundVar1 !== undefined;
      debugConsole.log(`  Result: ${success1 ? "SUCCESS" : "FAILED"}`);
      debugConsole.log(`  itemSpacing value: ${itemSpacing1}`);
      debugConsole.log(`  boundVariable: ${JSON.stringify(boundVar1)}`);

      results.push({
        approach: "1 - Immediate bind after layoutMode",
        success: success1,
        message: success1
          ? "Variable binding succeeded"
          : "Variable binding failed",
        details: {
          itemSpacing: itemSpacing1,
          boundVariable: boundVar1,
        },
      });
    } catch (error) {
      debugConsole.error(
        `  Approach 1 failed with error: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        approach: "1 - Immediate bind after layoutMode",
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    /**
     * APPROACH 2: Clear Then Bind
     *
     * Strategy: Set layoutMode, explicitly clear itemSpacing to 0, then bind the variable.
     * This tests if explicitly setting the value to 0 (the default) allows binding afterward.
     *
     * Steps:
     * 1. Create a frame
     * 2. Set layoutMode to VERTICAL (itemSpacing becomes 0 automatically)
     * 3. Explicitly set itemSpacing = 0
     * 4. Call setBoundVariable("itemSpacing", variable)
     * 5. Check if binding succeeded
     */
    // Approach 2: Set layoutMode, try to clear itemSpacing, then set bound variable
    debugConsole.log(
      "\n--- Approach 2: Set layoutMode, clear itemSpacing, then bind ---",
    );
    try {
      const frame2 = figma.createFrame();
      frame2.name = "Test Frame 2 - Clear Then Bind";
      testFrame.appendChild(frame2);

      // Set layoutMode
      frame2.layoutMode = "VERTICAL";
      debugConsole.log("  Set layoutMode to VERTICAL");
      debugConsole.log(`  itemSpacing after layoutMode: ${frame2.itemSpacing}`);

      // Try to clear itemSpacing by setting to 0 or undefined
      // Note: We can't set to undefined, but we can try setting to 0 first
      frame2.itemSpacing = 0;
      debugConsole.log("  Set itemSpacing to 0");

      // Now try to set bound variable
      frame2.setBoundVariable("itemSpacing", spacingVariable);
      debugConsole.log("  Set bound variable after clearing");

      // Check if it worked
      const boundVar2 = frame2.boundVariables?.itemSpacing;
      const itemSpacing2 = frame2.itemSpacing;

      const success2 = boundVar2 !== undefined;
      debugConsole.log(`  Result: ${success2 ? "SUCCESS" : "FAILED"}`);
      debugConsole.log(`  itemSpacing value: ${itemSpacing2}`);
      debugConsole.log(`  boundVariable: ${JSON.stringify(boundVar2)}`);

      results.push({
        approach: "2 - Clear then bind",
        success: success2,
        message: success2
          ? "Variable binding succeeded"
          : "Variable binding failed",
        details: {
          itemSpacing: itemSpacing2,
          boundVariable: boundVar2,
        },
      });
    } catch (error) {
      debugConsole.error(
        `  Approach 2 failed with error: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        approach: "2 - Clear then bind",
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    /**
     * APPROACH 3: Bind Before layoutMode
     *
     * Strategy: Try to set the bound variable before enabling layoutMode, then enable layoutMode.
     * This tests if the binding can be set in advance and will persist when layoutMode is enabled.
     *
     * Steps:
     * 1. Create a frame
     * 2. Try to call setBoundVariable("itemSpacing", variable) - expected to fail
     * 3. Set layoutMode to VERTICAL
     * 4. Check if binding persisted or was set correctly
     *
     * Note: This approach is expected to fail initially because itemSpacing doesn't exist
     * until layoutMode is set, but we test if the binding can be established afterward.
     */
    // Approach 3: Set bound variable in boundVariables object first, then enable layoutMode
    debugConsole.log(
      "\n--- Approach 3: Set boundVariable first, then layoutMode ---",
    );
    try {
      const frame3 = figma.createFrame();
      frame3.name = "Test Frame 3 - Bind Before Layout";
      testFrame.appendChild(frame3);

      // Try to set bound variable before layoutMode
      // This might not work because itemSpacing doesn't exist until layoutMode is set
      try {
        frame3.setBoundVariable("itemSpacing", spacingVariable);
        debugConsole.log("  Set bound variable before layoutMode");
      } catch (error) {
        debugConsole.log(
          `  Could not set bound variable before layoutMode (expected): ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      // Set layoutMode
      frame3.layoutMode = "VERTICAL";
      debugConsole.log("  Set layoutMode to VERTICAL");

      // Check if the bound variable persisted
      const boundVar3 = frame3.boundVariables?.itemSpacing;
      const itemSpacing3 = frame3.itemSpacing;

      const success3 = boundVar3 !== undefined;
      debugConsole.log(`  Result: ${success3 ? "SUCCESS" : "FAILED"}`);
      debugConsole.log(`  itemSpacing value: ${itemSpacing3}`);
      debugConsole.log(`  boundVariable: ${JSON.stringify(boundVar3)}`);

      results.push({
        approach: "3 - Bind before layoutMode",
        success: success3,
        message: success3
          ? "Variable binding succeeded"
          : "Variable binding failed",
        details: {
          itemSpacing: itemSpacing3,
          boundVariable: boundVar3,
        },
      });
    } catch (error) {
      debugConsole.error(
        `  Approach 3 failed with error: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        approach: "3 - Bind before layoutMode",
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    /**
     * APPROACH 4: Remove Then Bind
     *
     * Strategy: Set layoutMode, explicitly remove any existing binding (set to null),
     * then set the new binding. This tests if clearing the binding state allows
     * a fresh binding to be established.
     *
     * Steps:
     * 1. Create a frame
     * 2. Set layoutMode to VERTICAL
     * 3. Call setBoundVariable("itemSpacing", null) to remove any existing binding
     * 4. Call setBoundVariable("itemSpacing", variable) to set the new binding
     * 5. Check if binding succeeded
     */
    // Approach 4: Set layoutMode, then use removeBoundVariable and setBoundVariable
    debugConsole.log("\n--- Approach 4: Remove then set bound variable ---");
    try {
      const frame4 = figma.createFrame();
      frame4.name = "Test Frame 4 - Remove Then Bind";
      testFrame.appendChild(frame4);

      // Set layoutMode
      frame4.layoutMode = "VERTICAL";
      debugConsole.log("  Set layoutMode to VERTICAL");
      debugConsole.log(`  itemSpacing after layoutMode: ${frame4.itemSpacing}`);

      // Try to remove any existing binding first by setting to null
      try {
        frame4.setBoundVariable("itemSpacing", null);
        debugConsole.log("  Removed bound variable (if any)");
      } catch (error) {
        debugConsole.log(
          `  No bound variable to remove (expected): ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      // Now set the bound variable
      frame4.setBoundVariable("itemSpacing", spacingVariable);
      debugConsole.log("  Set bound variable after remove");

      // Check if it worked
      const boundVar4 = frame4.boundVariables?.itemSpacing;
      const itemSpacing4 = frame4.itemSpacing;

      const success4 = boundVar4 !== undefined;
      debugConsole.log(`  Result: ${success4 ? "SUCCESS" : "FAILED"}`);
      debugConsole.log(`  itemSpacing value: ${itemSpacing4}`);
      debugConsole.log(`  boundVariable: ${JSON.stringify(boundVar4)}`);

      results.push({
        approach: "4 - Remove then bind",
        success: success4,
        message: success4
          ? "Variable binding succeeded"
          : "Variable binding failed",
        details: {
          itemSpacing: itemSpacing4,
          boundVariable: boundVar4,
        },
      });
    } catch (error) {
      debugConsole.error(
        `  Approach 4 failed with error: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        approach: "4 - Remove then bind",
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    /**
     * APPROACH 5: Wait Then Bind
     *
     * Strategy: Set layoutMode, wait a short time (10ms), then bind the variable.
     * This tests if allowing Figma's internal initialization to complete first
     * makes the binding succeed.
     *
     * Steps:
     * 1. Create a frame
     * 2. Set layoutMode to VERTICAL
     * 3. Wait 10ms using setTimeout
     * 4. Call setBoundVariable("itemSpacing", variable)
     * 5. Check if binding succeeded
     *
     * Note: This tests if timing is the issue - whether Figma needs time to
     * complete internal initialization before binding can succeed.
     */
    // Approach 5: Set layoutMode, wait a tick, then set bound variable
    debugConsole.log("\n--- Approach 5: Set layoutMode, wait, then bind ---");
    try {
      const frame5 = figma.createFrame();
      frame5.name = "Test Frame 5 - Wait Then Bind";
      testFrame.appendChild(frame5);

      // Set layoutMode
      frame5.layoutMode = "VERTICAL";
      debugConsole.log("  Set layoutMode to VERTICAL");

      // Wait a bit (using a promise delay)
      await new Promise((resolve) => setTimeout(resolve, 10));
      debugConsole.log("  Waited 10ms");

      // Now set the bound variable
      frame5.setBoundVariable("itemSpacing", spacingVariable);
      debugConsole.log("  Set bound variable after wait");

      // Check if it worked
      const boundVar5 = frame5.boundVariables?.itemSpacing;
      const itemSpacing5 = frame5.itemSpacing;

      const success5 = boundVar5 !== undefined;
      debugConsole.log(`  Result: ${success5 ? "SUCCESS" : "FAILED"}`);
      debugConsole.log(`  itemSpacing value: ${itemSpacing5}`);
      debugConsole.log(`  boundVariable: ${JSON.stringify(boundVar5)}`);

      results.push({
        approach: "5 - Wait then bind",
        success: success5,
        message: success5
          ? "Variable binding succeeded"
          : "Variable binding failed",
        details: {
          itemSpacing: itemSpacing5,
          boundVariable: boundVar5,
        },
      });
    } catch (error) {
      debugConsole.error(
        `  Approach 5 failed with error: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        approach: "5 - Wait then bind",
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    // Summary
    debugConsole.log("\n=== Test Summary ===");
    const successfulApproaches = results.filter((r) => r.success);
    const failedApproaches = results.filter((r) => !r.success);

    debugConsole.log(
      `Successful approaches: ${successfulApproaches.length}/${results.length}`,
    );
    for (const result of results) {
      debugConsole.log(
        `  ${result.approach}: ${result.success ? "✓ SUCCESS" : "✗ FAILED"} - ${result.message}`,
      );
    }

    return {
      success: successfulApproaches.length > 0,
      message: `Test completed: ${successfulApproaches.length}/${results.length} approaches succeeded`,
      details: {
        results,
        successfulApproaches: successfulApproaches.map((r) => r.approach),
        failedApproaches: failedApproaches.map((r) => r.approach),
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}

/**
 * Test: Simulate Import Process for itemSpacing Variable Binding
 *
 * This test simulates the actual import process to see if the variable binding
 * survives all the operations that happen during import. It recreates the sequence
 * of operations from pageImportNew.ts to identify where the binding might be lost.
 *
 * SIMULATED IMPORT OPERATIONS:
 * 1. Create frame
 * 2. Set layoutMode
 * 3. Set bound variable using setBoundVariable() API (as we do in import)
 * 4. Set other layout properties (primaryAxisSizingMode, counterAxisSizingMode, etc.)
 * 5. Set padding properties
 * 6. Simulate "late setting" code that might override itemSpacing
 * 7. Append children (which might reset itemSpacing)
 * 8. Simulate "FINAL FIX" code that might override itemSpacing
 *
 * This helps verify that our fix actually works in the context of the full import process.
 */
export async function testItemSpacingVariableBindingImportSimulation(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: itemSpacing Variable Binding - Import Simulation ===",
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

    // Create a variable collection and a dimension variable
    debugConsole.log("Creating test variable collection and variable...");
    const collection = figma.variables.createVariableCollection("Test");
    const defaultMode = collection.modes[0];
    const spacingVariable = figma.variables.createVariable(
      "Spacing",
      collection,
      "FLOAT",
    );
    spacingVariable.setValueForMode(defaultMode.modeId, 16);

    debugConsole.log(
      `Created variable: "${spacingVariable.name}" = ${spacingVariable.valuesByMode[defaultMode.modeId]} in collection "${collection.name}"`,
    );

    // Simulate import process
    debugConsole.log("\n--- Simulating Import Process ---");

    // Step 1: Create frame (simulating newNode creation)
    const frame = figma.createFrame();
    frame.name = "Import Simulation Frame";
    testFrame.appendChild(frame);
    debugConsole.log("  Created frame");

    // Step 2: Set layoutMode (as done in import)
    frame.layoutMode = "VERTICAL";
    debugConsole.log("  Set layoutMode to VERTICAL");
    debugConsole.log(`  itemSpacing after layoutMode: ${frame.itemSpacing}`);

    // Step 3: Set bound variable using setBoundVariable() API (as we do in import now)
    debugConsole.log(
      "  Setting bound variable using setBoundVariable() API...",
    );
    try {
      // Remove any existing binding first
      frame.setBoundVariable("itemSpacing", null);
    } catch {
      // Ignore if no binding exists
    }
    frame.setBoundVariable("itemSpacing", spacingVariable);
    debugConsole.log("  Called setBoundVariable('itemSpacing', variable)");

    // Verify binding was set
    const boundVarAfterSet = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterSet = frame.itemSpacing;
    debugConsole.log(
      `  After setting binding: itemSpacing=${itemSpacingAfterSet}, boundVar=${JSON.stringify(boundVarAfterSet)}`,
    );

    if (!boundVarAfterSet) {
      return {
        success: false,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: itemSpacingAfterSet,
          boundVariable: boundVarAfterSet,
        },
      };
    }

    // Step 4: Set other layout properties (as done in import)
    debugConsole.log("  Setting other layout properties...");
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.primaryAxisAlignItems = "MIN";
    frame.counterAxisAlignItems = "MIN";
    debugConsole.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems",
    );

    // Check binding after setting layout properties
    const boundVarAfterLayout = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterLayout = frame.itemSpacing;
    debugConsole.log(
      `  After layout properties: itemSpacing=${itemSpacingAfterLayout}, boundVar=${JSON.stringify(boundVarAfterLayout)}`,
    );

    // Step 5: Set padding properties (as done in import)
    debugConsole.log("  Setting padding properties...");
    frame.paddingLeft = 0;
    frame.paddingRight = 0;
    frame.paddingTop = 0;
    frame.paddingBottom = 0;
    debugConsole.log("  Set padding to 0");

    // Check binding after setting padding
    const boundVarAfterPadding = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterPadding = frame.itemSpacing;
    debugConsole.log(
      `  After padding: itemSpacing=${itemSpacingAfterPadding}, boundVar=${JSON.stringify(boundVarAfterPadding)}`,
    );

    // Step 6: Simulate "late setting" code (the problematic code that might override)
    debugConsole.log("  Simulating 'late setting' code...");
    const nodeDataItemSpacing = 0; // Simulate nodeData.itemSpacing = 0
    const hasBoundVariables = true; // Simulate hasBoundVariables check
    const nodeDataBoundVariables = { itemSpacing: true }; // Simulate nodeData.boundVariables.itemSpacing exists

    // This is the check from the import code (line ~3148)
    const isActuallyBound = frame.boundVariables?.itemSpacing !== undefined;

    if (nodeDataItemSpacing !== undefined && frame.layoutMode !== undefined) {
      if (
        !isActuallyBound &&
        (!hasBoundVariables || !nodeDataBoundVariables.itemSpacing)
      ) {
        debugConsole.log("  ⚠️ Late setting would override binding!");
        frame.itemSpacing = nodeDataItemSpacing;
      } else if (isActuallyBound) {
        debugConsole.log("  ✓ Late setting correctly skipped (binding exists)");
      }
    }

    // Check binding after late setting
    const boundVarAfterLate = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterLate = frame.itemSpacing;
    debugConsole.log(
      `  After late setting: itemSpacing=${itemSpacingAfterLate}, boundVar=${JSON.stringify(boundVarAfterLate)}`,
    );

    // Step 7: Append children (which might reset itemSpacing)
    debugConsole.log("  Appending children (might reset itemSpacing)...");
    const child1 = figma.createFrame();
    child1.name = "Child 1";
    child1.resize(50, 50);
    frame.appendChild(child1);

    const child2 = figma.createFrame();
    child2.name = "Child 2";
    child2.resize(50, 50);
    frame.appendChild(child2);

    debugConsole.log("  Appended 2 children");

    // Check binding after appending children
    const boundVarAfterChildren = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterChildren = frame.itemSpacing;
    debugConsole.log(
      `  After appending children: itemSpacing=${itemSpacingAfterChildren}, boundVar=${JSON.stringify(boundVarAfterChildren)}`,
    );

    // Step 8: Simulate "FINAL FIX" code (the problematic code that might override)
    debugConsole.log("  Simulating 'FINAL FIX' code...");
    const finalIsActuallyBound =
      frame.boundVariables?.itemSpacing !== undefined;
    const finalShouldBeBound = true; // nodeData.boundVariables.itemSpacing exists

    if (finalIsActuallyBound) {
      debugConsole.log("  ✓ FINAL FIX correctly skipped (binding exists)");
    } else if (!finalShouldBeBound) {
      debugConsole.log(
        "  FINAL FIX would set direct value (but shouldn't be bound)",
      );
      // This is the code that would run - but we skip it if binding exists
    } else {
      debugConsole.log("  ⚠️ FINAL FIX: Binding should exist but doesn't!");
    }

    // Final check
    const finalBoundVar = frame.boundVariables?.itemSpacing;
    const finalItemSpacing = frame.itemSpacing;
    debugConsole.log(
      `  FINAL: itemSpacing=${finalItemSpacing}, boundVar=${JSON.stringify(finalBoundVar)}`,
    );

    // Summary
    const success =
      finalBoundVar !== undefined && finalBoundVar.id === spacingVariable.id;
    debugConsole.log("\n=== Import Simulation Summary ===");
    debugConsole.log(
      `Result: ${success ? "SUCCESS" : "FAILED"} - Binding ${success ? "survived" : "was lost"} through import simulation`,
    );

    return {
      success,
      message: success
        ? "Variable binding survived the import simulation"
        : "Variable binding was lost during import simulation",
      details: {
        afterSet: {
          itemSpacing: itemSpacingAfterSet,
          boundVariable: boundVarAfterSet,
        },
        afterLayout: {
          itemSpacing: itemSpacingAfterLayout,
          boundVariable: boundVarAfterLayout,
        },
        afterPadding: {
          itemSpacing: itemSpacingAfterPadding,
          boundVariable: boundVarAfterPadding,
        },
        afterLate: {
          itemSpacing: itemSpacingAfterLate,
          boundVariable: boundVarAfterLate,
        },
        afterChildren: {
          itemSpacing: itemSpacingAfterChildren,
          boundVariable: boundVarAfterChildren,
        },
        final: {
          itemSpacing: finalItemSpacing,
          boundVariable: finalBoundVar,
        },
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Import simulation test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}

/**
 * Test: Demonstrate the FAILURE - Old Broken Approach
 *
 * This test demonstrates the bug that was causing itemSpacing variable binding to fail.
 * It simulates the OLD import code behavior that was broken:
 *
 * BROKEN BEHAVIORS:
 * 1. Direct assignment to boundVariables object (instead of using setBoundVariable API)
 * 2. "Late setting" code that overrides itemSpacing without checking if it's bound
 * 3. "FINAL FIX" code that overrides itemSpacing without checking if it's bound
 *
 * EXPECTED RESULT:
 * The binding should be lost at some point during the import simulation, demonstrating
 * why the original import code was failing.
 *
 * This test proves that the old approach doesn't work, which is why we needed to fix it.
 */
export async function testItemSpacingVariableBindingFailure(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: itemSpacing Variable Binding - FAILURE DEMONSTRATION ===",
    );
    debugConsole.log(
      "This test demonstrates the OLD BROKEN approach that was causing the issue.",
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

    // Create a variable collection and a dimension variable
    debugConsole.log("Creating test variable collection and variable...");
    const collection = figma.variables.createVariableCollection("Test");
    const defaultMode = collection.modes[0];
    const spacingVariable = figma.variables.createVariable(
      "Spacing",
      collection,
      "FLOAT",
    );
    spacingVariable.setValueForMode(defaultMode.modeId, 16);

    debugConsole.log(
      `Created variable: "${spacingVariable.name}" = ${spacingVariable.valuesByMode[defaultMode.modeId]} in collection "${collection.name}"`,
    );

    // Simulate OLD BROKEN import process
    debugConsole.log("\n--- Simulating OLD BROKEN Import Process ---");

    // Step 1: Create frame
    const frame = figma.createFrame();
    frame.name = "Failure Demo Frame";
    testFrame.appendChild(frame);
    debugConsole.log("  Created frame");

    // Step 2: Set layoutMode
    frame.layoutMode = "VERTICAL";
    debugConsole.log("  Set layoutMode to VERTICAL");
    debugConsole.log(`  itemSpacing after layoutMode: ${frame.itemSpacing}`);

    // Step 3: BROKEN APPROACH - Try to set bound variable using direct assignment
    // (This is what the old code was doing - it doesn't work!)
    debugConsole.log(
      "  ⚠️ BROKEN: Attempting to set bound variable using direct assignment...",
    );
    try {
      // OLD BROKEN WAY: Direct assignment to boundVariables (doesn't work!)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (frame as any).boundVariables = {
        ...(frame.boundVariables || {}),
        itemSpacing: {
          type: "VARIABLE_ALIAS",
          id: spacingVariable.id,
        },
      };
      debugConsole.log(
        "  Called (frame as any).boundVariables.itemSpacing = alias (BROKEN APPROACH)",
      );
    } catch (error) {
      debugConsole.log(
        `  Direct assignment failed (expected): ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Check if binding was set (it probably wasn't)
    const boundVarAfterBrokenSet = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterBrokenSet = frame.itemSpacing;
    debugConsole.log(
      `  After broken set: itemSpacing=${itemSpacingAfterBrokenSet}, boundVar=${JSON.stringify(boundVarAfterBrokenSet)}`,
    );

    // Step 4: Try to set using setBoundVariable (the correct way, but let's see if it works now)
    debugConsole.log("  Attempting to fix by using setBoundVariable() API...");
    try {
      frame.setBoundVariable("itemSpacing", spacingVariable);
      debugConsole.log("  Called setBoundVariable('itemSpacing', variable)");
    } catch (error) {
      debugConsole.log(
        `  setBoundVariable failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Check binding after correct API call
    const boundVarAfterCorrectSet = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterCorrectSet = frame.itemSpacing;
    debugConsole.log(
      `  After correct set: itemSpacing=${itemSpacingAfterCorrectSet}, boundVar=${JSON.stringify(boundVarAfterCorrectSet)}`,
    );

    // Step 5: BROKEN APPROACH - "Late setting" code that overrides without checking
    debugConsole.log(
      "  ⚠️ BROKEN: Simulating 'late setting' code WITHOUT checking if bound...",
    );
    const nodeDataItemSpacing = 0; // Simulate nodeData.itemSpacing = 0

    // OLD BROKEN CODE: Just set it directly without checking if it's bound
    if (nodeDataItemSpacing !== undefined && frame.layoutMode !== undefined) {
      debugConsole.log(
        "  ⚠️ Late setting OVERRIDING itemSpacing without checking if bound!",
      );
      frame.itemSpacing = nodeDataItemSpacing; // This breaks the binding!
    }

    // Check binding after late setting (it should be lost)
    const boundVarAfterLate = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterLate = frame.itemSpacing;
    debugConsole.log(
      `  After broken late setting: itemSpacing=${itemSpacingAfterLate}, boundVar=${JSON.stringify(boundVarAfterLate)}`,
    );

    // Step 6: BROKEN APPROACH - "FINAL FIX" code that overrides without checking
    debugConsole.log(
      "  ⚠️ BROKEN: Simulating 'FINAL FIX' code WITHOUT checking if bound...",
    );
    const finalNodeDataItemSpacing = 0;

    // OLD BROKEN CODE: Just set it directly without checking if it's bound
    if (
      (frame.layoutMode === "VERTICAL" || frame.layoutMode === "HORIZONTAL") &&
      finalNodeDataItemSpacing !== undefined
    ) {
      debugConsole.log(
        "  ⚠️ FINAL FIX OVERRIDING itemSpacing without checking if bound!",
      );
      frame.itemSpacing = finalNodeDataItemSpacing; // This breaks the binding again!
    }

    // Final check
    const finalBoundVar = frame.boundVariables?.itemSpacing;
    const finalItemSpacing = frame.itemSpacing;
    debugConsole.log(
      `  FINAL: itemSpacing=${finalItemSpacing}, boundVar=${JSON.stringify(finalBoundVar)}`,
    );

    // Summary - This test is EXPECTED TO FAIL (demonstrating the bug)
    const bindingLost = finalBoundVar === undefined;
    debugConsole.log("\n=== Failure Demonstration Summary ===");
    debugConsole.log(
      `Result: ${bindingLost ? "FAILURE DEMONSTRATED ✓" : "UNEXPECTED - Binding survived"} - ${bindingLost ? "Binding was lost as expected (demonstrating the bug)" : "Binding survived (unexpected - bug may be fixed)"}`,
    );

    return {
      success: bindingLost, // Success = we demonstrated the failure
      message: bindingLost
        ? "Failure demonstrated: Binding was lost using old broken approach"
        : "Unexpected: Binding survived (bug may already be fixed)",
      details: {
        afterBrokenSet: {
          itemSpacing: itemSpacingAfterBrokenSet,
          boundVariable: boundVarAfterBrokenSet,
        },
        afterCorrectSet: {
          itemSpacing: itemSpacingAfterCorrectSet,
          boundVariable: boundVarAfterCorrectSet,
        },
        afterLate: {
          itemSpacing: itemSpacingAfterLate,
          boundVariable: boundVarAfterLate,
        },
        final: {
          itemSpacing: finalItemSpacing,
          boundVariable: finalBoundVar,
        },
        bindingLost: bindingLost,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Failure demonstration test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}

/**
 * Test: Demonstrate the FIX - New Working Approach
 *
 * This test demonstrates the FIXED import code behavior that correctly preserves
 * itemSpacing variable binding. It simulates the NEW import code behavior:
 *
 * FIXED BEHAVIORS:
 * 1. Using setBoundVariable() API instead of direct assignment
 * 2. "Late setting" code that CHECKS if itemSpacing is bound before overriding
 * 3. "FINAL FIX" code that CHECKS if itemSpacing is bound before overriding
 *
 * EXPECTED RESULT:
 * The binding should survive throughout the entire import simulation, demonstrating
 * that the fix works correctly.
 *
 * This test proves that the new approach works, which is why we implemented it.
 */
export async function testItemSpacingVariableBindingFix(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: itemSpacing Variable Binding - FIX DEMONSTRATION ===",
    );
    debugConsole.log(
      "This test demonstrates the NEW FIXED approach that correctly preserves binding.",
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

    // Create a variable collection and a dimension variable
    debugConsole.log("Creating test variable collection and variable...");
    const collection = figma.variables.createVariableCollection("Test");
    const defaultMode = collection.modes[0];
    const spacingVariable = figma.variables.createVariable(
      "Spacing",
      collection,
      "FLOAT",
    );
    spacingVariable.setValueForMode(defaultMode.modeId, 16);

    debugConsole.log(
      `Created variable: "${spacingVariable.name}" = ${spacingVariable.valuesByMode[defaultMode.modeId]} in collection "${collection.name}"`,
    );

    // Simulate NEW FIXED import process
    debugConsole.log("\n--- Simulating NEW FIXED Import Process ---");

    // Step 1: Create frame
    const frame = figma.createFrame();
    frame.name = "Fix Demo Frame";
    testFrame.appendChild(frame);
    debugConsole.log("  Created frame");

    // Step 2: Set layoutMode
    frame.layoutMode = "VERTICAL";
    debugConsole.log("  Set layoutMode to VERTICAL");
    debugConsole.log(`  itemSpacing after layoutMode: ${frame.itemSpacing}`);

    // Step 3: FIXED APPROACH - Use setBoundVariable() API (the correct way)
    debugConsole.log(
      "  ✓ FIXED: Setting bound variable using setBoundVariable() API...",
    );
    try {
      // Remove any existing binding first
      frame.setBoundVariable("itemSpacing", null);
    } catch {
      // Ignore if no binding exists
    }
    frame.setBoundVariable("itemSpacing", spacingVariable);
    debugConsole.log(
      "  Called setBoundVariable('itemSpacing', variable) (CORRECT APPROACH)",
    );

    // Verify binding was set
    const boundVarAfterSet = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterSet = frame.itemSpacing;
    debugConsole.log(
      `  After setting binding: itemSpacing=${itemSpacingAfterSet}, boundVar=${JSON.stringify(boundVarAfterSet)}`,
    );

    if (!boundVarAfterSet) {
      return {
        success: false,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: itemSpacingAfterSet,
          boundVariable: boundVarAfterSet,
        },
      };
    }

    // Step 4: Set other layout properties
    debugConsole.log("  Setting other layout properties...");
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.primaryAxisAlignItems = "MIN";
    frame.counterAxisAlignItems = "MIN";
    debugConsole.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems",
    );

    // Check binding after setting layout properties
    const boundVarAfterLayout = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterLayout = frame.itemSpacing;
    debugConsole.log(
      `  After layout properties: itemSpacing=${itemSpacingAfterLayout}, boundVar=${JSON.stringify(boundVarAfterLayout)}`,
    );

    // Step 5: Set padding properties
    debugConsole.log("  Setting padding properties...");
    frame.paddingLeft = 0;
    frame.paddingRight = 0;
    frame.paddingTop = 0;
    frame.paddingBottom = 0;
    debugConsole.log("  Set padding to 0");

    // Check binding after setting padding
    const boundVarAfterPadding = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterPadding = frame.itemSpacing;
    debugConsole.log(
      `  After padding: itemSpacing=${itemSpacingAfterPadding}, boundVar=${JSON.stringify(boundVarAfterPadding)}`,
    );

    // Step 6: FIXED APPROACH - "Late setting" code that CHECKS if bound before overriding
    debugConsole.log(
      "  ✓ FIXED: Simulating 'late setting' code WITH check if bound...",
    );
    const nodeDataItemSpacing = 0; // Simulate nodeData.itemSpacing = 0
    const hasBoundVariables = true; // Simulate hasBoundVariables check
    const nodeDataBoundVariables = { itemSpacing: true }; // Simulate nodeData.boundVariables.itemSpacing exists

    // FIXED CODE: Check if itemSpacing is actually bound before overriding
    const isActuallyBound = frame.boundVariables?.itemSpacing !== undefined;

    if (nodeDataItemSpacing !== undefined && frame.layoutMode !== undefined) {
      if (
        !isActuallyBound &&
        (!hasBoundVariables || !nodeDataBoundVariables.itemSpacing)
      ) {
        debugConsole.log(
          "  Late setting would override (but binding doesn't exist, so OK)",
        );
        frame.itemSpacing = nodeDataItemSpacing;
      } else if (isActuallyBound) {
        debugConsole.log(
          "  ✓ Late setting correctly skipped (binding exists) - FIXED!",
        );
        // Don't override - binding exists!
      }
    }

    // Check binding after late setting (it should still be bound)
    const boundVarAfterLate = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterLate = frame.itemSpacing;
    debugConsole.log(
      `  After fixed late setting: itemSpacing=${itemSpacingAfterLate}, boundVar=${JSON.stringify(boundVarAfterLate)}`,
    );

    // Step 7: Append children (which might reset itemSpacing)
    debugConsole.log("  Appending children (might reset itemSpacing)...");
    const child1 = figma.createFrame();
    child1.name = "Child 1";
    child1.resize(50, 50);
    frame.appendChild(child1);

    const child2 = figma.createFrame();
    child2.name = "Child 2";
    child2.resize(50, 50);
    frame.appendChild(child2);

    debugConsole.log("  Appended 2 children");

    // Check binding after appending children
    const boundVarAfterChildren = frame.boundVariables?.itemSpacing;
    const itemSpacingAfterChildren = frame.itemSpacing;
    debugConsole.log(
      `  After appending children: itemSpacing=${itemSpacingAfterChildren}, boundVar=${JSON.stringify(boundVarAfterChildren)}`,
    );

    // Step 8: FIXED APPROACH - "FINAL FIX" code that CHECKS if bound before overriding
    debugConsole.log(
      "  ✓ FIXED: Simulating 'FINAL FIX' code WITH check if bound...",
    );
    const finalIsActuallyBound =
      frame.boundVariables?.itemSpacing !== undefined;
    const finalNodeDataItemSpacing = 0;

    // FIXED CODE: Check if itemSpacing is actually bound before overriding
    if (
      (frame.type === "FRAME" ||
        frame.type === "COMPONENT" ||
        frame.type === "INSTANCE") &&
      (frame.layoutMode === "VERTICAL" || frame.layoutMode === "HORIZONTAL") &&
      finalNodeDataItemSpacing !== undefined
    ) {
      if (!finalIsActuallyBound) {
        // Only apply final fix if not bound
        debugConsole.log(
          "  FINAL FIX would set direct value (but binding doesn't exist, so OK)",
        );
        frame.itemSpacing = finalNodeDataItemSpacing;
      } else {
        debugConsole.log(
          "  ✓ FINAL FIX correctly skipped (binding exists) - FIXED!",
        );
        // Don't override - binding exists!
      }
    }

    // Final check
    const finalBoundVar = frame.boundVariables?.itemSpacing;
    const finalItemSpacing = frame.itemSpacing;
    debugConsole.log(
      `  FINAL: itemSpacing=${finalItemSpacing}, boundVar=${JSON.stringify(finalBoundVar)}`,
    );

    // Summary - This test should SUCCEED (demonstrating the fix works)
    const success =
      finalBoundVar !== undefined && finalBoundVar.id === spacingVariable.id;
    debugConsole.log("\n=== Fix Demonstration Summary ===");
    debugConsole.log(
      `Result: ${success ? "SUCCESS ✓" : "FAILED ✗"} - Binding ${success ? "survived" : "was lost"} through fixed import simulation`,
    );

    return {
      success,
      message: success
        ? "Fix demonstrated: Binding survived using new fixed approach"
        : "Fix failed: Binding was lost (unexpected)",
      details: {
        afterSet: {
          itemSpacing: itemSpacingAfterSet,
          boundVariable: boundVarAfterSet,
        },
        afterLayout: {
          itemSpacing: itemSpacingAfterLayout,
          boundVariable: boundVarAfterLayout,
        },
        afterPadding: {
          itemSpacing: itemSpacingAfterPadding,
          boundVariable: boundVarAfterPadding,
        },
        afterLate: {
          itemSpacing: itemSpacingAfterLate,
          boundVariable: boundVarAfterLate,
        },
        afterChildren: {
          itemSpacing: itemSpacingAfterChildren,
          boundVariable: boundVarAfterChildren,
        },
        final: {
          itemSpacing: finalItemSpacing,
          boundVariable: finalBoundVar,
        },
        bindingSurvived: success,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Fix demonstration test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}
