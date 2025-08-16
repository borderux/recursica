# @recursica/common

Shared TypeScript interfaces and types for Recursica projects.

## Features

- **Parsers**: Utility functions for parsing and transforming data
- **Detectors**: Functions for detecting and analyzing data types
- **Strings**: String manipulation utilities
- **Validators**: JSON schema validation for Recursica files

## Validation

The package includes validation functions for Recursica JSON files based on the schemas defined in `@recursica/schemas`. Each validation function is in its own module for better organization.

### Usage

```typescript
import {
  validateVariables,
  validateConfiguration,
  validateIcons,
} from "@recursica/common";

// Use specific validation functions
const variablesResult = validateVariables(data);
const configResult = validateConfiguration(data);
const iconsResult = validateIcons(data);

// Check validation results
if (variablesResult.isValid) {
  console.log("Variables are valid!");
} else {
  console.log("Validation errors:", variablesResult.errors);
}
```

### Error Formatting

Validation errors are returned as plain text strings with clear location information using dot notation:

- **Root level errors**: `"root level: must have required property 'projectId'"`
- **Nested property errors**: `"tokens.color.primary: must have required property 'value'"`
- **Array index errors**: `"overrides.fontWeight.[0]: must be object"`

The error messages are designed to be:

- **Plain text** with no special characters or symbols
- **Location-aware** indicating the exact path to the error in the JSON structure using dot notation
- **Human-readable** with clear descriptions of what went wrong

### Validation Functions

- **`validateVariables(data)`** - Validates Recursica variables JSON files

  - Schema validation against the RecursicaVariables schema
  - **Specialized reference validation:**
    - UI Kit variables should NOT reference Tokens (only Themes)
    - Theme variables should ONLY reference Tokens (not other Themes)
  - Returns validation status and detailed error messages

- **`validateConfiguration(data)`** - Validates Recursica configuration JSON files
- **`validateIcons(data)`** - Validates Recursica icons JSON files

### Variable Reference Rules

The `validateVariables` function includes specialized checks for proper variable reference relationships:

1. **UI Kit Layer**: Should only reference variables from the **Themes** collection

   - ❌ Invalid: UI Kit → Tokens reference
   - ✅ Valid: UI Kit → Themes reference

2. **Themes Layer**: Should only reference variables from the **Tokens** collection

   - ❌ Invalid: Themes → Themes reference
   - ✅ Valid: Themes → Tokens reference

3. **Tokens Layer**: Contains direct values (no references)

This ensures a clean separation of concerns:

- **Tokens**: Raw design values (colors, sizes, etc.)
- **Themes**: Semantic design tokens that reference raw tokens
- **UI Kit**: Component-specific tokens that reference semantic themes

### Return Type

All validation functions return a `ValidationResult` object:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}
```

### Example

```typescript
import { validateVariables } from "@recursica/common";

const variablesData = {
  projectId: "my-project",
  pluginVersion: "1.0.0",
  tokens: {
    /* ... */
  },
  themes: {
    /* ... */
  },
  uiKit: {
    /* ... */
  },
};

const result = validateVariables(variablesData);

if (result.isValid) {
  console.log("✅ Variables file is valid");
} else {
  console.log("❌ Validation errors:", result.errors);
}
```

### Module Structure

The validation functions are organized in separate modules:

- `validators/validateVariables.ts` - Variables schema validation
- `validators/validateConfiguration.ts` - Configuration schema validation
- `validators/validateIcons.ts` - Icons schema validation
- `validators/index.ts` - Validators directory exports

### Scripts

The package includes utility scripts in the `scripts/` directory:

- `scripts/validate-sample.ts` - Sample file validation utility
  - Demonstrates validation capabilities
  - Provides detailed error reporting
  - Categorizes violations by type

## Installation

```bash
npm install @recursica/common
```

## Development

```bash
npm run build         # Build the package
npm run dev           # Watch mode for development
npm run lint          # Run ESLint
npm run check-types   # Type checking
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
npm run validate-sample # Validate sample variables file
```

## Testing

The package uses Vitest for unit testing. Tests are located alongside the source files with `.test.ts` extensions.

### Test Coverage

The validation functions have comprehensive test coverage including:

- Valid data validation
- Invalid data rejection
- Error message verification
- Edge cases and special scenarios
- **Real-world sample file validation** - Tests against actual Recursica JSON files

Run `npm run test:coverage` to see detailed coverage reports.

### Sample File Tests

The package includes comprehensive tests that validate against real Recursica JSON files:

- **Configuration files** (`recursica.json`) - Tests project configuration validation
- **Icon files** (`recursica-icons.json`) - Tests icon collection validation with SVG content
- **Variable files** (`recursica-bundle.json`) - Tests large-scale token and theme validation

These tests ensure that the validation functions work correctly with real-world data and can handle large files efficiently.

### Sample Validation Script

The package includes a utility script for validating sample files and demonstrating the validation capabilities:

```bash
npm run validate-sample
```

This script:

- **Loads and validates** the sample `recursica-bundle.json` file
- **Categorizes violations** by type (UI Kit → Tokens, Theme → Theme)
- **Provides detailed reporting** with summary statistics and individual error messages
- **Demonstrates real-world usage** of the validation functions

**Example Output:**

```
Validation Result: FAIL

Found 302 validation errors:

=== SUMMARY ===
UI Kit → Tokens violations: 117
Theme → Theme violations: 185
Total violations: 302

=== UI KIT → TOKENS VIOLATIONS (117) ===
1. uiKit.[UI-Kit][Mode-1][accordion/size/padding]: UI Kit variables should not reference Tokens collection, found reference to "size/spacer/2x"
2. uiKit.[UI-Kit][Mode-1][accordion/size/spacing]: UI Kit variables should not reference Tokens collection, found reference to "size/spacer/2x"
...

=== THEME → THEME VIOLATIONS (185) ===
1. themes.default.[Themes][Light][layers/layer-0/elements/interactive/color]: Theme variables should only reference Tokens collection, found reference to "colors/scale-1/default/tone" in Themes collection
2. themes.default.[Themes][Dark][layers/layer-0/elements/interactive/color]: Theme variables should only reference Tokens collection, found reference to "colors/scale-1/default/tone" in Themes collection
...
```

This script is useful for:

- **Development testing** - Quickly validate changes to the validation logic
- **Documentation** - Show real examples of validation errors
- **Debugging** - Identify specific issues in sample data
- **Demonstration** - Show the capabilities of the validation system
