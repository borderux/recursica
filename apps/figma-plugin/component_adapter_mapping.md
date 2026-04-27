# Figma Plugin to Mantine-Adapter Component Review

This document provides a review of all UI components currently used within the `figma-plugin` app and maps them to the available replacements in the `mantine-adapter` package.

## 1. Direct Replacements Available 🟢

These components have exact or near-exact replacements in the `mantine-adapter` and are ready to be migrated.

| Figma Plugin App Component | Mantine-Adapter Component | Notes                                   |
| -------------------------- | ------------------------- | --------------------------------------- |
| `Avatar`                   | `Avatar`                  | Exact match                             |
| `Badge`                    | `Badge`                   | Exact match                             |
| `Button`                   | `Button`                  | Exact match                             |
| `Card`                     | `Card`                    | Exact match (uses `Paper` internally)   |
| `Center`                   | `Flex` or `Stack`         | Architectural replacement               |
| `Checkbox`                 | `Checkbox`                | Exact match                             |
| `Container`                | `Container`               | Exact match                             |
| `Group`                    | `Group`                   | Exact match                             |
| `LoadingSpinner`           | `Loader`                  | Naming difference                       |
| `Radio`                    | `Radio`                   | Exact match                             |
| `Select`                   | `Dropdown`                | Naming difference                       |
| `Stack`                    | `Stack`                   | Exact match                             |
| `Text`                     | `Text`                    | Exact match                             |
| `Textarea`                 | `TextArea`                | Case difference in adapter (`TextArea`) |
| `TextInput`                | `TextField`               | Naming difference                       |
| `Title`                    | `Title`                   | Exact match                             |

## 2. Permitted Direct Mantine Usage 🟡

These UI components are used directly from `@mantine/core` because they do not have a corresponding implementation defined in the Recursica design system. They are safe to use directly.

| Figma Plugin App Component | Notes                                                   |
| -------------------------- | ------------------------------------------------------- |
| `Alert`                    | Not defined in Recursica; use `@mantine/core` directly. |

## 3. App-Specific (No Adapter Equivalent Expected) ⚪

These are composite, app-level components that combine multiple primitive components to build higher-level features specifically for the Figma Plugin. They do not need to be ported to `mantine-adapter`.

- `ComponentList`
- `DebugConsole`
- `PageLayout`
- `PluginPrompt`
- `Profile`
- `VariableInput`
- `VersionHistory`

## Summary of Next Steps

1. **Refactors:** Replace uses of primitive Mantine components with their adapter equivalents (e.g., `Select` -> `Dropdown`, `TextInput` -> `TextField`, `Textarea` -> `TextArea`, and migrating over the layout elements like `Container`, `Stack`, `Group`, etc.). Replace `Center` usage with `Flex` or `Stack` wrappers.
2. **Direct Usage:** Continue using `Alert` directly from `@mantine/core` since there's no Recursica adapter equivalent planned.
