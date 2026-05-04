# AGENT.md — @repo/typescript-config

This package provides shared TypeScript configurations (`tsconfig.json` presets) used by all packages and apps in the Recursica monorepo.

## Purpose

Centralizes TypeScript compiler options so that all packages extend a common base configuration rather than duplicating settings.

## Available Configs

| File                 | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `base.json`          | Base TypeScript configuration for all packages |
| `react-library.json` | Config preset for React library packages       |
| `nextjs.json`        | Config preset for Next.js applications         |

## Usage

Packages extend these configs in their `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## Guidelines

- Changes to `base.json` affect **every package and app** — review carefully
- Add new preset files for new framework patterns rather than bloating `base.json`
