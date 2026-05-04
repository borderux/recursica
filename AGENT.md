# AGENT.md — Recursica Monorepo

This document is the entry point for AI agents operating in the Recursica monorepo. Use it to understand the repo structure and quickly locate the code, documentation, and tooling for any package or app.

## Rules

These rules apply to all AI agents working in this repository.

- Before making changes to any package or app, read its `AGENT.md` and `CONTRIBUTING.md` first.
- Read any supplemental docs referenced by those files (e.g. `USAGE.md`, `PHILOSOPHY.md`) before modifying code.
- Do not create fallbacks, default values, or silent error handling unless explicitly requested by the developer. Code should fail hard and visibly so issues are caught early.
- Do not swallow exceptions. Do not catch and rethrow unless necessary or requested by the developer. Let exceptions propagate naturally.
- Be concise. Do not add verbose comments, excessive logging, or unnecessary abstractions.
- All `AGENT.md` files use simple formatting — plain bullets, headers, and short paragraphs. No tables, no complex markdown. Keep them easy for agents to parse.

## Repo Overview

Recursica is a design system and component library monorepo. It uses **Turborepo** for task orchestration and **npm workspaces** for dependency management. All packages live under `packages/` and all applications live under `apps/`.

- **Root config:** `recursica.json`, `turbo.json`, `package.json`
- **Node version:** >= 20
- **Package manager:** npm >= 10.9.0
- **Build:** `npm run build` (delegates to Turborepo)
- **Lint:** `npm run lint`
- **Test:** `npm run test`
- **Type check:** `npm run check-types`

## Repository Map

```
recursica/
├── apps/
│   ├── figma-plugin/              → @recursica/figma-plugin
│   └── recursica-storybook/       → recursica-storybook
├── packages/
│   ├── adapter-common/            → @recursica/adapter-common
│   ├── common/                    → @recursica/common
│   ├── eslint-config/             → @repo/eslint-config
│   ├── mantine-adapter/           → @recursica/mantine-adapter
│   ├── recursica-postcss-vars/    → @recursica/recursica-postcss-vars
│   ├── schemas/                   → @recursica/schemas
│   ├── storybook-template/        → @recursica/storybook-template
│   └── typescript-config/         → @repo/typescript-config
├── docs/
│   ├── INTRODUCTION.md
│   └── API-CORS-FOR-FIGMA-PLUGINS.md
├── scripts/                       → CI/CD and release scripts
├── CONTRIBUTING.md
├── RELEASES.md
├── PUBLISHING.md
└── TURBO.md
```

## Apps

| Directory                   | Package Name              | Purpose                                                                                                  |
| --------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `apps/figma-plugin/`        | `@recursica/figma-plugin` | Figma plugin for exporting design tokens and assets. Has its own [AGENT.md](apps/figma-plugin/AGENT.md). |
| `apps/recursica-storybook/` | `recursica-storybook`     | Storybook app for showcasing components and design tokens.                                               |

## Core Packages

| Directory                          | Package Name                        | Purpose                                                                                                |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `packages/common/`                 | `@recursica/common`                 | Shared TypeScript interfaces and types used across the monorepo.                                       |
| `packages/schemas/`                | `@recursica/schemas`                | JSON schemas and generated TypeScript type definitions for Recursica configuration (`recursica.json`). |
| `packages/storybook-template/`     | `@recursica/storybook-template`     | Shared Storybook configuration and templates used by Storybook apps.                                   |
| `packages/recursica-postcss-vars/` | `@recursica/recursica-postcss-vars` | PostCSS plugin that validates missing Recursica CSS variables against a tokens JSON.                   |

## Shared Config Packages

| Directory                     | Package Name              | Purpose                                                   |
| ----------------------------- | ------------------------- | --------------------------------------------------------- |
| `packages/eslint-config/`     | `@repo/eslint-config`     | Shared ESLint configuration for all packages and apps.    |
| `packages/typescript-config/` | `@repo/typescript-config` | Shared `tsconfig.json` presets for all packages and apps. |

