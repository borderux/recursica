/**
 * Clean a component name to only allow alphanumeric, underscore, dash, or space characters
 */
export function getComponentName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
