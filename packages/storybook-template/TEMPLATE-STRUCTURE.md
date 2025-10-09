# UI Kit Template Structure

This document outlines the recommended structure for creating new UI kit packages with co-located Storybook documentation.

## Package Structure

```
packages/ui-kit-[framework]/
├── .storybook/                    # Storybook configuration
│   ├── main.ts                    # Main Storybook config
│   └── preview.tsx                # Preview configuration
├── src/                           # Source code
│   ├── components/                # UI components
│   │   ├── ComponentName/
│   │   │   ├── ComponentName.tsx  # Component implementation
│   │   │   ├── ComponentName.css.ts # Styling (if using vanilla-extract)
│   │   │   ├── ComponentName.stories.tsx # Storybook stories
│   │   │   └── index.ts           # Component exports
│   │   └── index.ts               # All component exports
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                     # Utility functions
│   │   └── index.ts
│   ├── recursica/                 # Design tokens (auto-generated)
│   │   ├── Recursica.ts           # Main tokens export
│   │   └── ...                    # Other token files
│   ├── index.ts                   # Main package export
│   └── index.css                  # Global styles
├── package.json                   # Package configuration
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Package documentation
```

## Key Principles

### 1. Co-located Documentation

- Storybook stories live alongside components in `src/components/ComponentName/`
- This keeps documentation close to the code it describes
- Makes it easier to maintain and update stories

### 2. Clean Separation

- Library build excludes Storybook files (`.stories.*`, `.storybook/`)
- Only production code is bundled in the library
- Storybook dependencies are in `devDependencies`

### 3. Framework Agnostic Template

- Use `@recursica/storybook-template` for consistent Storybook setup
- Template provides generic functions that work with any UI framework
- Easy to adapt for Mantine, MUI, Chakra, etc.

## Package.json Configuration

### Dependencies

```json
{
  "dependencies": {
    // Only production dependencies
  },
  "devDependencies": {
    // Storybook and development dependencies
    "@recursica/storybook-template": "*",
    "@storybook/react-vite": "^9.0.8",
    "storybook": "^9.0.8"
    // ... other dev dependencies
  },
  "peerDependencies": {
    // UI framework dependencies
    "@mantine/core": ">=8.0.0",
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "dev": "npm run storybook",
    "build": "tsc -b && vite build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build -o storybook-static"
  }
}
```

## Storybook Configuration

### Main Configuration (.storybook/main.ts)

```typescript
import { createMainConfig } from "@recursica/storybook-template";

const config = createMainConfig({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  basePath: "/recursica/", // For GitHub Pages deployment
  enableCORS: true, // For iframe embedding
  copyHeadersFile: true, // For GitHub Pages headers
});

export default config;
```

### Preview Configuration (.storybook/preview.tsx)

```typescript
import { createPreviewConfig } from "@recursica/storybook-template";
import { MantineProvider } from "@mantine/core"; // Replace with your framework
import "@recursica/ui-kit-mantine/style.css"; // Replace with your package
import "../src/index.css";

const preview = createPreviewConfig({
  defaultTheme: "dark",
  enableProvider: true,
  Provider: MantineProvider, // Replace with your framework provider
  enableThemeProvider: false,
});

export default preview;
```

## Build Configuration

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts(),
    // Add other plugins as needed
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "UIKitMantine", // Replace with your package name
      fileName: "ui-kit-mantine", // Replace with your package name
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        // Add your framework dependencies
        "@mantine/core",
        // ... other externals
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

## Component Structure

### Component Implementation

```typescript
// src/components/Button/Button.tsx
import { Button as FrameworkButton, type ButtonProps as FrameworkButtonProps } from "@mantine/core";
import { styles } from "./Button.css";

export type ButtonProps = FrameworkButtonProps;

export const Button = (props: ButtonProps) => {
  return (
    <FrameworkButton
      {...props}
      classNames={{
        ...styles,
        ...props.classNames,
      }}
    />
  );
};
```

### Component Stories

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define argTypes as needed
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};
```

## Benefits of This Structure

1. **Co-located Documentation**: Stories live with components, making them easier to maintain
2. **Clean Separation**: Library build excludes Storybook files
3. **Framework Agnostic**: Template works with any UI framework
4. **Consistent Setup**: All UI kits follow the same structure
5. **Easy Maintenance**: Changes to components automatically update stories
6. **Better Developer Experience**: Developers can see documentation while working on components

## Migration from Separate Apps

If you have existing UI kits with separate Storybook apps, you can migrate them by:

1. Moving `.storybook/` directory into the UI kit package
2. Moving stories from the separate app into `src/components/`
3. Updating package.json to include Storybook dependencies
4. Updating build configuration to exclude Storybook files
5. Testing that both library build and Storybook work correctly

This approach provides the best of both worlds: co-located documentation with clean separation of concerns.
