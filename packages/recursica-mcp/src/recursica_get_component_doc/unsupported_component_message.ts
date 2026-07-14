/**
 * Generates the generic error message when a component does not have usage details
 * for a detected/specified adapter and is currently not supported.
 */
export function getUnsupportedComponentMessage(
  componentName: string,
  adapterName: string,
): string {
  return `❌ Error: The component "${componentName}" does not have usage details for the "${adapterName}" adapter and is currently not supported.`;
}
