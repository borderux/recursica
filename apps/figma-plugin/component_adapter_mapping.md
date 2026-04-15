# Figma Plugin to Mantine-Adapter Component Review

This document provides a review of all UI components currently used within the `figma-plugin` app and maps them to the available replacements in the `mantine-adapter` package.

## 1. Direct Replacements Available 🟢

These components have exact or near-exact replacements in the `mantine-adapter` and are ready to be migrated.

| Figma Plugin App Component | Mantine-Adapter Component | Notes                                   |
| -------------------------- | ------------------------- | --------------------------------------- |
| `Badge`                    | `Badge`                   | Exact match                             |
| `Button`                   | `Button`                  | Exact match                             |
| `Card`                     | `Card`                    | Exact match                             |
| `Checkbox`                 | `Checkbox`                | Exact match                             |
| `Textarea`                 | `TextArea`                | Case difference in adapter (`TextArea`) |
| `TextInput`                | `TextField`               | Naming difference                       |
| `LoadingSpinner`           | `Loader`                  | Naming difference                       |

## 2. In Adapter, but Needs Export 🟡

These components exist in the `mantine-adapter/src/components` directory but are **not currently exported** in `mantine-adapter/src/components/index.ts`. We just need to add the `export *` lines.

| Figma Plugin App Component | Mantine-Adapter Component |
| -------------------------- | ------------------------- |
| `Title`                    | `Title`                   |
| `Text`                     | `Text`                    |

## 3. Missing in Adapter 🔴

These UI components are used in the Figma plugin (mostly direct mappings to `@mantine/core`) but have no corresponding implementation in the `mantine-adapter`.

| Figma Plugin App Component | Status / Notes                                                               |
| -------------------------- | ---------------------------------------------------------------------------- |
| `Alert`                    | Missing entirely in `mantine-adapter`.                                       |
| `Select`                   | Mantine adapter has a `Dropdown` skeleton component but no `Select` wrapper. |
| `Container`                | Missing. Used heavily for layout.                                            |
| `Group`                    | Missing. Used heavily for flex layout.                                       |
| `Stack`                    | Missing. Used heavily for flex layout.                                       |

## 4. App-Specific (No Adapter Equivalent Expected) ⚪

These are composite, app-level components that combine multiple primitive components to build higher-level features specifically for the Figma Plugin. They do not need to be ported to `mantine-adapter`.

- `ComponentList`
- `DebugConsole`
- `PageLayout`
- `PluginPrompt`
- `Profile`
- `VariableInput`
- `VersionHistory`

## Summary of Next Steps

1. **Easy Wins:** Update `mantine-adapter/src/components/index.ts` to export `Text` and `Title`.
2. **Refactors:** Replace uses of `TextInput`, `Textarea`, and `LoadingSpinner` with their adapter equivalents (`TextField`, `TextArea`, `Loader`).
3. **Missing Features to build in Adapter:** Implement wrappers for `Alert`, `Select`, `Container`, `Group`, and `Stack` in the `mantine-adapter` so we can fully detach the plugin from `@mantine/core`.
