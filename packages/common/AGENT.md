# AGENT.md — @recursica/common

This package provides shared TypeScript interfaces, types, parsers, detectors, string utilities, and validators used across the Recursica monorepo.

## Purpose

`@recursica/common` is a utility library consumed by most other packages. It contains no UI components — only pure TypeScript logic.

## Key Areas

- `src/parsers/` — Utility functions for parsing and transforming data
- `src/detectors/` — Functions for detecting and analyzing data types
- `src/strings/` — String manipulation utilities
- `src/validators/` — JSON schema validation for Recursica files

## Validation

The package validates Recursica JSON files using schemas from `@recursica/schemas`:

- `validateVariables(data)` — Validates variable JSON files (includes reference-layer checks)
- `validateConfiguration(data)` — Validates `recursica.json` configuration files
- `validateIcons(data)` — Validates icon JSON files

### Variable Reference Rules

- Tokens — raw values (no references)
- Themes — must only reference Tokens
- UI Kit — must only reference Themes

## Scripts

- `npm run build` — Build the package
- `npm run dev` — Watch mode
- `npm run test` — Run tests (Vitest, watch mode)
- `npm run test:run` — Run tests once
- `npm run test:coverage` — Run tests with coverage
- `npm run validate-sample` — Validate sample variables file

## Guidelines

- This package must remain UI-free — no React components, no CSS.
- All exports should be pure functions or TypeScript types.
- See `CONTRIBUTING.md` for contribution rules.
