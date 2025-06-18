# Recursica Mantine Adapter

A design token adapter that converts Figma design tokens exported via the Recursica Figma plugin into Mantine theme files, TypeScript types, and Vanilla Extract CSS-in-JS themes.

## What is Recursica Mantine Adapter

The Recursica Mantine Adapter processes design token JSON files and generates:

- **Mantine Theme**: Complete Mantine theme configuration with colors, typography, spacing, and more
- **Vanilla Extract Themes**: CSS-in-JS theme files with contract-based theme switching
- **TypeScript Types**: Type-safe interfaces for colors, spacers, border radius, and other tokens
- **React Components**: Ready-to-use Icon components with proper TypeScript definitions
- **UI Kit Objects**: Structured objects containing all design system primitives

## Installation

```bash
npm install @recursica/mantine-adapter
```

## Usage

### Option 1: Using npx (Recommended)

Run the adapter directly without installation:

```bash
npx @recursica/mantine-adapter
```

### Option 2: Adding a script to package.json

Add the recursica command to your package.json scripts:

```json
{
  "scripts": {
    "recursica": "recursica"
  }
}
```

Then run:

```bash
npm run recursica
```

### Option 3: Programmatic Usage

```typescript
import { runMain } from "@recursica/mantine-adapter";

await runMain();
```

## Configuration

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
    },
    "fontWeight": [
      {
        "fontFamily": "Inter",
        "value": 400,
        "alias": "regular"
      }
    ]
  },
  "iconsConfig": {
    "include": {
      "variants": ["Filled", "Outlined"]
    },
    "exclude": {
      "names": ["deprecated_icon"]
    }
  }
}
```

### Configuration Options

- `project`: Must match the project name in your exported JSON files
- `srcPath`: Output directory for generated files (default: `./src`)
- `bundledJson`: Path to your design tokens JSON file
- `iconsJson`: Path to your icons JSON file (optional)
- `overrides`: Custom overrides for theme generation
- `iconsConfig`: Configuration for icon filtering and processing

## Generated Files

The adapter generates the following file structure in `{srcPath}/recursica/`:

```
src/
└── recursica/
    ├── Recursica.ts                           # Main theme object
    ├── RecursicaTokens.ts                     # Base design tokens
    ├── RecursicaContractTheme.css.ts          # Vanilla Extract contract
    ├── RecursicaThemes.css.ts                 # Theme implementations
    ├── RecursicaMantineTheme.ts               # Mantine theme config
    ├── RecursicaColorsType.ts                 # Color type definitions
    ├── RecursicaSpacersType.ts                # Spacing type definitions
    ├── RecursicaBorderRadiusType.ts           # Border radius types
    ├── RecursicaUiKit.ts                      # UI Kit components object
    └── components/
        └── Icons/
            ├── Icon.tsx                       # Main Icon component
            ├── icon_exports.ts                # React icon components
            ├── icon_resource_map.ts           # Icon name mappings
            └── Svg/                           # SVG icon files
                ├── icon1.svg
                └── icon2.svg
```

## Icon Component Usage

The generated Icon component provides type-safe icon usage:

```tsx
import { Icon } from './recursica/components/Icons/Icon';
import type { RecursicaColors } from './recursica/RecursicaColorsType';

// Basic usage
<Icon name="check_Filled" />

// With custom size and color
<Icon
  name="arrow_back_ios_new_Outlined"
  size={32}
  color="primary-500"
/>

// Available props
interface IconProps {
  name: IconName;                              // Autocompleted icon names
  size?: 16 | 20 | 24 | 32 | 40 | 48 | "100%"; // Predefined sizes
  title?: string;                              // Accessibility title
  color?: RecursicaColors;                     // Theme colors
}
```

## Using with Webworker

For browser-based token processing, use the webworker implementation:

### 1. Setup the Worker

```typescript
// worker.ts
import "@recursica/mantine-adapter/dist/webworker.js";
```

### 2. Process Tokens in Main Thread

```typescript
// main.ts
interface WorkerMessage {
  bundledJson: string; // JSON content as string
  iconsJson?: string; // Icons JSON content as string
  project: string; // Project name
  srcPath: string; // Output path
  rootPath: string; // Root project path
  overrides?: any; // Theme overrides
  iconsConfig?: any; // Icons configuration
}

// Create and use worker
const worker = new Worker("./worker.js");

worker.postMessage({
  bundledJson: jsonFileContent,
  iconsJson: iconsJsonContent,
  project: "YourProject",
  srcPath: "./src",
  rootPath: "./",
  overrides: undefined,
  iconsConfig: undefined,
});

