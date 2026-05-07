/**
 * Shared utility for checking the status of Recursica variable collections.
 */
export async function checkRecursicaVarCollectionsExist() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const hasTokens = collections.some((c) => c.name === "Tokens");
  const hasTheme = collections.some(
    (c) => c.name === "Theme" || c.name === "Themes",
  );
  const hasLayer = collections.some((c) => c.name === "Layer");

  return {
    hasTokens,
    hasTheme,
    hasLayer,
    isComplete: hasTokens && hasTheme && hasLayer,
  };
}
