# Developer Guide

## Welcome, Developers

This guide is designed for developers who want to integrate Recursica into their projects. You'll learn how to configure Recursica using the `recursica.json` file, utilize the UI kit in your codebase, and work effectively with the design system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration with recursica.json](#configuration-with-recursicajson)
3. [Using the UI Kit](#using-the-ui-kit)
4. [Design Token Integration](#design-token-integration)
5. [Component Development](#component-development)
6. [Build and Deployment](#build-and-deployment)
7. [Advanced Usage](#advanced-usage)
8. [Troubleshooting](#troubleshooting)

## Quick Start

### Installation

```bash
# Install the UI kit
npm install @recursica/ui-kit-mantine

# Install peer dependencies
npm install @mantine/core@>=8.0.0 @mantine/dates@>=8.0.0 @mantine/hooks@>=8.0.0 react@>=16.8.0 react-dom@>=16.8.0
```

### Basic Setup

```tsx
import React from "react";
import { Button, ThemeProvider } from "@recursica/ui-kit-mantine";
import "@recursica/ui-kit-mantine/style.css";

function App() {
  return (
    <ThemeProvider>
      <Button
        label="Click Me"
        variant="solid"
        onClick={() => console.log("Clicked!")}
      />
    </ThemeProvider>
  );
}
```

## Configuration with recursica.json

The `recursica.json` file is the central configuration for your Recursica integration. It defines how your project interacts with the design system.

### File Structure

Create a `recursica.json` file in your project root:

```json
{
  "$schema": "./packages/schemas/src/RecursicaConfiguration.json",
  "project": {
    "name": "MyProject",
    "root": "src/components",
    "adapter": "src/recursica-adapter.js"
  },
  "overrides": {
    "mantineTheme": {
      "1-scale": "'colors-scale-1-default-tone'"
    }
  }
}
```

### Configuration Options

#### Project Configuration

```json
{
  "project": {
    "name": "MyProject", // Project identifier (alphanumeric only)
    "root": "src/components", // Root path for generated components
    "adapter": "src/adapter.js" // Path to adapter file
  }
}
```

**Required Fields:**

- `name`: Your project name (used for file naming and organization)
- `root`: Directory where components will be generated
- `adapter`: Path to the adapter file that handles theme generation

#### Complete Configuration Schema

For detailed documentation of all available configuration options, including icons, theme overrides, and advanced settings, refer to the [Recursica Configuration Schema](../../packages/schemas/dist/RecursicaConfiguration.json). This schema provides comprehensive documentation for all configuration properties, including:

- **Icons Configuration**: Icon output paths, naming conventions, and variant handling
- **Theme Overrides**: Mantine theme customization and font weight configurations
- **Advanced Options**: Additional settings for customizing Recursica behavior
- **Validation Rules**: Type checking and error messages for configuration validation

### Icon Management

For detailed information on managing icon exports from Figma, see the [Icons Guide](./ICONS-GUIDE.md). This covers:

- **Selective Export Process**: How to configure which icons to export
- **Configuration Setup**: Setting up the `icons` section in `recursica.json`
- **Export Workflow**: Step-by-step process for exporting icons
- **Usage in Code**: How to use exported icons with the Icon component

## Using the UI Kit

Recursica provides UI kits integrated with Mantine, offering a comprehensive set of React components with design token integration and TypeScript support.

### Quick Start

```tsx
import { Button, ThemeProvider } from "@recursica/ui-kit-mantine";
import "@recursica/ui-kit-mantine/style.css";

function App() {
  return (
    <ThemeProvider>
      <Button label="Click Me" variant="solid" />
    </ThemeProvider>
  );
}
```

### Documentation

For complete documentation on available components, installation, usage examples, and advanced features, refer to the [UI Kit Mantine Documentation](../../packages/ui-kit-mantine/README.md). This includes:

- **Installation Instructions**: How to add the UI kit to your project
- **Component Library**: Complete list of 60+ available components
- **Usage Examples**: Code examples for all component types
- **Design Token Integration**: How to use Figma design tokens in your code
- **Theming**: Custom theme configuration and styling
- **TypeScript Support**: Type definitions and prop interfaces
- **Storybook Documentation**: Interactive component documentation

## Design Token Integration

### Accessing Design Tokens

Recursica provides direct access to your Figma design tokens:

```tsx
import { recursica } from "@recursica/ui-kit-mantine";

// Spacing tokens
const spacing = {
  small: recursica["spacing/small"], // 8px
  medium: recursica["spacing/medium"], // 16px
  large: recursica["spacing/large"], // 24px
};

// Color tokens
const colors = {
  primary: recursica["color/primary"],
  background: recursica["color/background"],
  text: recursica["color/text"],
};

// Typography tokens
const typography = {
  fontSize: recursica["typography/body/font-size"],
  lineHeight: recursica["typography/body/line-height"],
  fontFamily: recursica["typography/body/font-family"],
};
```

### Using Tokens with Vanilla Extract

```tsx
import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/ui-kit-mantine";

const customButton = style({
  backgroundColor: recursica["color/primary"],
  borderRadius: recursica["border-radius/medium"],
  padding: recursica["spacing/medium"],
  fontSize: recursica["typography/button/font-size"],

  ":hover": {
    backgroundColor: recursica["color/primary-hover"],
  },
});

// Usage
<Button label="Custom Button" className={customButton} />;
```

### Typography Utilities

```tsx
import { typographies } from "@recursica/ui-kit-mantine";

const headingStyle = style({
  ...typographies.heading,
  color: recursica["color/heading"],
});

const bodyStyle = style({
  ...typographies.body,
  color: recursica["color/text"],
});
```

## Component Development

### Creating Custom Components

When building custom components, follow these patterns:

```tsx
import React from "react";
import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/ui-kit-mantine";

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

const cardStyle = style({
  backgroundColor: recursica["color/background"],
  borderRadius: recursica["border-radius/medium"],
  padding: recursica["spacing/large"],
  border: `1px solid ${recursica["color/border"]}`,
});

const elevatedCardStyle = style({
  boxShadow: recursica["shadow/medium"],
});

export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  children,
  variant = "default",
}) => {
  return (
    <div className={variant === "elevated" ? elevatedCardStyle : cardStyle}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};
```

### Extending Existing Components

```tsx
import { Button, type ButtonProps } from "@recursica/ui-kit-mantine";
import { style } from "@vanilla-extract/css";

const customButtonStyle = style({
  // Override or extend existing styles
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

interface CustomButtonProps extends ButtonProps {
  customVariant?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  customVariant,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      className={customVariant ? customButtonStyle : className}
    />
  );
};
```

## Build and Deployment

### Build Configuration

For optimal performance, configure your build tools:

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["@mantine/core", "@mantine/hooks"],
    },
  },
});
```

```javascript
// webpack.config.js
module.exports = {
  externals: {
    "@mantine/core": "@mantine/core",
    "@mantine/hooks": "@mantine/hooks",
  },
};
```

### Tree Shaking

Recursica supports tree shaking for optimal bundle sizes:

```tsx
// ✅ Good - imports only what you need
import { Button } from "@recursica/ui-kit-mantine/Button";

// ❌ Avoid - imports entire library
import * as Recursica from "@recursica/ui-kit-mantine";
```

### CSS Optimization

The library generates optimized CSS:

```tsx
// Import the bundled CSS
import "@recursica/ui-kit-mantine/style.css";

// Or import specific component styles
import "@recursica/ui-kit-mantine/Button.css";
```

## Advanced Usage

### Custom Themes

Create custom themes that extend the base Recursica theme:

```tsx
import { createTheme } from "@mantine/core";
import { recursica } from "@recursica/ui-kit-mantine";

const customTheme = createTheme({
  primaryColor: "blue",
  fontFamily: recursica["typography/body/font-family"],
  colors: {
    blue: [
      recursica["color/primary-50"],
      recursica["color/primary-100"],
      // ... other color variants
    ],
  },
  spacing: {
    xs: recursica["spacing/xs"],
    sm: recursica["spacing/small"],
    md: recursica["spacing/medium"],
    // ... other spacing values
  },
});

<ThemeProvider theme={customTheme}>{/* Your app */}</ThemeProvider>;
```

### Dynamic Theme Switching

```tsx
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mantine/core";

const lightTheme = createTheme({
  colorScheme: "light",
  // ... light theme configuration
});

const darkTheme = createTheme({
  colorScheme: "dark",
  // ... dark theme configuration
});

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <button onClick={() => setIsDark(!isDark)}>Toggle Theme</button>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### Server-Side Rendering (SSR)

For Next.js and other SSR frameworks:

```tsx
// pages/_app.tsx (Next.js)
import { ThemeProvider } from "@recursica/ui-kit-mantine";
import "@recursica/ui-kit-mantine/style.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

## Troubleshooting

### Common Issues

**Import Errors**

```bash
# Error: Cannot resolve module
Error: Cannot resolve module '@recursica/ui-kit-mantine'

# Solution: Check installation
npm install @recursica/ui-kit-mantine
```

**TypeScript Errors**

```bash
# Error: Module has no exported member
Error: Module '"@recursica/ui-kit-mantine"' has no exported member 'Button'

# Solution: Check import syntax
import { Button } from "@recursica/ui-kit-mantine";
```

**Styling Issues**

```bash
# Error: Styles not applied
# Solution: Import CSS
import "@recursica/ui-kit-mantine/style.css";
```

**Configuration Errors**

```json
// Error: Invalid configuration
{
  "project": "My Project!"  // ❌ Special characters not allowed
}

// Solution: Use alphanumeric only
{
  "project": "MyProject"    // ✅ Valid
}
```

### Performance Issues

**Large Bundle Size**

- Use tree shaking: `import { Button } from "@recursica/ui-kit-mantine/Button"`
- Configure externals for Mantine dependencies
- Use dynamic imports for large components

**Runtime Performance**

- Ensure you're using the compiled CSS, not CSS-in-JS
- Check that Vanilla Extract is properly configured
- Use React.memo for expensive components

### Getting Help

1. **Check Documentation**: Review component documentation in Storybook
2. **TypeScript Errors**: Use your IDE's TypeScript integration for detailed error messages
3. **Community**: Check the project's GitHub issues and discussions
4. **Team Support**: Reach out to your team's Recursica maintainers

### Resources

- [UI Kit Documentation](../../packages/ui-kit-mantine/README.md)
- [Storybook Documentation](https://borderux.github.io/recursica/)
- [Mantine Documentation](https://mantine.dev/)
- [Vanilla Extract Documentation](https://vanilla-extract.style/)
- [Project README](../README.md)

## Next Steps

Now that you understand how to use Recursica as a developer:

1. **Set Up Configuration**: Create your `recursica.json` file
2. **Install Dependencies**: Add the UI kit to your project
3. **Start Building**: Begin using components in your application
4. **Explore Storybook**: Check out the component documentation
5. **Customize**: Create custom themes and components as needed

Remember: Recursica is designed to make your development experience smooth and efficient. The more you use it, the more you'll appreciate the seamless integration between design and code.
