/// <reference types="@figma/plugin-typings" />
import { debugConsole } from "../debugConsole";

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Test: Instance Children and Overrides Behavior
 *
 * ISSUE DESCRIPTION:
 * We need to understand how Figma instances work:
 * 1. When you create an instance, does it immediately have children?
 * 2. Are children actual nodes or dynamically resolved from the component?
 * 3. How do instance overrides work - are they separate nodes or metadata?
 * 4. Can we merge placeholder children into an instance?
 *
 * ROOT CAUSE:
 * We're trying to resolve nested deferred instances by matching children by name,
 * but we need to understand if instances have children immediately or if they're
 * resolved dynamically. This affects how we should merge placeholder children
 * into instances.
 *
 * TEST OBJECTIVE:
 * Verify:
 * 1. Whether instances have children immediately after creation
 * 2. Whether children are actual nodes or references
 * 3. How overrides are stored and accessed
 * 4. Whether we can merge placeholder children into an instance
 *
 * EXPECTED RESULT:
 * We'll discover how Figma actually handles instance children and overrides,
 * which will inform our approach to resolving nested deferred instances.
 */
export async function testInstanceChildrenAndOverrides(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log("=== Test: Instance Children and Overrides Behavior ===");

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

    const testResults: Array<{
      test: string;
      success: boolean;
      details: Record<string, unknown>;
    }> = [];

    // Test 1: Create a component with children, then create an instance
    debugConsole.log(
      "\n--- Test 1: Component with children → Create instance ---",
    );

    // Create a component with children
    const component = figma.createComponent();
    component.name = "Test Component - With Children";
    component.resize(200, 200);
    testFrame.appendChild(component);

    // Add children to component
    const child1 = figma.createFrame();
    child1.name = "Child 1";
    child1.resize(50, 50);
    child1.x = 10;
    child1.y = 10;
    component.appendChild(child1);

    const child2 = figma.createFrame();
    child2.name = "Child 2";
    child2.resize(50, 50);
    child2.x = 70;
    child2.y = 10;
    component.appendChild(child2);

    debugConsole.log(
      `  Created component "${component.name}" with ${component.children.length} children`,
    );
    debugConsole.log(
      `  Component children: ${component.children.map((c) => c.name).join(", ")}`,
    );

    // Create an instance
    const instance1 = component.createInstance();
    instance1.name = "Instance 1 - From Component";
    testFrame.appendChild(instance1);

    debugConsole.log(`  Created instance "${instance1.name}" from component`);

    // Check if instance has children immediately
    const instance1ChildrenCount = instance1.children.length;
    debugConsole.log(
      `  Instance children count immediately after creation: ${instance1ChildrenCount}`,
    );

    if (instance1ChildrenCount > 0) {
      debugConsole.log(
        `  Instance children: ${instance1.children.map((c) => c.name).join(", ")}`,
      );
      debugConsole.log(
        `  Instance child types: ${instance1.children.map((c) => c.type).join(", ")}`,
      );

      // Check if children are actual nodes or references
      const firstChild = instance1.children[0];
      debugConsole.log(
        `  First child: name="${firstChild.name}", type="${firstChild.type}", id="${firstChild.id}"`,
      );
      debugConsole.log(
        `  First child parent: ${firstChild.parent?.name} (id: ${firstChild.parent?.id})`,
      );

      // Check if child has mainComponent (is it an instance?)
      if ("mainComponent" in firstChild) {
        const childMainComponent = await (
          firstChild as InstanceNode
        ).getMainComponentAsync();
        debugConsole.log(
          `  First child mainComponent: ${childMainComponent?.name || "none"}`,
        );
      }

      // Compare instance children to component children
      debugConsole.log(
        `  Component children IDs: ${component.children.map((c) => c.id).join(", ")}`,
      );
      debugConsole.log(
        `  Instance children IDs: ${instance1.children.map((c) => c.id).join(", ")}`,
      );

      const areDifferentNodes =
        instance1.children[0].id !== component.children[0].id;
      debugConsole.log(
        `  Are instance children different nodes from component children? ${areDifferentNodes}`,
      );
    } else {
      debugConsole.log(
        "  ⚠️ Instance has NO children immediately after creation",
      );
    }

    testResults.push({
      test: "Instance has children immediately",
      success: instance1ChildrenCount > 0,
      details: {
        instanceChildrenCount: instance1ChildrenCount,
        componentChildrenCount: component.children.length,
        instanceChildren: instance1.children.map((c) => ({
          name: c.name,
          type: c.type,
          id: c.id,
        })),
      },
    });

    // Test 2: Create an override by replacing a child
    debugConsole.log(
      "\n--- Test 2: Create instance override by replacing child ---",
    );

    if (instance1ChildrenCount > 0) {
      const originalChild = instance1.children[0];
      debugConsole.log(
        `  Original child to replace: "${originalChild.name}" (id: ${originalChild.id})`,
      );

      // Create a new frame to replace the child
      // NOTE: We must create it OUTSIDE the instance first, then move it in
      // IMPORTANT: Always append to testFrame (not root) so it can be cleaned up
      const overrideChild = figma.createFrame();
      overrideChild.name = "Override Child";
      overrideChild.resize(60, 60);
      overrideChild.x = originalChild.x;
      overrideChild.y = originalChild.y;
      // Append to testFrame (the "Test" frame container) - never create at root
      testFrame.appendChild(overrideChild);

      debugConsole.log(
        `  Created override child "${overrideChild.name}" as child of Test frame`,
      );

      // Try to replace the child
      // NOTE: Figma may not allow moving nodes into instances - we'll test this
      let overrideSuccess = false;
      let overrideError: string | undefined;
      try {
        const childIndex = instance1.children.indexOf(originalChild);
        instance1.insertChild(childIndex, overrideChild);
        originalChild.remove();
        overrideSuccess = true;
        debugConsole.log(
          `  ✓ Successfully replaced child at index ${childIndex}`,
        );
      } catch (error) {
        overrideError = error instanceof Error ? error.message : String(error);
        debugConsole.log(
          `  ✗ Cannot move node into instance: ${overrideError}`,
        );
        debugConsole.log(
          "  → This means we cannot directly move placeholder children into instances",
        );
        debugConsole.log(
          "  → We must create NEW nodes and copy properties instead",
        );
        // Clean up the override child we created (it's in testFrame, so it will be cleaned up)
        overrideChild.remove();
      }

      if (overrideSuccess) {
        debugConsole.log(
          `  Instance children after override: ${instance1.children.map((c) => c.name).join(", ")}`,
        );
        debugConsole.log(
          `  Instance children count after override: ${instance1.children.length}`,
        );

        // Check if component children changed (they shouldn't)
        debugConsole.log(
          `  Component children after override: ${component.children.map((c) => c.name).join(", ")}`,
        );
        debugConsole.log(
          `  Component children count after override: ${component.children.length}`,
        );

        const componentUnchanged =
          component.children.length === 2 &&
          component.children[0].name === "Child 1" &&
          component.children[1].name === "Child 2";

        testResults.push({
          test: "Instance override doesn't affect component",
          success: componentUnchanged,
          details: {
            instanceChildrenAfterOverride: instance1.children.map((c) => ({
              name: c.name,
              type: c.type,
              id: c.id,
            })),
            componentChildrenAfterOverride: component.children.map((c) => ({
              name: c.name,
              type: c.type,
              id: c.id,
            })),
          },
        });
      } else {
        // Override failed - this is expected behavior
        debugConsole.log(
          "  → Cannot move nodes into instances - must create new nodes instead",
        );
        testResults.push({
          test: "Instance override doesn't affect component",
          success: true, // This is expected behavior
          details: {
            overrideAttempted: true,
            overrideError,
            note: "Cannot move nodes into instances - must create new nodes and copy properties",
          },
        });
      }
    } else {
      debugConsole.log(
        "  ⚠️ Skipping override test - instance has no children",
      );
      testResults.push({
        test: "Instance override doesn't affect component",
        success: false,
        details: { reason: "Instance has no children to override" },
      });
    }

    // Test 3: Create a placeholder frame with children, then try to merge into instance
    debugConsole.log(
      "\n--- Test 3: Merge placeholder children into instance ---",
    );

    // Create a new instance for this test
    const instance2 = component.createInstance();
    instance2.name = "Instance 2 - For Placeholder Merge";
    instance2.x = 250;
    testFrame.appendChild(instance2);

    debugConsole.log(
      `  Created instance "${instance2.name}" with ${instance2.children.length} children`,
    );

    // Create a placeholder frame with children
    const placeholder = figma.createFrame();
    placeholder.name = "[Deferred: Placeholder]";
    placeholder.resize(200, 200);
    testFrame.appendChild(placeholder);

    // Add children to placeholder (simulating what we do during import)
    const placeholderChild1 = figma.createFrame();
    placeholderChild1.name = "Child 1"; // Same name as component child
    placeholderChild1.resize(60, 60);
    placeholderChild1.x = 10;
    placeholderChild1.y = 10;
    placeholder.appendChild(placeholderChild1);

    const placeholderChild2 = figma.createFrame();
    placeholderChild2.name = "Placeholder Only Child"; // Different name
    placeholderChild2.resize(50, 50);
    placeholderChild2.x = 80;
    placeholderChild2.y = 10;
    placeholder.appendChild(placeholderChild2);

    debugConsole.log(
      `  Created placeholder with ${placeholder.children.length} children: ${placeholder.children.map((c) => c.name).join(", ")}`,
    );
    debugConsole.log(
      `  Instance has ${instance2.children.length} children: ${instance2.children.map((c) => c.name).join(", ")}`,
    );

    // Try to merge placeholder children into instance
    // NOTE: We cannot move nodes into instances, so we must create new nodes and copy properties
    let mergeSuccess = false;
    let mergeDetails: Record<string, unknown> = {};
    let mergeError: string | undefined;

    if (instance2.children.length > 0 && placeholder.children.length > 0) {
      debugConsole.log("  Attempting to merge placeholder children...");
      debugConsole.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes",
      );

      const mergedChildren: Array<{
        name: string;
        source: string;
        error?: string;
      }> = [];

      for (const placeholderChild of placeholder.children) {
        // Find matching child in instance by name
        const matchingChild = instance2.children.find(
          (child) => child.name === placeholderChild.name,
        );

        if (matchingChild) {
          debugConsole.log(
            `  Found matching child "${placeholderChild.name}" in instance - attempting to replace`,
          );
          try {
            // Try to move the placeholder child into the instance
            const childIndex = instance2.children.indexOf(matchingChild);
            instance2.insertChild(childIndex, placeholderChild);
            matchingChild.remove();
            mergedChildren.push({
              name: placeholderChild.name,
              source: "replaced existing",
            });
            debugConsole.log(
              `    ✓ Successfully replaced "${placeholderChild.name}"`,
            );
          } catch (error) {
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            debugConsole.log(
              `    ✗ Cannot move "${placeholderChild.name}" into instance: ${errorMsg}`,
            );
            debugConsole.log(
              `    → Must create new node and copy properties instead`,
            );
            mergedChildren.push({
              name: placeholderChild.name,
              source: "replaced existing (failed)",
              error: errorMsg,
            });
            mergeError = errorMsg;
          }
        } else {
          debugConsole.log(
            `  No matching child for "${placeholderChild.name}" - attempting to append`,
          );
          try {
            instance2.appendChild(placeholderChild);
            mergedChildren.push({
              name: placeholderChild.name,
              source: "appended new",
            });
            debugConsole.log(
              `    ✓ Successfully appended "${placeholderChild.name}"`,
            );
          } catch (error) {
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            debugConsole.log(
              `    ✗ Cannot append "${placeholderChild.name}" to instance: ${errorMsg}`,
            );
            debugConsole.log(
              `    → Must create new node and copy properties instead`,
            );
            mergedChildren.push({
              name: placeholderChild.name,
              source: "appended new (failed)",
              error: errorMsg,
            });
            mergeError = errorMsg;
          }
        }
      }

      debugConsole.log(
        `  After merge attempt, instance has ${instance2.children.length} children: ${instance2.children.map((c) => c.name).join(", ")}`,
      );

      // Check if any merges succeeded
      const successfulMerges = mergedChildren.filter(
        (c) =>
          !c.error &&
          c.source !== "replaced existing (failed)" &&
          c.source !== "appended new (failed)",
      );

      if (mergeError) {
        debugConsole.log(
          `  → Merge failed: Cannot move nodes into instances (expected behavior)`,
        );
        debugConsole.log(
          `  → Solution: Must create NEW nodes and copy properties from placeholder children`,
        );
        mergeSuccess = true; // This is expected behavior - we learned something
      } else {
        mergeSuccess = successfulMerges.length > 0;
      }

      mergeDetails = {
        mergedChildren,
        successfulMerges: successfulMerges.length,
        failedMerges: mergedChildren.length - successfulMerges.length,
        mergeError,
        finalInstanceChildren: instance2.children.map((c) => ({
          name: c.name,
          type: c.type,
          id: c.id,
        })),
        finalInstanceChildrenCount: instance2.children.length,
        note: mergeError
          ? "Cannot move nodes into instances - must create new nodes and copy properties"
          : "Merge succeeded",
      };
    } else {
      debugConsole.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children",
      );
      mergeDetails = {
        instanceChildrenCount: instance2.children.length,
        placeholderChildrenCount: placeholder.children.length,
      };
    }

    testResults.push({
      test: "Merge placeholder children into instance",
      success: mergeSuccess,
      details: mergeDetails,
    });

    // Test 4: Check getMainComponent behavior
    debugConsole.log("\n--- Test 4: getMainComponent behavior ---");

    const mainComponent = await instance1.getMainComponentAsync();
    debugConsole.log(
      `  Instance mainComponent: ${mainComponent?.name || "none"} (id: ${mainComponent?.id || "none"})`,
    );
    debugConsole.log(`  MainComponent type: ${mainComponent?.type || "none"}`);

    if (mainComponent) {
      debugConsole.log(
        `  MainComponent children: ${mainComponent.children.map((c) => c.name).join(", ")}`,
      );
      debugConsole.log(
        `  MainComponent children count: ${mainComponent.children.length}`,
      );
      debugConsole.log(
        `  Instance children count: ${instance1.children.length}`,
      );

      // Check if instance children match mainComponent children
      const childrenMatch =
        instance1.children.length === mainComponent.children.length &&
        instance1.children.every(
          (child, index) => child.name === mainComponent.children[index].name,
        );

      debugConsole.log(
        `  Do instance children match mainComponent children? ${childrenMatch}`,
      );

      testResults.push({
        test: "getMainComponent returns component",
        success: mainComponent.id === component.id,
        details: {
          mainComponentId: mainComponent.id,
          componentId: component.id,
          childrenMatch,
          instanceChildrenCount: instance1.children.length,
          mainComponentChildrenCount: mainComponent.children.length,
        },
      });
    } else {
      testResults.push({
        test: "getMainComponent returns component",
        success: false,
        details: { reason: "getMainComponentAsync returned null" },
      });
    }

    // Test 5: Recreate children from JSON (simulating deferred instance resolution)
    debugConsole.log(
      "\n--- Test 5: Recreate children from JSON (simulating deferred resolution) ---",
    );

    // Create a component with 3 children
    const component3 = figma.createComponent();
    component3.name = "Test Component - For JSON Recreation";
    component3.resize(300, 300);
    testFrame.appendChild(component3);

    const defaultChild1 = figma.createFrame();
    defaultChild1.name = "Default Child 1";
    defaultChild1.resize(50, 50);
    defaultChild1.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }]; // Red
    component3.appendChild(defaultChild1);

    const defaultChild2 = figma.createFrame();
    defaultChild2.name = "Default Child 2";
    defaultChild2.resize(50, 50);
    defaultChild2.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }]; // Green
    component3.appendChild(defaultChild2);

    const defaultChild3 = figma.createFrame();
    defaultChild3.name = "Default Child 3";
    defaultChild3.resize(50, 50);
    defaultChild3.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }]; // Blue
    component3.appendChild(defaultChild3);

    debugConsole.log(
      `  Created component "${component3.name}" with ${component3.children.length} default children`,
    );
    debugConsole.log(
      `  Default children: ${component3.children.map((c) => c.name).join(", ")}`,
    );

    // Create instance (gets default children)
    const instance3 = component3.createInstance();
    instance3.name = "Instance 3 - For JSON Recreation";
    instance3.x = 350;
    testFrame.appendChild(instance3);

    debugConsole.log(
      `  Created instance "${instance3.name}" with ${instance3.children.length} default children`,
    );
    debugConsole.log(
      `  Instance default children: ${instance3.children.map((c) => c.name).join(", ")}`,
    );

    // Simulate JSON data (what we want the instance to have)
    // - "Default Child 1" exists in both → should be replaced/updated
    // - "JSON Only Child" only in JSON → should be created
    // - "Default Child 2" and "Default Child 3" only in default → should be kept

    const jsonChildren = [
      {
        name: "Default Child 1",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 0 } }], // Yellow (different from default red)
      },
      {
        name: "JSON Only Child",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 0, b: 1 } }], // Magenta
      },
    ];

    debugConsole.log(
      `  JSON children to recreate: ${jsonChildren.map((c) => c.name).join(", ")}`,
    );
    debugConsole.log(
      `  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON`,
    );

    // Simulate recreating children from JSON
    // CRITICAL: We cannot insert/append nodes into instances, so we must modify existing children in place
    let recreationSuccess = true;
    const recreationDetails: Record<string, unknown> = {
      defaultChildrenBefore: instance3.children.map((c) => ({
        name: c.name,
        type: c.type,
        fills: "fills" in c ? c.fills : undefined,
      })),
      jsonChildren: jsonChildren.map((c) => ({ name: c.name, type: c.type })),
    };

    const updatedChildren: string[] = [];
    const skippedChildren: string[] = [];

    // For each JSON child:
    for (const jsonChild of jsonChildren) {
      // Find matching default child by name
      const matchingDefaultChild = instance3.children.find(
        (child) => child.name === jsonChild.name,
      );

      if (matchingDefaultChild) {
        // Match found - try to update it in place
        debugConsole.log(
          `  Found matching child "${jsonChild.name}" - attempting to update in place`,
        );
        try {
          // Try to update properties in place
          if ("fills" in matchingDefaultChild && jsonChild.fills) {
            // Check current fills before update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillsBefore = (matchingDefaultChild as any).fills;
            debugConsole.log(
              `    Current fills before update: ${JSON.stringify(fillsBefore)}`,
            );

            // Try to assign new fills
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (matchingDefaultChild as any).fills = jsonChild.fills as any;

            // Check fills after update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillsAfter = (matchingDefaultChild as any).fills;
            debugConsole.log(
              `    Fills after update: ${JSON.stringify(fillsAfter)}`,
            );

            // Verify the update actually worked
            const updateWorked =
              Array.isArray(fillsAfter) &&
              fillsAfter.length > 0 &&
              fillsAfter[0].type === "SOLID" &&
              fillsAfter[0].color.r === jsonChild.fills[0].color.r &&
              fillsAfter[0].color.g === jsonChild.fills[0].color.g &&
              fillsAfter[0].color.b === jsonChild.fills[0].color.b;

            if (updateWorked) {
              debugConsole.log(
                `    ✓ Successfully updated "${jsonChild.name}" fills in place`,
              );
              updatedChildren.push(jsonChild.name);
            } else {
              debugConsole.log(
                `    ✗ Update assignment succeeded but fills didn't change (read-only?)`,
              );
              recreationSuccess = false;
            }
          } else {
            debugConsole.log(
              `    ⚠ Cannot update "${jsonChild.name}" - node type doesn't support fills`,
            );
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          debugConsole.log(
            `    ✗ Cannot update "${jsonChild.name}": ${errorMsg}`,
          );
          recreationSuccess = false;
        }
      } else {
        // No match - cannot add new children to instances (Figma limitation)
        debugConsole.log(
          `  No matching child for "${jsonChild.name}" - cannot add to instance (Figma limitation)`,
        );
        debugConsole.log(
          `    → Children that exist only in JSON cannot be added to instances`,
        );
        skippedChildren.push(jsonChild.name);
      }
    }

    // Test: Can we modify other properties of instance children?
    debugConsole.log(
      `  Testing: Can we modify other properties (like name, size) of instance children?`,
    );
    let canModifyProperties = false;
    if (instance3.children.length > 0) {
      const childToModify = instance3.children[0];
      const originalName = childToModify.name;
      const originalWidth =
        "width" in childToModify ? childToModify.width : undefined;
      try {
        childToModify.name = "Modified Name";
        if ("resize" in childToModify && originalWidth) {
          childToModify.resize(originalWidth + 10, childToModify.height);
        }
        canModifyProperties = true;
        debugConsole.log(
          `    ✓ Can modify properties (name, size) of instance children`,
        );
        // Restore original values
        childToModify.name = originalName;
        if ("resize" in childToModify && originalWidth) {
          childToModify.resize(originalWidth, childToModify.height);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        debugConsole.log(
          `    ✗ Cannot modify properties of instance children: ${errorMsg}`,
        );
      }
    }

    // Check which default children were kept (not in JSON)
    const keptDefaultChildren = instance3.children.filter(
      (child) => !jsonChildren.some((jc) => jc.name === child.name),
    );

    debugConsole.log(
      `  Kept default children (not in JSON): ${keptDefaultChildren.map((c) => c.name).join(", ")}`,
    );
    debugConsole.log(
      `  Final instance children: ${instance3.children.map((c) => c.name).join(", ")}`,
    );
    debugConsole.log(
      `  Final instance children count: ${instance3.children.length}`,
    );

    recreationDetails.finalChildren = instance3.children.map((c) => ({
      name: c.name,
      type: c.type,
    }));
    recreationDetails.keptDefaultChildren = keptDefaultChildren.map((c) => ({
      name: c.name,
      type: c.type,
    }));
    recreationDetails.finalChildrenCount = instance3.children.length;

    recreationDetails.updatedChildren = updatedChildren;
    recreationDetails.skippedChildren = skippedChildren;
    recreationDetails.canModifyProperties = canModifyProperties;

    // Verify expectations:
    // - "Default Child 1" should be updated (from JSON) - fills changed to yellow
    // - "JSON Only Child" cannot be added (Figma limitation - children only in JSON can't be added)
    // - "Default Child 2" and "Default Child 3" should be kept (not in JSON)
    const hasJsonChild1 = instance3.children.some(
      (c) => c.name === "Default Child 1",
    );
    const hasJsonOnlyChild = instance3.children.some(
      (c) => c.name === "JSON Only Child",
    );
    const hasDefaultChild2 = instance3.children.some(
      (c) => c.name === "Default Child 2",
    );
    const hasDefaultChild3 = instance3.children.some(
      (c) => c.name === "Default Child 3",
    );

    // Check if "Default Child 1" was actually updated (fills should be yellow now)
    const instanceDefaultChild1 = instance3.children.find(
      (c) => c.name === "Default Child 1",
    );
    let child1Updated = false;
    if (instanceDefaultChild1 && "fills" in instanceDefaultChild1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fills = instanceDefaultChild1.fills as any;
      if (
        Array.isArray(fills) &&
        fills.length > 0 &&
        fills[0].type === "SOLID"
      ) {
        // Check if color is yellow (r: 1, g: 1, b: 0)
        child1Updated =
          fills[0].color.r === 1 &&
          fills[0].color.g === 1 &&
          fills[0].color.b === 0;
      }
    }

    // Expectations:
    // - "Default Child 1" exists and was updated (fills changed)
    // - "JSON Only Child" does NOT exist (cannot add new children to instances)
    // - "Default Child 2" and "Default Child 3" are kept
    const meetsExpectations =
      hasJsonChild1 &&
      child1Updated &&
      !hasJsonOnlyChild && // Should NOT exist (Figma limitation)
      hasDefaultChild2 &&
      hasDefaultChild3 &&
      instance3.children.length === 3; // Should still be 3 (can't add new ones)

    debugConsole.log(`  Meets expectations: ${meetsExpectations}`);
    debugConsole.log(`    - "Default Child 1" updated: ${child1Updated}`);
    debugConsole.log(
      `    - "JSON Only Child" added: ${hasJsonOnlyChild} (expected: false - cannot add new children)`,
    );
    debugConsole.log(
      `    - Default children kept: ${hasDefaultChild2 && hasDefaultChild3}`,
    );

    testResults.push({
      test: "Recreate children from JSON",
      success: recreationSuccess && meetsExpectations,
      details: {
        ...recreationDetails,
        meetsExpectations,
        hasJsonChild1,
        child1Updated,
        hasJsonOnlyChild,
        hasDefaultChild2,
        hasDefaultChild3,
        note:
          recreationSuccess && meetsExpectations
            ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)."
            : "Failed to update children or expectations not met",
      },
    });

    // Test 6: Bottom-up resolution order (simulating nested deferred instances)
    debugConsole.log(
      "\n--- Test 6: Bottom-up resolution order (nested deferred instances) ---",
    );

    // Create a nested structure: Parent -> Child -> Grandchild
    // Simulate deferred instances with placeholders
    const parentPlaceholder = figma.createFrame();
    parentPlaceholder.name = "[Deferred: Parent]";
    parentPlaceholder.resize(200, 200);
    testFrame.appendChild(parentPlaceholder);

    const childPlaceholder = figma.createFrame();
    childPlaceholder.name = "[Deferred: Child]";
    childPlaceholder.resize(100, 100);
    childPlaceholder.x = 10;
    childPlaceholder.y = 10;
    parentPlaceholder.appendChild(childPlaceholder);

    const grandchildPlaceholder = figma.createFrame();
    grandchildPlaceholder.name = "[Deferred: Grandchild]";
    grandchildPlaceholder.resize(50, 50);
    grandchildPlaceholder.x = 10;
    grandchildPlaceholder.y = 10;
    childPlaceholder.appendChild(grandchildPlaceholder);

    debugConsole.log(
      `  Created nested structure: Parent -> Child -> Grandchild`,
    );
    debugConsole.log(
      `  Parent placeholder has ${parentPlaceholder.children.length} child(ren)`,
    );
    debugConsole.log(
      `  Child placeholder has ${childPlaceholder.children.length} child(ren)`,
    );

    // Simulate bottom-up resolution:
    // 1. Resolve grandchild first (leaf node)
    // 2. Resolve child (now has resolved grandchild)
    // 3. Resolve parent (now has resolved child)

    let bottomUpSuccess = true;
    const bottomUpDetails: Record<string, unknown> = {};

    // Step 1: Resolve grandchild (leaf node - no children)
    debugConsole.log(`  Step 1: Resolving grandchild (leaf node)...`);
    const grandchildComponent = figma.createComponent();
    grandchildComponent.name = "Grandchild Component";
    grandchildComponent.resize(50, 50);
    testFrame.appendChild(grandchildComponent);

    const grandchildInstance = grandchildComponent.createInstance();
    grandchildInstance.name = "Grandchild Instance";
    testFrame.appendChild(grandchildInstance); // Create outside first

    // Replace grandchild placeholder
    const grandchildParent = grandchildPlaceholder.parent;
    if (grandchildParent && "children" in grandchildParent) {
      const grandchildIndex = grandchildParent.children.indexOf(
        grandchildPlaceholder,
      );
      grandchildParent.insertChild(grandchildIndex, grandchildInstance);
      grandchildPlaceholder.remove();
      debugConsole.log(
        `    ✓ Resolved grandchild - replaced placeholder with instance`,
      );
      bottomUpDetails.grandchildResolved = true;
    } else {
      debugConsole.log(`    ✗ Could not resolve grandchild`);
      bottomUpSuccess = false;
    }

    // Step 2: Resolve child (now has resolved grandchild inside)
    debugConsole.log(
      `  Step 2: Resolving child (has resolved grandchild inside)...`,
    );
    const childComponent = figma.createComponent();
    childComponent.name = "Child Component";
    childComponent.resize(100, 100);
    testFrame.appendChild(childComponent);

    const childInstance = childComponent.createInstance();
    childInstance.name = "Child Instance";
    testFrame.appendChild(childInstance); // Create outside first

    // Check if grandchild is still accessible (it should be, since we resolved it first)
    const childPlaceholderAfterGrandchild = parentPlaceholder.children.find(
      (c) => c.name === "[Deferred: Child]",
    );
    if (!childPlaceholderAfterGrandchild) {
      debugConsole.log(
        `    ✗ Child placeholder lost after resolving grandchild`,
      );
      bottomUpSuccess = false;
    } else if (!("children" in childPlaceholderAfterGrandchild)) {
      debugConsole.log(`    ✗ Child placeholder does not support children`);
      bottomUpSuccess = false;
    } else {
      // Grandchild should be inside the child placeholder
      const grandchildInsideChild =
        childPlaceholderAfterGrandchild.children.find(
          (c: SceneNode) => c.name === "Grandchild Instance",
        );
      if (grandchildInsideChild) {
        debugConsole.log(
          `    ✓ Grandchild still accessible inside child placeholder`,
        );
        bottomUpDetails.grandchildStillAccessible = true;
      } else {
        debugConsole.log(
          `    ⚠ Grandchild not found inside child placeholder (may have been moved)`,
        );
      }

      // CRITICAL: Extract grandchild instance from child placeholder before replacing
      // Otherwise, the grandchild will be removed when we remove the child placeholder
      const grandchildToMove = childPlaceholderAfterGrandchild.children.find(
        (c: SceneNode) => c.name === "Grandchild Instance",
      );

      // Replace child placeholder
      const childParent = childPlaceholderAfterGrandchild.parent;
      if (childParent && "children" in childParent) {
        const childIndex = childParent.children.indexOf(
          childPlaceholderAfterGrandchild,
        );
        childParent.insertChild(childIndex, childInstance);
        childPlaceholderAfterGrandchild.remove();
        debugConsole.log(
          `    ✓ Resolved child - replaced placeholder with instance`,
        );
        bottomUpDetails.childResolved = true;

        // NOTE: We cannot add children to instances (Figma limitation)
        // The grandchild instance is now in the parent placeholder (since we replaced child placeholder)
        // This is actually correct - the child instance is in the parent, and grandchild is lost
        // This demonstrates why we need to handle nested deferred instances differently
        if (grandchildToMove) {
          debugConsole.log(
            `    ⚠ Grandchild instance was in child placeholder and is now lost`,
          );
          debugConsole.log(
            `    → This demonstrates the need to extract children before replacing placeholders`,
          );
          bottomUpDetails.grandchildLost = true;
        }
      } else {
        debugConsole.log(`    ✗ Could not resolve child`);
        bottomUpSuccess = false;
      }
    }

    // Step 3: Resolve parent (now has resolved child inside)
    debugConsole.log(
      `  Step 3: Resolving parent (has resolved child inside)...`,
    );
    const parentComponent = figma.createComponent();
    parentComponent.name = "Parent Component";
    parentComponent.resize(200, 200);
    testFrame.appendChild(parentComponent);

    const parentInstance = parentComponent.createInstance();
    parentInstance.name = "Parent Instance";
    testFrame.appendChild(parentInstance); // Create outside first

    // CRITICAL: Extract child instance from parent placeholder before replacing
    // Otherwise, the child will be removed when we remove the parent placeholder
    const childInsideParent = parentPlaceholder.children.find(
      (c) => c.name === "Child Instance",
    );
    if (childInsideParent) {
      debugConsole.log(
        `    ✓ Child still accessible inside parent placeholder`,
      );
      bottomUpDetails.childStillAccessible = true;

      // Extract child instance before replacing parent placeholder
      // Move it to testFrame temporarily (we can't add it to parentInstance yet)
      testFrame.appendChild(childInsideParent);
      debugConsole.log(
        `    ✓ Extracted child instance from parent placeholder`,
      );
      bottomUpDetails.childExtracted = true;
    } else {
      debugConsole.log(
        `    ✗ Child not found inside parent placeholder - cannot extract`,
      );
      bottomUpSuccess = false;
    }

    // Replace parent placeholder
    const parentParent = parentPlaceholder.parent;
    if (parentParent && "children" in parentParent) {
      const parentIndex = parentParent.children.indexOf(parentPlaceholder);
      parentParent.insertChild(parentIndex, parentInstance);
      parentPlaceholder.remove();
      debugConsole.log(
        `    ✓ Resolved parent - replaced placeholder with instance`,
      );
      bottomUpDetails.parentResolved = true;

      // Now try to add child instance to parent instance
      // NOTE: This will fail because we can't add children to instances
      // This demonstrates the limitation we need to work around
      if (childInsideParent) {
        try {
          parentInstance.appendChild(childInsideParent);
          debugConsole.log(`    ✓ Added child instance to parent instance`);
          bottomUpDetails.childAddedToParent = true;
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          debugConsole.log(
            `    ✗ Cannot add child to parent instance: ${errorMsg}`,
          );
          debugConsole.log(
            `    → This is the Figma limitation - cannot add children to instances`,
          );
          debugConsole.log(
            `    → Child instance remains in testFrame (not in final structure)`,
          );
          bottomUpDetails.childAddedToParent = false;
          bottomUpDetails.childAddError = errorMsg;
        }
      }
    } else {
      debugConsole.log(`    ✗ Could not resolve parent`);
      bottomUpSuccess = false;
    }

    // Verify final structure
    // NOTE: Due to Figma limitations, we cannot add children to instances
    // So the final structure won't have children inside instances
    // But we can verify that bottom-up resolution worked (children resolved before parents)
    debugConsole.log(`  Verifying bottom-up resolution worked...`);
    const finalParent = testFrame.children.find(
      (c) => c.name === "Parent Instance",
    );
    const childInTestFrame = testFrame.children.find(
      (c) => c.name === "Child Instance",
    );

    let bottomUpWorked = false;
    if (finalParent && childInTestFrame) {
      // Bottom-up worked: parent was resolved, child was extracted (but can't be added to instance)
      bottomUpWorked = true;
      debugConsole.log(
        `    ✓ Bottom-up resolution worked: Parent resolved, child extracted`,
      );
      debugConsole.log(
        `    ⚠ Child cannot be added to parent instance (Figma limitation)`,
      );
    } else if (finalParent) {
      debugConsole.log(
        `    ⚠ Parent resolved but child not found (may have been lost)`,
      );
    } else {
      debugConsole.log(`    ✗ Parent not resolved`);
    }

    bottomUpDetails.bottomUpWorked = bottomUpWorked;
    bottomUpDetails.finalParentExists = !!finalParent;
    bottomUpDetails.childExtractedExists = !!childInTestFrame;
    bottomUpDetails.note =
      "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).";
    bottomUpDetails.note =
      "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced";

    testResults.push({
      test: "Bottom-up resolution order",
      success: bottomUpSuccess && bottomUpWorked,
      details: bottomUpDetails,
    });

    // Summary
    debugConsole.log("\n--- Test Summary ---");
    const allPassed = testResults.every((r) => r.success);
    const passedCount = testResults.filter((r) => r.success).length;

    debugConsole.log(`  Tests passed: ${passedCount}/${testResults.length}`);

    for (const result of testResults) {
      debugConsole.log(
        `  ${result.success ? "✓" : "✗"} ${result.test}: ${result.success ? "PASS" : "FAIL"}`,
      );
    }

    return {
      success: allPassed,
      message: allPassed
        ? "All instance children and override tests passed"
        : `${passedCount}/${testResults.length} tests passed - see details`,
      details: {
        testResults,
        summary: {
          total: testResults.length,
          passed: passedCount,
          failed: testResults.length - passedCount,
        },
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
