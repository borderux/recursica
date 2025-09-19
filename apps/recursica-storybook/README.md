# Recursica Storybook

A comprehensive Storybook application for showcasing Recursica design tokens and components in a Figma-oriented format. This application provides an interactive way to explore and understand the design system's token structure and visual representations.

## Features

- **Design Token Stories**: Interactive stories for colors, sizes, and other design tokens
- **Figma-Oriented Layout**: Organized presentation similar to Figma's design token panels
- **Theme Support**: Light and dark theme switching
- **Token Management**: Centralized token management with grouping and sorting
- **Visual Representations**: Visual previews of tokens with their values and names

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10.9.0

### Installation

1. Install dependencies from the monorepo root:

```sh
npm install
```

2. Start the Storybook development server:

```sh
cd apps/recursica-storybook
npm run storybook
```

3. Open your browser to `http://localhost:6006`

### Building for Production

```sh
npm run build-storybook
```

The built files will be available in the `storybook-static` directory.

## Available Stories

### Introduction

- **Welcome**: Overview of the Recursica Design System

### Tokens

- **Colors**: Interactive color palette organized by color families
- **Size**: Size tokens including spacers, gutters, and border radius

## Token Management

The `TokenManager` class provides a centralized way to access and organize design tokens:

```typescript
import TokenManager from "./src/TokenManager";

const tokenManager = TokenManager.getInstance();

// Get grouped color tokens
const colors = tokenManager.getGroupedColors();

// Get grouped size tokens
const sizes = tokenManager.getGroupedSizeTokens();

// Get sorted families/categories
const colorFamilies = tokenManager.getSortedColorFamilies();
const sizeCategories = tokenManager.getSortedSizeCategories();
```

## Development

### Adding New Stories

1. Create a new story file in the `stories` directory
2. Follow the existing pattern for story structure
3. Use the TokenManager for accessing design tokens
4. Ensure proper TypeScript typing

### Story Structure

```typescript
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Typography } from "@recursica/ui-kit-mantine";

const MyComponent = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">My Story</Typography>
  </Box>
);

const meta: Meta<typeof MyComponent> = {
  title: "Category/MyStory",
  component: MyComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Description of what this story demonstrates",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MyStory: Story = {
  name: "My Story",
};
```

## Configuration

The Storybook configuration is located in `.storybook/`:

- `main.ts`: Main configuration including addons and framework settings
- `preview.tsx`: Global decorators, parameters, and theme configuration

## Dependencies

- **@storybook/react-vite**: Storybook framework for React with Vite
- **@storybook/addon-docs**: Documentation addon for enhanced story documentation
- **@recursica/ui-kit-mantine**: Recursica UI components
- **@recursica/schemas**: Type definitions for design tokens

## Contributing

When adding new stories or modifying existing ones:

1. Follow the established patterns and conventions
2. Ensure proper TypeScript typing
3. Add appropriate documentation
4. Test in both light and dark themes
5. Verify responsive behavior

## License

This project is licensed under the terms specified in the [LICENSE](../../LICENSE) file.
