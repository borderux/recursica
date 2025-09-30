# General Adapter Testing

This directory contains the test setup for the `@recursica/general-adapter` package.

## Test Script

The adapter uses a single test script that processes the real `recursica-bundle.json` file:

```bash
npm run test
```

This will:

1. Read the `recursica-bundle.json` file from the package root
2. Process it through the general adapter
3. Generate all output files to `test/output/`
4. Display detailed analysis of the generated files

## Test Output

The test generates the following files:

### Core Files

- `recursica-tokens.css` - Base design token variables
- `recursica.css` - UI Kit variables with all themes included

### Theme Files

- `recursica-light.theme.css` - Light theme variables
- `recursica-dark.theme.css` - Dark theme variables

### Configuration Files

- `.prettierignore` - Prettier ignore rules
- `icon_exports.ts` - Icon export definitions
- `icon_resource_map.ts` - Icon resource mapping

## Test Analysis

The test provides detailed analysis of each generated file:

- File size and line count
- Number of CSS variables in each file
- Sample content from key files

## Output Directory

All test output is written to `test/output/` and is automatically cleaned up before each test run. You'll see a "🧹 Cleaning previous test output..." message when the test starts.

## Git Ignore

The `test/output/` directory is ignored by Git to prevent committing generated test files.