worker.onmessage = (event) => {
  const files = event.data;
  // Process generated files
  console.log("Generated files:", files);

  // Files structure matches the CLI output:
  // - files.recursicaTokens
  // - files.vanillaExtractThemes
  // - files.mantineTheme
  // - files.uiKitObject
  // - files.recursicaObject
  // - files.colorsType
  // - files.iconsObject
  // etc.
};
```

### 3. Handle Worker Response

```typescript
interface WorkerResponse {
  recursicaTokens: ExportingResult;
  vanillaExtractThemes: VanillaExtractThemesOutput;
  mantineTheme: GenerateMantineThemeOutput;
  uiKitObject: ExportingResult;
  recursicaObject: ExportingResult;
  colorsType: ExportingResult;
  spacersType: ExportingResult;
  borderRadiusType: ExportingResult;
  iconsObject?: GenerateIconsOutput;
  recursicaThemes: ExportingResult;
  prettierignore: ExportingResult;
}

interface ExportingResult {
  content: string; // File content
  path: string; // Full file path
  filename: string; // Filename only
}
```

## Creating Custom Adapters

To create your own adapter, you need to implement the core generator functions. The adapter architecture is modular and extensible.

### 1. Adapter Structure

```typescript
// your-adapter/index.ts
import type {
  RecursicaConfigOverrides,
  RecursicaConfigIcons,
  ExportingResult,
} from "@recursica/mantine-adapter";

interface CustomAdapterParams {
  overrides: RecursicaConfigOverrides | undefined;
  rootPath: string;
  srcPath: string;
  project: string;
  icons: Record<string, string>;
  iconsConfig: RecursicaConfigIcons | undefined;
  processTokens: ProcessTokens;
}

export function runCustomAdapter(params: CustomAdapterParams) {
  // Your custom generation logic here
  return {
    // Return ExportingResult objects for each file you want to generate
    customTheme: generateCustomTheme(params),
    customTypes: generateCustomTypes(params),
    // ... other generators
  };
}
```

### 2. Individual Generators

Each generator should follow this pattern:

```typescript
// generateCustomTheme.ts
import type {
  ExportingResult,
  ExportingProps,
} from "@recursica/mantine-adapter";

export function generateCustomTheme(
  tokens: Record<string, any>,
  exportingProps: ExportingProps,
): ExportingResult {
  const { outputPath, project } = exportingProps;

  const filename = `${project}CustomTheme.ts`;
  const path = `${outputPath}/${filename}`;

  const content = `
// Auto-generated custom theme
export const customTheme = ${JSON.stringify(tokens, null, 2)};
  `.trim();

  return {
    content,
    path,
    filename,
  };
}
```

### 3. Available Generator Templates

The mantine-adapter provides several generator templates you can extend:

- `generateRecursicaTokens`: Base token generation
- `generateVanillaExtractThemes`: CSS-in-JS theme generation
- `generateMantineTheme`: Mantine-specific theme generation
- `generateColorTypes`: TypeScript color type generation
- `generateIcons`: React icon component generation
- `generateUiKit`: UI component object generation

### 4. Token Processing

Use the `ProcessTokens` class to handle token transformation:

```typescript
import { ProcessTokens } from "@recursica/mantine-adapter";

const processTokens = new ProcessTokens(overrides);
processTokens.processTokens(jsonContent.tokens);

// Access processed tokens
const colors = processTokens.colors;
const spacers = processTokens.spacers;
const typography = processTokens.typography;
const themes = processTokens.themes;
```

### 5. Integration

Replace the default adapter by modifying the `runAdapter` function or create a separate CLI that uses your custom adapter:

```typescript
// custom-cli.ts
import { processJsonContent, processIcons } from "@recursica/mantine-adapter";
import { runCustomAdapter } from "./your-adapter";

// Use the same processing logic but with your custom adapter
const processTokens = processJsonContent(bundledJsonContent, {
  project,
  overrides,
});
const icons = processIcons(iconsJsonContent);

const files = runCustomAdapter({
  rootPath,
  overrides,
  srcPath,
  icons,
  processTokens,
  project,
  iconsConfig,
});
```

## API Reference

### Core Functions

- `runMain()`: Main CLI execution function
- `processJsonContent()`: Process design token JSON
- `processIcons()`: Process icons JSON
- `processAdapter()`: Core adapter processing logic
- `runAdapter()`: Execute the Mantine adapter

### Types

- `ExportingResult`: File output interface
- `RecursicaConfigOverrides`: Theme override configuration
- `RecursicaConfigIcons`: Icon processing configuration
- `ThemeTokens`: Theme token structure
- `Themes`: Multi-theme structure

## License

MIT
