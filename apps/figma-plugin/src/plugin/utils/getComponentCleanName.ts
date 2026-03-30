/**
 * Clean a component name to only allow alphanumeric characters, spaces, underscores, and dashes
 * This is used for matching names later on
 */
export function getComponentCleanName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s_-]/g, "");
}
