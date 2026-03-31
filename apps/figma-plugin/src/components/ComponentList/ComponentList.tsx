import { Stack } from "../Stack";
import { Checkbox } from "../Checkbox";
import { getComponentCleanName } from "../../plugin/utils/getComponentCleanName";
import classes from "./ComponentList.module.css";

/**
 * Component badge status
 */
export type ComponentBadgeStatus = "NEW" | "UPDATED" | "EXISTING";

/**
 * Component information interface
 * Matches the ComponentInfo type from githubService
 */
export interface ComponentInfo {
  guid: string;
  name: string;
  path: string;
  version: number;
  publishDate?: string;
  /**
   * Optional badge status to display (NEW, UPDATED, or EXISTING)
   * If not provided, no badge will be shown
   */
  badge?: ComponentBadgeStatus;
}

export interface ComponentListProps {
  /**
   * Array of components to display
   */
  components: ComponentInfo[];
  /**
   * Array of currently selected components
   */
  selectedComponents: ComponentInfo[];
  /**
   * Callback when selection changes
   * @param selected - The new array of selected components
   */
  onSelectionChange: (selected: ComponentInfo[]) => void;
  /**
   * Optional className for the list container
   */
  className?: string;
}

/**
 * ComponentList - A reusable component for displaying a list of components
 *
 * Displays components in a checkbox list format with:
 * - Checkbox (left-aligned)
 * - Component name (middle-aligned)
 * - Badge (right-aligned, optional: UPDATED, or EXISTING. NEW is hidden)
 *
 * Components are automatically sorted alphabetically by name.
 *
 * Used in:
 * - ImportMain page
 * - ImportWizard Step1ComponentSelection
 */
export function ComponentList({
  components,
  selectedComponents,
  onSelectionChange,
  className,
}: ComponentListProps) {
  if (components.length === 0) {
    return null;
  }

  // Sort components alphabetically by clean component name (case-insensitive, alphanumeric only)
  const sortedComponents = [...components].sort((a, b) => {
    const cleanA = getComponentCleanName(a.name).toLowerCase();
    const cleanB = getComponentCleanName(b.name).toLowerCase();
    return cleanA.localeCompare(cleanB);
  });

  const handleToggle = (component: ComponentInfo, isChecked: boolean) => {
    if (isChecked) {
      onSelectionChange([...selectedComponents, component]);
    } else {
      onSelectionChange(
        selectedComponents.filter((c) => c.guid !== component.guid),
      );
    }
  };

  return (
    <Stack gap={0} className={`${classes.componentList} ${className || ""}`}>
      {sortedComponents.map((component) => {
        const isSelected = selectedComponents.some(
          (c) => c.guid === component.guid,
        );
        return (
          <label key={component.guid} className={classes.componentItem}>
            <Checkbox
              checked={isSelected}
              onChange={(e) => handleToggle(component, e.currentTarget.checked)}
            />
            <div className={classes.componentName}>
              {getComponentCleanName(component.name)}
            </div>
          </label>
        );
      })}
    </Stack>
  );
}
