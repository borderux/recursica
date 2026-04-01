# @recursica/storybook-template

Common Storybook configuration and templates for Recursica packages and apps.

## Features

- **Centralized Configuration**: Common Storybook configurations for all Recursica projects
- **Flexible Templates**: Easy-to-use templates for main and preview configurations
- **Theme Support**: Built-in support for light/dark themes with any UI framework
- **Accessibility**: Pre-configured accessibility testing
- **Deployment Ready**: Support for GitHub Pages and iframe embedding

## Installation

```bash
npm install @recursica/storybook-template
```

## Usage

### Quick Start

Copy the template files to your `.storybook` directory:

```bash
cp node_modules/@recursica/storybook-template/templates/main.ts .storybook/main.ts
cp node_modules/@recursica/storybook-template/templates/preview.tsx .storybook/preview.tsx
```

### Custom Configuration

#### Main Configuration

```typescript
import { createMainConfig } from "@recursica/storybook-template/configs/main";

const config = createMainConfig({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  basePath: "/your-app/", // For GitHub Pages deployment
  enableCORS: true, // For iframe embedding
  enablePostcssVars: true, // Enable Recursica PostCSS variables
  recursicaCSSPath: "../recursica_variables_scoped.css", // Path to variables
  postCSSStrictMode: true, // Enforce strict CSS variable parsing
});

export default config;
```

#### Preview Configuration

```typescript
import { createPreviewConfig } from "@recursica/storybook-template";
import { MantineProvider } from "@mantine/core";
// or import { ThemeProvider } from "@mui/material/styles";
// or import { ChakraProvider } from "@chakra-ui/react";

const preview = createPreviewConfig({
  defaultTheme: "dark",
  enableProvider: true,
  Provider: MantineProvider,
  providerProps: {
    /* your provider props */
  },
  enableThemeProvider: true,
  // ThemeProvider: ThemeProvider,
  lightThemeClass: "light-theme",
  darkThemeClass: "dark-theme",
});

export default preview;
```

### Individual Components

You can also import individual components:

```typescript
import { withProvider, withTheme } from "@recursica/storybook-template";
import {
  commonParameters,
  accessibilityParameters,
} from "@recursica/storybook-template";
```

## Configuration Options

### MainConfigOptions

- `stories`: Array of story file patterns
- `addons`: Array of Storybook addons (defaults to common addons)
- `basePath`: Base path for deployment (default: "/")
- `enableCORS`: Enable CORS headers and remove X-Frame-Options to allow iframe embedding (default: true)
- `enablePostcssVars`: Enable injection of the `@recursica/recursica-postcss-vars` plugin into the Vite CSS pipeline (default: false)
- `recursicaCSSPath`: Absolute path to the Recursica scoped variables CSS file. Used if enablePostcssVars is true
- `postCSSStrictMode`: Enforces strict mode for postcss vars plugin (throws on missing vars). Defaults to true in PRODUCTION mode

### PreviewConfigOptions

- `defaultTheme`: Default theme ("light" | "dark", default: "dark")
- `enableProvider`: Enable UI framework provider (default: false)
- `Provider`: UI framework provider component (e.g., MantineProvider, ThemeProvider)
- `providerProps`: Props to pass to the provider
- `enableThemeProvider`: Enable custom theme provider (default: false)
- `ThemeProvider`: Custom theme provider component
- `lightThemeClass`: CSS class for light theme
- `darkThemeClass`: CSS class for dark theme
- `customParameters`: Additional Storybook parameters

## Available Parameters

- `commonParameters`: Common story sorting and options
- `accessibilityParameters`: Accessibility testing configuration
- `backgroundParameters`: Dark theme backgrounds
- `lightBackgroundParameters`: Light theme backgrounds
- `controlParameters`: Control matchers for colors and dates

## Available Decorators

- `withProvider`: Generic provider wrapper for any UI framework
- `withTheme`: Theme provider wrapper with customizable options

## License

MIT
