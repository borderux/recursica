# AGENT.md — @recursica/adapter-common

This package provides shared, framework-agnostic React components and structural hooks used by all Recursica adapters.

## Purpose

`adapter-common` is the foundation layer for all adapter packages. It contains primitives that are **not tied to any specific UI framework** (Mantine, MUI, etc.). Other adapters depend on this package and extend its primitives with framework-specific behavior.

## Key Exports

```tsx
import { Layer, RecursicaThemeProvider } from "@recursica/adapter-common";
```

## Key Files

| Path              | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `src/`            | Source components and hooks                      |
| `CONTRIBUTING.md` | Contribution guidelines specific to this package |
| `vite.config.ts`  | Vite library-mode build configuration            |
| `package.json`    | Package metadata and scripts                     |

## Consumers

This package is used internally by:

- `@recursica/mantine-adapter`
- `@recursica/storybook-template`

## Guidelines

- Components in this package must remain **framework-agnostic** — do not import from Mantine, MUI, or any other UI framework
- All exports should be generic primitives that any adapter can build on
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution rules
