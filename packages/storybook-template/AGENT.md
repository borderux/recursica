# AGENT.md — @recursica/storybook-template

This package provides shared Storybook configuration and templates used by all Recursica Storybook apps.

## Purpose

Centralizes Storybook setup so that multiple apps can share the same configuration, decorators, and parameters without duplicating boilerplate.

## Key Exports

```typescript
// Main config
import { createMainConfig } from "@recursica/storybook-template/configs/main";

// Preview config
import { createPreviewConfig } from "@recursica/storybook-template";

// Individual pieces
import { withProvider, withTheme } from "@recursica/storybook-template";
import {
  commonParameters,
  accessibilityParameters,
} from "@recursica/storybook-template";
```

## Key Files

| Path         | Purpose                                                   |
| ------------ | --------------------------------------------------------- |
| `templates/` | Template files for `.storybook/main.ts` and `preview.tsx` |
| `src/`       | Configuration factories, decorators, parameters           |

## Configuration Factories

### `createMainConfig(options)`

Options: `stories`, `addons`, `basePath`, `enableCORS`, `enablePostcssVars`, `recursicaCSSPath`, `postCSSStrictMode`

### `createPreviewConfig(options)`

Options: `defaultTheme`, `enableProvider`, `Provider`, `providerProps`, `enableThemeProvider`, `ThemeProvider`, `lightThemeClass`, `darkThemeClass`, `customParameters`

## Consumers

- `apps/recursica-storybook` — Storybook deployment app
- `packages/mantine-adapter` — Component Storybook

## Guidelines

- This package is framework-agnostic — it should work with Mantine, MUI, Chakra, or any provider-based UI framework
- Changes here affect all Storybook instances across the monorepo
