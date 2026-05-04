# AGENT.md — @repo/eslint-config

This package provides the shared ESLint configuration used by all packages and apps in the Recursica monorepo.

## Purpose

Centralizes ESLint rules so that all packages and apps share a single, consistent linting configuration. Individual packages extend this config via their own `eslint.config.mjs`.

## Key Files

| Path           | Purpose          |
| -------------- | ---------------- |
| `package.json` | Package metadata |

## Usage

Packages and apps reference this config in their `eslint.config.mjs`:

```js
import config from "@repo/eslint-config";
export default [...config];
```

## Guidelines

- Changes to this package affect **every package and app** in the monorepo — lint changes should be reviewed carefully
- Do not add package-specific rules here; those belong in the individual package's `eslint.config.mjs`
