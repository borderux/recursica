# @recursica/ui-kit-test

Test UI components for Recursica applications with global recursica.js integration.

## Features

- 🎨 **Design System Integration**: Seamlessly integrates with Recursica design tokens
- 🏭 **Factory Pattern**: Global factory system for managing Recursica design system
- 🧩 **React Components**: Pre-built React components using design tokens
- 🎯 **TypeScript Support**: Full TypeScript support with type definitions
- 🎨 **Vanilla Extract**: CSS-in-TS styling with design token integration

## Installation

```bash
npm install @recursica/ui-kit-test
```

## Quick Start

### 1. Set Recursica Data

Before using any components, set the Recursica design system data globally:

```tsx
import { setRecursica } from "@recursica/ui-kit-test";
import recursicaData from "./recursica.js";

// Set the recursica data globally once at the root of your application
setRecursica(recursicaData);
```

### 2. Use Components

```tsx
import React from "react";
import { Button } from "@recursica/ui-kit-test";

function App() {
  return (
    <div>
      <Button onClick={() => console.log("Clicked!")}>Click me!</Button>
    </div>
  );
}
```

## Components

### Button

A button component with salmon/600 background color using Recursica design tokens.

```tsx
import { Button } from '@recursica/ui-kit-test';

// Basic usage
<Button onClick={handleClick}>Click me</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

#### Button Props

| Prop        | Type                                                   | Default     | Description                |
| ----------- | ------------------------------------------------------ | ----------- | -------------------------- |
| `children`  | `React.ReactNode`                                      | -           | Button content             |
| `size`      | `'small' \| 'medium' \| 'large'`                       | `'medium'`  | Button size                |
| `variant`   | `'primary' \| 'secondary'`                             | `'primary'` | Button variant             |
| `disabled`  | `boolean`                                              | `false`     | Whether button is disabled |
| `type`      | `'button' \| 'submit' \| 'reset'`                      | `'button'`  | Button type                |
| `onClick`   | `(event: React.MouseEvent<HTMLButtonElement>) => void` | -           | Click handler              |
| `className` | `string`                                               | -           | Additional CSS class       |

## Factory System

The package includes a factory system for managing the Recursica design system globally:

```tsx
import {
  setRecursica,
  getRecursica,
  getRecursicaFactory,
} from "@recursica/ui-kit-test";
import recursicaData from "./recursica.js";

// Set recursica data globally (call once)
setRecursica(recursicaData);

// Get the factory instance
const factory = getRecursicaFactory();

// Get design tokens
const salmonColor = factory.getToken("color/salmon/600");
const borderRadius = factory.getToken("size/border-radius/default");

// Or use the convenience function
const recursica = getRecursica();
const color = recursica.tokens["color/salmon/600"];
```

## Design Tokens

The package uses Recursica design tokens for consistent styling:

- **Colors**: `color/salmon/600` (primary button background)
- **Spacing**: `size/spacer/*` (padding, margins)
- **Typography**: `font/family/lexend`, `font/size/*`, `font/weight/*`
- **Borders**: `size/border-radius/*`
- **Elevation**: `elevation/*` (shadows, blur, spread)

## TypeScript Support

The package provides full TypeScript support:

```tsx
import type {
  ButtonProps,
  Recursica,
  RecursicaToken,
} from "@recursica/ui-kit-test";

// Component props are fully typed
const MyButton: React.FC<ButtonProps> = ({ children, size = "medium" }) => {
  return <Button size={size}>{children}</Button>;
};

// Design tokens are type-safe
const color: RecursicaToken = "color/salmon/600"; // ✅ Valid
const invalidColor: RecursicaToken = "invalid/token"; // ❌ Type error
```

## Styling

The package uses Vanilla Extract for CSS-in-TS styling. All styles are automatically generated and optimized.

## Browser Support

- Modern browsers with ES2015+ support
- React 16.8+ (hooks support required)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes
npm run dev

# Lint
npm run lint
```

## License

MIT
