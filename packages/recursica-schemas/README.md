# @borderux/recursica-schemas

This package is responsible for managing the JSON schemas and generating corresponding TypeScript type definitions for the project.

## Available Scripts

In the `packages/schemas` directory, you can run the following commands:

- `npm run lint`: Lints the files in the package.
- `npm run check-types`: Checks for TypeScript errors without emitting files.
- `npm run build`: Cleans the `dist` directory, generates TypeScript definitions from JSON schemas, and copies the schemas into the `dist` folder.
- `npm run test`: Runs type-checking and validates the JSON schemas.

## Build Output

The `npm run build` command generates the following output in the `dist` directory:

- **`dist/types/`**: Contains the generated TypeScript definition files (`.d.ts`). Each file corresponds to a JSON schema in the `src` directory, but the output structure is flattened.
- **`dist/schemas/`**: Contains the original JSON schema files, copied from the `src` directory with a flattened structure.
