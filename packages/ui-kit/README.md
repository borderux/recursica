# @recursica/ui-kit

A modern React component library built with TypeScript, Mantine, and Vanilla Extract CSS. This package provides reusable UI components with consistent design tokens and theming support.

## Installation

```bash
npm install @recursica/ui-kit
# or
yarn add @recursica/ui-kit
# or
pnpm add @recursica/ui-kit
```

## Usage

### Basic Setup

```tsx
import React from "react";
import { Button, ThemeProvider } from "@recursica/ui-kit";
import "@recursica/ui-kit/style.css";

function App() {
  return (
    <ThemeProvider>
      <Button
        label="Click Me"
        variant="contained"
        onClick={() => console.log("Clicked!")}
      />
    </ThemeProvider>
  );
}
```

### Importing Components

```tsx
// Named imports (recommended)
import { Button, Textfield, Flex, Box } from "@recursica/ui-kit";

// Import types
import type { ButtonProps, TextfieldProps } from "@recursica/ui-kit";
```

### Available Components

- **Layout**: `Box`, `Flex`, `ThemeProvider`
- **Form Controls**: `Button`, `Textfield`, `Checkbox`, `Dropdown`, `Chip`
- **Navigation**: `Tabs`, `Anchor`
- **Typography**: `Text`, `Title`, `Typography`
- **Feedback**: `Loader`, `Accordion`
- **Media**: `Logo`, `Icon`

## Adding New Components

### 1. Component Structure

Create a new component following this folder structure:

```
src/components/MyComponent/
├── MyComponent.tsx          # Main component file
├── MyComponent.css.ts       # Vanilla Extract styles (preferred)
├── MyComponent.stories.tsx  # Storybook stories
└── index.ts                 # Export file
```

### 2. Component Template

```tsx
// src/components/MyComponent/MyComponent.tsx
import { forwardRef, type HTMLAttributes } from "react";
import { styles } from "./MyComponent.css";

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  /** Component label */
  label: string;
  /** Component variant */
  variant?: "primary" | "secondary";
  /** Component size */
  size?: "small" | "medium" | "large";
}

/** Brief description of your component */
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  (
    { label, variant = "primary", size = "medium", className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.root} ${className || ""}`}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {label}
      </div>
    );
  },
);

MyComponent.displayName = "MyComponent";
```

### 3. Export the Component

```tsx
// src/components/MyComponent/index.ts
export * from "./MyComponent";
```

```tsx
// src/components/index.ts (add your component here)
export * from "./MyComponent";
```

### 4. Create Storybook Stories

```tsx
// src/components/MyComponent/MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "My Component",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    label: "My Component",
    variant: "secondary",
  },
};
```

## Component Styling

This UI Kit uses multiple styling approaches to provide flexibility and maintainability.

### Vanilla Extract CSS

**Recommended for**: Most components, design system integration

```tsx
// MyComponent.css.ts
import { style, createVar } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const colorVar = createVar();

export const styles = {
  root: style({
    borderRadius: recursica["border-radius/medium"],
    padding: recursica["spacing/medium"],
    color: colorVar,
    ...typographies.body,

    selectors: {
      '&[data-variant="primary"]': {
        vars: { [colorVar]: recursica["color/primary"] },
        backgroundColor: recursica["color/primary-background"],
      },
      '&[data-variant="secondary"]': {
        vars: { [colorVar]: recursica["color/secondary"] },
        backgroundColor: recursica["color/secondary-background"],
      },
      '&[data-size="small"]': {
        padding: recursica["spacing/small"],
        fontSize: recursica["typography/small/font-size"],
      },
      "&:hover": {
        opacity: 0.8,
      },
    },
  }),
};
```

### 3. Design Tokens Access

The UI Kit uses the Recursica design system. Access tokens via:

```tsx
import { recursica } from "../../recursica/Recursica";

// Spacing
recursica["spacing/small"]; // 8px
recursica["spacing/medium"]; // 16px
recursica["spacing/large"]; // 24px

// Colors
recursica["color/primary"];
recursica["color/secondary"];
recursica["color/background"];

// Typography
recursica["typography/heading/font-size"];
recursica["typography/body/line-height"];

// Border Radius
recursica["border-radius/small"]; // 4px
recursica["border-radius/medium"]; // 8px
recursica["border-radius/large"]; // 12px
```

### 4. Typography Utilities

```tsx
import { typographies } from "../Typography";

const myStyle = style({
  ...typographies.heading, // Heading styles
  ...typographies.body, // Body text styles
  ...typographies.caption, // Small text styles
  ...typographies.button, // Button text styles
});
```

## Development Commands

```bash
# Development with hot reload
npm run dev

# Build the library
npm run build

# Run Storybook for component development
npm run storybook

# Build Storybook for deployment
npm run build-storybook

# Lint the codebase
npm run lint
```

## Best Practices

### Component Development

- Always use TypeScript interfaces for props
- Include proper JSDoc comments for documentation
- Follow the forwardRef pattern for DOM element access
- Use semantic HTML elements when possible

### Styling Guidelines

- Prefer Vanilla Extract CSS for new components
- Use design tokens from the Recursica system
- Follow responsive design principles
- Implement proper hover and focus states

### Testing & Documentation

- Create comprehensive Storybook stories
- Include accessibility considerations
- Test component variants and edge cases
- Document props and usage examples

## Architecture

This UI Kit is built on:

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Mantine Core** - Base component library for consistent behavior
- **Vanilla Extract** - Type-safe CSS-in-JS with zero runtime
- **Vite** - Fast build tool and development server
- **Storybook** - Component documentation and testing
- **Recursica Design System** - Consistent design tokens and theming
