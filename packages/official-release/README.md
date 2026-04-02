# Recursica General Adapter

The Recursica General Adapter is the core processing engine that converts Figma design tokens into production-ready code files. It serves as the bridge between Figma's design system and your development workflow, generating CSS variables, JavaScript lookup objects, TypeScript types, and React components.

## Purpose

The General Adapter is designed to:

1. **Process Figma Design Tokens**: Convert raw Figma variable exports into structured design tokens
2. **Generate Multiple Output Formats**: Create CSS, JavaScript, TypeScript, and React component files
3. **Support Theme Switching**: Enable dynamic theme changes through CSS custom properties
4. **Provide Type Safety**: Generate TypeScript definitions for all design tokens
5. **Enable Icon Integration**: Process and export SVG icons as React components
6. **Support Multiple Adapters**: Serve as the foundation for framework-specific adapters (Mantine, MUI, etc.)
7. **Provide Global Object Access**: Utilities to safely access the global `recursica` object in consuming applications

## Architecture

The adapter follows a three-layer architecture that mirrors the Recursica design system:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Kit Layer (Highest)                   │
│  Component-level variables that reference theme variables   │
│  Example: --button-color-background: var(--theme-primary)   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Theme Layer (Middle)                     │
│  Theme definitions that reference token variables          │
│  Example: --theme-primary: var(--color-salmon-600)         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Token Layer (Lowest)                     │
│  Base design tokens with actual CSS values                 │
│  Example: --color-salmon-600: #b1173b                      │
└─────────────────────────────────────────────────────────────┘
```

## Build Process

The adapter is built using Rollup with multiple output formats:

### Build Configuration

```javascript
// rollup.config.js
export default defineConfig([
  // Main package entry point (ES Module)
  {
    input: "./index.ts",
    output: {
      file: "./dist/index.js",
      sourcemap: true,
      exports: "auto",
    },
    plugins,
    external,
  },
  // CLI entry point (ES Module)
  {
    input: "./main.ts",
    output: {
      file: "./dist/main.js",
      format: "es",
      sourcemap: true,
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
    plugins,
    external,
  },
  // CLI entry point (CommonJS)
  {
    input: "./main.ts",
    output: {
      file: "./dist/main.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
    plugins,
    external,
  },
  // WebWorker for browser usage
  {
    input: "./webworker.ts",
    output: {
      file: "./dist/webworker.js",
      format: "es",
      sourcemap: false,
      exports: "auto",
    },
    plugins,
  },
]);
```

### Build Scripts

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "clean": "rm -rf dist",
    "test": "tsx test/test.ts"
  }
}
```

### Output Files

After building, the `dist/` directory contains:

- `index.js` - Main ES module for programmatic usage
- `main.js` - ES module CLI entry point
- `main.cjs` - CommonJS CLI entry point
- `webworker.js` - WebWorker for browser-based processing

## Usage by Recursica Plugin

The Figma plugin uses the General Adapter in two primary ways:

### 1. WebWorker Integration

The plugin dynamically loads the adapter as a WebWorker to process design tokens in the browser:

```typescript
// Figma plugin code
const adapterFile = await repositoryInstance.getSingleFile(
  selectedProject,
  adapterPath,
  targetBranch,
);

const worker = new Worker(
  URL.createObjectURL(new Blob([adapterFile], { type: "text/javascript" })),
);

worker.postMessage({
  bundledJson: jsonContent,
  iconsJson: iconsContent,
  project: config.project,
  srcPath: rootPath + "/src",
  rootPath,
  overrides: config.overrides,
  iconsConfig: config.icons,
});

worker.onmessage = (event) => {
  const files = event.data;
  // Process generated files and commit to repository
};
```

### 2. File Generation Workflow

The plugin follows this workflow:

1. **Export Design Tokens**: Extract variables and icons from Figma
2. **Load Adapter**: Fetch the appropriate adapter from the repository
3. **Process Tokens**: Run the adapter in a WebWorker
4. **Generate Files**: Create CSS, JavaScript, TypeScript, and React files
5. **Commit Changes**: Push generated files to the repository

## Generated Output

The adapter generates a comprehensive set of files:

### CSS Files

- `recursica-tokens.css` - Base design token variables
- `recursica.css` - Main UI Kit file (imports all other CSS files)
- `light-theme.css` - Light theme definition
- `dark-theme.css` - Dark theme definition

### JavaScript/TypeScript Files

- `recursica.js` - Type-safe lookup object for CSS-in-JS frameworks
- `recursica.d.ts` - Complete TypeScript definitions
- `icon_exports.ts` - React icon component exports (when icons are provided)
- `icon_resource_map.ts` - Icon resource mapping (when icons are provided)

### Configuration Files

- `.prettierignore` - Prettier ignore rules for generated files

## CLI Usage

### Installation

```bash
npm install @recursica/general-adapter
```

### Basic Usage

```bash
# Using npx (recommended)
npx @recursica/general-adapter

# Using npm script
npm run recursica

# Programmatic usage
import { runMain } from "@recursica/general-adapter";
await runMain();
```

### Configuration

Create a `recursica.json` file in your project root:

```json
{
  "$schema": "node_modules/@recursica/schemas/RecursicaConfiguration.json",
  "project": "YourProjectName",
  "srcPath": "./src",
  "bundledJson": "./design-tokens.json",
  "iconsJson": "./icons.json",
  "overrides": {
    "mantineTheme": {
      "1-scale": "rem",
      "background": "white"
    }
  },
  "iconsConfig": {
    "include": {
      "variants": ["Filled", "Outlined"]
    }
  }
}
```

## Programmatic API

### Core Functions

```typescript
import {
  processAdapter,
  runAdapter,
  processJsonContent,
  processIcons,
} from "@recursica/general-adapter";

// Process design tokens
const tokens = processJsonContent(bundledJsonContent, {
  project: "MyProject",
  overrides: undefined,
});

// Process icons
const icons = processIcons(iconsJsonContent);

// Run the adapter
const files = processAdapter({
  bundledJsonContent,
  project: "MyProject",
  overrides: undefined,
  rootPath: "./",
  srcPath: "./src",
  iconsJsonContent,
  iconsConfig: undefined,
});
```

### Types

```typescript
import type {
  ExportingResult,
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ThemeTokens,
  Themes,
} from "@recursica/general-adapter";

interface ExportingResult {
  content: string; // File content
  path: string; // Full file path
  filename: string; // Filename only
}
```

## Integration with Framework Adapters

The General Adapter serves as the foundation for framework-specific adapters:

### Mantine Adapter

```typescript
// packages/mantine-adapter/adapter/index.ts
import { runAdapter as runGeneralAdapter } from "@recursica/general-adapter";

export function runMantineAdapter(params) {
  // Generate general files
  const generalFiles = runGeneralAdapter(params);

  // Generate Mantine-specific files
  const mantineFiles = generateMantineTheme(params);

  return [...generalFiles, ...mantineFiles];
}
```

### Custom Adapters

You can create custom adapters by extending the general adapter:

```typescript
import { processAdapter, runAdapter } from "@recursica/general-adapter";

export function runCustomAdapter(params) {
  // Use the general adapter for core functionality
  const generalFiles = runAdapter(params);

  // Add custom file generation
  const customFiles = generateCustomFiles(params);

  return [...generalFiles, ...customFiles];
}
```

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development mode with watch
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Testing

The adapter includes comprehensive tests that verify:

- Token processing accuracy
- File generation correctness
- Theme switching functionality
- Icon processing (when provided)
- Error handling

```bash
npm test
```

## Architecture Benefits

### 1. Separation of Concerns

- **General Adapter**: Handles core token processing and file generation
- **Framework Adapters**: Add framework-specific functionality
- **Plugin Integration**: Provides WebWorker and CLI interfaces

### 2. Reusability

- Single codebase for all framework adapters
- Shared token processing logic
- Consistent file generation patterns

### 3. Extensibility

- Easy to add new output formats
- Simple to create framework-specific adapters
- Modular architecture supports custom generators

### 4. Performance

- WebWorker support for browser-based processing
- Efficient token processing algorithms
- Minimal bundle size for plugin integration

## Using the Global Recursica Object

This package provides utilities to safely access the global `recursica` object that should be available in your consuming application.

### Setup in Your Application

First, include the generated `recursica.js` file in your application:

```html
<!-- In your HTML -->
<script src="./path/to/recursica.js"></script>
```

Or import it in your JavaScript/TypeScript:

```javascript
// In your main application file
import "./path/to/recursica.js";
```

> **For Next.js users**: See the [Next.js Setup Guide](./docs/nextjs-setup.md) for detailed instructions on SSR support and proper setup.

### Using the Utilities

```typescript
import {
  getRecursica,
  hasRecursica,
  clearRecursicaCache,
  setRecursica,
  type RecursicaGlobal,
} from "@recursica/general-adapter";

// Check if recursica object is available
if (hasRecursica()) {
  const recursica = getRecursica();

  // Use the recursica object
  const primaryColor = recursica.tokens["color/salmon/600"];
  const buttonPadding =
    recursica.uiKit["button/size/default-horizontal-padding"];
  const lightTheme = recursica.themes.light;
}

// For testing or manual setup
const mockRecursica: RecursicaGlobal = {
  tokens: { "color/primary": "#ff0000" },
  uiKit: { "button/padding": "16px" },
  themes: { light: {}, dark: {} },
};
setRecursica(mockRecursica);

// Clear cache if needed (useful for hot reloading)
clearRecursicaCache();
```

### Type Safety

The package exports the `RecursicaObject` type for TypeScript users:

```typescript
import type { RecursicaObject } from "@recursica/general-adapter";

function useRecursica(): RecursicaObject {
  return getRecursica();
}
```

## License

MIT
