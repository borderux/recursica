# AGENT.md — @recursica/adapter-common

This package provides shared, framework-agnostic React components and structural hooks used by all Recursica adapters.

## Purpose

`adapter-common` is the foundation layer for all adapter packages. It contains primitives that are not tied to any specific UI framework (no specific UI kit). Other adapters depend on this package and extend its primitives with framework-specific behavior.

## Key Exports

```tsx
import { Layer, RecursicaThemeProvider } from "@recursica/adapter-common";
```

## Consumers

- Recursica UI-kit adapters — separate, independently-versioned repos, not packages in this monorepo
- `@recursica/storybook-template`

## Guidelines

- Components in this package must remain framework-agnostic — do not import from any UI framework or UI kit.
- **Never name specific adapters or UI kits in documentation or comments.** Keep all docs, READMEs, `llms.txt`, and code comments in this package generic ("every adapter", "the underlying UI kit", "the source-of-truth adapter"). Specific adapter names and repo links belong in the adapters' own repos or in the root monorepo docs, not here. The exception is `CHANGELOG.md`, which is historical and generated.
- All exports should be generic primitives that any adapter can build on.
- See `CONTRIBUTING.md` for contribution rules.