## Adapters

Adapters convert Recursica design tokens (exported from Figma as JSON) into framework-specific code: themes, types, CSS variables, and components. If you need to work on how tokens are consumed, this is where to look.

| Directory                   | Package Name                 | Purpose                                                                                                    |
| --------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `packages/adapter-common/`  | `@recursica/adapter-common`  | Framework-agnostic component primitives and hooks shared by all adapters.                                  |
| `packages/mantine-adapter/` | `@recursica/mantine-adapter` | Primary adapter — Mantine 8+ component library. Has its own [AGENT.md](packages/mantine-adapter/AGENT.md). |

`adapter-common` provides shared primitives. `mantine-adapter` depends on it and extends with Mantine-specific behavior.

## Forge

[Recursica Forge](https://forge.recursica.com) is the official tool for managing Recursica JSON token files. It lives in a **separate repository** — it is not part of this monorepo. Visit [forge.recursica.com](https://forge.recursica.com) for documentation and access.

## Per-Package Documentation

Many packages and apps contain their own documentation. Always check the target directory for these files before making changes:

| File              | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `README.md`       | Package overview, installation, and usage |
| `AGENT.md`        | Agent-specific routing and guidelines     |
| `CONTRIBUTING.md` | Package-specific contribution guidelines  |

Every package and app has its own `AGENT.md`. Read it before making changes:

- [`apps/figma-plugin/AGENT.md`](apps/figma-plugin/AGENT.md)
- [`apps/recursica-storybook/AGENT.md`](apps/recursica-storybook/AGENT.md)
- [`packages/adapter-common/AGENT.md`](packages/adapter-common/AGENT.md)
- [`packages/common/AGENT.md`](packages/common/AGENT.md)
- [`packages/eslint-config/AGENT.md`](packages/eslint-config/AGENT.md)
- [`packages/mantine-adapter/AGENT.md`](packages/mantine-adapter/AGENT.md)
- [`packages/recursica-postcss-vars/AGENT.md`](packages/recursica-postcss-vars/AGENT.md)
- [`packages/schemas/AGENT.md`](packages/schemas/AGENT.md)
- [`packages/storybook-template/AGENT.md`](packages/storybook-template/AGENT.md)
- [`packages/typescript-config/AGENT.md`](packages/typescript-config/AGENT.md)

### Packages with their own CONTRIBUTING.md

- [`packages/adapter-common/CONTRIBUTING.md`](packages/adapter-common/CONTRIBUTING.md)
- [`packages/common/CONTRIBUTING.md`](packages/common/CONTRIBUTING.md)
- [`packages/mantine-adapter/CONTRIBUTING.md`](packages/mantine-adapter/CONTRIBUTING.md)

## Root Documentation Index

| Document                                                                 | Description                                          |
| ------------------------------------------------------------------------ | ---------------------------------------------------- |
| [README.md](README.md)                                                   | Project overview and quickstart                      |
| [CONTRIBUTING.md](CONTRIBUTING.md)                                       | Fork-and-PR workflow, changeset usage                |
| [RELEASES.md](RELEASES.md)                                               | Versioning and release process (npm + GitHub assets) |
| [PUBLISHING.md](PUBLISHING.md)                                           | Publishing architecture for CI/CD                    |
| [TURBO.md](TURBO.md)                                                     | Turborepo configuration and caching                  |
| [docs/INTRODUCTION.md](docs/INTRODUCTION.md)                             | Purpose, philosophy, and design principles           |
| [docs/API-CORS-FOR-FIGMA-PLUGINS.md](docs/API-CORS-FOR-FIGMA-PLUGINS.md) | CORS setup for Figma plugin API calls                |

## Quick Reference

- **To build everything:** `npm run build`
- **To lint everything:** `npm run lint`
- **To test everything:** `npm run test`
- **To type-check everything:** `npm run check-types`
- **To format everything:** `npm run format`
- **To create a changeset:** `npx changeset`
