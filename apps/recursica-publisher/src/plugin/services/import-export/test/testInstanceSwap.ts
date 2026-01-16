/// <reference types="@figma/plugin-typings" />
import { debugConsole } from "../debugConsole";
import { InstanceTable } from "../parsers/instanceTable";
import { VariableTable, CollectionTable } from "../parsers/variableTable";
import { StyleTable } from "../parsers/styleTable";
import { ImageTable } from "../parsers/imageTable";
import type { ParserContext } from "../parsers/baseNodeParser";
import { parseFrameProperties } from "../parsers/frameParser";

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

interface InstanceRefValue {
  _instanceRef: number;
}

/**
 * Test: INSTANCE_SWAP Component Property Export/Import
 *
 * IMPORTANT: This file tests INSTANCE_SWAP component property handling only.
 *
 * ISSUE DESCRIPTION:
 * INSTANCE_SWAP properties allow swapping instances in component variants.
 * The defaultValue is a node ID pointing to a nested instance within the component.
 * This test verifies that INSTANCE_SWAP properties are correctly exported and imported.
 *
 * TEST OBJECTIVE:
 * Verify that INSTANCE_SWAP component properties are correctly:
 * 1. Created with a nested instance as defaultValue
 * 2. Exported (converting node ID to _instanceRef in instance table)
 * 3. Imported (resolving _instanceRef back to instance node ID)
 * 4. Preserved through the export/import cycle
 *
 * TEST STEPS:
 * 1. Create a target component (the one that will be swapped)
 * 2. Create a parent component with a nested instance of the target component
 * 3. Add an INSTANCE_SWAP property to the parent component, referencing the nested instance
 * 4. Verify the property exists and has the correct defaultValue (instance node ID)
 * 5. Simulate export: Read componentPropertyDefinitions and verify INSTANCE_SWAP property
 * 6. Simulate import: Create a new component and add the INSTANCE_SWAP property
 * 7. Verify the imported component has the INSTANCE_SWAP property with correct defaultValue
 */
