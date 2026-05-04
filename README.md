# Recursica

Recursica is a comprehensive design system and component library that helps teams build consistent, beautiful user interfaces. It provides a set of reusable components, design tokens, and tools for seamless integration with Figma and various frontend frameworks.

This is a monorepo managed with [Turborepo](https://turborepo.com/) and [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces).

## Documentation

- **[Introduction](docs/INTRODUCTION.md)** — Purpose, philosophy, and core components of Recursica
- **[API CORS for Figma Plugins](docs/API-CORS-FOR-FIGMA-PLUGINS.md)** — CORS configuration for Figma plugin API calls

### Root-Level Docs

| Document                           | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to fork, contribute, and open pull requests                    |
| [RELEASES.md](RELEASES.md)         | Release process, changesets, and versioning                        |
| [PUBLISHING.md](PUBLISHING.md)     | Publishing architecture for npm packages and GitHub release assets |
| [TURBO.md](TURBO.md)               | Turborepo setup and configuration                                  |

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10.9.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/borderux/recursica.git
cd recursica
```

2. Install dependencies:

```bash
npm install
```

3. Build all packages:

```bash
npm run build
```

## Available Scripts

| Script                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run build`       | Build all packages and applications               |
| `npm run lint`        | Run ESLint across all packages                    |
| `npm run format`      | Format all files with Prettier                    |
| `npm run check-types` | Run TypeScript type checking                      |
| `npm run test`        | Run tests across all packages                     |
| `npm run precommit`   | Run type checking, linting, tests, and formatting |
| `npm run version`     | Update versions using Changesets                  |
| `npm run release`     | Publish packages to npm                           |
| `npm run simulate-ci` | Simulate a CI build locally                       |

## Project Structure

```
recursica/
├── apps/
│   ├── figma-plugin/          # Figma plugin for design token export
│   └── recursica-storybook/   # Storybook for component showcase
├── packages/
│   ├── adapter-common/        # Shared adapter primitives
│   ├── common/                # Shared utilities and types
│   ├── eslint-config/         # Shared ESLint configuration
│   ├── mantine-adapter/       # Mantine UI component library
│   ├── recursica-postcss-vars/# PostCSS plugin for CSS variable validation
│   ├── schemas/               # JSON schemas and TypeScript types
│   ├── storybook-template/    # Shared Storybook configuration
│   └── typescript-config/     # Shared TypeScript configurations
└── docs/                      # Project-wide documentation
```

### Apps

| App                                              | Package                   | Description                                                                     |
| ------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------- |
| [figma-plugin](apps/figma-plugin/)               | `@recursica/figma-plugin` | Figma plugin for exporting design tokens and assets from Figma to your codebase |
| [recursica-storybook](apps/recursica-storybook/) | `recursica-storybook`     | Storybook application for showcasing design tokens and components               |

### Packages

| Package                                                    | npm                                 | Description                                                                    |
| ---------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| [common](packages/common/)                                 | `@recursica/common`                 | Shared TypeScript interfaces and types for Recursica projects                  |
| [schemas](packages/schemas/)                               | `@recursica/schemas`                | JSON schemas and TypeScript type definitions for Recursica configuration       |
| [eslint-config](packages/eslint-config/)                   | `@repo/eslint-config`               | Shared ESLint configurations for consistent code style                         |
| [typescript-config](packages/typescript-config/)           | `@repo/typescript-config`           | Shared TypeScript configurations                                               |
| [storybook-template](packages/storybook-template/)         | `@recursica/storybook-template`     | Common Storybook configuration and templates                                   |
| [recursica-postcss-vars](packages/recursica-postcss-vars/) | `@recursica/recursica-postcss-vars` | PostCSS plugin to validate missing Recursica CSS variables against tokens JSON |

## Adapters

Adapters are the bridge between Recursica design tokens (exported from Figma) and a target UI framework. Each adapter processes design token JSON and generates framework-specific output — theme configurations, TypeScript types, CSS variables, and component code.

The **adapter-common** package provides shared, framework-agnostic component primitives and hooks that all adapters build on top of.

| Adapter                                      | Package                      | Description                                                            |
| -------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| [adapter-common](packages/adapter-common/)   | `@recursica/adapter-common`  | Shared agnostic design-system component primitives for all adapters    |
| [mantine-adapter](packages/mantine-adapter/) | `@recursica/mantine-adapter` | Mantine 8+ UI component library — the primary adapter for building UIs |

## Forge

[Recursica Forge](https://forge.recursica.com) is the official tool for managing Recursica JSON token files. Forge lives in a separate repository — visit [forge.recursica.com](https://forge.recursica.com) for documentation and access.

## Contributing

We welcome contributions of all kinds! Please see our [Contributing Guidelines](CONTRIBUTING.md) for how to get started. Each package and app may have its own `CONTRIBUTING.md` with additional guidelines — check the relevant directory before contributing.

## Development Tools

- [TypeScript](https://www.typescriptlang.org/) — Static type checking
- [ESLint](https://eslint.org/) — Code linting
- [Prettier](https://prettier.io) — Code formatting
- [Turborepo](https://turborepo.com/) — Monorepo build system
- [Changesets](https://github.com/changesets/changesets) — Version management and publishing
- [Husky](https://typicode.github.io/husky/) — Git hooks (pre-commit linting and formatting)

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
