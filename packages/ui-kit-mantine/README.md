# @recursica/ui-kit-mantine

A modern React component library built with TypeScript, Mantine, and Vanilla Extract CSS. This package provides reusable UI components with consistent design tokens and theming support.

## Installation

```bash
npm install @recursica/ui-kit-mantine
# or
yarn add @recursica/ui-kit-mantine
# or
pnpm add @recursica/ui-kit-mantine
```

## Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install @mantine/core@>=8.0.0 @mantine/dates@>=8.0.0 @mantine/hooks@>=8.0.0 react@>=16.8.0 react-dom@>=16.8.0
```

**Important**: Make sure you have these exact versions or higher installed, as the components rely on Mantine 8+ features and React 16.8+ hooks.

## Quick Start

### 1. Basic Setup

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

### 2. Importing Components

```tsx
// Named imports (recommended)
import { Button, Textfield, Flex, Box, Badge } from "@recursica/ui-kit-mantine";

// Import types for TypeScript
import type { ButtonProps, TextfieldProps } from "@recursica/ui-kit-mantine";
```

## Available Components

### Layout Components

- `Box` - Basic container component
- `Flex` - Flexbox container with common layouts
- `ThemeProvider` - Theme context provider

### Form Components

- `Button` - Interactive button with multiple variants
- `Textfield` - Text input component
- `Checkbox` - Checkbox input
- `Dropdown` - Select dropdown with search
- `Chip` - Tag/chip component
- `Radio` - Radio button component
- `Datepicker` - Date selection component

### Navigation Components

- `Tabs` - Tab navigation
- `Anchor` - Link component
- `Breadcrumb` - Breadcrumb navigation
- `Pagination` - Page navigation

### Display Components

- `Text` - Typography component
- `Typography` - Typography utilities
- `Badge` - Status indicator
- `Avatar` - User avatar
- `Logo` - Logo component
- `Icon` - Icon component with 240+ icons

### Feedback Components

- `Loader` - Loading indicator
- `Accordion` - Collapsible content
- `Tooltip` - Tooltip component

## Component Usage Examples

### Button Component

```tsx
import { Button } from "@recursica/ui-kit-mantine";

// Basic button
<Button label="Click me" variant="solid" />

// Different variants
<Button label="Outline" variant="outline" />
<Button label="Text" variant="text" />

// Different sizes
<Button label="Small" size="small" />
<Button label="Default" size="default" />

// With icons
<Button
  label="Download"
  leftIcon={<DownloadIcon />}
  variant="solid"
/>

// Icon-only button
<Button
  leftIcon={<SettingsIcon />}
  style="icon"
  variant="outline"
/>
```

### Form Components

```tsx
import { Textfield, Checkbox, Dropdown } from "@recursica/ui-kit-mantine";

// Text input
<Textfield
  label="Email"
  placeholder="Enter your email"
  required
/>

// Checkbox
<Checkbox
  label="I agree to terms"
  description="Please read our terms and conditions"
/>

// Dropdown
<Dropdown
  label="Select country"
  placeholder="Choose a country"
  data={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
  ]}
/>
```

### Layout Components

```tsx
import { Box, Flex } from "@recursica/ui-kit-mantine";

// Basic container
<Box padding="medium" backgroundColor="background">
  <Text>Content here</Text>
</Box>

// Flexbox layouts
<Flex gap="medium" align="center" justify="space-between">
  <Text>Left content</Text>
  <Button label="Action" />
</Flex>
```

## Styling with Vanilla Extract

This library uses **Vanilla Extract** for styling, which provides:

- **Type-safe CSS**: Compile-time CSS validation
- **Zero runtime**: No CSS-in-JS overhead
- **Design token integration**: Direct access to design system tokens
- **Scoped styles**: Automatic CSS class generation

### Why Vanilla Extract?

Vanilla Extract is chosen because it:

- Eliminates runtime CSS-in-JS overhead
- Provides compile-time type safety
- Integrates seamlessly with design tokens
- Generates optimized CSS bundles
- Supports CSS custom properties and themes

### Customizing Component Styles

You can customize component styles by extending the existing styles:

```tsx
import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/ui-kit-mantine";

// Custom button style
const customButton = style({
  backgroundColor: recursica["color/primary"],
  borderRadius: recursica["border-radius/medium"],
  padding: recursica["spacing/medium"],

  ":hover": {
    backgroundColor: recursica["color/primary-hover"],
  },
});

// Usage
<Button label="Custom Button" className={customButton} />;
```

### Using Design Tokens

Access design tokens directly from the Recursica system:

```tsx
import { recursica } from "@recursica/ui-kit-mantine";

const myStyle = style({
  // Spacing
  padding: recursica["spacing/medium"], // 16px
  margin: recursica["spacing/large"], // 24px

  // Colors
  backgroundColor: recursica["color/background"],
  color: recursica["color/text"],

  // Typography
  fontSize: recursica["typography/body/font-size"],
  lineHeight: recursica["typography/body/line-height"],

  // Border radius
  borderRadius: recursica["border-radius/medium"], // 8px
});
```

### Typography Utilities

Use predefined typography styles:

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

## Theming

### Using ThemeProvider

Wrap your app with the ThemeProvider to enable theming:

```tsx
import { ThemeProvider } from "@recursica/ui-kit-mantine";

function App() {
  return <ThemeProvider>{/* Your app components */}</ThemeProvider>;
}
```

### Custom Themes

You can create custom themes by extending the base theme:

```tsx
import { createTheme } from "@mantine/core";

const customTheme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, sans-serif",
  // ... other theme overrides
});

<ThemeProvider theme={customTheme}>{/* Your app */}</ThemeProvider>;
```

## TypeScript Support

All components include full TypeScript support with proper prop types:

```tsx
import type { ButtonProps, TextfieldProps } from "@recursica/ui-kit-mantine";

interface MyFormProps {
  onSubmit: (data: FormData) => void;
}

const MyForm: React.FC<MyFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Textfield
        label="Name"
        required
        // TypeScript will provide autocomplete and type checking
      />
    </form>
  );
};
```

## Storybook Documentation

This library includes comprehensive Storybook documentation for all components. You can:

- **View live examples** of all components and their variants
- **Explore component props** and their effects
- **Test component interactions** and accessibility features
- **Copy code examples** directly from the documentation

### Accessing Storybook

- **Online (Recommended)**: Visit the [Storybook documentation](https://borderux.github.io/recursica/ui-kit-mantine/) for live examples and documentation
- **For Contributors**: If you're contributing to the library, clone the repository and run `npm run storybook` in the `packages/ui-kit-mantine` directory

### Using Storybook for Development

Storybook is an excellent tool for:

- Understanding component capabilities and variants
- Testing component behavior before integration
- Exploring design system patterns
- Copying working code examples for your implementation

## Browser Support

This library supports all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

For development and contribution guidelines, see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