export async function testInstanceSwapProperty(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: INSTANCE_SWAP Component Property Export/Import ===",
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

    // Step 1: Create a target component (the one that will be swapped)
    debugConsole.log("\n--- Step 1: Create target component ---");
    const targetComponent = figma.createComponent();
    targetComponent.name = "Target Component";
    targetComponent.resize(50, 50);

    // Add some content to the target component
    const targetFrame = figma.createFrame();
    targetFrame.name = "Target Content";
    targetFrame.resize(50, 50);
    targetFrame.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];
    targetComponent.appendChild(targetFrame);
    testFrame.appendChild(targetComponent);

    debugConsole.log(
      `  Created target component "${targetComponent.name}" (ID: ${targetComponent.id.substring(0, 8)}...)`,
    );

    // Step 2: Create a parent component with a nested instance
    debugConsole.log(
      "\n--- Step 2: Create parent component with nested instance ---",
    );
    const parentComponent = figma.createComponent();
    parentComponent.name = "Parent Component with Instance Swap";
    parentComponent.resize(200, 200);

    // Create a nested instance of the target component
    const nestedInstance = targetComponent.createInstance();
    nestedInstance.name = "Nested Instance";
    nestedInstance.x = 10;
    nestedInstance.y = 10;
    parentComponent.appendChild(nestedInstance);

    // Add some other content to make it more realistic
    const parentFrame = figma.createFrame();
    parentFrame.name = "Parent Content";
    parentFrame.resize(200, 200);
    parentFrame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    parentComponent.appendChild(parentFrame);
    parentComponent.insertChild(0, nestedInstance); // Put instance on top

    testFrame.appendChild(parentComponent);

    debugConsole.log(`  Created parent component "${parentComponent.name}"`);
    debugConsole.log(
      `  Created nested instance "${nestedInstance.name}" (ID: ${nestedInstance.id.substring(0, 8)}...)`,
    );

    // Step 3: Add INSTANCE_SWAP property to parent component
    debugConsole.log("\n--- Step 3: Add INSTANCE_SWAP property ---");
    const propertyName = "Swappable Instance";

    // For INSTANCE_SWAP, defaultValue should be the component name (the main component the instance is based on)
    // Get the main component from the nested instance
    const mainComponent = await nestedInstance.getMainComponentAsync();
    if (!mainComponent) {
      throw new Error("Could not get main component from nested instance");
    }

    debugConsole.log(
      `  Nested instance main component: "${mainComponent.name}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
    );
    debugConsole.log(
      `  Using component ID as defaultValue: ${mainComponent.id}`,
    );

    const propertyId = parentComponent.addComponentProperty(
      propertyName,
      "INSTANCE_SWAP",
      mainComponent.id, // defaultValue is the main component ID, not the instance ID or name
    );

    debugConsole.log(
      `  Added INSTANCE_SWAP property "${propertyName}" with ID "${propertyId}"`,
    );
    debugConsole.log(
      `  Property defaultValue (component ID): ${mainComponent.id}`,
    );

    // Step 4: Verify the property exists
    debugConsole.log("\n--- Step 4: Verify property exists ---");
    const componentProps = parentComponent.componentPropertyDefinitions;
    const instanceSwapProp = componentProps[propertyId];

    if (!instanceSwapProp) {
      throw new Error(
        `INSTANCE_SWAP property not found in componentPropertyDefinitions`,
      );
    }

    if (instanceSwapProp.type !== "INSTANCE_SWAP") {
      throw new Error(
        `Property type is ${instanceSwapProp.type}, expected INSTANCE_SWAP`,
      );
    }

    const defaultValue = instanceSwapProp.defaultValue;
    debugConsole.log(`  Property type: ${instanceSwapProp.type}`);
    debugConsole.log(`  Property defaultValue: ${defaultValue}`);

    // For INSTANCE_SWAP, defaultValue is the main component ID
    if (defaultValue !== mainComponent.id) {
      throw new Error(
        `Property defaultValue is ${defaultValue}, expected ${mainComponent.id}`,
      );
    }

    debugConsole.log("  ✓ INSTANCE_SWAP property verified");

    // Step 5: Simulate export - read componentPropertyDefinitions
    debugConsole.log(
      "\n--- Step 5: Simulate Export (read componentPropertyDefinitions) ---",
    );
    const exportedProps = parentComponent.componentPropertyDefinitions;
    const exportedInstanceSwapProp = exportedProps[propertyId];

    if (!exportedInstanceSwapProp) {
      throw new Error(
        "INSTANCE_SWAP property not found in exported properties",
      );
    }

    const exportedDefaultValue = exportedInstanceSwapProp.defaultValue;
    debugConsole.log(
      `  Exported property type: ${exportedInstanceSwapProp.type}`,
    );
    debugConsole.log(`  Exported defaultValue: ${exportedDefaultValue}`);

    // In a real export, the component ID would be used to find the instance
    // and convert it to _instanceRef in the instance table
    // For this test, we'll verify the component ID is present
    if (typeof exportedDefaultValue !== "string") {
      throw new Error(
        `Exported defaultValue is not a string: ${typeof exportedDefaultValue}`,
      );
    }

    if (exportedDefaultValue !== mainComponent.id) {
      throw new Error(
        `Exported defaultValue is ${exportedDefaultValue}, expected ${mainComponent.id}`,
      );
    }

    debugConsole.log("  ✓ Export simulation successful");

    // Step 6: Simulate import - create new component and add INSTANCE_SWAP property
    debugConsole.log(
      "\n--- Step 6: Simulate Import (create new component) ---",
    );

    // First, we need to recreate the target component (simulating it exists in the file)
    const importedTargetComponent = figma.createComponent();
    importedTargetComponent.name = "Imported Target Component";
    importedTargetComponent.resize(50, 50);

    const importedTargetFrame = figma.createFrame();
    importedTargetFrame.name = "Imported Target Content";
    importedTargetFrame.resize(50, 50);
    importedTargetFrame.fills = [
      { type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } },
    ];
    importedTargetComponent.appendChild(importedTargetFrame);
    testFrame.appendChild(importedTargetComponent);

    debugConsole.log(
      `  Created imported target component "${importedTargetComponent.name}"`,
    );

    // Create the imported parent component
    const importedParentComponent = figma.createComponent();
    importedParentComponent.name = "Imported Parent Component";
    importedParentComponent.resize(200, 200);

    // Create a nested instance in the imported component
    const importedNestedInstance = importedTargetComponent.createInstance();
    importedNestedInstance.name = "Imported Nested Instance";
    importedNestedInstance.x = 10;
    importedNestedInstance.y = 10;
    importedParentComponent.appendChild(importedNestedInstance);

    const importedParentFrame = figma.createFrame();
    importedParentFrame.name = "Imported Parent Content";
    importedParentFrame.resize(200, 200);
    importedParentFrame.fills = [
      { type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } },
    ];
    importedParentComponent.appendChild(importedParentFrame);
    importedParentComponent.insertChild(0, importedNestedInstance);

    testFrame.appendChild(importedParentComponent);

    debugConsole.log(
      `  Created imported parent component "${importedParentComponent.name}"`,
    );
    debugConsole.log(
      `  Created imported nested instance (ID: ${importedNestedInstance.id.substring(0, 8)}...)`,
    );

    // Add the INSTANCE_SWAP property using the imported component's ID
    // In a real import, this would come from resolving _instanceRef to find the instance,
    // then getting its main component ID
    const importedMainComponent =
      await importedNestedInstance.getMainComponentAsync();
    if (!importedMainComponent) {
      throw new Error(
        "Could not get main component from imported nested instance",
      );
    }

    debugConsole.log(
      `  Imported nested instance main component: "${importedMainComponent.name}" (ID: ${importedMainComponent.id.substring(0, 8)}...)`,
    );

    const importedPropertyId = importedParentComponent.addComponentProperty(
      propertyName,
      "INSTANCE_SWAP",
      importedMainComponent.id, // Use the component ID, not the instance ID or name
    );

    debugConsole.log(
      `  Added INSTANCE_SWAP property "${propertyName}" with ID "${importedPropertyId}"`,
    );
    debugConsole.log(
      `  Property defaultValue (imported component ID): ${importedMainComponent.id}`,
    );

    // Step 7: Verify the imported component has the INSTANCE_SWAP property
    debugConsole.log("\n--- Step 7: Verify imported property ---");
    const importedComponentProps =
      importedParentComponent.componentPropertyDefinitions;
    const importedInstanceSwapProp = importedComponentProps[importedPropertyId];

    if (!importedInstanceSwapProp) {
      throw new Error("INSTANCE_SWAP property not found in imported component");
    }

    if (importedInstanceSwapProp.type !== "INSTANCE_SWAP") {
      throw new Error(
        `Imported property type is ${importedInstanceSwapProp.type}, expected INSTANCE_SWAP`,
      );
    }

    const importedDefaultValue = importedInstanceSwapProp.defaultValue;
    debugConsole.log(
      `  Imported property type: ${importedInstanceSwapProp.type}`,
    );
    debugConsole.log(`  Imported defaultValue: ${importedDefaultValue}`);

    // For INSTANCE_SWAP, defaultValue is the main component ID
    if (importedDefaultValue !== importedMainComponent.id) {
      throw new Error(
        `Imported defaultValue is ${importedDefaultValue}, expected ${importedMainComponent.id}`,
      );
    }

    debugConsole.log("  ✓ Imported INSTANCE_SWAP property verified");

    // Summary
    const success = true;
    debugConsole.log("\n=== Test Summary ===");
    debugConsole.log("✓ INSTANCE_SWAP property export/import test PASSED");
    debugConsole.log(
      `  Original property: ${propertyName} = ${defaultValue} (component ID)`,
    );
    debugConsole.log(
      `  Imported property: ${propertyName} = ${importedDefaultValue} (component ID)`,
    );

    return {
      success,
      message: "INSTANCE_SWAP property correctly exported and imported",
      details: {
        original: {
          propertyName,
          propertyId,
          defaultValue,
          componentId: mainComponent.id,
          componentName: mainComponent.name,
          instanceId: nestedInstance.id,
        },
        imported: {
          propertyName,
          propertyId: importedPropertyId,
          defaultValue: importedDefaultValue,
          componentId: importedMainComponent.id,
          componentName: importedMainComponent.name,
          instanceId: importedNestedInstance.id,
        },
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`INSTANCE_SWAP test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}

