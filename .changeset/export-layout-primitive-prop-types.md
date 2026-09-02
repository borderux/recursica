---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Export the prop types for the structural layout primitives (`FlexProps`, `GridProps`, `GridColProps`, `GroupProps`, `StackProps`, `ContainerProps`, `LinkProps`, `TextProps`) from each adapter's public entry point. These components were exported as values but their prop types were unreachable, so consumers could not type their own wrappers/props against them (e.g. `import type { FlexProps }`).
