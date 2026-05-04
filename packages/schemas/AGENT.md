# AGENT.md — @recursica/schemas

This package manages JSON schemas and generates corresponding TypeScript type definitions for the Recursica design system.

## Purpose

`@recursica/schemas` is the single source of truth for the structure of all Recursica JSON files (`recursica.json`, variables bundles, icon files, etc.). Other packages — especially `@recursica/common` — use these schemas for validation.

## Key Files

| Path                       | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `src/`                     | JSON schema source files                       |
| `dist/types/`              | Generated TypeScript `.d.ts` files (flattened) |
| `dist/schemas/`            | Copied JSON schema files (flattened)           |
| `scripts/`                 | Build scripts for schema-to-type generation    |
| `lib/`                     | Shared build utilities                         |
| `tsconfig.validators.json` | TypeScript config for validator generation     |

## Scripts

- `npm run build` — Clean `dist/`, generate TypeScript definitions from JSON schemas, copy schemas to `dist/`
- `npm run lint` — Lint the package
- `npm run check-types` — TypeScript type checking
- `npm run test` — Run type-checking and validate schemas

## Usage by Other Packages

```typescript
// Import a schema
import mySchema from "@recursica/schemas/MySchema.json";

// Import a generated type
import { MyType } from "@recursica/schemas/types";
```

## Guidelines

- When adding a new Recursica JSON format, add the schema in `src/` — the build will auto-generate the corresponding TypeScript types
- Do not manually edit files in `dist/` — they are generated
- Schema changes may require corresponding updates in `@recursica/common` validators