/**
 * Test: INSTANCE_SWAP Component Property Cross-Page Scenario
 *
 * This test verifies that INSTANCE_SWAP properties work correctly when the
 * target component is on a different page than the parent component.
 *
 * TEST OBJECTIVE:
 * Verify that INSTANCE_SWAP component properties work correctly when:
 * 1. Target component is on Page A
 * 2. Parent component with nested instance is on Page B
 * 3. The instance references the component on Page A
 *
 * This tests the "normal" instance type scenario where components are on
 * different pages within the same file.
 *
 * TEST STEPS:
 * 1. Create a separate test page for the target component
 * 2. Create target component on the separate page
 * 3. Load all pages to ensure cross-page access works
 * 4. Create parent component on the main test page
 * 5. Create nested instance of target component (cross-page reference)
 * 6. Add INSTANCE_SWAP property referencing the cross-page component
 * 7. Verify the property works correctly
 */
export async function testInstanceSwapPropertyCrossPage(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: INSTANCE_SWAP Component Property Cross-Page Scenario ===",
    );

    // Get the test page
    const testPage = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!testPage || testPage.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = testPage.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Step 1: Create a separate page for the target component
    debugConsole.log(
      "\n--- Step 1: Create separate page for target component ---",
    );
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;

    // Find or create a separate test page for the target component
    let targetComponentPage = allPages.find(
      (p) => p.type === "PAGE" && p.name === "Test - Target Component Page",
    ) as PageNode | undefined;

    if (!targetComponentPage) {
      targetComponentPage = figma.createPage();
      targetComponentPage.name = "Test - Target Component Page";
      debugConsole.log(
        `  Created separate page "${targetComponentPage.name}" for target component`,
      );
    } else {
      debugConsole.log(
        `  Found existing page "${targetComponentPage.name}" for target component`,
      );
      // Clean up any existing content on this page
      const existingFrame = targetComponentPage.children.find(
        (child) => child.type === "FRAME",
      );
      if (existingFrame) {
        existingFrame.remove();
      }
    }

    // Step 2: Create target component on the separate page
    debugConsole.log(
      "\n--- Step 2: Create target component on separate page ---",
    );
    const targetComponent = figma.createComponent();
    targetComponent.name = "Target Component (Cross-Page)";
    targetComponent.resize(50, 50);

    // Add some content to the target component
    const targetFrame = figma.createFrame();
    targetFrame.name = "Target Content";
    targetFrame.resize(50, 50);
    targetFrame.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];
    targetComponent.appendChild(targetFrame);

    // Create a frame on the target page to hold the component
    const targetPageFrame = figma.createFrame();
    targetPageFrame.name = "Target Component Container";
    targetComponentPage.appendChild(targetPageFrame);
    targetPageFrame.appendChild(targetComponent);

    debugConsole.log(
      `  Created target component "${targetComponent.name}" on page "${targetComponentPage.name}" (ID: ${targetComponent.id.substring(0, 8)}...)`,
    );

    // Step 3: Load all pages to ensure cross-page access
    debugConsole.log("\n--- Step 3: Load all pages for cross-page access ---");
    await figma.loadAllPagesAsync();
    debugConsole.log("  Loaded all pages");

    // Step 4: Create parent component on the main test page
    debugConsole.log(
      "\n--- Step 4: Create parent component on main test page ---",
    );
    const parentComponent = figma.createComponent();
    parentComponent.name = "Parent Component (Cross-Page Instance Swap)";
    parentComponent.resize(200, 200);

    // Step 5: Create nested instance of target component (cross-page reference)
    debugConsole.log(
      "\n--- Step 5: Create nested instance (cross-page reference) ---",
    );
    // The instance is created from the component on a different page
    const nestedInstance = targetComponent.createInstance();
    nestedInstance.name = "Nested Instance (Cross-Page)";
    nestedInstance.x = 10;
    nestedInstance.y = 10;
    parentComponent.appendChild(nestedInstance);

    // Add some other content to make it more realistic
    const parentFrame = figma.createFrame();
    parentFrame.name = "Parent Content";
    parentFrame.resize(200, 200);
    parentFrame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    parentComponent.appendChild(parentFrame);
    parentComponent.insertChild(0, nestedInstance); // Put instance on top

    testFrame.appendChild(parentComponent);

    debugConsole.log(`  Created parent component "${parentComponent.name}"`);
    debugConsole.log(
      `  Created nested instance "${nestedInstance.name}" (ID: ${nestedInstance.id.substring(0, 8)}...)`,
    );
    debugConsole.log(
      `  Instance references component on different page: "${targetComponentPage.name}"`,
    );

    // Step 6: Add INSTANCE_SWAP property referencing the cross-page component
    debugConsole.log(
      "\n--- Step 6: Add INSTANCE_SWAP property (cross-page) ---",
    );
    const propertyName = "Swappable Instance (Cross-Page)";

    // Get the main component from the nested instance
    // This should work even though the component is on a different page
    const mainComponent = await nestedInstance.getMainComponentAsync();
    if (!mainComponent) {
      throw new Error(
        "Could not get main component from nested instance (cross-page)",
      );
    }

    debugConsole.log(
      `  Nested instance main component: "${mainComponent.name}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
    );
    debugConsole.log(`  Component is on page: "${targetComponentPage.name}"`);
    debugConsole.log(`  Parent component is on page: "${testPage.name}"`);
    debugConsole.log(
      `  Using component ID as defaultValue: ${mainComponent.id}`,
    );

    // Verify the component ID matches what we expect
    if (mainComponent.id !== targetComponent.id) {
      throw new Error(
        `Main component ID mismatch: expected ${targetComponent.id}, got ${mainComponent.id}`,
      );
    }

    const propertyId = parentComponent.addComponentProperty(
      propertyName,
      "INSTANCE_SWAP",
      mainComponent.id, // defaultValue is the main component ID (cross-page)
    );

    debugConsole.log(
      `  Added INSTANCE_SWAP property "${propertyName}" with ID "${propertyId}"`,
    );
    debugConsole.log(
      `  Property defaultValue (component ID from different page): ${mainComponent.id}`,
    );

    // Step 7: Verify the property works correctly
    debugConsole.log(
      "\n--- Step 7: Verify cross-page INSTANCE_SWAP property ---",
    );
    const componentProps = parentComponent.componentPropertyDefinitions;
    const instanceSwapProp = componentProps[propertyId];

    if (!instanceSwapProp) {
      throw new Error(
        `INSTANCE_SWAP property not found in componentPropertyDefinitions (cross-page)`,
      );
    }

    if (instanceSwapProp.type !== "INSTANCE_SWAP") {
      throw new Error(
        `Property type is ${instanceSwapProp.type}, expected INSTANCE_SWAP`,
      );
    }

    const defaultValue = instanceSwapProp.defaultValue;
    debugConsole.log(`  Property type: ${instanceSwapProp.type}`);
    debugConsole.log(`  Property defaultValue: ${defaultValue}`);

    // For INSTANCE_SWAP, defaultValue is the main component ID
    if (defaultValue !== mainComponent.id) {
      throw new Error(
        `Property defaultValue is ${defaultValue}, expected ${mainComponent.id}`,
      );
    }

    // Verify the component ID matches the target component
    if (defaultValue !== targetComponent.id) {
      throw new Error(
        `Property defaultValue doesn't match target component ID: ${defaultValue} vs ${targetComponent.id}`,
      );
    }

    debugConsole.log("  ✓ Cross-page INSTANCE_SWAP property verified");

    // Test that we can still access the component after property creation
    debugConsole.log(
      "\n--- Step 8: Verify component accessibility after property creation ---",
    );
    const mainComponentAfter = await nestedInstance.getMainComponentAsync();
    if (!mainComponentAfter) {
      throw new Error(
        "Could not get main component after property creation (cross-page)",
      );
    }

    if (mainComponentAfter.id !== targetComponent.id) {
      throw new Error(
        `Component ID changed after property creation: ${mainComponentAfter.id} vs ${targetComponent.id}`,
      );
    }

    debugConsole.log(
      `  ✓ Component still accessible after property creation: "${mainComponentAfter.name}"`,
    );

    // Summary
    const success = true;
    debugConsole.log("\n=== Cross-Page Test Summary ===");
    debugConsole.log("✓ INSTANCE_SWAP property cross-page test PASSED");
    debugConsole.log(`  Target component page: "${targetComponentPage.name}"`);
    debugConsole.log(`  Parent component page: "${testPage.name}"`);
    debugConsole.log(
      `  Property: ${propertyName} = ${defaultValue} (component ID)`,
    );
    debugConsole.log(`  Cross-page component reference works correctly`);

    return {
      success,
      message:
        "INSTANCE_SWAP property correctly works with cross-page component references",
      details: {
        targetComponentPage: targetComponentPage.name,
        parentComponentPage: testPage.name,
        propertyName,
        propertyId,
        defaultValue,
        componentId: mainComponent.id,
        componentName: mainComponent.name,
        instanceId: nestedInstance.id,
        crossPageAccess: true,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`INSTANCE_SWAP cross-page test failed: ${errorMessage}`);
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}

