# `@recursica/adapter-common`

This package houses the shared, agnostic React components and structural hooks necessary to evaluate and render Recursica design-system primitives within broader UI toolkit adapters.

## Usage

This package is utilized internally by `@recursica/storybook-template` and structural adapters like `@recursica/adapter-mantine-v8` and `@recursica/adapter-mui-v7` (separate, independently-versioned repos, not packages in this monorepo).

```tsx
import { Layer, RecursicaThemeProvider } from "@recursica/adapter-common";
```
