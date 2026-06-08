export const no_match_fallback = `### 🔍 No Specific Component Matched Directly

We scanned common patterns but couldn't find a direct component mapping for this specific description. Here is what you should do:

1. **Check the Full List**: Use tool \`recursica_list_components\` to check all available UI components in your active adapters.
2. **Fallback Rules**: If the required layout is highly custom, compose it using general primitives like \`<Flex>\`, \`<Stack>\`, or \`<Group>\` and custom native HTML blocks.
3. **Pausing Integration / Contributing**: According to Recursica guidelines, if the adapter does not yet implement a required component, the best approach is to pause integration, open the adapter package (e.g. \`packages/mantine-adapter\`), and contribute the missing wrapper component following its \`CONTRIBUTING.md\` guidelines.\n`;