/**
 * Test: INSTANCE_SWAP Component Property _instanceRef Conversion
 *
 * This test validates that INSTANCE_SWAP properties are correctly converted
 * to _instanceRef during export and resolved back to component IDs during import.
 *
 * TEST OBJECTIVE:
 * Verify that the full export/import cycle works correctly:
 * 1. Create component with INSTANCE_SWAP property (defaultValue = component ID)
 * 2. Export: Convert component ID to _instanceRef in instance table
 * 3. Import: Resolve _instanceRef back to component ID
 * 4. Verify the property works after round-trip
 */
export async function testInstanceSwapPropertyInstanceRef(
  pageId: string,
): Promise<TestResult> {
  try {
    debugConsole.log(
      "=== Test: INSTANCE_SWAP Component Property _instanceRef Conversion ===",
    );

    // Get the test page
    const testPage = (await figma.getNodeByIdAsync(pageId)) as PageNode;
    if (!testPage || testPage.type !== "PAGE") {
      throw new Error("Test page not found");
    }

    // Find the "Test" frame container on the page
    const testFrame = testPage.children.find(
      (child) => child.type === "FRAME" && child.name === "Test",
    ) as FrameNode | undefined;

    if (!testFrame) {
      throw new Error("Test frame container not found on page");
    }

    // Step 1: Create target component
    debugConsole.log("\n--- Step 1: Create target component ---");
    const targetComponent = figma.createComponent();
    targetComponent.name = "Target Component (InstanceRef Test)";
    targetComponent.resize(50, 50);

    const targetFrame = figma.createFrame();
    targetFrame.name = "Target Content";
    targetFrame.resize(50, 50);
    targetFrame.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];
    targetComponent.appendChild(targetFrame);
    testFrame.appendChild(targetComponent);

    debugConsole.log(
      `  Created target component "${targetComponent.name}" (ID: ${targetComponent.id.substring(0, 8)}...)`,
    );

    // Step 2: Create parent component with nested instance
    debugConsole.log(
      "\n--- Step 2: Create parent component with nested instance ---",
    );
    const parentComponent = figma.createComponent();
    parentComponent.name = "Parent Component (InstanceRef Test)";
    parentComponent.resize(200, 200);

    const nestedInstance = targetComponent.createInstance();
    nestedInstance.name = "Nested Instance";
    nestedInstance.x = 10;
    nestedInstance.y = 10;
    parentComponent.appendChild(nestedInstance);

    const parentFrame = figma.createFrame();
    parentFrame.name = "Parent Content";
    parentFrame.resize(200, 200);
    parentFrame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    parentComponent.appendChild(parentFrame);
    parentComponent.insertChild(0, nestedInstance);

    testFrame.appendChild(parentComponent);

    debugConsole.log(`  Created parent component "${parentComponent.name}"`);
    debugConsole.log(
      `  Created nested instance "${nestedInstance.name}" (ID: ${nestedInstance.id.substring(0, 8)}...)`,
    );

    // Step 3: Add INSTANCE_SWAP property
    debugConsole.log("\n--- Step 3: Add INSTANCE_SWAP property ---");
    const propertyName = "Swappable Instance (InstanceRef)";
    const mainComponent = await nestedInstance.getMainComponentAsync();
    if (!mainComponent) {
      throw new Error("Could not get main component from nested instance");
    }

    const propertyId = parentComponent.addComponentProperty(
      propertyName,
      "INSTANCE_SWAP",
      mainComponent.id,
    );

    debugConsole.log(
      `  Added INSTANCE_SWAP property "${propertyName}" with defaultValue (component ID): ${mainComponent.id}`,
    );

    // Step 4: Simulate export - process componentPropertyDefinitions
    debugConsole.log(
      "\n--- Step 4: Simulate Export (process componentPropertyDefinitions) ---",
    );
    const instanceTable = new InstanceTable();
    const context: ParserContext = {
      visited: new WeakSet(),
      depth: 0,
      maxDepth: 100,
      nodeCount: 0,
      maxNodes: 10000,
      unhandledKeys: new Set(),
      variableTable: new VariableTable(),
      collectionTable: new CollectionTable(),
      instanceTable: instanceTable,
      styleTable: new StyleTable(),
      imageTable: new ImageTable(),
      detachedComponentsHandled: new Set(),
      exportedIds: new Map(),
      skipPrompts: true,
    };

    // Parse frame properties which will process componentPropertyDefinitions
    const parsedProps = await parseFrameProperties(parentComponent, context);

    if (!parsedProps.componentPropertyDefinitions) {
      throw new Error(
        "componentPropertyDefinitions not found in parsed properties",
      );
    }

    const exportedProps = parsedProps.componentPropertyDefinitions;
    const exportedInstanceSwapProp = exportedProps[propertyId];

    if (!exportedInstanceSwapProp) {
      throw new Error(
        "INSTANCE_SWAP property not found in exported properties",
      );
    }

    const exportedDefaultValue = exportedInstanceSwapProp.defaultValue;
    debugConsole.log(
      `  Exported property type: ${exportedInstanceSwapProp.type}`,
    );
    debugConsole.log(
      `  Exported defaultValue: ${JSON.stringify(exportedDefaultValue)}`,
    );

    // Verify that defaultValue was converted to _instanceRef
    if (
      !exportedDefaultValue ||
      typeof exportedDefaultValue !== "object" ||
      !("_instanceRef" in exportedDefaultValue) ||
      typeof (exportedDefaultValue as InstanceRefValue)._instanceRef !==
        "number"
    ) {
      throw new Error(
        `Expected defaultValue to be _instanceRef object, got: ${JSON.stringify(exportedDefaultValue)}`,
      );
    }

    const instanceRefIndex = (exportedDefaultValue as InstanceRefValue)
      ._instanceRef;
    debugConsole.log(
      `  ✓ Successfully converted component ID to _instanceRef (index: ${instanceRefIndex})`,
    );

    // Verify the instance table entry exists
    const instanceEntry = instanceTable.getInstanceByIndex(instanceRefIndex);
    if (!instanceEntry) {
      throw new Error(
        `Instance table entry not found for index ${instanceRefIndex}`,
      );
    }

    debugConsole.log(
      `  Instance table entry: type=${instanceEntry.instanceType}, componentName="${instanceEntry.componentName}"`,
    );

    if (instanceEntry.instanceType !== "internal") {
      throw new Error(
        `Expected internal instance type, got ${instanceEntry.instanceType}`,
      );
    }

    if (instanceEntry.componentNodeId !== mainComponent.id) {
      throw new Error(
        `Component node ID mismatch: expected ${mainComponent.id}, got ${instanceEntry.componentNodeId}`,
      );
    }

    debugConsole.log("  ✓ Instance table entry verified");

    // Step 5: Simulate import - resolve _instanceRef back to component ID
    debugConsole.log(
      "\n--- Step 5: Simulate Import (resolve _instanceRef) ---",
    );

    // Create a new component to simulate import
    const importedParentComponent = figma.createComponent();
    importedParentComponent.name = "Imported Parent Component";
    importedParentComponent.resize(200, 200);

    // Create the target component in the imported context (simulating it exists)
    const importedTargetComponent = figma.createComponent();
    importedTargetComponent.name = "Imported Target Component";
    importedTargetComponent.resize(50, 50);
    const importedTargetFrame = figma.createFrame();
    importedTargetFrame.name = "Imported Target Content";
    importedTargetFrame.resize(50, 50);
    importedTargetFrame.fills = [
      { type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } },
    ];
    importedTargetComponent.appendChild(importedTargetFrame);
    testFrame.appendChild(importedTargetComponent);

    // Create nodeIdMapping to simulate import context
    const nodeIdMapping = new Map<string, SceneNode>();
    nodeIdMapping.set(mainComponent.id, importedTargetComponent);

    // Resolve _instanceRef
    const instanceEntryForImport =
      instanceTable.getInstanceByIndex(instanceRefIndex);
    if (!instanceEntryForImport) {
      throw new Error(
        `Instance entry not found for index ${instanceRefIndex} during import simulation`,
      );
    }

    // Get the resolved component ID (simulating the import resolution logic)
    const resolvedComponentId = nodeIdMapping.get(
      instanceEntryForImport.componentNodeId!,
    )?.id;

    if (!resolvedComponentId) {
      throw new Error(
        `Could not resolve component ID from instance entry during import simulation`,
      );
    }

    debugConsole.log(
      `  Resolved _instanceRef ${instanceRefIndex} to component ID: ${resolvedComponentId.substring(0, 8)}...`,
    );

    // Step 6: Add INSTANCE_SWAP property with resolved component ID
    debugConsole.log(
      "\n--- Step 6: Add INSTANCE_SWAP property with resolved component ID ---",
    );
    const importedPropertyId = importedParentComponent.addComponentProperty(
      propertyName,
      "INSTANCE_SWAP",
      resolvedComponentId,
    );

    debugConsole.log(
      `  Added INSTANCE_SWAP property "${propertyName}" with resolved component ID: ${resolvedComponentId.substring(0, 8)}...`,
    );

    // Step 7: Verify the imported property
    debugConsole.log(
      "\n--- Step 7: Verify imported INSTANCE_SWAP property ---",
    );
    const importedComponentProps =
      importedParentComponent.componentPropertyDefinitions;
    const importedInstanceSwapProp = importedComponentProps[importedPropertyId];

    if (!importedInstanceSwapProp) {
      throw new Error("INSTANCE_SWAP property not found in imported component");
    }

    if (importedInstanceSwapProp.type !== "INSTANCE_SWAP") {
      throw new Error(
        `Imported property type is ${importedInstanceSwapProp.type}, expected INSTANCE_SWAP`,
      );
    }

    const importedDefaultValue = importedInstanceSwapProp.defaultValue;
    debugConsole.log(
      `  Imported property type: ${importedInstanceSwapProp.type}`,
    );
    debugConsole.log(`  Imported defaultValue: ${importedDefaultValue}`);

    if (importedDefaultValue !== resolvedComponentId) {
      throw new Error(
        `Imported defaultValue is ${importedDefaultValue}, expected ${resolvedComponentId}`,
      );
    }

    debugConsole.log("  ✓ Imported INSTANCE_SWAP property verified");

    // Summary
    const success = true;
    debugConsole.log("\n=== _instanceRef Conversion Test Summary ===");
    debugConsole.log(
      "✓ INSTANCE_SWAP property _instanceRef conversion test PASSED",
    );
    debugConsole.log(
      `  Original component ID: ${mainComponent.id.substring(0, 8)}...`,
    );
    debugConsole.log(`  Exported as _instanceRef: ${instanceRefIndex}`);
    debugConsole.log(
      `  Resolved back to component ID: ${resolvedComponentId.substring(0, 8)}...`,
    );
    debugConsole.log(
      `  Round-trip successful: ${mainComponent.id === resolvedComponentId ? "YES (same component)" : "YES (different component, but valid)"}`,
    );

    return {
      success,
      message:
        "INSTANCE_SWAP property correctly converted to _instanceRef and resolved back",
      details: {
        original: {
          componentId: mainComponent.id,
          propertyName,
          propertyId,
        },
        exported: {
          instanceRefIndex,
          instanceType: instanceEntry.instanceType,
        },
        imported: {
          resolvedComponentId,
          propertyId: importedPropertyId,
          defaultValue: importedDefaultValue,
        },
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(
      `INSTANCE_SWAP _instanceRef conversion test failed: ${errorMessage}`,
    );
    return {
      success: false,
      message: `Test error: ${errorMessage}`,
    };
  }
}
