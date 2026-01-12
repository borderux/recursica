import { Stack } from "../Stack";
import classes from "./ComponentList.module.css";

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
}

export interface ComponentListProps {
  /**
   * Array of components to display
   */
  components: ComponentInfo[];
  /**
   * Callback when a component is selected
   * @param component - The selected component
   */
  onSelect: (component: ComponentInfo) => void;
  /**
   * Optional className for the list container
   */
  className?: string;
}

/**
 * ComponentList - A reusable component for displaying a list of components
 *
 * Displays components in a clickable list format with:
 * - Component name (left-aligned, smaller, not bold)
 * - Version and publish date (right-aligned)
 *
 * Components are automatically sorted alphabetically by name.
 *
 * Used in:
 * - ImportMain page
 * - ImportWizard Step1ComponentSelection
 */
export function ComponentList({
  components,
  onSelect,
  className,
}: ComponentListProps) {
  if (components.length === 0) {
    return null;
  }

  // Sort components alphabetically by name
  const sortedComponents = [...components].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <Stack gap={8} className={`${classes.componentList} ${className || ""}`}>
      {sortedComponents.map((component) => (
        <button
          key={component.guid}
          type="button"
          onClick={() => onSelect(component)}
          className={classes.componentButton}
        >
          <div className={classes.componentName}>{component.name}</div>
          <div className={classes.componentVersion}>
            <div>Version: {component.version || "N/A"}</div>
            {component.publishDate && (
              <div>{new Date(component.publishDate).toLocaleDateString()}</div>
            )}
          </div>
        </button>
      ))}
    </Stack>
  );
}
