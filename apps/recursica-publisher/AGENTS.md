# Recursica Publisher — Agent Rules

- Rules in this file should be brief bullets with no code examples

## Figma Plugin API

- This plugin uses `documentAccess: "dynamic-page"` — always use **async** Figma API methods (e.g., `getMainComponentAsync()`, `getNodeByIdAsync()`, `getVariableByIdAsync()`) instead of synchronous equivalents, which will throw at runtime.

## Setting Properties on Figma Nodes

- Many node properties (fills, strokes, effects, etc.) are read-only objects — never mutate them in place
- Always **clone** the data before modifying, then reassign the full property back to the node
- Prefer Figma API methods (e.g., `setBoundVariable()`, `setPluginData()`) over direct property assignment when available

## UI Components

- Always use the project's `Button` component from `src/components/Button` — do not use Mantine's `Button` directly
- Do not override Button styles with `color`, `size`, or inline `style` props — use the component's defaults
